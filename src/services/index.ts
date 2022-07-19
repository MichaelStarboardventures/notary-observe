import neo4j, { QueryResult, Session } from 'neo4j-driver';
import { Driver } from 'neo4j-driver-core';

export type Key = 'c' | 'v' | 'p';

export type ServicesProps = {
  getGraphin: () => void;
};

class Services implements ServicesProps {
  private readonly url = 'neo4j+s://f3c84999.databases.neo4j.io';
  private readonly user = 'neo4j';
  private readonly password = 'QMYaXY0K4D8NmtW_8OyXQItmHx4Q9gD0OWhH4qtPrcA';
  private readonly session: Session;
  private readonly driver: Driver;

  constructor() {
    this.driver = neo4j.driver(
      this.url,
      neo4j.auth.basic(this.user, this.password),
    );

    this.session = this.driver.session();
  }

  getCollectData = (records: QueryResult['records']) => {
    if (!records?.length) return { nodes: {}, edges: {} };

    return records?.reduce<Record<string, any>>(
      (prev, cur) => {
        cur.keys.forEach((key) => {
          if (key === 'c') {
            const cNode = cur.get('c');
            if (!cNode) return;
            prev.nodes[cNode.properties['client_id']] = {
              key: 'c',
              ...cNode,
            };
          }

          if (key == 'n') {
            const vNode = cur.get('n');
            if (!vNode) return;
            prev.nodes[vNode.properties['verifier_id']] = {
              key: 'v',
              ...vNode,
            };
          }

          if (key == 's') {
            const pNode = cur.get('s');
            if (!pNode) return;
            prev.nodes[pNode.properties['provider_id']] = {
              key: 'p',
              ...pNode,
            };
          }

          if (key === 'r1') {
            const aEdge = cur.get('r1');
            if (!aEdge) return;
            const id =
              aEdge.properties['from_verifier_id'] +
              aEdge.properties['to_client_id'];
            prev.edges[id] = {
              key: 'a',
              id,
              ...aEdge,
              from: aEdge.properties['from_verifier_id'],
              to: aEdge.properties['to_client_id'],
              label: 'allocation',
            };
          }

          if (key === 'r2') {
            const sEdge = cur.get('r2');
            if (!sEdge) return;
            const id =
              sEdge.properties['from_client_id'] +
              sEdge.properties['to_provider_id'];
            prev.edges[id] = {
              key: 's',
              id,
              ...sEdge,
              from: sEdge.properties['from_client_id'],
              to: sEdge.properties['to_provider_id'],
              label: 'spending',
            };
          }
        });

        return prev;
      },
      { nodes: {}, edges: {} },
    );
  };

  /**
   * 获取图数据
   * @returns {nodes: *[], edges: *[]}
   */
  getGraphin = async (key?: Key, id?: string) => {
    try {
      const sql = {
        GRAPHIN_DATA: this.getGraphinSection(key),
      };

      const result = await this.session.run(sql.GRAPHIN_DATA, { id });

      return this.getCollectData(result?.records);
    } catch (e) {
      return { nodes: {}, edges: {} };
    }
  };

  getGraphinSection = (key?: Key) => {
    switch (key) {
      case 'c':
        return `MATCH (c:Client {client_id: $id})
OPTIONAL MATCH (c:Client)<-[r1:datacap_allocation]-(n:Verifier)
OPTIONAL MATCH (c:Client)-[r2:datacap_spending]->(s:StorageProvider)
RETURN n,r1,c,r2,s`;
      case 'p':
        return `MATCH (s:StorageProvider {provider_id: $id})
OPTIONAL MATCH (c:Client)-[r2:datacap_spending]->(s)
RETURN c,r2,s`;
      case 'v':
        return `MATCH (n:Verifier {verifier_id: $id})
OPTIONAL MATCH (c:Client)<-[r1:datacap_allocation]-(n)
OPTIONAL MATCH (s:StorageProvider)<-[r2:datacap_spending]-(c)
RETURN n,r1,c,r2,s`;
      default:
        return `MATCH (n:Verifier {verifier_id: $id})
OPTIONAL MATCH (c:Client)<-[r1:datacap_allocation]-(n)
OPTIONAL MATCH (s:StorageProvider)<-[r2:datacap_spending]-(c)
RETURN n,r1,c,r2,s`;
    }
  };

  getGraphinDetail = async (key: Key, id: string) => {
    try {
      return this.getGraphin(key, id);
    } catch (e) {
      return { nodes: {}, edges: {} };
    }
  };

  getSummary = async () => {
    try {
      const sql = {
        DATA: `MATCH (n:Verifier {verifier_id: $clientId})
OPTIONAL MATCH (n)-[r1:datacap_allocation]->(c:Client)
OPTIONAL MATCH (c:Client)-[r2:datacap_spending]->(s:StorageProvider)
RETURN count(distinct(c.client_id)) AS \`ClientHeadcount\`, // 1.2.1
count(distinct(s.provider_id)) AS \`ProviderHeadcount\`, // 1.2.2
MAX(r1.total_allocation_tib) AS \`MaximumAllocationsperClient\`, // 1.2.3
100 * MAX(r1.total_allocation_tib)/SUM(r1.total_allocation_tib) AS \`ShareofTotal\` // 1.2.4`,
        clientId: 'f01079326',
      };
      const result1 = await this.queryGraphinSummaryRecord({
        command: sql.DATA,
        clientId: sql.clientId,
      });

      if (!result1) return null;

      return {
        ...result1,
      };
    } catch (e) {
      return null;
    }
  };

  /**
   * 转换val
   * @param val
   * @returns {string|number}
   */
  transRecordValue = (val: Record<string, any>) => {
    let res: Record<string, any> | string | number = val;

    const getNum = (num: string) => {
      let res = num;

      if (Number(num) < 10) {
        res = '0' + Number(num);
      }

      return res;
    };

    if (neo4j.isDateTime(val)) {
      res = `${val.year.low}-${getNum(val.month.low + 1)}-${getNum(
        val.day.low,
      )} ${getNum(val.hour.low)}:${getNum(val.minute.low)}:${getNum(
        val.second.low,
      )}`;
    } else if (neo4j.isInt(val)) {
      res = val.low;
    }

    return res;
  };

  /**
   * 查询summary
   * @param config
   * @returns {Promise<{}>}
   */
  queryGraphinSummaryRecord = async (config: {
    command: string;
    clientId: string;
  }) => {
    try {
      const { command, clientId } = config;

      if (!clientId) return null;

      const session = this.driver.session();

      const result = await session.run(command, { clientId });
      const record = result.records[0];

      return record.keys.reduce<Record<string | number | symbol, any>>(
        (prev, cur) => {
          const val = record.get(cur);

          prev[cur] = this.transRecordValue(val);

          return prev;
        },
        {},
      );
    } catch (e) {
      console.log(e, 'summary error');
      return null;
    }
  };

  getGraphinItem = async (clientId: string) => {
    try {
      const sql = {
        DATA: `MATCH (n:Verifier {verifier_id: $clientId})
OPTIONAL MATCH (n)-[r1:datacap_allocation]->(c:Client)
OPTIONAL MATCH (c:Client)-[r2:datacap_spending]->(s:StorageProvider)
RETURN r1.total_allocation_tib AS \`dataCapAllocatedTiB\`, // 1.3.1
r2.total_spending_tib AS \`dataCapSpentTiB\` // 1.3.2`,
        clientId: 'f01079326',
      };

      const result1 = await this.queryGraphinSummaryRecord({
        command: sql.DATA,
        clientId: 'f01079326',
      });

      if (!result1) return null;

      return {
        ...result1,
      };
    } catch (e) {}
  };

  getNeighborList = async (
    searchId: string,
    id?: Key,
    type?: string,
  ): Promise<Record<string, any>[]> => {
    try {
      const sqlConfig: Record<string, Record<Key, string>> = {
        2: {
          v: `
          MATCH (n:Verifier)
          OPTIONAL MATCH (n)-[r1:datacap_allocation]->(c:Client)
          RETURN c.client_id AS \`clientId\`, // 4.2.1
          r1.total_allocation_tib AS \`allocationSize\`, // 4.2.2
          r1.recent_allocation_time AS \`allocationTime\`, // 4.2.3
          CASE n.verifier_type
          WHEN "LDN" THEN n.verifier_id
          ELSE "N/A"
          END AS \`signers\` // 4.2.4
        `,
          c: `
          MATCH (n:Verifier)
          OPTIONAL MATCH (n)-[r1:datacap_allocation]->(c:Client)
          RETURN c.client_id AS \`clientId\`, // 4.2.1
          r1.total_allocation_tib AS \`allocationSize\`, // 4.2.2
          r1.recent_allocation_time AS \`allocationTime\`, // 4.2.3
          CASE n.verifier_type
          WHEN "LDN" THEN n.verifier_id
          ELSE "N/A"
          END AS \`signers\` // 4.2.4
        `,
          p: `
          MATCH (n:Verifier)
          OPTIONAL MATCH (n)-[r1:datacap_allocation]->(c:Client)
          RETURN c.client_id AS \`clientId\`, // 4.2.1
          r1.total_allocation_tib AS \`allocationSize\`, // 4.2.2
          r1.recent_allocation_time AS \`allocationTime\`, // 4.2.3
          CASE n.verifier_type
          WHEN "LDN" THEN n.verifier_id
          ELSE "N/A"
          END AS \`signers\` // 4.2.4
        `,
        },
        3: {
          v: `
          MATCH (v:Verifier {verifier_id: $id})
          OPTIONAL MATCH (c:Client)<-[a:datacap_allocation]-(v)
          OPTIONAL MATCH (c)-[s:datacap_spending]->(p:StorageProvider)
          RETURN c.client_id as \`clientId\`,
          c.client_name as \`clientName\`,
          c.client_address as \`clientAddress\`,
          c.onboarding_time as \`accountOnboardingTime\`,
          c.total_datacap_received_tib as \`totalDatacapReceived\`,
          100*c.total_datacap_spent_tib/c.total_datacap_received_tib as \`datacapSpent\`
        `,
          c: `
          MATCH (c:Client {client_id: $id})
          OPTIONAL MATCH (c)<-[a:datacap_allocation]-(v:Verifier)
          OPTIONAL MATCH (c)-[s:datacap_spending]->(p:StorageProvider)
          OPTIONAL MATCH (v)-[]-(u:Client)-[]-(w:StorageProvider)
          RETURN v.verifier_name as \`notaryName\`, // 8.1.1
          v.verifier_id as \`notaryId\`, // 8.1.2
          v.verifier_address as \`notaryAddress\`, // 8.1.3
          v.onboarding_time as \`accountOnboardingTime\`, // 8.1.4
          v.total_datacap_allocated_tib as \`totalDataCapAllocated\`, // 8.1.5
          COUNT(DISTINCT u) as \`clientHeadcount\`, // 8.1.6
          COUNT(DISTINCT w) as \`providerHeadcount\`
        `,
          p: `
          MATCH (p:StorageProvider {provider_id: $id})
          OPTIONAL MATCH (c:Client)-[s:datacap_spending]->(p)
          OPTIONAL MATCH (c)<-[a:datacap_allocation]-(v:Verifier)
          OPTIONAL MATCH (v)-[]-(u:Client)-[]-(w:StorageProvider)
          RETURN v.verifier_name as \`notaryName\`, // 8.1.1
          v.verifier_id as \`notaryId\`, // 8.1.2
        `,
        },
        4: {
          v: `
          MATCH (v:Verifier {verifier_id: $id})
          OPTIONAL MATCH (c:Client)<-[a:datacap_allocation]-(v)
          OPTIONAL MATCH (c)-[s:datacap_spending]->(p:StorageProvider)
          RETURN p.provider_id as \`providerId\`,
          p.provider_address as \`providerAddress\`,
          p.onboarding_time as \`accountOnboardingTime\`,
          p.raw_byte_capacity_tib as \`rawBytePower\`,
          p.quality_adjusted_power_tib as \`qualityAdjustedPower\`,
          p.total_plusdeal_size_tib as \`verifiedDeal\`,
          count(DISTINCT(v.verifier_id)) as \`notaryHeadcount\`,
          count(DISTINCT(c.client_id)) as \`clientHeadcount\`
        `,
          c: `
          MATCH (c:Client {client_id: $id})
          OPTIONAL MATCH (c)<-[a:datacap_allocation]-(v:Verifier)
          OPTIONAL MATCH (c)-[s:datacap_spending]->(p:StorageProvider)
          RETURN p.provider_id as \`providerId\`,
          p.provider_address as \`providerAddress\`,
          p.onboarding_time as \`accountOnboardingTime\`,
          p.raw_byte_capacity_tib as \`rawBytePower\`,
          p.quality_adjusted_power_tib as \`qualityAdjustedPower\`,
          p.total_plusdeal_size_tib as \`verifiedDeal\`,
          count(DISTINCT(v.verifier_id)) as \`notaryHeadcount\`,
          count(DISTINCT(c.client_id)) as \`clientHeadcount\`
        `,
          p: `
          MATCH (p:StorageProvider {provider_id: $id})
          OPTIONAL MATCH (c:Client)-[s:datacap_spending]->(p)
          OPTIONAL MATCH (c)<-[a:datacap_allocation]-(v:Verifier)
          RETURN c.client_id as \`clientId\`,
          c.client_name as \`clientName\`,
          c.client_address as \`clientAddress\`,
          c.onboarding_time as \`accountOnboardingTime\`,
          c.total_datacap_received_tib as \`totalDatacapReceived\`,
          100*c.total_datacap_spent_tib/c.total_datacap_received_tib as \`datacapSpent\`
        `,
        },
      };

      const res = await this.session.run(sqlConfig[type || '3'][id || 'v'], {
        id: searchId,
      });

      const result = res?.records?.reduce<Record<string, any>[]>(
        (prev, cur) => {
          const obj: Record<string | symbol, any> = {};

          cur.keys.forEach((key) => {
            const value = cur.get(key);

            obj[key] = this.transRecordValue(value);
          });

          prev.push(obj);

          return prev;
        },
        [],
      );

      return result;
    } catch (e) {
      return [];
    }
  };
}

export default new Services();

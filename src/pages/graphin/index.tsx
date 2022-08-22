import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { GraphinWrapperStyled, GraphinStyled } from './style';
import { GraphinData, IUserNode, IUserEdge } from '@antv/graphin';
import { DetailContent } from '@/pages/graphin/detail-content';
import { DetailItem } from '@/pages/graphin/detail-item';
import { Col, Spin, Empty, Radio, Input, Form } from 'antd';
import { Search } from '@/components/search';
import { history } from 'umi';
import { queryParse } from '@/utils';
import { Details, UserType } from '@/pages/graphin/props';
import clientIcon from '@/assets/2.png';
import providerIcon from '@/assets/1.png';
import verifierIcon from '@/assets/3.png';
import services, { Key } from '@/services';

export const GraphinDataContext = createContext<{
  nodes: Record<string, any>;
  edges: Record<string, any>;
}>({
  nodes: {},
  edges: {},
});

export const updateNodeIcon = (node: IUserNode): IUserNode => {
  return {
    ...node,
    style: {
      ...node.style,
      icon: {
        type: 'image',
        value:
          node.key === 'c'
            ? clientIcon
            : node.key === 'p'
            ? providerIcon
            : verifierIcon,
        size: [40, 40],
      },
    },
  };
};

const createGraphinNodeStyle = (node: IUserNode) => {
  const { key } = node;
  const opacity = setEdgeNodeOpacity(node);

  return {
    keyshape: {
      size: 60,
      fill: `${key === 'p' ? '#FFB74B' : key === 'c' ? '#D5A050' : '#706BFF'}`,
      icon: `${key === 'p' ? '#FFB74B' : key === 'c' ? '#D5A050' : '#706BFF'}`,
      lineWidth: 0,
      fillOpacity: opacity,
      opacity,
    },
  };
};

const setEdgeNodeOpacity = (edge: IUserEdge | IUserNode) => {
  if (!edge) return;

  switch (edge.key) {
    case 'a':
      const aEdge =
        edge?.properties.total_allocation?.high ||
        edge?.properties.total_allocation?.low;
      return aEdge > 100 ? 1 : aEdge < 100 && aEdge > 50 ? 0.7 : 0.3;
    case 's':
      const sEdge =
        edge?.properties?.total_spending?.high ||
        edge?.properties?.total_spending?.low;
      return sEdge > 100 ? 1 : sEdge < 100 && sEdge > 50 ? 0.7 : 0.3;
    case 'c':
      const cEdge = edge?.identity?.high || edge?.identity?.low;
      return cEdge > 100 ? 1 : cEdge < 100 && cEdge > 50 ? 0.7 : 0.3;
    case 'p':
      const pEdge = edge?.identity?.high || edge?.identity?.low;
      return pEdge > 100 ? 1 : pEdge < 100 && pEdge > 50 ? 0.7 : 0.3;
    case 'v':
      const vEdge = edge?.identity?.high || edge?.identity?.low;
      return vEdge > 100 ? 1 : vEdge < 100 && vEdge > 50 ? 0.7 : 0.3;
  }
};

const createGraphinEdgeStyle = (key: string, edge: IUserEdge) => {
  const opacity = setEdgeNodeOpacity(edge);

  return {
    label: {
      value: key === 'a' ? 'allocation' : 'spending',
      fill: '#fff',
      background: {
        fill: key === 's' ? '#706BFF' : '#A0A4A8',
        radius: 8,
        stroke: key === 's' ? '#706BFF' : '#A0A4A8',
      },
    },
    keyshape: {
      stroke: key === 's' ? '#706BFF' : '#A0A4A8',
      opacity,
    },
  };
};

export const useGraphinData = (data: Record<string, any>): GraphinData => {
  return useMemo(() => {
    if (!data) return { nodes: [], edges: [] } as GraphinData;

    const nodes: GraphinData['nodes'] = Object.keys(data.nodes)
      .map((node) => ({
        key: data.nodes[node].key,
        id: node,
        style: createGraphinNodeStyle(data.nodes[node]),
      }))
      .map((node) => {
        const restNode = updateNodeIcon(node);

        return {
          ...restNode,
        };
      });

    const edges: GraphinData['edges'] = Object.keys(data.edges).map((edge) => ({
      key: data.edges[edge].key,
      id: edge,
      source: data.edges[edge].from,
      target: data.edges[edge].to,
      style: createGraphinEdgeStyle(data.edges[edge].key, data.edges[edge]),
    }));

    return { nodes, edges };
  }, [data]);
};

const Graphin: React.FC = () => {
  const [data, setData] = useState<{
    nodes: Record<string, any>;
    edges: Record<string, any>;
  }>({ nodes: {}, edges: {} });
  const [details, setDetails] = useState<Details | null>(null);
  const [loading, setLoading] = useState(false);
  const [nodeId, setNodeId] = useState('');
  const graphinData = useGraphinData(data);

  const {
    location: { search },
  } = history;
  const { id: clientId } = queryParse(search.replace('?', ''));

  const fetchData = useCallback(async (key?: Key, id?: string) => {
    try {
      setLoading(true);

      const res = await services.getGraphin(key, id);

      setLoading(false);

      setData(Object.create(res));
    } catch (e) {
      setLoading(false);
    }
  }, []);

  const fetchDetails = useCallback(
    async (id: string, clientId: string, type: UserType) => {
      try {
        // const res = await request(`/api/details/${id}`, {
        //   method: 'get',
        //   params: {
        //     clientId,
        //     type,
        //   },
        // });
        const res = await services.getGraphinItem(clientId);

        setNodeId(id);

        setDetails(res as Details);
      } catch (e) {}
    },
    [],
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Search fetchData={fetchData} isClient />
      <Spin spinning={loading}>
        <GraphinDataContext.Provider value={data}>
          <GraphinWrapperStyled>
            {graphinData.nodes.length ? (
              <GraphinStyled>
                <Col flex={'auto'}>
                  <DetailContent
                    data={graphinData}
                    fetchDetails={fetchDetails}
                    setData={setData}
                  />
                </Col>
                <Col flex={'190px'}>
                  <DetailItem details={details} nodeId={nodeId} />
                </Col>
              </GraphinStyled>
            ) : (
              <Empty />
            )}
          </GraphinWrapperStyled>
        </GraphinDataContext.Provider>
      </Spin>
    </>
  );
};

export default Graphin;

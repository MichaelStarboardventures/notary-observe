import { Tabs, Table } from 'antd';
import styled from 'styled-components';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import services from '@/services';
import { useCallback } from 'react';

const ListStyled = styled.div`
  padding: 24px;
`;

const columnsConfig: Record<string, ProColumns[]> = {
  3: [
    {
      title: 'Client Name',
      dataIndex: 'clientName',
    },
    {
      title: 'Client ID',
      dataIndex: 'clientId',
    },
    {
      title: 'Client Address',
      dataIndex: 'clientAddress',
    },
    {
      title: 'Account Onboarding Time',
      dataIndex: 'accountOnboardingTime',
    },
    {
      title: 'Total DataCap Received(TiB)',
      dataIndex: 'totalDataCapReceived',
    },
    {
      title: '% of DataCap Spent',
      dataIndex: 'dataCapSpent',
    },
  ],
  4: [
    {
      title: 'Provider ID',
      dataIndex: 'providerId',
    },
    {
      title: 'Provider Address',
      dataIndex: 'providerAddress',
    },
    {
      title: 'Raw Byte Power(TiB)',
      dataIndex: 'rawBytePower',
    },
    {
      title: 'Quality Adjusted Power(TiB)',
      dataIndex: 'qualityAdjustedPower',
    },
    {
      title: 'Verified Deal(TiB)',
      dataIndex: 'verifiedDeal',
    },
    {
      title: 'Notary Headcount',
      dataIndex: 'notaryHeadcount',
    },
    {
      title: 'Client Headcount',
      dataIndex: 'clientHeadcount',
    },
  ],
  2: [
    {
      title: 'Client ID',
      dataIndex: 'clientId',
    },
    {
      title: 'Allocation Size(TiB)',
      dataIndex: 'allocationSize',
    },
    {
      title: 'Allocation Time',
      dataIndex: 'allocationTime',
    },
    {
      title: 'Signers(LDN)',
      dataIndex: 'signers',
    },
  ],
};

const List = () => {
  const fetchData = useCallback(async (key: string) => {
    try {
      const res = await services.getNeighborList('', key);

      return {
        data: res?.map((ret, index) => {
          ret.key = index;

          return ret;
        }),
        success: true,
      };
    } catch (e) {
      return {
        data: [],
        success: false,
      };
    }
  }, []);

  return (
    <ListStyled>
      <Tabs>
        <Tabs.TabPane key={'1'} tab={'Neighbor List'}>
          <Tabs>
            <Tabs.TabPane key={'3'} tab={'Client List'}>
              <ProTable
                columns={columnsConfig['3']}
                request={() => fetchData('3')}
                search={false}
              />
            </Tabs.TabPane>
            <Tabs.TabPane key={'4'} tab={'Provider List'}>
              <ProTable
                columns={columnsConfig['4']}
                request={() => fetchData('4')}
                search={false}
              />
            </Tabs.TabPane>
          </Tabs>
        </Tabs.TabPane>
        <Tabs.TabPane key={'2'} tab={'Activity List'}>
          <ProTable
            columns={columnsConfig['2']}
            request={() => fetchData('2')}
            search={false}
          />
        </Tabs.TabPane>
      </Tabs>
    </ListStyled>
  );
};

export default List;

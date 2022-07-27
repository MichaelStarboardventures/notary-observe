import React, {
  ReactNode,
  DetailedReactHTMLElement,
  ReactElement,
  createContext,
  useContext,
  useEffect,
} from 'react';
import { Tabs, Table, Row, Col } from 'antd';
import styled from 'styled-components';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Search } from '@/components/search';
import services from '@/services';
import { useCallback, useRef, useState } from 'react';
import { Key } from '@/services';

const ListStyled = styled.div`
  padding: 24px;
`;

const columnsConfig: Record<string, Record<string, ProColumns[]>> = {
  3: {
    v: [
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
        dataIndex: 'totalDatacapReceived',
      },
      {
        title: '% of DataCap Spent',
        dataIndex: 'datacapSpent',
      },
    ],
    c: [
      {
        title: 'Notary Name',
        dataIndex: 'notaryName',
      },
      {
        title: 'Notary ID',
        dataIndex: 'notaryId',
      },
      {
        title: 'Notary Address',
        dataIndex: 'notaryAddress',
      },
      {
        title: 'Account Onboarding Time',
        dataIndex: 'accountOnboardingTime',
      },
      {
        title: 'Client Headcount',
        dataIndex: 'clientHeadcount',
      },
      {
        title: 'Provider Headcount',
        dataIndex: 'providerHeadcount',
      },
      {
        title: 'Total Data Cap Allocated',
        dataIndex: 'totalDataCapAllocated',
      },
    ],
    p: [
      {
        title: 'Notary Name',
        dataIndex: 'notaryName',
      },
      {
        title: 'Notary ID',
        dataIndex: 'notaryId',
      },
      {
        title: 'Notary Address',
        dataIndex: 'notaryAddress',
      },
      {
        title: 'Account Onboarding Time',
        dataIndex: 'accountOnboardingTime',
      },
      {
        title: 'Total DataCap Allocated(TiB)',
        dataIndex: 'totalDataCapAllocated',
      },
      {
        title: 'Client Headcount',
        dataIndex: 'clientHeadcount',
      },
      {
        title: 'Provider Headcount',
        dataIndex: 'providerHeadcount',
      },
    ],
  },
  4: {
    v: [
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
    c: [
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
    p: [
      {
        title: 'Client ID',
        dataIndex: 'clientId',
      },
      { title: 'Client Name', dataIndex: 'clientName' },
      {
        title: 'Client Address',
        dataIndex: 'clientAddress',
      },
      {
        title: 'Account Onboarding Time',
        dataIndex: 'accountOnboardingTime',
      },
      {
        title: 'Total Datacap Received',
        dataIndex: 'totalDatacapReceived',
      },
      {
        title: '% Datacap Spent',
        dataIndex: 'datacapSpent',
      },
    ],
  },
  2: {
    v: [
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
    c: [
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
    p: [
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
  },
};

const TableTabsContext = createContext<{
  activeKey: string;
  setActiveKey: React.Dispatch<React.SetStateAction<string>>;
}>({ activeKey: '', setActiveKey: () => {} });

const TableTabs: React.FC<{
  onTabClick?: (key: string) => void;
  activeTabKey: string;
}> = ({ onTabClick, activeTabKey, children }) => {
  const [activeKey, setActiveKey] = useState(activeTabKey);

  return (
    <TableTabsContext.Provider value={{ activeKey, setActiveKey }}>
      <Row align={'middle'} gutter={[15, 0]}>
        {React.Children.map(children, (child, index) => (
          <Col key={index}>
            {React.cloneElement(
              child as DetailedReactHTMLElement<{}, HTMLElement>,
              {
                onClick: () => {
                  onTabClick &&
                    onTabClick((child as ReactElement)?.props?.value);

                  setActiveKey((child as ReactElement)?.props?.value);
                },
              },
            )}
          </Col>
        ))}
      </Row>
    </TableTabsContext.Provider>
  );
};

const TableTab: React.FC<{
  value: string;
  onClick?: (value: string) => void;
}> = ({ value, onClick, children }) => {
  const { activeKey } = useContext(TableTabsContext);
  const color = activeKey === value ? '#1890ff' : 'transparent';

  return (
    <div
      style={{
        minWidth: 100,
        textAlign: 'center',
        padding: '5px 10px',
        cursor: 'pointer',
        borderBottom: `1px solid ${color}`,
      }}
      onClick={() => {
        onClick && onClick(value);
      }}
    >
      {children}
    </div>
  );
};

const SecondTabs = ({
  currentKey,
  setCurrentTab,
  setDataSource,
}: {
  currentKey: Key;
  setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
  setDataSource: React.Dispatch<React.SetStateAction<Record<string, any>[]>>;
}) => {
  useEffect(() => {
    setCurrentTab('3');
  }, []);

  const tabs = {
    v: [
      { label: 'Client List', value: '3' },
      { label: 'Provider List', value: '4' },
    ],
    c: [
      { label: 'Notary List', value: '3' },
      { label: 'Provider List', value: '4' },
    ],
    p: [
      { label: 'Notary List', value: '3' },
      { label: 'Client List', value: '4' },
    ],
  };

  return (
    <TableTabs
      activeTabKey={'3'}
      onTabClick={(key) => {
        setCurrentTab(key);
        setDataSource([]);
      }}
    >
      {tabs[currentKey].map((tab) => (
        <TableTab key={tab.value} value={tab.value}>
          {tab.label}
        </TableTab>
      ))}
    </TableTabs>
  );
};

const List = () => {
  const [currentTab, setCurrentTab] = useState('1');
  const [currentKey, setCurrentKey] = useState<Key>('v');
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);

  const fetchData = useCallback(
    async (searchId: string, key?: Key, id?: string) => {
      try {
        setLoading(true);
        const res = await services.getNeighborList(searchId, key, id);
        const data = res?.map((ret, index) => {
          ret.key = index;

          return ret;
        });

        setDataSource(data || []);
        setLoading(false);

        return {
          data: res?.map((ret, index) => {
            ret.key = index;

            return ret;
          }),
          success: true,
        };
      } catch (e) {
        setLoading(false);
        return {
          data: [],
          success: false,
        };
      }
    },
    [],
  );

  useEffect(() => {
    setCurrentTab('3');
  }, []);

  useEffect(() => {
    currentId && fetchData(currentId, currentKey, currentTab);
  }, [currentId, currentTab, currentKey]);

  return (
    <>
      <Search
        onTabClick={(key) => setCurrentKey(key)}
        getSearchId={async (id) => {
          setCurrentId(id);
          await fetchData(id, currentKey, currentTab);
        }}
      />
      <ListStyled>
        <TableTabs
          activeTabKey={'1'}
          onTabClick={(key) => {
            setCurrentTab(key);
            setDataSource([]);
          }}
        >
          <TableTab value={'1'}>Neighbor List</TableTab>
          {/*<TableTab value={'2'}>Activity List</TableTab>*/}
        </TableTabs>

        {currentTab === '2' ? null : (
          <SecondTabs
            currentKey={currentKey}
            setCurrentTab={setCurrentTab}
            setDataSource={setDataSource}
          />
        )}
      </ListStyled>
      {columnsConfig[currentTab] && (
        <ProTable
          columns={columnsConfig[currentTab][currentKey]}
          loading={loading}
          dataSource={dataSource}
          search={false}
        />
      )}
    </>
  );
};

export default List;

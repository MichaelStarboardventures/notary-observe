import { Key } from '@/services';
import React, { useState } from 'react';
import { Form, Input, Radio } from 'antd';

export const Search = ({
  fetchData,
  onTabClick,
  getSearchId,
  isClient,
}: {
  fetchData?: (key?: Key, id?: string) => void;
  onTabClick?: (value: Key) => void;
  getSearchId?: (id: string) => void;
  isClient?: boolean;
}) => {
  const options: { label: string; value: Key }[] = isClient
    ? [
        {
          label: 'Client',
          value: 'c',
        },
      ]
    : [
        {
          label: 'Notary',
          value: 'v',
        },
        {
          label: 'Client',
          value: 'c',
        },
        {
          label: 'Provider',
          value: 'p',
        },
      ];
  const [tab, setTab] = useState<Key>(options[0]['value']);

  return (
    <div style={{ width: 600, padding: 24 }}>
      <Form.Item>
        <Radio.Group
          value={tab}
          onChange={(e) => {
            setTab(e.target.value);
            onTabClick && onTabClick(e.target.value);
          }}
          options={options}
        />
      </Form.Item>
      <Form.Item>
        <Input.Search
          placeholder={`Search ${
            options.find((option) => option.value === tab)?.label
          } Id`}
          onSearch={(e) => {
            fetchData && fetchData(tab, e);
            getSearchId && getSearchId(e);
          }}
        />
      </Form.Item>
    </div>
  );
};

import React from 'react';
import enGB from 'antd/es/locale/en_GB';
import {
  createIntl,
  ConfigProvider,
  IntlProvider,
  enUSIntl,
} from '@ant-design/pro-table';

const Layout: React.FC = ({ children }) => {
  console.log('dfdfdfdxxxfdfdf');
  return (
    <IntlProvider
      value={{
        intl: enUSIntl,
        valueTypeMap: {},
      }}
    >
      {children}
    </IntlProvider>
  );
};

export default Layout;

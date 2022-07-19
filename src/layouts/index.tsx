import React from 'react';
import {
  createIntl,
  ConfigProvider,
  IntlProvider,
  enUSIntl,
} from '@ant-design/pro-table';

const Layout: React.FC = ({ children }) => {
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

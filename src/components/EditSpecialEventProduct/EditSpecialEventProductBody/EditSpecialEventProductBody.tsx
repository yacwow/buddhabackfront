import { useModel } from '@umijs/max';
import React, { useEffect } from 'react';
import styles from './EditSpecialEventProductBody.less';
import EditSpecialEventProductBodyHeader from './EditSpecialEventProductBodyHeader';
import EditSpecialEventProductBodyTable from './EditSpecialEventProductBodyTable';

const App: React.FC = () => {
  return (
    <div>
      <EditSpecialEventProductBodyHeader />
      <EditSpecialEventProductBodyTable />
    </div>
  );
};
export default App;

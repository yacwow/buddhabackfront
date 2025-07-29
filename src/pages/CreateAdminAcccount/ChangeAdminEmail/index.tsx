import ChangeAdminAccountEmail from '@/components/CreateAdminAccount/ChangeAdminAccountEmail';
import LayOut from '@/components/LayOut';
import { request } from '@umijs/max';
import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [initialValues, setInitialValuese] = useState();
  useEffect(() => {
    request('/admin/secure/getBasicAdminInfo').then((data) => {
      if (data.result) {
        let admin = data.data.adminUser;
        let map: any = {};
        map.username = admin.adminusername;
        map.adminemail = admin.adminemail;
        map.nickname = admin.adminname;
        map.level = admin.level;
        setInitialValuese(map);
      }
    });
  }, []);
  return (
    <LayOut>
      {initialValues && (
        <ChangeAdminAccountEmail initialValues={initialValues} />
      )}
    </LayOut>
  );
};
export default App;

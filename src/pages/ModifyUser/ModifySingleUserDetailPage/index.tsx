import LayOut from '@/components/LayOut';
import ModifySingleUserDetailComp from '@/components/ModifyUserComp/ModifySingleUserDetailComp';
import { formatTimeFromStr } from '@/utils/format';
import { request } from '@umijs/max';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [userData, setUserData] = useState();
  const [invoiceList, setInvoiceList] = useState();
  useEffect(() => {
    let searchArr = location.search.split('?');
    let email;
    if (searchArr.length >= 2) {
      email = searchArr[1];
    }
    request('/admin/secure/getSingleUserDetailInfo', {
      params: {
        email,
      },
    }).then((data) => {
      if (data.result) {
        if (data.code === 20001) {
          message.error(
            { content: '不存在这个用户', style: { marginTop: '40vh' } },
            4,
          );
          return;
        } else {
          let userData = data.data.user;
          if (userData.lastlogin) {
            userData.lastlogin = formatTimeFromStr(userData.lastlogin);
          }
          setUserData(userData);
          setInvoiceList(data.data.invoiceList);
        }
      }
    });
  }, []);
  return (
    <LayOut>
      {userData ? (
        <ModifySingleUserDetailComp
          userData={userData}
          invoiceList={invoiceList}
        />
      ) : null}
    </LayOut>
  );
};
export default App;

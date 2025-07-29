import ChangeAdminAccountActivity from '@/components/CreateAdminAccount/ChangeAdminAccountActivity';
import LayOut from '@/components/LayOut';
import React from 'react';

const App: React.FC = () => {
  return (
    <LayOut>
      <h2>
        可以在当前页面改变这个管理员的状态，昵称，级别，
        <br />
        如果把状态改为禁用则该管理员无法登录
        <br />
        <span style={{ color: 'red' }}>
          (由于有缓存的存在，一般都是三天后才真正生效)
        </span>
      </h2>
      <ChangeAdminAccountActivity />
    </LayOut>
  );
};
export default App;

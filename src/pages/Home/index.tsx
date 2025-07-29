import LayOut from '@/components/LayOut';
import { useModel } from '@umijs/max';
import React from 'react';

const App: React.FC = () => {
  const { userName } = useModel('global');
  return (
    <LayOut>
      <div>
        <h2>欢迎{userName},这是个超级丑的后台管理系统</h2>
      </div>
    </LayOut>
  );
};
export default App;

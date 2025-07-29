import LayOut from '@/components/LayOut';
import BadInvoice from '@/components/WebDesignData/BadInvoice';
import React from 'react';

const App: React.FC = () => {
  return (
    <LayOut>
      <h2>
        每一行为0则表示该列数据没啥问题，主要关注非0项，
        如果全为0则需要看服务器内部的错误提示
        有时候账单会因为下单的时候有限时等等的折扣， 到支付的时候没了导致问题
        如果真实的数据和订单差距不大就删掉。
      </h2>
      <BadInvoice />
    </LayOut>
  );
};
export default App;

import LayOut from '@/components/LayOut';
import PersonalCouponUsage from '@/components/PersonalCouponUsage';
import React from 'react';
interface Props {}
const App: React.FC<Props> = (props) => {
  return (
    <LayOut>
      <PersonalCouponUsage />
    </LayOut>
  );
};
export default App;

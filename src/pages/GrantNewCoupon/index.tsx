import GrantAllCouponData from '@/components/GrantAllCouponData';
import LayOut from '@/components/LayOut';

import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react';
interface InitialValue {
  codeNumber?: string;
  codeType?: string;
  whoCanApply?: string;
  applyAmount?: number;
  userEmail?: string;
  couponAmount?: number;
  couponPercentOrAmount?: string;
  startDate?: Dayjs;
  expireDate?: Dayjs;
  used?: boolean;
}
const App: React.FC = () => {
  const [initialValue] = useState<InitialValue | undefined>({
    whoCanApply: 'person',
    used: true,
    startDate: dayjs(new Date()),
    couponPercentOrAmount: 'amount',
    applyAmount: 0,
  });
  const [couponId] = useState<number>(-1);

  return (
    <LayOut>
      {initialValue && couponId && (
        <GrantAllCouponData initialValue={initialValue} couponId={couponId} change={false} />
      )}
    </LayOut>
  );
};
export default App;

import GrantAllCouponData from '@/components/GrantAllCouponData';
import LayOut from '@/components/LayOut';
import { request } from '@umijs/max';
import { message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
interface InitialValue {
  codeNumber?: string;
  codeType?: string;
  whoCanApply?: string;
  applyAmount?: number;
  userEmail?: string;
  couponAmount?: number;
  couponPercentOrAmount?: string;
  promotionCode?: string;
  startDate?: Dayjs;
  expireDate?: Dayjs;
  used?: boolean;
}
const App: React.FC = () => {
  const [initialValue, setInitialValue] = useState<InitialValue | undefined>();
  const [couponId, setCouponId] = useState<number>(-1);
  useEffect(() => {
    let href = window.location.search.split('?');
    console.log(href);
    if (href.length > 1 && +href[1]) {
      console.log('in');
      request('/admin/secure/getDetailCoupon', {
        params: {
          idCouponList: href[1],
        },
      }).then((data) => {
        if (data.result) {
          // setInitialValue(data.data.value);
          let newInitial: InitialValue = {};
          newInitial.codeNumber = data.data.codeNumber;
          newInitial.codeType = data.data.codeType;
          newInitial.couponAmount = data.data.couponAmount
            ? data.data.couponAmount
            : data.data.couponPercent;
          newInitial.whoCanApply = data.data.userEmail
            ? 'person'
            : data.data.whoCanApply;
          newInitial.promotionCode = data.data.promotionCode;
          newInitial.applyAmount = data.data.applyAmount;
          newInitial.couponPercentOrAmount = data.data.couponAmount
            ? 'amount'
            : 'percent';
          newInitial.userEmail = data.data.userEmail
            ? data.data.userEmail
            : null;
          newInitial.startDate = dayjs(data.data.startDate);
          newInitial.expireDate = dayjs(data.data.expireDate);
          console.log(dayjs(data.data.startDate));
          newInitial.used = data.data.used ? data.data.used : false;
          setInitialValue(newInitial);
          setCouponId(data.data.couponId);
        } else {
          message.info(
            { content: '没有这个优惠代码', style: { marginTop: '40vh' } },
            4,
          );
        }
      });
    } else {
      message.info(
        {
          content: '请通过折扣码展示页面跳转过来',
          style: { marginTop: '40vh' },
        },
        4,
      );
    }
  }, []);
  return (
    <LayOut>
      <h2>时间选择的时候先选时分秒后选年月日，不然年月日会回归当前日</h2>
      {initialValue && couponId && (
        <GrantAllCouponData initialValue={initialValue} couponId={couponId} />
      )}
    </LayOut>
  );
};
export default App;

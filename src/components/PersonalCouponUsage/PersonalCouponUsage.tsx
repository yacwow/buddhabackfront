import { NavLink, request } from '@umijs/max';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [list, setList] = useState([]);
  const [userName, setUserName] = useState('');
  const [promotionCode, setPromotionCode] = useState('');
  useEffect(() => {
    let pathArr = location.pathname.split('/');
    console.log(pathArr);
    if (pathArr.length !== 5 || !+pathArr[3]) {
      message.error({ content: '请通过网页跳转到该页面，不要自己输入url' }, 4);
    } else {
      setPromotionCode(pathArr[4]);
      request('/admin/secure/getPersonalCouponUsage', {
        params: {
          invoiceId: pathArr[3],
          couponCode: pathArr[4],
        },
      }).then((data) => {
        if (data.result) {
          if (data.code === 20001) {
            //这两个状态不在一起
            message.error(
              { content: '似乎订单号和优惠码不匹配，请联系后台管理员' },
              4,
            );
          } else {
            setList(data.data.result);
            setUserName(data.data.name);
          }
        }
      });
    }
  }, []);
  return (
    <div>
      {list.length > 0 ? (
        <>
          <div>用户名字：{userName}</div>
          <div>用户使用的折扣码：{promotionCode}</div>
          {list.map((item, index: number) => {
            return (
              <div key={index}>
                订单号：
                <NavLink to={`/backend/invoice/${item}`}>{item}</NavLink>
              </div>
            );
          })}
        </>
      ) : (
        '不存在任何相关订单，有错误，请联系后台管理'
      )}
    </div>
  );
};
export default App;

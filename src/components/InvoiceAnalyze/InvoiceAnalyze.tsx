import { request } from '@umijs/max';
import React, { useEffect, useState } from 'react';
import InvoiceAnalyzeBody from './InvoiceAnalyzeBody';
import InvoiceAnalyzeHeader from './InvoiceAnalyzeHeader';

export type tableDateType = {
  country: string;
  email: string;
  finalPrice: number;
  firstName: string;
  lastName: string;
  invoiceId: string;
  orderDate: string;
  price: number;
  province: string;
  status: string;
  discountAmount?: number;
  discountPercent?: number;
  ip?: string;
};
const App: React.FC = () => {
  const [tableData, setTableData] = useState<tableDateType[]>([]); //整个table的数据
  const [total, setTotal] = useState(0); //总的invoice数量

  const [listData, setListData] = useState<any[]>([]); //header里面展示信息的数据
  const date = new Date();
  let today =
    date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  let milliSecond = date.getTime() - 3600 * 1000 * 24;
  const date1 = new Date(milliSecond);
  let yesterday =
    date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate();

  useEffect(() => {
    // let tomorrowmilliSecond = date.getTime() + 3600 * 1000 * 24;
    // const date2 = new Date(tomorrowmilliSecond);
    // let tomorrow =
    //   date2.getFullYear() +
    //   '-' +
    //   (date2.getMonth() + 1) +
    //   '-' +
    //   date2.getDate();
    // console.log(today);
    // console.log(yesterday, tomorrow);
    request('/admin/secure/getRecentTwoDayInvoice', {
      params: {
        today,
        yesterday,
      },
    }).then((data) => {
      if (data.result) {
        setListData(data.data.invoiceInfo);
      }
    });
  }, []);
  return (
    <div style={{ minWidth: 1300 }}>
      {listData ? (
        <InvoiceAnalyzeHeader
          listData={listData}
          setTotal={setTotal}
          setTableData={setTableData}
          today={today}
          yesterday={yesterday}
        />
      ) : null}

      <InvoiceAnalyzeBody
        tableData={tableData}
        total={total}
        setTotal={setTotal}
        setTableData={setTableData}
      />
    </div>
  );
};
export default App;

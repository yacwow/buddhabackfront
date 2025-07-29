import { request } from '@umijs/max';
import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';

import NumToString from '@/utils/NumToString';
import { formatTimeFromStr } from '@/utils/format';
import ShowAllCouponHead from './ShowAllCouponHead';

interface DataType {
  key: string;
  idcouponlist: number;
  coupontype: string;
  codenumber: string;
  whocanapply: number;

  discountamount: number | null;
  //   discountpercent: null | null;
  discountType: string;
  applyamount: number;
  startdate: string;
  expiredate: string;
  promotioncode: string;
  used: false;
}
const columns: ColumnsType<DataType> = [
  {
    title: 'ID',
    dataIndex: 'idcouponlist',
    key: 'idcouponlist',
  },
  {
    title: '优惠码名称',
    dataIndex: 'coupontype',
    key: 'coupontype',
  },
  {
    title: '优惠码',
    dataIndex: 'codenumber',
    key: 'codenumber',
    render: (codenumber, singleLine) => (
      <a
        target={'_blank'}
        href={`/backend/changeCoupon?${singleLine.idcouponlist}`}
        rel="noreferrer"
      >
        {codenumber}
      </a>
    ),
  },
  {
    title: '使用者',
    dataIndex: 'whocanapply',
    key: 'whocanapply',
    render: (whocanapply) => (
      <div>
        {whocanapply === 0
          ? '限时折扣'
          : whocanapply === 1
          ? '普通折扣'
          : whocanapply === 2
          ? '个人推广'
          : '个人折扣'}
      </div>
    ),
  },
  {
    title: '优惠金额',
    dataIndex: 'discountamount',
    key: 'discountamount',
    render: (discountamount) => <div>{NumToString(discountamount)}</div>,
  },
  {
    title: '优惠类型',
    dataIndex: 'discountType',
    key: 'discountType',
    render: (discountType) => (
      <div>{discountType === 'percent' ? '指定比例' : '指定价格(固定值)'}</div>
    ),
  },
  {
    title: '最低购买',
    dataIndex: 'applyamount',
    key: 'applyamount',
    render: (applyamount) => <div>{NumToString(applyamount)}</div>,
  },
  {
    title: '开始时间',
    dataIndex: 'startdate',
    key: 'startdate',
    render: (startdate) => <div>{formatTimeFromStr(startdate)}</div>,
  },
  {
    title: '结束时间',
    dataIndex: 'expiredate',
    key: 'expiredate',
    render: (expiredate) => <div>{formatTimeFromStr(expiredate)}</div>,
  },
  {
    title: '是否已经使用',
    dataIndex: 'used',
    key: 'used',
    render: (used) => <div>{used ? '是' : '否'}</div>,
  },
  {
    title: '适用邮件',
    dataIndex: 'email',
    key: 'email',
    render: (email) => <div style={{ width: 100 }}>{email}</div>,
  },
  {
    title: '用户名字',
    dataIndex: 'name',
    key: 'name',
    render: (name) => <div>{name}</div>,
  },
  {
    title: '个人推广码',
    dataIndex: 'promotioncode',
    key: 'promotioncode',
    render: (promotioncode) => <div>{promotioncode}</div>,
    sorter: (a, b) => +a.promotioncode - +b.promotioncode,
  },
];
const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<number>();
  const [tableData, setTableData] = useState([]);
  const [search, setSearch] = useState('email');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (inputValue === '') {
      request('/admin/secure/getAllCouponList', {
        params: {
          page: page,
          search,
          inputValue,
        },
      }).then((data) => {
        if (data.result) {
          setTotal(data.data.total);
          let newCoupon = data.data.couponList;
          for (let i = 0; i < newCoupon.length; i++) {
            newCoupon[i].key = i;
            newCoupon[i].discountType = newCoupon[i].discountType
          }
          setTableData(newCoupon);
        }
      });
    } else {
      request('/admin/secure/getCouponListByParams', {
        params: {
          page: page,
          search,
          inputValue,
        },
      }).then((data) => {
        if (data.result) {
          setTotal(data.data.total);
          let newCoupon = data.data.couponList;
          for (let i = 0; i < newCoupon.length; i++) {
            newCoupon[i].key = i;
            newCoupon[i].discountType = newCoupon[i].discountType
          }
          setTableData(newCoupon);
        }
      });
    }
  }, [page]);

  return (
    <div>
      <ShowAllCouponHead
        setTableData={setTableData}
        setTotal={setTotal}
        setSearch={setSearch}
        setInputValue={setInputValue}
        inputValue={inputValue}
        search={search}
        page={page}
        setPage={setPage}
      />
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={{
          current: page,
          total: total,
          pageSize: 40,
          hideOnSinglePage: true,
          position: ['bottomCenter'],
          onChange(page) {
            setPage(page);
          },
        }}
      />
      
    </div>
  );
};
export default App;

import React, { Dispatch, SetStateAction } from 'react';
import { PaginationProps, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import NumToString from '@/utils/NumToString';
import { formatTimeFromStr } from '@/utils/format';

interface DataType {
  key: number;
  invoiceId: string;
  orderDate: string;
  firstName: string;
  email: string;
  country: string;
  province: string;
  price: number;
  finalPrice: number;
  status: string;
  deliveryStatus: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: '订单编号',
    dataIndex: 'invoiceId',
    key: 'invoiceId',
    render: (invoiceId) => (
      <a
        target="_blank"
        href={`/backend/deliverySingleInvoicePage/${invoiceId}`}
        rel="noreferrer"
      >
        {invoiceId}
      </a>
    ),
    sorter: (a: any, b: any) => {
      return a.invoiceId - b.invoiceId;
    },
  },
  {
    title: '订单时间',
    dataIndex: 'orderDate',
    key: 'orderDate',
    render: (orderDate: string) => {
      return <div>{formatTimeFromStr(orderDate)}</div>;
    },
  },
  {
    title: '用户名字',
    dataIndex: 'firstName',
    key: 'firstName',
    sorter: (a: any, b: any) => {
      return a.firstName - b.firstName;
    },
  },
  {
    title: '用户邮箱',
    dataIndex: 'email',
    key: 'email',
    sorter: (a: any, b: any) => {
      return a.email - b.email;
    },
  },
  {
    title: '国家',
    dataIndex: 'country',
    key: 'country',
  },
  {
    title: '省份',
    dataIndex: 'province',
    key: 'province',
    sorter: (a: any, b: any) => {
      return a.province - b.province;
    },
  },
  {
    title: '实际订单价格',
    dataIndex: 'price',
    key: 'price',
    render: (price: number) => {
      return <div>￥{NumToString(price)}</div>;
    },
    sorter: (a: any, b: any) => {
      return a.price - b.price;
    },
  },
  {
    title: '订单金额',
    dataIndex: 'finalPrice',
    key: 'finalPrice',
    render: (finalPrice: number) => {
      return <div>￥{NumToString(finalPrice)}</div>;
    },
    sorter: (a: any, b: any) => {
      return a.finalPrice - b.finalPrice;
    },
  },
  {
    title: '状态',
    key: 'deliveryStatus',
    dataIndex: 'deliveryStatus',
    render: (status: string, oneLineData) => {
      console.log(oneLineData)
      if (status === 'notdelivery') {
        return (
          <div style={{ padding: 4, color: 'white', backgroundColor: 'gray' }}>
            未发货
          </div>
        );
      } else if (status === 'partialdelivery') {
        return (
          <div
            style={{
              padding: 4, color: 'white', backgroundColor: 'rgb(100,200,100)',
            }}
          >
            部分发货有单号
          </div>
        );
      } else if (status === 'alldelivery') {
        return (
          <div style={{ padding: 4, color: 'white', backgroundColor: 'red' }}>
            全部发货有单号
          </div>
        );
      } else if (status === 'deliveried') {
        return (
          <div
            style={{ padding: 4, color: 'white', backgroundColor: '#1062d2' }}
          >
            快递已查收
          </div>
        );
      } else if (status === 'userinfoerror' || status === 'usernotshow') {
        return (
          <div style={{ padding: 4, color: 'white', backgroundColor: 'blue' }}>
            用户信息错误/用户未出现
          </div>
        );
      } else {
        return (
          <div style={{ padding: 4, color: 'white', backgroundColor: 'orange' }}>
            未知状态
          </div>
        );
      }
    },
    filters: [
      { text: '未发货', value: 'notdelivery' },
      { text: '部分发货有单号', value: 'partialdelivery' },
      { text: '全部发货有单号', value: 'alldelivery' },
      { text: '快递已查收', value: 'deliveried' },
      { text: '用户信息错误/用户未出现', value: 'userinfoerror' },
      { text: '用户信息错误/用户未出现', value: 'usernotshow' },
    ],
    onFilter: (value: string | number | boolean, record) =>
      typeof value === 'string' && record.status.includes(value),
  },
];

interface Props {
  page: number;
  pageSize: number;
  setPage: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
  tableData: any[];
  total: number;
}
const App: React.FC<Props> = (props) => {
  const { page, pageSize, setPage, setPageSize, total, tableData } = props;
  const data: DataType[] = tableData.map((item, index: number) => {
    return {
      key: index,
      invoiceId: item.invoiceId,
      orderDate: item.orderDate,
      firstName: item.firstName,
      email: item.email,
      country: item.country,
      province: item.province,
      price: +item.price,
      finalPrice: +item.finalPrice,
      status: item.status,
      deliveryStatus: item.deliveryStatus,
    };
  });

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    current,
    pageSize,
  ) => {
    setPageSize(pageSize);
    setPage(current);
  };
  return (
    <Table
      columns={columns}
      pagination={{
        showSizeChanger: true,
        defaultCurrent: page,
        defaultPageSize: pageSize,
        onChange: onShowSizeChange,
        total: total,
        pageSizeOptions: [40, 100, 200, 500],
      }}
      dataSource={data}
    />
  );
};
export default App;

import React, { Dispatch, SetStateAction, useState } from 'react';
import { message, Modal, PaginationProps, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import NumToString from '@/utils/NumToString';
import { formatTimeFromStr } from '@/utils/format';
import { tableDateType } from '../../InvoiceAnalyze';
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { set } from 'rsuite/esm/internals/utils/date';
import { request } from '@umijs/max';

dayjs.extend(utc);
dayjs.extend(timezone);

interface DataType {
  key: string;
  invoiceId: string;
  orderDate: string;
  firstName: string;
  email: string;
  country: string;
  province: string;
  price: number;
  finalPrice: number;
  discountAmount?: number;
  discountPercent?: number;
  status: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: '订单编号',
    dataIndex: 'invoiceId',
    key: 'invoiceId',
    render: (invoiceId) => (
      <a
        target="_blank"
        rel="noreferrer"
        href={`/backend/invoice/${invoiceId}`}
      >
        {invoiceId}
      </a>
    ),
    sorter: (a: any, b: any) => {
      return a.invoiceId - b.invoiceId;
    },
  },
  {
    title: '订单生成时间(美西时间)',
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
      return <div>${price}</div>;
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
      return <div>${finalPrice}</div>;
    },
    sorter: (a: any, b: any) => {
      return a.finalPrice - b.finalPrice;
    },
  },
  {
    title: '固定折扣',
    dataIndex: 'discountAmount',
    key: 'discountAmount',
    render: (discountAmount: number) => {
      if (discountAmount) {
        return <div>${NumToString(discountAmount)}</div>;
      } else {
        return <div>${0}</div>;
      }
    },
    sorter: (a: any, b: any) => {
      return a.discountAmount - b.discountAmount;
    },
  },
  {
    title: '折扣比例',
    dataIndex: 'discountPercent',
    key: 'discountPercent',
    render: (discountPercent: number) => {
      if (discountPercent) {
        return <div>{NumToString(discountPercent)}%</div>;
      } else {
        return <div>{0}%</div>;
      }
    },
    sorter: (a: any, b: any) => {
      return a.discountPercent - b.discountPercent;
    },
  },

  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    render: (status: string) => {
      if (status === 'delivery') {
        return (
          <div style={{ padding: 4, color: 'white', backgroundColor: 'gray' }}>
            快递中
          </div>
        );
      } else if (status === 'paid') {
        return (
          <div
            style={{
              padding: 4,
              color: 'white',
              backgroundColor: 'rgb(100,200,100)',
            }}
          >
            支付完成
          </div>
        );
      } else if (status === 'cancelled') {
        return (
          <div style={{ padding: 4, color: 'white', backgroundColor: 'red' }}>
            取消支付
          </div>
        );
      } else if (status === 'unpaid') {
        return (
          <div
            style={{ padding: 4, color: 'white', backgroundColor: '#1062d2' }}
          >
            支付确认中
          </div>
        );
      } else if (status === 'received') {
        return (
          <div style={{ padding: 4, color: 'white', backgroundColor: 'green' }}>
            快递已查收
          </div>
        );
      }
      // else if (status === 'userinfoerror' || status === "usernotshow") {
      //   return (
      //     <div style={{ padding: 4, color: 'white', backgroundColor: 'orange' }}>
      //       用户信息错误/用户未出现
      //     </div>
      //   );
      // }
      // else {
      //   return (
      //     <div style={{ padding: 4, color: 'white', backgroundColor: 'purple' }}>
      //       未知状态
      //     </div>
      //   );
      // }
    },
    filters: [
      { text: '快递中', value: 'delivery' },
      { text: '快递已查收', value: 'received' },
      { text: '支付完成', value: 'paid' },
      { text: '取消支付', value: 'cancelled' },
      { text: '支付确认中', value: 'unpaid' },
    ],
    onFilter: (value: string | number | boolean, record) => {
      if (typeof value === 'string') {
        return record.status.includes(value);
      }
      return false;
    },
  },
];

interface Props {
  page: number;
  pageSize: number;
  setPage: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
  tableData: tableDateType[];
  total: number;
  active: boolean;
  refreshPage: () => void;
}
const App: React.FC<Props> = (props) => {
  const { page, pageSize, setPage, setPageSize, total, tableData, active, refreshPage } = props;
  const data: DataType[] = tableData.map((item, index: number) => {
    return {
      key: item.invoiceId,
      invoiceId: item.invoiceId,
      orderDate: dayjs(item.orderDate)
        .tz("America/Los_Angeles") // 自动处理夏令时
        .format("YYYY-MM-DD HH:mm:ss"),
      firstName: item.firstName
        ? item.firstName + ',' + item.lastName
        : item.ip ? item.ip : '非登录账号',
      email: item.email,
      country: item.country,
      province: item.province,
      price: +item.price,
      finalPrice: +item.finalPrice,
      status: item.status,
      discountAmount: item.discountAmount,
      discountPercent: item.discountPercent,
    };
  });

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    current,
    pageSize,
  ) => {
    setPageSize(pageSize);
    setPage(current);
  };
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[], selectedRows: DataType[]) => {
      console.log('选中的行：', selectedRows);
      setSelectedRowKeys(keys);
    },
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <button type='button' style={{ marginRight: 10 }} onClick={() => {
        setIsModalOpen(true);
      }}>提取所选订单编号</button>
      <button type='button' style={{ marginRight: 10 }}
        disabled={active ? true : false}
        onClick={() => {
          if (selectedRowKeys.length === 0) {
            message.error({ content: "请选择要删除的订单", style: { marginBottom: "40vh" } })
            return;
          }
          request("/admin/secure/deleteInvoice", { method: "POST", data: { selectedRowKeys } })
            .then(data => {
              if (data.result) {
                message.success({ content: "删除成功", style: { marginBottom: "40vh" } })
                setSelectedRowKeys([]);
                refreshPage();
              } else {
                message.error({ content: "有点小问题，好像没删成功", style: { marginBottom: "40vh" } })
              }
            })
        }}>删除所选订单编号</button>

      <button type='button'
        disabled={active ? false : true}
        onClick={() => {
          if (selectedRowKeys.length === 0) {
            message.error({ content: "请选择要恢复的订单", style: { marginBottom: "40vh" } })
            return;
          }
          request("/admin/secure/recoveryInvoice", { method: "POST", data: { selectedRowKeys } })
            .then(data => {
              if (data.result) {
                message.success({ content: "恢复成功", style: { marginBottom: "40vh" } })
                setSelectedRowKeys([]);
                refreshPage();
              } else {
                message.error({ content: "有点小问题，好像没恢复成功", style: { marginBottom: "40vh" } })
              }
            })
        }}
      >移出回收站</button>
      <Modal
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        title="所选订单编号">
        {selectedRowKeys.map((item) => <span key={item}>{item + ";"}</span>)}
      </Modal>
      <Table
        columns={columns}
        rowSelection={rowSelection}
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
    </>

  );
};
export default App;

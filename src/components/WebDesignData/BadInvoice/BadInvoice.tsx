import React, { useEffect, useState } from 'react';
import { Button, Input, message, Modal, PaginationProps, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import NumToString from '@/utils/NumToString';
import { formatTimeFromStr } from '@/utils/format';
import { request } from '@umijs/max';

interface serverSideDataType {
  key: number;
  invoiceid: string;
  createdTime?: string;
  countNum?: number;
  uncheckedCountNum?: number;
  deliveryAmount?: number;
  uncheckedDeliveryAmount?: number;
  discount?: number;
  uncheckedDiscount?: number;
  getPoint?: number;
  uncheckedGetPoint?: number;
  luckBag?: number;
  uncheckedLuckBag?: number;
  paymentAmount?: number;
  uncheckedPaymentAmount?: number;
  secondHalfDiscount?: number;
  uncheckedSecondHalfDiscount?: number;
  timelyDiscount?: number;
  uncheckedTimelyDiscount?: number;
  // rebateamount?: number;
  // uncheckrebateamount?: number;
  personalCoupon: string;
  total?: number;
  uncheckedTotal?: number;
  author: string;
}

const App: React.FC = () => {
  const [page, setPage] = useState(1); //table显示的页面
  const [pageSize, setPageSize] = useState(40); //显示的一页数量
  const [total, setTotal] = useState(0); //总的invoice数量
  const [tableData, setTableData] = useState<serverSideDataType[]>([]); //整个table的数据
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [needToDeleteInvoice, setNeedToDeleteInvoice] = useState<string>(); //操作的invoiceid
  const [searchInvoiceId, setSearchInvoiceId] = useState<number>();
  //请求服务器删除某一行
  const handleDelete = () => {
    if (needToDeleteInvoice === undefined) return;
    request(`/admin/deleteOneInvoice/${needToDeleteInvoice}`).then((data) => {
      if (data.result) {
        message.info('删除成功', 3);
        let newTableData = structuredClone(tableData).filter((item) => {
          return item.invoiceid !== needToDeleteInvoice;
        });
        setTableData(newTableData);
        setIsModalOpen(false);
      }
    });
  };
  const columns: ColumnsType<serverSideDataType> = [
    {
      title: '订单编号',
      dataIndex: 'invoiceid',
      key: 'invoiceid',
      render: (invoiceid) => (
        <a
          target="_blank"
          rel="noreferrer"
          href={`/backend/invoice/${invoiceid}`}
        >
          {invoiceid}
        </a>
      ),
      sorter: (a: any, b: any) => {
        return a.invoiceid - b.invoiceid;
      },
    },
    {
      title: '订单时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      render: (createdTime: string) => {
        return <div>{formatTimeFromStr(createdTime)}</div>;
      },
    },
    {
      title: '真实产品数量',
      dataIndex: 'countNum',
      key: 'countNum',
      sorter: (a: any, b: any) => {
        return a.countNum - b.countNum;
      },
    },
    {
      title: '上传的数量',
      dataIndex: 'uncheckedCountNum',
      key: 'uncheckedCountNum',
      sorter: (a: any, b: any) => {
        return a.uncheckedCountNum - b.uncheckedCountNum;
      },
    },
    {
      title: '真实的折扣前总费用',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => {
        return <div>￥{NumToString(total)}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.total - b.total;
      },
    },
    {
      title: '上传的折扣前总费用',
      dataIndex: 'uncheckedTotal',
      key: 'uncheckedTotal',
      render: (uncheckedTotal: number) => {
        return <div>￥{NumToString(uncheckedTotal)}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.uncheckedTotal - b.uncheckedTotal;
      },
    },
    {
      title: '真实快递费',
      dataIndex: 'deliveryAmount',
      key: 'deliveryAmount',
      render: (deliveryAmount: number) => {
        return <div>￥{NumToString(deliveryAmount)}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.deliveryAmount - b.deliveryAmount;
      },
    },
    {
      title: '上传的快递费',
      dataIndex: 'uncheckedDeliveryAmount',
      key: 'uncheckedDeliveryAmount',
      render: (uncheckedDeliveryAmount: number) => {
        return <div>￥{NumToString(uncheckedDeliveryAmount)}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.uncheckedDeliveryAmount - b.uncheckedDeliveryAmount;
      },
    },
    {
      title: '真实折扣',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount: number) => {
        return <div>￥{NumToString(discount)}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.discount - b.discount;
      },
    },
    {
      title: '上传的折扣',
      dataIndex: 'uncheckedDiscount',
      key: 'uncheckedDiscount',
      render: (uncheckedDiscount: number) => {
        return <div>￥{NumToString(uncheckedDiscount)}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.uncheckedDiscount - b.uncheckedDiscount;
      },
    },
    {
      title: '真实获取的积分',
      dataIndex: 'getPoint',
      key: 'getPoint',
      render: (getPoint: number) => {
        return <div>￥{NumToString(getPoint)}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.getPoint - b.getPoint;
      },
    },
    {
      title: '上传的积分',
      dataIndex: 'uncheckedGetPoint',
      key: 'uncheckedGetPoint',
      render: (uncheckedGetPoint: number) => {
        return <div>￥{NumToString(uncheckedGetPoint)}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.uncheckedGetPoint - b.uncheckedGetPoint;
      },
    },
    {
      title: '真实luckbag数量',
      dataIndex: 'luckBag',
      key: 'luckBag',
      render: (luckBag: number) => {
        return <div>{luckBag ? luckBag : 0}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.luckBag - b.luckBag;
      },
    },
    {
      title: '上传的luckbag数量',
      dataIndex: 'uncheckedLuckBag',
      key: 'uncheckedLuckBag',
      render: (uncheckedLuckBag: number) => {
        return <div>{uncheckedLuckBag ? uncheckedLuckBag : 0}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.uncheckedLuckBag - b.uncheckedLuckBag;
      },
    },
    {
      title: '真实得第二件半价总折扣',
      dataIndex: 'secondHalfDiscount',
      key: 'secondHalfDiscount',
      render: (secondHalfDiscount: number) => {
        return <div>￥{NumToString(secondHalfDiscount)}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.secondHalfDiscount - b.secondHalfDiscount;
      },
    },
    {
      title: '上传的第二件半价总折扣',
      dataIndex: 'uncheckedSecondHalfDiscount',
      key: 'uncheckedSecondHalfDiscount',
      render: (uncheckedSecondHalfDiscount: number) => {
        return <div>￥{NumToString(uncheckedSecondHalfDiscount)}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.uncheckedSecondHalfDiscount - b.uncheckedSecondHalfDiscount;
      },
    },
    {
      title: '真实的限时折扣',
      dataIndex: 'timelyDiscount',
      key: 'timelyDiscount',
      render: (timelyDiscount: number) => {
        return <div>￥{NumToString(timelyDiscount)}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.timelyDiscount - b.timelyDiscount;
      },
    },
    {
      title: '上传的限时折扣',
      dataIndex: 'uncheckedTimelyDiscount',
      key: 'uncheckedTimelyDiscount',
      render: (uncheckedTimelyDiscount: number) => {
        return <div>￥{NumToString(uncheckedTimelyDiscount)}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.uncheckedTimelyDiscount - b.uncheckedTimelyDiscount;
      },
    },

    {
      title: '使用的个人折扣码',
      dataIndex: 'personalCoupon',
      key: 'personalCoupon',
      render: (personalCoupon: string) => {
        return <div>{personalCoupon ? personalCoupon : '未使用'}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.personalCoupon - b.personalCoupon;
      },
    },

    // {
    //   title: '上传的个人折扣',
    //   dataIndex: 'uncheckrebateamount',
    //   key: 'uncheckrebateamount',
    //   render: (uncheckrebateamount: number) => {
    //     return <div>￥{NumToString(uncheckrebateamount)}</div>;
    //   },
    //   sorter: (a: any, b: any) => {
    //     return a.uncheckrebateamount - b.uncheckrebateamount;
    //   },
    // },
    // {
    //   title: '真实的个人折扣',
    //   dataIndex: 'rebateamount',
    //   key: 'rebateamount',
    //   render: (rebateamount: number) => {
    //     return <div>￥{NumToString(rebateamount)}</div>;
    //   },
    //   sorter: (a: any, b: any) => {
    //     return a.rebateamount - b.rebateamount;
    //   },
    // },

    {
      title: '真实需要支付的费用',
      dataIndex: 'paymentAmount',
      key: 'paymentAmount',
      render: (paymentAmount: number) => {
        return <div>￥{NumToString(paymentAmount)}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.paymentAmount - b.paymentAmount;
      },
    },
    {
      title: '上传的需要支付的费用',
      dataIndex: 'uncheckedPaymentAmount',
      key: 'uncheckedPaymentAmount',
      render: (uncheckedPaymentAmount: number) => {
        return <div>￥{NumToString(uncheckedPaymentAmount)}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.uncheckedPaymentAmount - b.uncheckedPaymentAmount;
      },
    },
    {
      title: '谁添加的',
      dataIndex: 'author',
      key: 'author',
      render: (author: number) => {
        return <div>{author}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.author - b.author;
      },
    },
    {
      title: '删除',
      key: 'delete',
      render: (_: any, oneline: serverSideDataType) => (
        <Button
          danger
          onClick={async () => {
            await setNeedToDeleteInvoice(oneline.invoiceid);
            setIsModalOpen(true);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];
  useEffect(() => {
    request('/admin/getBadInvoice', {
      params: {
        page,
        pageSize,
        active: true,
      },
    }).then((data) => {
      if (data.result) {
        let serversideData = data.data.badInvoices;
        setTotal(serversideData.length);
        let newData = serversideData.map(
          (item: serverSideDataType, index: number) => {
            return {
              key: index,
              invoiceid: item.invoiceid,
              createdTime: item.createdTime,
              countNum: item.countNum ? item.countNum : 0,
              uncheckedCountNum: item.uncheckedCountNum
                ? item.uncheckedCountNum
                : 0,
              deliveryAmount: item.deliveryAmount,
              uncheckedDeliveryAmount: item.uncheckedDeliveryAmount,
              discount: item.discount,
              uncheckedDiscount: item.uncheckedDiscount,
              getPoint: item.getPoint,
              uncheckedGetPoint: item.uncheckedGetPoint,
              luckBag: item.luckBag,
              uncheckedLuckBag: item.uncheckedLuckBag,
              paymentAmount: item.paymentAmount,
              uncheckedPaymentAmount: item.uncheckedPaymentAmount,
              secondHalfDiscount: item.secondHalfDiscount,
              uncheckedSecondHalfDiscount: item.uncheckedSecondHalfDiscount,
              timelyDiscount: item.timelyDiscount,
              uncheckedTimelyDiscount: item.uncheckedTimelyDiscount,
              // rebateamount: item.rebateamount,
              // uncheckrebateamount: item.uncheckrebateamount,
              personalCoupon: item.personalCoupon,
              total: item.total,
              uncheckedTotal: item.uncheckedTotal,
              author: item.author,
            };
          },
        );
        setTableData(newData);
      }
    });
  }, [page, pageSize]);

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    current,
    pageSize,
  ) => {
    setPageSize(pageSize);
    setPage(current);
  };
  //按订单号搜索订单
  const handleSearch = () => {
    if (!searchInvoiceId) return;
    request('/admin/secure/getBadInvoiceByInvoiceId', {
      params: {
        searchInvoiceId,
        audited: false,
      },
    }).then((data) => {
      if (data.result) {
        let serversideData = data.data.badInvoices;
        setTotal(serversideData.length);
        let newData = serversideData.map(
          (item: serverSideDataType, index: number) => {
            return {
              key: index,
              invoiceid: item.invoiceid,
              createdTime: item.createdTime,
              countNum: item.countNum ? item.countNum : 0,
              uncheckedCountNum: item.uncheckedCountNum
                ? item.uncheckedCountNum
                : 0,
              deliveryAmount: item.deliveryAmount,
              uncheckedDeliveryAmount: item.uncheckedDeliveryAmount,
              discount: item.discount,
              uncheckedDiscount: item.uncheckedDiscount,
              getPoint: item.getPoint,
              uncheckedGetPoint: item.uncheckedGetPoint,
              luckBag: item.luckBag,
              uncheckedLuckBag: item.uncheckedLuckBag,
              paymentAmount: item.paymentAmount,
              uncheckedPaymentAmount: item.uncheckedPaymentAmount,
              secondHalfDiscount: item.secondHalfDiscount,
              uncheckedSecondHalfDiscount: item.uncheckedSecondHalfDiscount,
              timelyDiscount: item.timelyDiscount,
              uncheckedTimelyDiscount: item.uncheckedTimelyDiscount,
              total: item.total,
              uncheckedTotal: item.uncheckedTotal,
              author: item.author,
            };
          },
        );
        setTableData(newData);
      }
    });
  };
  //全部订单
  const handleReset = () => {
    request('/admin/getBadInvoice', {
      params: {
        page: 1,
        pageSize,
        active: true,
      },
    }).then((data) => {
      if (data.result) {
        let serversideData = data.data.badInvoices;
        setTotal(serversideData.length);
        let newData = serversideData.map(
          (item: serverSideDataType, index: number) => {
            return {
              key: index,
              invoiceid: item.invoiceid,
              createdTime: item.createdTime,
              countNum: item.countNum ? item.countNum : 0,
              uncheckedCountNum: item.uncheckedCountNum
                ? item.uncheckedCountNum
                : 0,
              deliveryAmount: item.deliveryAmount,
              uncheckedDeliveryAmount: item.uncheckedDeliveryAmount,
              discount: item.discount,
              uncheckedDiscount: item.uncheckedDiscount,
              getPoint: item.getPoint,
              uncheckedGetPoint: item.uncheckedGetPoint,
              luckBag: item.luckBag,
              uncheckedLuckBag: item.uncheckedLuckBag,
              paymentAmount: item.paymentAmount,
              uncheckedPaymentAmount: item.uncheckedPaymentAmount,
              secondHalfDiscount: item.secondHalfDiscount,
              uncheckedSecondHalfDiscount: item.uncheckedSecondHalfDiscount,
              timelyDiscount: item.timelyDiscount,
              uncheckedTimelyDiscount: item.uncheckedTimelyDiscount,
              total: item.total,
              uncheckedTotal: item.uncheckedTotal,
              author: item.author,
            };
          },
        );
        setTableData(newData);
      }
    });
  };
  return (
    <>
      <Modal
        title="提交确认"
        open={isModalOpen}
        onOk={handleDelete}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <p>确定要删除么？</p>
      </Modal>
      <Input
        placeholder="输入想要查找的订单号"
        type={'number'}
        value={searchInvoiceId}
        onChange={(e) => {
          setSearchInvoiceId(+e.target.value);
        }}
        style={{ width: 300 }}
      />
      <Button
        type={'primary'}
        onClick={handleSearch}
        style={{ marginRight: 15, marginLeft: 15 }}
      >
        搜索
      </Button>
      <Button type={'primary'} onClick={handleReset}>
        显示全部
      </Button>

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
        dataSource={tableData}
      />
    </>
  );
};
export default App;

import React, { useEffect, useState } from 'react';
import {
  Button,
  Image,
  Input,
  message,
  Modal,
  PaginationProps,
  Select,
  Table,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import NumToString from '@/utils/NumToString';
import { formatTimeFromStr } from '@/utils/format';
import { request } from '@umijs/max';
import InvoiceDetail from './InvoiceDetail';

interface InvoiceDataType {
  productId: number;
  amount: number;
  color: string;
  href: string;
  imgSrc: string;
  price: number;
  free: boolean;
  productDescription: string;
  secondOneHalf: number;
  size: string;
  timesale: number;
  createTime: string;
  stockStatus: string;
  cartDetailId:number;
}
interface InvoicePaymentInfo {
  invoiceId: string;
  normalDiscount: number;
  originPrice: number;
  paymentAmount: number;
  priceAfterDiscount: number;
  couponCode: string;
  secondHalfDiscount: number;
  timelyDiscount: number;
  deliveryFee: number;
  usedPoint: number;
  firstName: string;
  lastName: string;
}
const App: React.FC = () => {
  const [page, setPage] = useState(1); //table显示的页面
  const [pageSize, setPageSize] = useState(40); //显示的一页数量
  const [total, setTotal] = useState(0); //总的invoice数量
  const [paymentStatus, setPaymentStatus] = useState<string>(); //支付状态
  const [invoiceData, setInvoiceData] = useState<InvoiceDataType[]>([]);
  const [deliveryCode, setDeliveryCode] = useState<string>(); //快递单号
  const [invoiceId, setInvoiceId] = useState<string>();
  const [invoicePaymentInfo, setInvoicePaymentInfo] =
    useState<InvoicePaymentInfo>();
  const [isModalOpen, setIsModalOpen] = useState(false); //打开modal
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [recordPaymentStatus, setRecordPaymentStatus] = useState("")
  useEffect(() => {
    let pathArr = location.pathname.split('/');

    if (pathArr.length > 3) {

      const invoiceIdStr = pathArr[3];

      // 判断是否为纯数字字符串且不超过25位
      const isValidInvoiceId = /^[0-9]{1,25}$/.test(invoiceIdStr);

      if (isValidInvoiceId) {
        setInvoiceId(pathArr[3]);
        request(`/admin/secure/getOneInvoiceInfo`, {
          params: {
            invoiceId: pathArr[3],
          },
        }).then((data) => {
          if (data.result) {
            let serversideData = data.data.singleInvoice;
            setPaymentStatus(data.data.paymentStatus);
            setRecordPaymentStatus(data.data.paymentStatus)
            setTotal(serversideData.length);
            setDeliveryCode(data.data.deliveryCode);
            setInvoicePaymentInfo(data.data.invoiceInfo);
            let newData = serversideData.map(
              (item: InvoiceDataType, index: number) => {
                return {
                  key: index,
                  productId: item.productId,
                  amount: item.amount,
                  color: item.color,
                  href: item.href,
                  imgSrc: item.imgSrc,
                  price: item.price,
                  free: item.free,
                  productDescription: item.productDescription,
                  secondOneHalf: item.secondOneHalf,
                  size: item.size,
                  timesale: item.timesale,
                  createTime: formatTimeFromStr(item.createTime),
                  stockStatus: item.stockStatus,
                  cartDetailId:item.cartDetailId,
                };
              },
            );
            setInvoiceData(newData);
          } else {
            message.error({ content: '找不到这个订单' }, 4);
          }
        });
      }


    }
  }, [page, pageSize]);

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    current,
    pageSize,
  ) => {
    setPageSize(pageSize);
    setPage(current);
  };
  //添加或者改变订单的快递单号
  const handleSubmit = () => {
    request('/admin/secure/updateSingleInvoiceDeliveryCode', {
      params: {
        invoiceId,
        deliveryCode,
      },
    }).then((data) => {
      if (data.result) {
        message.info(
          {
            content: '修改成功',
            style: {
              marginTop: '50vh',
            },
          },
          4,
        );
      } else {
        message.info(
          {
            content: '修改失败，大概是是没有这个订单',
            style: {
              marginTop: '50vh',
            },
          },
          4,
        );
      }
    });
  };
  //改变订单的支付状态
  const handleSubmitStatus = () => {
    request('/admin/secure/updateSingleInvoicePaymentStatus', {
      params: {
        invoiceId,
        paymentStatus,
      },
    }).then((data) => {
      if (data.result) {
        message.info(
          {
            content: '修改成功',
            style: {
              marginTop: '50vh',
            },
          },
          4,
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        paymentStatus && setRecordPaymentStatus(paymentStatus);
      } else {
        message.info(
          {
            content: data.message,
            style: {
              marginTop: '50vh',
            },
          },
          4,
        );
      }
    });
  };
  //改变订单选择状态
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    setPaymentStatus(value);
  };
  //这里只能删除虚拟订单，什么级别都行
  const handleDeleteInvoice = () => {
    request('/admin/secure/deleteInvoiceById', {
      params: {
        invoiceId,
      },
    }).then((data) => {
      if (data.result) {
        if (data.code === 20001) {
          //非测试单，再来个modal并且必须是超级管理员
          setIsModalOpen2(true);
        } else {
          message.info({ content: '删除成功' }, 4);
          setIsModalOpen(false);
        }
      } else {
        message.info({ content: '删除失败,大概率是本身就不存在' }, 4);
        setIsModalOpen(false);
      }
    });
  };

  //必须是superadmin才能删除
  const handleDeleteInvoiceBySuperAdmin = () => {
    request('/admin/secure/deleteInvoiceByIdBySuperAdmin', {
      params: {
        invoiceId,
      },
    }).then((data) => {
      if (data.result) {
        if (data.code === 20001) {
          //非测试单，再来个modal并且必须是超级管理员
          setIsModalOpen2(false);
          setIsModalOpen(false);
          message.error(
            {
              content: '必须超级管理员才能删除真实的订单',
              style: {
                marginTop: '40vh',
              },
            },
            4,
          );
        } else {
          message.info({ content: '删除成功' }, 4);
          setIsModalOpen(false);
          setIsModalOpen2(false);
        }
      } else {
        message.info({ content: '删除失败,大概率是本身就不存在' }, 4);
        setIsModalOpen(false);
        setIsModalOpen2(false);
      }
    });
  };
  //改变某个产品的状态，直接发送请求过去
  const handleStockChange = (e: string, targetLine: InvoiceDataType) => {
    let newInvoiceData = structuredClone(invoiceData).map((item) => {
      if (item.productId === targetLine.productId) {
        item.stockStatus = e;
        return item;
      } else {
        return item;
      }
    });
    setInvoiceData(newInvoiceData);
  };

  const columns: ColumnsType<InvoiceDataType> = [
    {
      title: '产品编号',
      dataIndex: 'productId',
      key: 'productId',
      render: (productId, oneline) => (
        <a
          target="_blank"
          href={`${window.location.protocol}//${window.location.hostname}${oneline.href}`}
          rel="noreferrer"
        >
          {productId}
        </a>
      ),
      sorter: (a: any, b: any) => {
        return a.invoiceid - b.invoiceid;
      },
    },
    {
      title: '添加到购物车时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (createTime: string) => {
        return <div>{createTime}</div>;
      },
    },
    {
      title: '购买数量',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a: any, b: any) => {
        return a.amount - b.amount;
      },
    },
    {
      title: '购买产品颜色',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: '产品图片',
      dataIndex: 'imgSrc',
      key: 'imgSrc',
      render: (imgSrc: string, data) => {
        return <div style={{ position: 'relative' }}><Image src={imgSrc} style={{ width: 100, height: 100 }}></Image>
          {data.free ? <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 999, color: 'green', fontWeight: 700 }}>Gift</div> : null}</div>;
      },
    },
    {
      title: '产品价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => {
        return <div>${NumToString(price)}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.price - b.price;
      },
    },
    // {
    //   title: '赠品',
    //   dataIndex: 'free',
    //   key: 'free',
    //   render: (free: boolean) => {
    //     return <div>{free ? '是' : '否'}</div>;
    //   },
    //   sorter: (a: any, b: any) => {
    //     return a.price - b.price;
    //   },
    // },
    {
      title: '产品介绍',
      dataIndex: 'productDescription',
      key: 'productDescription',
      render: (productDescription: string) => {
        return <div style={{ width: 200 }}>{productDescription}</div>;
      },
    },
    // {
    //   title: '有没有第二件半价',
    //   dataIndex: 'secondOneHalf',
    //   key: 'secondOneHalf',
    //   render: (secondOneHalf: number) => {
    //     return <div>{secondOneHalf ? '第二件半价' : '没有第二件半价'}</div>;
    //   },
    // },
    {
      title: '尺寸',
      dataIndex: 'size',
      key: 'size',
      render: (size: string) => {
        return <div>{size}</div>;
      },
    },
    // {
    //   title: '限时折扣',
    //   dataIndex: 'timesale',
    //   key: 'timesale',
    //   render: (timesale: number) => {
    //     return <div>{timesale}</div>;
    //   },
    //   sorter: (a: any, b: any) => {
    //     return a.timesale - b.timesale;
    //   },
    // },
    {
      title: '单件产品状态',
      dataIndex: 'stockStatus',
      key: 'stockStatus',
      render: (stockStatus: string, data) => {
        // console.log(data);
        return (
          <Select
            defaultValue={stockStatus}
            style={{ width: 120 }}
            onChange={(e) => handleStockChange(e, data)}
            options={[
              { value: 'cancel', label: '已退款/取消' },
              { value: 'nostock', label: '无库存' },
              { value: 'notprepared', label: '未开始邮寄' },
              { value: 'delivery', label: '已开始邮寄' },
            ]}
          />
        );
      },
    },
    {
      title: '修改产品状态',
      render: (data) => {
        return (
          <Button
            type="primary"
            onClick={() => {
              console.log(invoiceData[data.key].stockStatus);
              console.log(data);
              request('/admin/secure/changeSingleInvoiceStockStatus', {
                params: {
                  productId: data.productId,
                  stockStatus: data.stockStatus,
                  invoiceId,
                  productColor: data.color,
                  productSize: data.size,
                  cartDetailId:data.cartDetailId
                },
              }).then((data) => {
                if (data.result) {
                  message.info({ content: '修改成功' }, 4);
                } else {
                  message.error({ content: '修改失败' }, 4);
                }
              });
            }}
          >
            修改该行状态
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Modal
        title="这是个真实的客户订单，确定要删除么？"
        open={isModalOpen2}
        onOk={handleDeleteInvoiceBySuperAdmin}
        onCancel={() => {
          setIsModalOpen2(false);
        }}
      >
        <p style={{ color: 'red' }}>需要删除的订单号：{invoiceId}</p>
      </Modal>
      <Modal
        title="删除该订单"
        open={isModalOpen}
        onOk={handleDeleteInvoice}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <p style={{ color: 'red' }}>需要删除的订单号：{invoiceId}</p>
      </Modal>
      <h3>该表格主要用于单件产品的退款/退点数相关业务</h3>
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
        dataSource={invoiceData}
      />
      <h3>订单付款相关的信息</h3>
      <div style={{ marginBottom: 20 }}>
        {invoicePaymentInfo && invoiceId ? (
          <InvoiceDetail
            invoiceInfo={invoicePaymentInfo}
            invoiceId={+invoiceId}
          />
        ) : null}
      </div>
      <div>
        快递单号尽量在快递管理相关的页面操作，这里主要用来操作订单的支付状态。当整个订单退款/退点数之后，这里修改状态为取消
      </div>
      <span>订单状态:</span>
      <span>
        {paymentStatus === 'unpaid'
          ? '未付款'
          : paymentStatus === 'paid'
            ? '已支付'
            : paymentStatus === 'delivery'
              ? '运送中'
              : paymentStatus === 'received'
                ? '已送达'
                : paymentStatus === 'cancelled'
                  ? '已取消'
                  : ''}
      </span>
      <Input
        placeholder="请输入快递单号"
        style={{ width: 300 }}
        value={deliveryCode}
        onChange={(e) => {
          setDeliveryCode(e.target.value);
        }}
        disabled={paymentStatus === 'unpaid' || paymentStatus === 'cancelled'}
      />
      <Button
        type="primary"
        disabled={paymentStatus === 'unpaid' || paymentStatus === 'cancelled'}
        onClick={handleSubmit}
      >
        添加/修改订单快递单号
      </Button>
      <Select
        value={paymentStatus}
        style={{ width: 120, marginLeft: 40, marginRight: 20 }}
        onChange={handleChange}
        options={[
          { value: 'paid', label: '已支付' },
          { value: 'delivery', label: '运送中' },
          { value: 'received', label: '已送达' },
          { value: 'cancelled', label: '已取消' },
        ]}
      />
      <Button type="primary" onClick={handleSubmitStatus} disabled={recordPaymentStatus === paymentStatus}>
        修改整个订单的支付状态
      </Button>
      <br />
      <Button
        style={{ background: '#f40', marginTop: 500 }}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        删除订单
      </Button>
    </>
  );
};
export default App;

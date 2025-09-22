import React, { useEffect, useState } from 'react';
import { Button, Image, Input, message, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import NumToString from '@/utils/NumToString';
import { formatTimeFromStr } from '@/utils/format';
import { request } from '@umijs/max';
import AddressInfo from './AddressInfo';

interface InvoiceDataType {
  allDeliveryEmail: boolean | null;
  amount: 1;
  author: string | null;
  color: string;
  createTime: string;
  deliveryCode: string | null;
  href: string;
  imgSrc: string;
  gift: boolean;
  noStockEmailed: boolean | null;
  partialDeliveryEmail: boolean | null;
  price: number;
  productDescription: string;
  productId: number;
  size: string;
  stockStatus: string;
  invoiceProductDetailId: number;
  userNotShowEmailed: boolean | null;
}

const App: React.FC = () => {
  const [deliveryStatus, setDeliveryStatus] = useState<string>(); //快递状态
  const [invoiceData, setInvoiceData] = useState<InvoiceDataType[]>([]);
  const [deliveryCode, setDeliveryCode] = useState<string>("无单号"); //快递单号
  const [invoiceId, setInvoiceId] = useState<string>();
  //下面三个还是稍微注意一下，true的时候可以点击，false的时候不能点击
  const [partialDeliveryEmailActive, setPartialDeliveryEmailActive] =
    useState(true);
  const [allDeliveryEmailActive, setAllDeliveryEmailActive] = useState(true);
  const [noProductActive, setNoProductActive] = useState(true); //能否发送无货邮件
  const [userInfoErrorActive, setUserInfoErrorActive] = useState(true); //能否发送用户信息报错邮件
  const [userInfoErrorMsg, setUserInfoErrorMsg] = useState(''); //用户错误信息具体内容
  const [deliveryErrorDeliveryCode, setDeliveryErrorDeliveryCode] =
    useState(''); //配送失败的具体单号
  const [invoiceInfo, setInvoiceInfo] = useState();
  const [showPage, setShowPage] = useState(true);
  // const [priorDeliveryCode, setPriorDeliveryCode] = useState<string>();
  useEffect(() => {
    let pathArr = location.pathname.split('/');
    if (pathArr.length > 3) {
      setInvoiceId(pathArr[3]);
      request(`/admin/secure/getOneDeliveryInvoiceInfo`, {
        params: {
          invoiceId: pathArr[3],
        },
      }).then((data) => {
        if (data.result) {
          if (data.code === 20001) {
            message.error({ content: '该张订单已经消失' }, 6);
            setShowPage(false);
            return;
          }
          console.log(data);
          let serversideData = data.data.productDetailList;
          // setPriorDeliveryCode(data.data.invoice.deliverycode);
          setDeliveryStatus(data.data.invoice.deliverystatus);
          setInvoiceInfo(data.data.invoice);
          let newData = serversideData.map(
            (item: InvoiceDataType, index: number) => {
              return {
                key: index,
                productId: item.productId,
                amount: item.amount,
                author: item.author,
                color: item.color,
                href: item.href,
                imgSrc: item.imgSrc,
                gift: item.gift,
                price: item.price,
                productDescription: item.productDescription,
                size: item.size,
                createTime:
                  item.createTime && formatTimeFromStr(item.createTime),
                stockStatus: item.stockStatus,
                invoiceProductDetailId: item.invoiceProductDetailId,
                deliveryCode: item.deliveryCode,
                allDeliveryEmail: item.allDeliveryEmail,
                partialDeliveryEmail: item.partialDeliveryEmail,
                noStockEmailed: item.noStockEmailed,
                userNotShowEmailed: item.userNotShowEmailed,
              };
            },
          );
          //根据这里的来搞出deliverycode
          const deliveryCodeSet = new Set();
          for (let i = 0; i < newData.length; i++) {
            if (newData[i].deliveryCode) {
              deliveryCodeSet.add(newData[i].deliveryCode);
            }
          }
          const resultString = Array.from(deliveryCodeSet).join('//');
          console.log(resultString);
          setDeliveryCode(resultString);
          setInvoiceData(newData);
          if (data.data.invoice.usererroremailed === null || (data.data.invoice.usererroremailed === false)) {
            setUserInfoErrorActive(true);
          } else {
            setUserInfoErrorActive(false);
          }
          if (data.data.invoice.usererrorinfo) {
            setUserInfoErrorMsg(data.data.invoice.usererrorinfo);
          }

          //判断该发全部发货有单号还是部分发货有单号
          let count = 0;
          let flag = true; //true则是可以发送全部发货有单号的邮件，否则只能发部分发货
          for (let i = 0; i < serversideData.length; i++) {
            if (serversideData[i].partialDeliveryEmail === true) {
              count++;
              flag = false;
            }
          }
          console.log(flag);
          if (!flag) {
            setAllDeliveryEmailActive(false);
            if (count === serversideData.length) {
              setPartialDeliveryEmailActive(false);
            }
          }
          for (let i = 0; i < serversideData.length; i++) {
            if (serversideData[i].allDeliveryEmail === true) {
              setAllDeliveryEmailActive(false);
              setPartialDeliveryEmailActive(false);
              break;
            }
          }
          //判断能否发送无货邮件
          let noStockEmailActive = false;
          //有任何一个它stockStatus===cancel并且noStockEmailed===null，并且超过五天下单
          for (let i = 0; i < serversideData.length; i++) {
            if (
              serversideData[i].stockStatus === 'nostock' &&
              serversideData[i].noStockEmailed === null
            ) {
              const givenTime = new Date(serversideData[i].createTime);
              const currentTime = new Date();

              // 计算时间差，以毫秒为单位
              //@ts-ignore
              const timeDifference = currentTime - givenTime;

              // 定义一天的毫秒数
              const oneDayMilliseconds = 24;

              // 判断是否超过五天
              if (timeDifference > 5 * oneDayMilliseconds) {
                noStockEmailActive = true;
              }
            }
          }

          setNoProductActive(noStockEmailActive);
        } else {
          message.error({ content: '找不到这个订单' }, 4);
        }
      });
    }
  }, []);

  // //添加或者改变订单的快递单号
  // const handleSubmit = () => {
  //   request('/admin/secure/updateSingleInvoiceDeliveryCode', {
  //     params: {
  //       invoiceId,
  //       deliveryCode,
  //     },
  //   }).then((data) => {
  //     if (data.result) {
  //       setPriorDeliveryCode(deliveryCode);
  //       message.info(
  //         {
  //           content: '修改成功',
  //           style: {
  //             marginTop: '50vh',
  //           },
  //         },
  //         4,
  //       );
  //     } else {
  //       message.info(
  //         {
  //           content: '修改失败，大概是是没有这个订单',
  //           style: {
  //             marginTop: '50vh',
  //           },
  //         },
  //         4,
  //       );
  //     }
  //   });
  // };
  //改变订单的支付状态
  const handleSubmitStatus = () => {
    request('/admin/secure/updateSingleInvoiceDeliveryStatus', {
      params: {
        invoiceId,
        deliveryStatus,
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
    setDeliveryStatus(value);
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
  //改变单品的快递单号
  const handleInvoiceDeliveryCode = (e: any, targetLine: InvoiceDataType) => {
    let newInvoiceData = structuredClone(invoiceData).map((item) => {
      if (item.invoiceProductDetailId === targetLine.invoiceProductDetailId) {
        item.deliveryCode = e.target.value;
        return item;
      } else {
        return item;
      }
    });

    setInvoiceData(newInvoiceData);
  };

  const columns: ColumnsType<InvoiceDataType> = [
    // {
    //   title: '产品编号',
    //   dataIndex: 'productId',
    //   key: 'productId',
    //   render: (productId, oneline) => (
    //     <a target="_blank" rel="noreferrer" href={oneline.href}>
    //       {productId}
    //     </a>
    //   ),
    //   sorter: (a: any, b: any) => {
    //     return a.invoiceid - b.invoiceid;
    //   },
    // },
    {
      title: '产品编号',
      dataIndex: 'productId',
      key: 'productId',
      render: (productId, oneline) => (
        <a
          target="_blank"
          rel="noreferrer"
          href={`${window.location.protocol}//${window.location.hostname}${oneline.href}`}
        >
          {productId}
        </a>
      ),
      sorter: (a: any, b: any) => {
        return a.invoiceid - b.invoiceid;
      },
    },
    {
      title: '订单时间',
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
          {data.gift ? <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 999, color: 'green', fontWeight: 700 }}>Gift</div> : null}</div>;
      },
    },
    {
      title: '产品价格',
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
      title: '产品介绍',
      dataIndex: 'productDescription',
      key: 'productDescription',
      render: (productDescription: string) => {
        return <div style={{ width: 200 }}>{productDescription}</div>;
      },
    },
    {
      title: '尺寸',
      dataIndex: 'size',
      key: 'size',
      render: (size: string) => {
        return <div>{size}</div>;
      },
    },
    {
      title: '操作人员',
      dataIndex: 'author',
      key: 'author',
      render: (author: string) => {
        return <div>{author}</div>;
      },
    },
    {
      title: '全部邮寄有单号？',
      dataIndex: 'allDeliveryEmail',
      key: 'allDeliveryEmail',
      render: (allDeliveryEmail: boolean | null) => {
        return (
          <div>
            {allDeliveryEmail === null || allDeliveryEmail === false
              ? '未发'
              : '已发'}
          </div>
        );
      },
    },
    {
      title: '部分邮寄有单号？',
      dataIndex: 'partialDeliveryEmail',
      key: 'partialDeliveryEmail',
      render: (partialDeliveryEmail: boolean | null) => {
        return (
          <div>
            {partialDeliveryEmail === null || partialDeliveryEmail === false
              ? '未发'
              : '已发'}
          </div>
        );
      },
    },
    {
      title: '无货邮件？',
      dataIndex: 'noStockEmailed',
      key: 'noStockEmailed',
      render: (noStockEmailed: boolean | null) => {
        return (
          <div>
            {noStockEmailed === null || noStockEmailed === false
              ? '未发'
              : '已发'}
          </div>
        );
      },
    },
    {
      title: '配送失败邮件？',
      dataIndex: 'userNotShowEmailed',
      key: 'userNotShowEmailed',
      render: (userNotShowEmailed: boolean | null) => {
        return (
          <div>
            {userNotShowEmailed === null || userNotShowEmailed === false
              ? '未发'
              : '已发'}
          </div>
        );
      },
    },
    {
      title: '单件产品状态',
      dataIndex: 'stockStatus',
      key: 'stockStatus',
      render: (stockStatus: string, data) => {
        // console.log(data);
        return (
          <Select
            value={stockStatus}
            style={{ width: 120 }}
            onChange={(e) => handleStockChange(e, data)}
            disabled={stockStatus === 'cancel'}
            options={[
              { value: 'cancel', label: '已退款/取消', disabled: true },
              { value: 'notprepared', label: '未开始邮寄' },
              { value: 'delivery', label: '已开始邮寄' },
              { value: 'nostock', label: '无库存' },
            ]}
          />
        );
      },
    },
    {
      title: '修改快递状态',
      render: (data) => {
        return (
          <Button
            type="primary"
            onClick={() => {
              let stockStatus = data.stockStatus;
              if (!stockStatus) {
                return;
              }
              request('/admin/secure/changeSingleInvoiceStockStatus', {
                params: {
                  productId: data.productId,
                  stockStatus: stockStatus,
                  invoiceId,
                  productColor: data.color,
                  productSize: data.size,
                  cartDetailId: data.invoiceProductDetailId
                },
              }).then((res) => {
                if (res.result) {
                  if (stockStatus === 'nostock') {
                    setNoProductActive(true);
                  }
                  message.info({ content: '修改成功' }, 4);
                  let newInvoiceData = invoiceData.map((item) =>{
                    if (item.invoiceProductDetailId === data.invoiceProductDetailId&&stockStatus.toLowerCase()!=="delivery") { 
                      return {...item,deliveryCode:""}  // 新对象
                    }else{
                      return item;
                    }
                  })
                  console.log(newInvoiceData)
                  setInvoiceData(newInvoiceData);
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
  //保存单行的快递单号
  const handleDeliveryCodeSave = (record: InvoiceDataType) => {
    request('/admin/secure/saveSingleProductDeliveryCode', {
      params: {
        id: record.invoiceProductDetailId,
        deliveryCode: record.deliveryCode ? record.deliveryCode : '',
      },
    }).then((data) => {
      if (data.result) {
        message.info({ content: '保存成功', style: { marginTop: '40vh' } }, 4);
        //根据这里的来搞出deliverycode
        const deliveryCodeSet = new Set();
        for (let i = 0; i < invoiceData.length; i++) {
          if (invoiceData[i].deliveryCode) {
            deliveryCodeSet.add(invoiceData[i].deliveryCode);
          }
        }
        const resultString = Array.from(deliveryCodeSet).join('//');
        setDeliveryCode(resultString);
        let newInvoiceData = invoiceData.map((item) =>
          item.invoiceProductDetailId === record.invoiceProductDetailId
            ? { ...item, stockStatus: "delivery" }  // 新对象
            : item
        );
        console.log("newInvoiceData", newInvoiceData);
        setInvoiceData(newInvoiceData);
      } else {
        message.error(
          { content: '没有保存成功,稍后再试', style: { marginTop: '40vh' } },
          4,
        );
      }
    });
  };
  //每行列表的扩展列
  const buildExpandLine = (record: InvoiceDataType) => {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <label htmlFor="">快递单号：</label>
          <Input
            value={record.deliveryCode ? record.deliveryCode : ''}
            style={{ width: 300 }}
            onChange={(e) => {
              handleInvoiceDeliveryCode(e, record);
            }}
            placeholder="请输入快递单号"
          />
          <Button type="primary" onClick={() => handleDeliveryCodeSave(record)}>
            保存快递单号
          </Button>
        </div>
      </div>
    );
  };
  //通知用户部分/全部发货有单号
  const handleEmailToCustomer = () => {
    console.log(invoiceData);
    //先判断，如果只有部分有deliverycode，则只能
    setAllDeliveryEmailActive(false);
    setPartialDeliveryEmailActive(false);
    request('/admin/secure/sendDeliveryInfoEmailToCustomer', {
      params: {
        invoiceId,
      },
    }).then((data) => {
      if (!data.result) {
        if (data.code === 20001) {
          message.error(
            { content: data.message, style: { marginTop: '40vh' } },
            4,
          );
          setAllDeliveryEmailActive(true);
          setPartialDeliveryEmailActive(true);
        }
      }
      if (data.result) {
        if (data.code === 20001) {
          message.error(
            { content: data.message, style: { marginTop: '40vh' } },
            4,
          );
          setAllDeliveryEmailActive(true);
          setPartialDeliveryEmailActive(true);
        } else {
          if (data.data.status === 'allSend') {
            message.info(
              { content: '全部发货有单号邮件发送成功', style: { marginTop: '40vh' } },
              4,)
          } else {
            message.info(
              { content: '部分发货有单号邮件发送成功', style: { marginTop: '40vh' } },
              4,)
            setPartialDeliveryEmailActive(true);
          }
        }
      }
    });
  };
  //通知客户无货，退款/退点数
  const handleNoProductEmailToCustomer = () => {
    setNoProductActive(false);
    request('/admin/secure/sendNoProductEmail', { params: { invoiceId } }).then(
      (data) => {
        if (data.result) {
          setNoProductActive(true);
          if (data.code === 20001) {
            message.error(
              { content: data.message, style: { marginTop: '40vh' } },
              4,
            );
          } else {
            message.info(
              { content: '成功邮寄', style: { marginTop: '40vh' } },
              4,
            );
          }
        }
      },
    );
  };
  //保存一下 哪里的用户信息出错了
  const handleSaveUserInfoError = () => {
    //后端修改了deliverystatus同时添加上原因
    if (userInfoErrorMsg !== '') {
      const regex = /^[A-Za-z\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/;
      if (!regex.test(userInfoErrorMsg)) {
        message.error(
          { content: '必须是英文的单词和字符', style: { marginTop: '40vh' } },
          4,
        );
        return;
      }
    }
    request('/admin/secure/updateDeliveryStatusAndErrorInfo', {
      params: {
        userInfoErrorMsg,
        invoiceId,
      },
    }).then((data) => {
      if (data.result) {
        message.info({ content: '成功保存', style: { marginTop: '40vh' } }, 4);
        setDeliveryStatus('userinfoerror');
      } else {
        message.error(
          {
            content: '保存失败，刷新后重新保存试试看',
            style: { marginTop: '40vh' },
          },
          4,
        );
      }
    });
  };
  //email用户信息报错给用户
  const handleUserInfoErrorEmailToCustomer = () => {
    //后端处理，如果有没邮寄，同时确定用户信息错误的内容，则发送
    if (userInfoErrorMsg === '') {
      message.error(
        { content: '需要有具体的错误原因', style: { marginTop: '40vh' } },
        4,
      );
      return;
    }

    setUserInfoErrorActive(false);
    request('/admin/secure/sendUserInfoErrorEmail', { params: { invoiceId } }).then(
      (data) => {
        if (data.result) {
          if (data.code === 20001) {
            message.error(
              { content: data.message, style: { marginTop: '40vh' } },
              4,
            );
            setUserInfoErrorActive(true);
          } else {
            message.info(
              { content: '发送成功', style: { marginTop: '40vh' } },
              4,
            );
          }
        }
      },
    );
  };
  //email配送失败给用户
  const handleDeliveryErrorEmailToCustomer = () => {
    if (!deliveryErrorDeliveryCode) {
      message.error(
        { content: '必须填写快递单号', style: { marginTop: '40vh' } },
        4,
      );
      return;
    }
    request('/admin/secure/sendDeliveryErrorEmail', {
      params: { invoiceId, deliveryErrorDeliveryCode },
    }).then((data) => {
      if (data.result) {
        if (data.code === 20001) {
          message.error(
            { content: data.message, style: { marginTop: '40vh' } },
            4,
          );
        } else {
          message.info(
            { content: '发送成功', style: { marginTop: '40vh' } },
            4,
          );
        }
      }
    });
  };
  return showPage ? (
    <>
      这里要个快递地址的表格，管理员可操作修改地址
      {invoiceInfo && <AddressInfo invoiceInfo={invoiceInfo} />}
      <h3>
        每个非退款单品都<span style={{ color: '#f40' }}>需要输入快递单号</span>
        并保存，如果全部产品都为开始邮寄或者已退款状态，
        <br />
        则将所有的快递单号输入到下面的订单快递单号中。
        <br />
        单品快递状态： 1.快递公司已收货打包并有快递单号，则选择为已开始邮寄
        2.如果五天之后还没找到该货购买渠道，则选为无库存并邮件通知
      </h3>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender: (record) => buildExpandLine(record),
          rowExpandable: (record) => record.stockStatus !== 'cancel',
        }}
        dataSource={invoiceData}
      />
      <h4 style={{ color: '#f40' }}>
        注意：发送邮件之前，请仔细检查快递单号。发送之后无法重发。尽量全部产品一个包裹。
        <br />
        如果刚修改了快递状态确定需要重新发送，请刷新。
      </h4>
      <div style={{ marginBottom: 15 }}>
        <span>
          发送 <b>全部发货有单号</b> 邮件
        </span>
        <Button
          type="primary"
          style={{ marginLeft: 20 }}
          disabled={!allDeliveryEmailActive}
          onClick={handleEmailToCustomer}
        >
          发送
        </Button>
      </div>
      <div style={{ marginBottom: 15 }}>
        <span>
          发送 <b>部分发货有单号</b> 邮件
        </span>
        <Button
          type="primary"
          style={{ marginLeft: 20 }}
          disabled={!partialDeliveryEmailActive}
          onClick={handleEmailToCustomer}
        >
          发送
        </Button>
      </div>
      <h4 style={{ color: '#f40' }}>
        下单后五天才能发送无货邮件，尽量所有的无货发一个邮件
      </h4>
      <div style={{ marginBottom: 15 }}>
        <span>
          发送 <b>无货</b> 邮件
        </span>
        <Button
          type="primary"
          style={{ marginLeft: 20 }}
          disabled={!noProductActive}
          onClick={handleNoProductEmailToCustomer}
        >
          发送
        </Button>
      </div>
      <h4 style={{ color: '#f40' }}>
        发送用户信息报错邮件之前，请先输入用户信息错误的原因并保存
      </h4>
      <Input
        style={{ width: 300 }}
        placeholder="用户具体的错误信息,必须是英文"
        value={userInfoErrorMsg}
        onChange={(e) => {
          setUserInfoErrorMsg(e.target.value);
        }}
      />{' '}
      <Button type="primary" onClick={handleSaveUserInfoError}>
        保存错误信息
      </Button>
      <div style={{ marginBottom: 15 }}>
        <span>
          发送 <b>用户信息报错</b> 邮件
        </span>
        <Button
          type="primary"
          style={{ marginLeft: 20 }}
          disabled={!userInfoErrorActive || userInfoErrorMsg === ''}
          onClick={handleUserInfoErrorEmailToCustomer}
        >
          发送
        </Button>
      </div>
      <h4 style={{ color: '#f40' }}>
        发送配送失败邮件之前，请先输入配送失败的快递单号，不然无法发送
      </h4>
      <Input
        style={{ width: 300 }}
        placeholder="配送失败的快递单号"
        value={deliveryErrorDeliveryCode}
        onChange={(e) => {
          setDeliveryErrorDeliveryCode(e.target.value);
        }}
      />
      <div style={{ marginBottom: 15 }}>
        <span>
          发送 <b>配送失败</b> 邮件
        </span>
        <Button
          type="primary"
          style={{ marginLeft: 20 }}
          onClick={handleDeliveryErrorEmailToCustomer}
        >
          发送
        </Button>
      </div>
      <h4>
        订单快递状态选择：
        <br />
        1.初始状态为未发送
        <br />
        2.快递公司提示用户信息不全/其他原因导致无法寄送，则选择用户信息错误
        <br />
        3.部分单品已经在快递公司处打包，则选择部分发货有单号
        <br />
        4.全部单品均已经在快递公司处打包，则选择全部发货有单号
        <br />
        5.部分单品如果无货则选择部分无货
        <br />
        6.如果快递公司提示用户没收货（部分也算），则选择配送失败
        <br />
        7.快递公司提示全部已送达（退款的产品不算在内），则选择已送达
        <br />
        注意：每个选项关系为符合后面的条件的时候必须选择后面这条
        <br />
      </h4>
      <span>订单快递单号，多个以//分割</span>
      {/* <Input
        placeholder="请输入快递单号"
        style={{ width: 300 }}
        value={deliveryCode}
        onChange={(e) => {
          setDeliveryCode(e.target.value);
        }}
      /> */}
      <span style={{ display: "inline-block", width: 300, borderRadius: 5, border: "1px solid #959999", padding: "3px 8px" }}>{deliveryCode}</span>
      {/* <Button
        type="primary"
        onClick={handleSubmit}
        disabled={priorDeliveryCode === deliveryCode}
      >
        添加/修改订单快递单号
      </Button> */}
      <span style={{ marginLeft: 20 }}>订单快递状态:</span>
      <span style={{ minWidth: 150, display: 'inline-block' }}>
        {deliveryStatus === 'alldelivery'
          ? '全部发送有单号'
          : deliveryStatus === 'partialdelivery'
            ? '部分发送有单号'
            : deliveryStatus === 'notdelivery'
              ? '未发送'
              : deliveryStatus === 'partialnostock'
                ? '部分无货'
                : deliveryStatus === 'deliveried'
                  ? '已送达'
                  : deliveryStatus === 'userinfoerror'
                    ? '用户信息错误'
                    : deliveryStatus === 'usernotshow'
                      ? '配送失败'
                      : ''}
      </span>
      <Select
        value={deliveryStatus}
        style={{ width: 120, marginLeft: 40, marginRight: 20 }}
        onChange={handleChange}
        options={[
          { value: 'notdelivery', label: '未发送', disabled: true },
          { value: 'userinfoerror', label: '用户信息错误' },
          { value: 'partialdelivery', label: '部分发送有单号' },
          { value: 'alldelivery', label: '全部发送有单号' },
          { value: 'partialnostock', label: '部分无货' },
          { value: 'usernotshow', label: '配送失败' },
          { value: 'deliveried', label: '已送达' },
        ]}
      />
      <Button type="primary" onClick={handleSubmitStatus}>
        修改整个订单的快递状态
      </Button>
    </>
  ) : (
    <div>不存在该订单/订单已过期</div>
  );
};
export default App;

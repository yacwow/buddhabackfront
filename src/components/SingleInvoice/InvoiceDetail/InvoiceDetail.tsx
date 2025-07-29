import React from 'react';
import {  Form, Input } from 'antd';
import { useModel } from '@umijs/max';

const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

interface Props {
  invoiceInfo: {
    firstName: string;
    lastName: string;
    invoiceId: string;
    originPrice: number;
    normalDiscount: number;
    secondHalfDiscount: number;
    timelyDiscount: number;
    couponCode: string;
    usedPoint: number;
    priceAfterDiscount: number;
    deliveryFee: number;
    paymentAmount: number;
  };
  invoiceId: number;
}
const App: React.FC<Props> = (props) => {
  const { invoiceInfo, invoiceId } = props;
  const { level } = useModel('global');
  console.log(level);
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={invoiceInfo}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item label="用户名字" name="firstName">
        <Input disabled />
      </Form.Item>

      <Form.Item label="用户姓氏" name="lastName">
        <Input disabled />
      </Form.Item>

      <Form.Item label="订单号" name="invoiceId">
        <Input disabled />
      </Form.Item>

      <Form.Item
        label="初始价格"
        name="originPrice"

      // rules={[
      //   { required: true, message: '请输入' },
      //   () => ({
      //     validator(_, value) {
      //       const reg = /^-?\d*(\.\d*)?$/;
      //       if (reg.test(value) || value === '' || value === '-') {
      //         return Promise.resolve();
      //       }
      //       return Promise.reject(new Error('必须是数字'));
      //     },
      //   }),
      // ]}
      >
        <Input disabled />
      </Form.Item>

      <Form.Item label="满减" name="normalDiscount">
        <Input disabled />
      </Form.Item>

      <Form.Item label="第二件半价" name="secondHalfDiscount">
        <Input disabled />
      </Form.Item>

      <Form.Item label="限时/个人折扣" name="timelyDiscount">
        <Input disabled />
      </Form.Item>

      <Form.Item label="个人折扣码" name="promotionCode">
        {invoiceInfo.couponCode ? (
          <a
            target={'_blank'}
            href={`/backend/getPersonalCouponUsage/${invoiceId}/${invoiceInfo.couponCode}`}
            rel="noreferrer"
          >
            {invoiceInfo.couponCode} 点击跳转至该用户使用该折扣码的情况
          </a>
        ) : (
          <div>未使用个人折扣</div>
        )}
      </Form.Item>

      <Form.Item label="点数使用" name="usedPoint">
        <Input disabled />
      </Form.Item>

      <Form.Item label="折扣后价格" name="priceAfterDiscount">
        <Input disabled />
      </Form.Item>

      <Form.Item label="快递费用" name="deliveryFee">
        <Input disabled />
      </Form.Item>

      <Form.Item label="应支付价" name="paymentAmount">
        <Input disabled />
      </Form.Item>
    </Form>
  );
};

export default App;

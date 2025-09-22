import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useModel } from '@umijs/max';
import { request } from '@umijs/max';

interface Props {
  invoiceInfo: {
    firstname: string;
    lastname: string;
    invoiceid: string;
    country: string;
    province: number;
    city: number;
    area: number;
    detailaddress: string;
    deliverymethod: number;
    mobilephone: number;
  };
}
const App: React.FC<Props> = (props) => {
  const { invoiceInfo } = props;
  const { level } = useModel('global');
  const [buttonDisable, setButtonDisable] = useState(false);
  const onFinish = (values: any) => {
    console.log('Success:', values);
    setButtonDisable(true);
    if (+values.mobilephone) {
      request('/admin/secure/changeUserAddressByAdmin', {
        method: 'POST',
        data: {
          userInvoiceInfo: values,
        },
      })
        .then((data) => {
          if (data.result) {
            if (data.code === 20001) {
              message.error({ content: '必须是管理员/超级管理员才能修改' }, 4);
            } else {
              message.info({ content: '修改成功' }, 4);
              setButtonDisable(false);
            }
          }else{
            message.error({ content: '修改失败，请稍后再试' }, 4);
            setButtonDisable(false);
          }
        })
        .catch(() => {
          message.error({ content: '出错误了' }, 5);
          setButtonDisable(false);
        });
    } else {
      message.error({ content: '手机号码不要用-来分割了，我后端处理麻烦' }, 5);
      setButtonDisable(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
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
      <Form.Item
        label="用户名字"
        name="firstname"
        rules={[{ required: true, message: '请输入!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="用户姓氏"
        name="lastname"
        rules={[{ required: true, message: '请输入' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="订单号"
        name="invoiceid"
        rules={[{ required: true, message: '请输入' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="国家"
        name="country"
        rules={[{ required: true, message: '请输入' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="省"
        name="province"
        rules={[{ required: true, message: '请输入' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="城市"
        name="city"
        rules={[{ required: true, message: '请输入' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="区域"
        name="area"
      // rules={[{ required: true, message: '请输入' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="具体地址"
        name="detailaddress"
        rules={[{ required: true, message: '请输入' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="快递方式"
        name="deliverymethod"
        rules={[{ required: true, message: '请输入' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="通知消息的email号"
        name="updateemail"
        rules={[{ type: 'email' }, { required: true, message: '请输入' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="手机号码"
        name="mobilephone"
        rules={[
          {
            required: true,
            message: '请输入',
          },
          {
            pattern: /^\+?[1-9]\d{1,14}$/,
            message: '请输入有效的国际手机号，例如 +14155552671',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button
          type="primary"
          htmlType="submit"
          disabled={level !== 'superadmin' || buttonDisable}
        >
          修改订单快递信息
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;

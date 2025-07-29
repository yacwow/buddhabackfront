import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useModel } from '@umijs/max';
import { request } from '@umijs/max';

interface Props {
  invoiceInfo: {
    firstname: string;
    lastname: string;
    invoiceid: number;
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
  console.log(invoiceInfo);
  const { level } = useModel('global');
  console.log(level);
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
        rules={[{ required: true, message: '请输入' }]}
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
        label="手机号码"
        name="mobilephone"
        rules={[
          {
            required: true,
            validator: (rule, val) => {
              const mobileReg =
                /^(0([1-9]{1}-?[1-9]\d{3}|[1-9]{2}-?\d{3}|[1-9]{2}\d{1}-?\d{2}|[1-9]{2}\d{2}-?\d{1})-?\d{4}|0[789]0-?\d{4}-?\d{4}|050-?\d{4}-?\d{4})$/;
              switch (true) {
                case !Boolean(val):
                  return Promise.reject('手机号有误');
                case !mobileReg.test(val.trim()):
                  return Promise.reject('手机号有误');
                default:
                  return Promise.resolve();
              }
            },
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

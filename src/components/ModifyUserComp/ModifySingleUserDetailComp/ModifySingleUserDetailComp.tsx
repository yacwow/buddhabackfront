import { request } from '@umijs/max';
import { Button, Form, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import ModifySingleInvoiceAddress from './ModifySingleInvoiceAddress';

interface Prop {
  userData: any;
  invoiceList: any;
}
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const App: React.FC<Prop> = (props) => {
  const { userData, invoiceList } = props;
  const [form] = Form.useForm();
  //修改信息
  const handleSubmit = () => {
    let data = form.getFieldsValue();
    console.log(data);
    request('/admin/secure/updateUserBasicInfoByAdmin', {
      params: {
        email: data.email,
        firstName: data.firstname,
        lastName: data.lastname,
        upassword: data.upassword,
      },
    });
  };
  return (
    <div>
      <h3>用户的基础信息</h3>
      <Form
        form={form}
        initialValues={userData}
        {...formItemLayout}
        style={{ width: 600 }}
      >
        <Form.Item
          name="email"
          label="注册邮箱，无法修改"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item name="firstname" label="名字">
          <Input />
        </Form.Item>
        <Form.Item name="lastname" label="姓名">
          <Input />
        </Form.Item>
        <Form.Item name="lastlogin" label="最后一次登录">
          <Input disabled />
        </Form.Item>
        <Form.Item name="upassword" label="密码">
          <Input placeholder="这个只能修改，不能展示旧的密码" />
        </Form.Item>
        <Button type="primary" onClick={handleSubmit}>
          修改用户基础信息
        </Button>
      </Form>
      <h3>用户邮寄地址信息的修改，仅针对已经下单的并支付的单子</h3>
      {invoiceList &&
        invoiceList.map((item: any, index: number) => {
          return <ModifySingleInvoiceAddress key={index} invoiceInfo={item} />;
        })}
    </div>
  );
};
export default App;

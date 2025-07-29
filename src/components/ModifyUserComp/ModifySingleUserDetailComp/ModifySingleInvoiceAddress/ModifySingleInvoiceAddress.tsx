import { request } from '@umijs/max';
import { Button, Form, Input } from 'antd';
import React from 'react';
interface Props {
  invoiceInfo: any;
}
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const App: React.FC<Props> = (props) => {
  const { invoiceInfo } = props;
  const [form] = Form.useForm();
  //修改快递信息
  const handleSubmit = () => {
    let data = form.getFieldsValue();
    console.log(data);
    // request('/admin/updateUserInvoiceInfoByAdmin', {
    //   params: {
    //     email: data.email,
    //     firstName: data.firstname,
    //     lastName: data.lastname,
    //     upassword: data.upassword,
    //   },
    // });
  };
  return (
    <>
      <h4>里面的是收货的信息，可能与基础信息不同</h4>
      <Form
        form={form}
        initialValues={invoiceInfo}
        {...formItemLayout}
        style={{ width: 600 }}
      >
        <Form.Item name="invoiceid" label="订单号">
          <Input disabled />
        </Form.Item>{' '}
        <Form.Item name="firstname" label="收款名字">
          <Input />
        </Form.Item>{' '}
        <Form.Item name="lastname" label="收款姓名">
          <Input />
        </Form.Item>{' '}
        <Form.Item name="country" label="国家">
          <Input />
        </Form.Item>{' '}
        <Form.Item name="province" label="省">
          <Input />
        </Form.Item>{' '}
        <Form.Item name="city" label="城市">
          <Input />
        </Form.Item>{' '}
        <Form.Item name="area" label="地区">
          <Input />
        </Form.Item>{' '}
        <Form.Item name="detailaddress" label="具体地址">
          <Input />
        </Form.Item>
        <Form.Item name="postcode" label="邮编">
          <Input />
        </Form.Item>
        <Form.Item name="mobilephone" label="手机号码">
          <Input />
        </Form.Item>{' '}
        <Form.Item name="paymentmethod" label="付款方式">
          <Input />
        </Form.Item>{' '}
        <Form.Item name="updateemail" label="邮箱">
          <Input />
        </Form.Item>{' '}
        <Form.Item name="paymentamount" label="具体金额">
          <Input />
        </Form.Item>
        <Button type="primary" onClick={handleSubmit}>
          修改快递信息
        </Button>
      </Form>
    </>
  );
};
export default App;

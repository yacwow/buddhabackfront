import { request } from '@umijs/max';
import { Button, Form, Input, message } from 'antd';
import React from 'react';
interface Props {
  initialValues: any;
}
const App: React.FC<Props> = (props) => {
  const { initialValues } = props;
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);

    request('/admin/secure/updateAdminBasicInfo', { params: values }).then(
      (data) => {
        if (data.result) {
          message.info(data.message, 3);
          // form.resetFields();
          form.setFieldValue('adminemail', data.data.email);
          form.setFieldValue('nickname', data.data.userName);
        } else {
          message.error(data.message, 3);
        }
      },
    );
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '-20vw',
        minHeight: '98vh',
        maxHeight: '100vh',
        height: '100%',
      }}
    >
      <div>
        <h3>修改个人信息</h3>
        <Form
          form={form}
          name="normal_login"
          initialValues={initialValues}
          onFinish={onFinish}
        >
          <Form.Item style={{ width: 360 }} name="username">
            <Input placeholder="用户名" disabled />
          </Form.Item>
          <Form.Item
            style={{ width: 360 }}
            name="adminemail"
            rules={[
              { required: true, message: '请输入管理员邮箱!' },
              { type: 'email' },
            ]}
          >
            <Input placeholder="管理员邮箱" />
          </Form.Item>
          <Form.Item
            style={{ width: 360 }}
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password type="password" placeholder="密码" />
          </Form.Item>
          <Form.Item
            style={{ width: 360 }}
            name="nickname"
            rules={[{ required: true, message: '请输入用户昵称!' }]}
          >
            <Input placeholder="用户昵称" />
          </Form.Item>
          <Form.Item name="level">
            <Input placeholder="级别" disabled />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              提交修改
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default App;

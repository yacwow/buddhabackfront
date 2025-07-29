import { request } from '@umijs/max';
import { Button, Form, Input, message, Select } from 'antd';
import React from 'react';

const App: React.FC = () => {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);

    request('/admin/secure/register', { params: values }).then((data) => {
      if (data.result) {
        message.info(data.message, 3);
        form.resetFields();
      } else {
        message.error(data.message, 3);
      }
    });
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
        height: '100%',
      }}
    >
      <div>
        <Form
          form={form}
          labelCol={{ flex: '150px' }}
          name="normal_login"
          initialValues={{ level: 'admin' }}
          onFinish={onFinish}
        >
          <Form.Item
            style={{ width: 600 }}
            name="username"
            label="账号名"
            rules={[
              { required: true, message: '请输入账号!' },
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.resolve();
                  }
                  if (/^[a-zA-Z0-9]+$/.test(value)) {
                    if (value.length < 6 || value.length > 20) {
                      return Promise.reject(new Error('账号长度在6-20之间'));
                    }
                    return Promise.resolve();
                  } else {
                    return Promise.reject(
                      new Error('账号只能包含英文字母和数字'),
                    );
                  }
                },
              }),
            ]}
          >
            <Input placeholder="请输入账号名，只能包含英文字母或者数字，长度在6-20之间" />
          </Form.Item>
          <Form.Item
            style={{ width: 600 }}
            name="adminemail"
            label="邮箱"
            rules={[
              { required: true, message: '请输入管理员邮箱!' },
              { type: 'email' },
            ]}
          >
            <Input placeholder="邮箱" />
          </Form.Item>
          <Form.Item
            style={{ width: 600 }}
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password type="password" placeholder="密码" />
          </Form.Item>
          <Form.Item
            style={{ width: 600 }}
            label="密码确认"
            name="password2"
            rules={[
              { required: true, message: '请再次输入密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次的密码必须一致'));
                },
              }),
            ]}
          >
            <Input.Password type="password" placeholder="再次密码" />
          </Form.Item>
          <Form.Item
            style={{ width: 600 }}
            label="用户名"
            name="nickname"
            rules={[
              { required: true, message: '请输入用户名!' },
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.resolve();
                  }
                  if (/^[a-zA-Z0-9]+$/.test(value)) {
                    if (value.length < 6 || value.length > 20) {
                      return Promise.reject(new Error('用户名长度在6-20之间'));
                    }
                    return Promise.resolve();
                  } else {
                    return Promise.reject(
                      new Error('用户名只能包含英文字母和数字'),
                    );
                  }
                },
              }),
            ]}
          >
            <Input placeholder="请输入用户名，只能包含英文字母或者数字，长度在6-20之间" />
          </Form.Item>
          <Form.Item
            name="level"
            label="角色职级"
            rules={[{ required: true, message: '请选择角色职级!' }]}
          >
            <Select
              style={{ width: 120 }}
              // onChange={handleChange}
              options={[
                { value: 'admin', label: '管理员' },
                { value: 'normal', label: '普通' },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              注册
            </Button>
            给其他人注册的账号用户名
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default App;

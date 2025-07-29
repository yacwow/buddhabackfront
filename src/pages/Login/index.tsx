import React from 'react';
import { Button, Form, Input, Select } from 'antd';
import { request } from '@umijs/max';
import { history } from '@umijs/max';
import { useModel } from '@umijs/max';

const App: React.FC = () => {
  const { setLevel, setUserName } = useModel('global');
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);

    request('/admin/login', { params: values }).then(async (data) => {
      if (data.result) {
        await setLevel(data.data.level);
        await setUserName(data.data.nickname);
        //进入主页
        history.push('/backend/home');
      } else {
        window.alert(data.message);
      }
    });
  };

  // const onFinish = (values: any) => {
  //     console.log('Received values of form: ', values);

  //     request("/admin/register",{params:values}).then(data => {
  //         console.log(data)
  //     })
  // };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '98vh',
        height: '100%',
        background: "url('/login.jpg')",
        backgroundSize: 'cover',
      }}
    >
      <div>
        <h2 style={{ color: 'red' }}>Gstylehub管理系统</h2>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ level: 'admin' }}
          onFinish={onFinish}
        >
          <Form.Item
            style={{ width: 360 }}
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item
            style={{ width: 360 }}
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password type="password" placeholder="密码" />
          </Form.Item>
          <Form.Item
            name="level"
            rules={[{ required: true, message: '请选择角色名!' }]}
          >
            <Select
              style={{ width: 120 }}
              // onChange={handleChange}
              options={[
                { value: 'superadmin', label: '超级管理员' },
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
              登录
            </Button>
            只能登录不能注册不能找回密码
            {/* <Button type="primary" htmlType="submit" className="login-form-button">
                    注册
                </Button>测试用，到时候挪地方 */}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default App;

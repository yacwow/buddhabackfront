import { request } from '@umijs/max';
import { Button, Form, Input, message, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useEffect, useState } from 'react';
import styles from './ChangeAdminAccountActivity.less';

const App: React.FC = () => {
  const [userNameList, setUserNameList] =
    useState<{ value: string; label: string }[]>();
  const [form] = Form.useForm();
  //控制一下，请求的时候别填其他的东西
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    request('/admin/secure/getAllAccountInfo').then((data) => {
      if (data.result) {
        console.log(data);
        let userNameOptions = data.data.adminUserNames.map(
          (item: { active: boolean; adminUserName: string }) => {
            return {
              value: item.adminUserName,
              label: (
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>{item.adminUserName}</span>
                  <span>
                    {item.active === true ? (
                      <span style={{ color: '#0070BA' }}>{'活跃管理员'}</span>
                    ) : (
                      <s style={{ color: 'red' }}>{'禁用管理员'}</s>
                    )}
                  </span>
                </div>
              ),
            };
          },
        );
        setUserNameList(userNameOptions);
      }
    });
  }, []);

  const handleUserChange = (username: string) => {
    console.log(username);
    setLoading(true);
    request('/admin/secure/getNormalAdminInfo', { params: { username } }).then(
      (data) => {
        if (data.result) {
          console.log(data);
          let resultMapList = data.data.resultMapList;
          form.setFieldValue('nickname', resultMapList.adminname);
          form.setFieldValue('level', resultMapList.level);
          form.setFieldValue('activity', resultMapList.active);
        }
        setLoading(false);
      },
    );
  };

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    request('/admin/secure/changeUserActivity', { params: values }).then(
      (data) => {
        if (data.result) {
          message.info(data.message, 3);
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
        marginTop: '-30vh',
        minHeight: '98vh',
        height: '100%',
      }}
    >
      <div>
        <Form form={form} name="normal_login" onFinish={onFinish}>
          <Form.Item
            style={{ width: 360 }}
            name="username"
            rules={[{ required: true, message: '请选择用户名!' }]}
          >
            <Select
              placeholder="请选择用户名"
              onChange={handleUserChange}
              style={{ width: 360 }}
              options={userNameList}
            />
          </Form.Item>
          <Form.Item
            style={{ width: 360 }}
            name="nickname"
            rules={[{ required: true, message: '请输入用户昵称!' }]}
          >
            <Input disabled={loading} placeholder="用户昵称" />
          </Form.Item>

          <Form.Item
            name="level"
            rules={[{ required: true, message: '请选择角色名!' }]}
          >
            <Select
              disabled={loading}
              style={{ width: 120 }}
              options={[
                { value: 'admin', label: '管理员' },
                { value: 'normal', label: '普通' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="activity"
            rules={[{ required: true, message: '请选择状态!' }]}
          >
            <Select
              disabled={loading}
              style={{ width: 120 }}
              options={[
                { value: true, label: '活跃的' },
                { value: false, label: '禁用' },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              修改信息
            </Button>
            给普通管理员修改用的，超级管理员改不了
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default App;

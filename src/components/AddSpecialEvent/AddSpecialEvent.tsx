import styles from './AddSpecialEvent.less';
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Switch } from 'antd';
import { request } from '@umijs/max';

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [description, setDescription] = useState();

  const [switch1, setSwitch1] = useState(false); //控制是否启用勾选
  const [switch2, setSwitch2] = useState(false); //控制是否启用促销
  const [productListData, setProductListData] = useState<string>('');
  // 控制是否启用勾选
  const handleSwitch1Change = (checked: boolean) => {
    setSwitch1(checked);
  };
  //控制是否启用促销
  const handleSwitch2Change = (checked: boolean) => {
    setSwitch2(checked);
  };

  // 保存
  const handleSave = async () => {
    await form.validateFields();
    const params = form.getFieldsValue();
    console.log(params.specialCodeActive);
    params.specialCodeActive =
      params.specialCodeActive === undefined ? false : true;
    console.log(params);
    request('/admin/secure/addBasicSpecialEventInfo', {
      params,
    }).then((data) => {
      if (data.result) {
        message.info('成功添加新的勾选分类', 3);
      } else {
        message.error('添加信息失败，请确认提交的代码是否已经存在', 3);
      }
    });
  };
  // 保存并推出
  const handleSaveAndQuit = async () => {
    await form.validateFields();
    const params = form.getFieldsValue();
    params.specialCodeActive =
      params.specialCodeActive === undefined ? false : true;
    request('/admin/secure/addBasicSpecialEventInfo', {
      params,
    }).then((data) => {
      if (data.result) {
        history.back();
      } else {
        message.error('添加信息失败，请确认提交的代码是否已经存在', 3);
      }
    });
  };

  //取消
  const handleUnSave = () => {
    form.resetFields();
    setSwitch1(false);
    setSwitch2(false);
  };

  return (
    <div style={{ width: 1200 }}>
      <h2>添加新的勾选分类</h2>
      <Form form={form} labelWrap={true} labelCol={{ span: 6 }}>
        <div className={styles.display}>
          <div className={styles.inside}>
            <Form.Item
              name="description"
              label={<label>介绍</label>}
              extra={<label>仅后台可见，可作为备注使用</label>}
              rules={[
                {
                  required: true,
                  message: '请输入介绍',
                },
              ]}
            >
              <Input placeholder="介绍" value={description} />
            </Form.Item>
          </div>

          <div className={styles.inside}>
            <Form.Item
              name="specialCode"
              label={<label>代码</label>}
              extra={
                <label>
                  只允许英文字母、阿拉伯数字、英文横线(-)以及英文下划线(_)
                </label>
              }
              rules={[
                {
                  required: true,
                  message: '请输入代码',
                },
              ]}
            >
              <Input placeholder="代码" />
            </Form.Item>
          </div>
        </div>

        <div className={styles.display}>
          <div className={styles.inside}>
            <Form.Item
              name="showCount"
              label={<label>显示个数</label>}
              extra={<label>输入正整数，最多显示多少个商品</label>}
              rules={[
                {
                  required: true,
                  message: '请输入显示个数',
                },
              ]}
            >
              <Input placeholder="显示个数" type={'number'} />
            </Form.Item>
          </div>

          <div className={styles.inside}>
            <Form.Item
              name="promotionCode"
              label={<label>促销管理code</label>}
              extra={
                <label>
                  绑定促销管理code,必须和上面的代码是一致的
                  <br />
                  (勾选位更新保存后,绑定的促销管理产品id同步更新)
                </label>
              }
              dependencies={['specialCode']}
              rules={[
                {
                  required: true,
                  message: '请输入促销code',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('specialCode') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('促销code必须和上面的勾选cod一致'),
                    );
                  },
                }),
              ]}
            >
              <Input placeholder="促销管理code" />
            </Form.Item>
          </div>
        </div>
        <div className={styles.inside}>
          <div style={{ marginBottom: 20 }}>
            <Form.Item
              name="specialCodeActive"
              label={<div>是否启用此勾选</div>}
              extra={<span>{switch1 ? '已开启' : '已关闭'}</span>}
            >
              <Switch checked={switch1} onChange={handleSwitch1Change} />
            </Form.Item>
          </div>
        </div>
        <div className={styles.inside}>
          <Form.Item
            name="promotionCodeActive"
            label={<div>是否参与促销活动</div>}
            extra={<span>{switch2 ? '已开启' : '已关闭'}</span>}
          >
            <Switch checked={switch2} onChange={handleSwitch2Change} disabled />
          </Form.Item>
        </div>
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <Button
            type="primary"
            style={{ marginRight: 20 }}
            onClick={handleSave}
          >
            添加
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 60 }}
            onClick={handleSaveAndQuit}
          >
            添加并退出
          </Button>
          <Button onClick={handleUnSave}>取消</Button>
        </div>
      </Form>
    </div>
  );
};
export default App;

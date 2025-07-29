// import styles from './GrantAllCouponData.less';
import React from 'react';
import { Button, DatePicker, Form, Input, message, Select } from 'antd';
import { Dayjs } from 'dayjs';
import { request } from '@umijs/max';

interface Props {
  couponId: number;
  initialValue: {
    codeNumber?: string;
    codeType?: string;
    whoCanApply?: string;
    applyAmount?: number;
    userEmail?: string;
    couponAmount?: number;
    couponPercentOrAmount?: string;
    startDate?: Dayjs;
    expireDate?: Dayjs;
    used?: boolean;
  };
}
const App: React.FC<Props> = (props) => {
  const { initialValue, couponId } = props;
  const onFinish = (values: any) => {
    console.log('Success:', values);
    //把dayjs换成普通的时间类型
    let expireDate = values.expireDate;
    let year = expireDate.year();
    let month = expireDate.month() + 1; // 月份从0开始，所以要加1
    let day = expireDate.date();
    let hours = expireDate.hour();
    let minutes = expireDate.minute();
    let seconds = expireDate.second();
    let formatExpire = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    let startDate = values.startDate;
    let year1 = startDate.year();
    let month1 = startDate.month() + 1; // 月份从0开始，所以要加1
    let day1 = startDate.date();
    let hours1 = startDate.hour();
    let minutes1 = startDate.minute();
    let seconds1 = startDate.second();
    let formatStart = `${year1}-${month1}-${day1} ${hours1}:${minutes1}:${seconds1}`;
    let params = { ...values };
    params.expireDate = formatExpire;
    params.startDate = formatStart;
    let userEmail = values.userEmail;
    if (userEmail === undefined || userEmail === null) {
      params.userEmail = '';
    }
    params.promotionCode = values.promotionCode ? values.promotionCode : '';
    if (params.promotionCode === '' && params.whoCanApply === 2) {
      message.error(
        { content: `个人推广必须要推广码`, style: { marginTop: '40vh' } },
        4,
      );
      return;
    }
    params.couponId = couponId;
    if (params.userEmail === '' && params.whoCanApply === 'person') {
      message.error(
        { content: `个人优惠码必须有个人邮箱`, style: { marginTop: '40vh' } },
        4,
      );
      return;
    }

    request('/admin/secure/updateOrSaveDetailCoupon', {
      params: params,
    }).then((data) => {
      if (data.result) {
        message.info(
          {
            content: couponId === -1 ? '添加成功' : `修改成功`,
            style: { marginTop: '40vh' },
          },
          4,
        );
      } else {
        message.error(
          {
            content:
              couponId === -1
                ? '没添加成功，看下哪里出问题了，大概率是优惠码重复了'
                : '没修改成功，看下哪里出问题了，大概率是优惠码重复了',
            style: { marginTop: '40vh' },
          },
          4,
        );
      }
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    message.info(
      { content: `有地方出错了,${errorInfo}`, style: { marginTop: '40vh' } },
      4,
    );
  };

  return (
    <Form
      name="basic"
      labelCol={{ flex: '200px' }}
      labelWrap
      wrapperCol={{ flex: 1 }}
      // wrapperCol={{ span: 16 }}
      initialValues={initialValue}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="优惠代码--显示在用户界面，必须唯一"
        name="codeNumber"
        rules={[{ required: true, message: '不能为空' }]}
      >
        <Input placeholder="最多只能20位，并且必须唯一" />
      </Form.Item>
      <Form.Item
        label="优惠码名称-显示在用户界面,唯一"
        name="codeType"
        rules={[{ required: true, message: '不能为空' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="优惠码发放类型"
        name="whoCanApply"
        rules={[{ required: true, message: '不能为空' }]}
      >
        <Select>
          <Select.Option value="person">个人</Select.Option>
          <Select.Option value={2}>个人推广</Select.Option>
          <Select.Option value={0}>限时</Select.Option>
          <Select.Option value={1}>全局</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="如果是个人推广，则必须输入独一推广码，用于url设置"
        name="promotionCode"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="如果优惠码是个人，则必须输入个人的email"
        name="userEmail"
        rules={[{ type: 'email', message: '不是有效的email' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="最少消费多少才能使用"
        name="applyAmount"
        rules={[{ required: true, message: '不能为空，可以为0' }]}
      >
        <Input type={'number'} />
      </Form.Item>
      <Form.Item
        label="优惠金额/比例"
        name="couponAmount"
        rules={[{ required: true, message: '不能为空' }]}
      >
        <Input type={'number'} />
      </Form.Item>
      <Form.Item
        label="优惠类型"
        name="couponPercentOrAmount"
        rules={[{ required: true, message: '不能为空' }]}
      >
        <Select>
          <Select.Option value="amount">固定金额</Select.Option>
          <Select.Option value="percent">比例</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="起始日期"
        name="startDate"
        rules={[{ required: true, message: '不能为空' }]}
      >
        <DatePicker showTime />
      </Form.Item>
      <Form.Item
        label="结束日期"
        name="expireDate"
        rules={[{ required: true, message: '不能为空' }]}
      >
        <DatePicker showTime />
      </Form.Item>
      <Form.Item label="是否已使用-如果选是则用户无法使用" name="used">
        <Select>
          <Select.Option value={true}>是</Select.Option>
          <Select.Option value={false}>否</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          {couponId === -1 ? '添加新的优惠码' : '修改优惠码'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;

import React, { useState } from 'react';
import styles from './CustomerSalesComp.less';
import { Button, DatePicker, DatePickerProps, Input, message, Select } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { request } from '@umijs/max';


const CustomerSalesComp: React.FC = () => {
  const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
    console.log('onOk: ', value);
  };
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("paid")
  const [couponCode, setCouponCode] = useState("")
  const handleSearch = (page: number) => {
    if (couponCode === "") {
      message.error({ content: "必须有具体折扣码" })
      return;
    }

    request("/admin/secure/getInvoiceInfoByCouponCode", {
      params: {
        page,
        startDate,
        endDate,
        paymentStatus,
        couponCode
      }
    }).then(data => {
      if (data.result) {
        let serverInvoiceList = data.data.invoiceList;
        //返回的信息必须有总的sales（折扣后），具体多少个invoice，          invoice的id应该联动到/backend/invoice/17




      }
    })
  }

  return (
    <div className={styles.container}>
      filter的种类有以下几个：
      1.具体折扣码
      2.具体的日期范围
      3.该invoice的支付状态

      具体展示的表格是：每个invoice的信息，同时有一个总的已支付的数值的统计


      <br />
      如果是个人推广的code，则


      <br />
      开始日期：
      <DatePicker
        showTime
        onChange={(value, dateString) => {
          console.log('Selected Time: ', value);
          console.log('Formatted Selected Time: ', dateString);
          setStartDate(dateString)
        }}
        onOk={onOk}
      />
      &nbsp;&nbsp;  结束日期：
      <DatePicker
        showTime
        onChange={(value, dateString) => {
          console.log('Selected Time: ', value);
          console.log('Formatted Selected Time: ', dateString);
          setEndDate(dateString)
        }}
        onOk={onOk}
      />
      &nbsp;&nbsp;支付状态： <Select
        value={paymentStatus}
        style={{ width: 120 }}
        onChange={(value) => {
          setPaymentStatus(value)
        }}
        options={[
          { value: 'unpaid', label: '未支付' },
          { value: 'paid', label: '已支付' },
          { value: 'delivery', label: '快递中' },
          { value: 'received', label: '已送达' },
          { value: 'cancelled', label: '已退款' },
        ]}
      />
      &nbsp;&nbsp; 具体折扣码：<Input style={{ width: 180 }} onChange={(e) => {
        setCouponCode(e.target.value)
      }}></Input>
      <Button onClick={() => handleSearch(1)} style={{ marginLeft: 30 }}>搜索</Button>
    </div>
  );
};

export default CustomerSalesComp;
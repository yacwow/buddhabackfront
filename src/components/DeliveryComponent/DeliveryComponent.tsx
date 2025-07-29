import { Button, DatePicker, Input, message, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import React, { useEffect, useState } from 'react';

import { request } from '@umijs/max';
import DeliveryComponentTable from './DeliveryComponentTable';
import { SearchOutlined } from '@ant-design/icons';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
const { RangePicker } = DatePicker;
const rangePresets: {
  label: string;
  value: [Dayjs, Dayjs];
}[] = [
    { label: '最近7天', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: '最近14天', value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: '最近30天', value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: '最近90天', value: [dayjs().add(-90, 'd'), dayjs()] },
  ];

const App: React.FC = () => {
  const [total, setTotal] = useState<number>(0);
  const [tableData, setTableData] = useState<any>([]);

  const [deliveryStatus, setDeliveryStatus] = useState('all'); //订单状态
  const [page, setPage] = useState(1); //table显示的页面
  const [pageSize, setPageSize] = useState(40); //显示的一页数量
  const [selectValue, setSelectValue] = useState('invoiceId');
  const [value, setValue] = useState(); //input的值
  //   订单快递状态的改变
  const handleDeliveryStatusChange = (val: string) => {
    console.log(val);
    setDeliveryStatus(val);
  };
  const [searchType, setSearchType] = useState('normal');
  const [afterUpdateTime, setAfterUpdateTime] = useState<string | null>(); //上新时间之后
  const [beforeUpdateTime, setBeforeUpdateTime] = useState<string | null>(); //上新时间之前
  const dateFormat = 'YYYY-MM-DD';

  //时间的选择
  const onRangeChange = (
    dates: null | (Dayjs | null)[],
    dateStrings: string[],
  ) => {
    if (dates) {
      setAfterUpdateTime(dateStrings[0]);
      setBeforeUpdateTime(dateStrings[1]);
      console.log(dayjs(dates[0]).toDate());

      console.log('From: ', dates[0], ', to: ', dates[1]);
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    } else {
      setAfterUpdateTime(null);
      setBeforeUpdateTime(null);
    }
  };
  //搜索的条件
  const handleSelectChange = (e: string) => {
    setSelectValue(e);
    setValue(undefined);
    setDeliveryStatus('all');
    setAfterUpdateTime(null);
    setBeforeUpdateTime(null);
  };
  //搜索框条件输入
  const handleInputChange = (e: any) => {
    e.preventDefault();
    if (selectValue === 'invoiceId' || selectValue === 'productId') {
      let reg = /^[0-9]*$/;
      if (reg.test(e.target.value)) {
        setValue(e.target.value);
      } else {
        setValue(undefined);
        message.error('输入不能为数字之外的内容', 3);
        return;
      }
    } else {
      setValue(e.target.value);
    }
  };
  // 按条件搜索,操作快递的只能看到已经付款或者已经邮寄的单号
  const handleSearch = (page: number) => {
    let reg = /^[0-9]*$/;
    if (!value) {
      message.error('搜索参数不能为空', 3);
      return;
    }
    if (
      (selectValue === 'invoiceId' || selectValue === 'productId') &&
      !reg.test(value)
    ) {
      message.error('产品id和订单id必须是数字', 3);
      return;
    }
    if (selectValue === 'updateEmail') {
      let emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailReg.test(value)) {
        message.error('邮箱格式不正确', 3);
        return;
      }
    }
    setSearchType('params');
    request('/admin/secure/getDeliveryInvoiceInfoByParams', {
      params: {
        value,
        selectValue,
        page: page,
        pageSize,
      },
    }).then((data) => {
      console.log(data);
      if (data.result) {
        setTotal(1);
        setTableData(data.data.invoiceData);
      } else {
        setTotal(0);
        setTableData(undefined);
      }
    });
  };
  //第二排正常的搜索
  const handleNormalSearch = () => {
    setSearchType('normal');
    request('/admin/secure/getDeliveryInvoiceInfoByNormal', {
      params: {
        afterUpdateTime,
        beforeUpdateTime,
        deliveryStatus,
        page,
        pageSize,
      },
    }).then((data) => {
      if (data.result) {
        setTotal(data.data.total);
        setTableData(data.data.invoiceData);
      }
    });
  };
  useEffect(() => {
    if (searchType === 'params') {
      handleSearch(page);
    } else if (searchType === 'normal') {
      handleNormalSearch();
    }
  }, [page, pageSize]);
  return (
    <div style={{ position: 'relative' }}>
      <h4>按条件搜索和一般的订单时间配合订单状态的搜索无关联</h4>
      <div style={{ marginBottom: 30, textAlign: 'right' }}>
        <span>按条件搜索：</span>
        <Select
          value={selectValue}
          style={{ width: 120, height: 32, textAlign: 'left' }}
          onChange={handleSelectChange}
          options={[
            { value: 'invoiceId', label: '订单编号' },
            { value: 'productId', label: '产品id' },
            { value: 'updateEmail', label: '邮箱' },
          ]}
        />
        <Input
          style={{ width: 300, marginLeft: 20 }}
          // type="number"
          // min={0}
          value={value}
          onChange={handleInputChange}
          addonAfter={
            <SearchOutlined
              style={{ height: 20, width: 20 }}
              onClick={() => handleSearch(1)}
            />
          }
          placeholder="搜索"
        />
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: 420, height: 50 }}>
          <label style={{ display: 'flex', justifyContent: 'space-around' }}>
            <span>订单付款时间:</span>
            <RangePicker
              allowClear
              presets={rangePresets}
              onChange={(dates: any, dateStrings) =>
                onRangeChange(dates, dateStrings)
              }
              value={
                afterUpdateTime && beforeUpdateTime
                  ? [
                    dayjs(afterUpdateTime, dateFormat),
                    dayjs(beforeUpdateTime, dateFormat),
                  ]
                  : null
              }
            />
          </label>
        </div>
        <div style={{ width: 280, marginLeft: 20 }}>
          <label>订单快递状态: </label>
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={handleDeliveryStatusChange}
            value={deliveryStatus}
            options={[
              { value: 'notdelivery', label: '未发送' },
              { value: 'userinfoerror', label: '用户信息错误' },
              { value: 'partialdelivery', label: '部分发送有单号' },
              { value: 'alldelivery', label: '全部发送有单号' },
              { value: 'partialnostock', label: '部分无货' },
              { value: 'usernotshow', label: '配送失败' },
              { value: 'deliveried', label: '已送达' },
            ]}
          />
        </div>
        <Button type="primary" onClick={handleNormalSearch}>
          搜索
        </Button>
      </div>

      <div>
        {tableData ? (
          <DeliveryComponentTable
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            tableData={tableData}
            total={total}
          />
        ) : null}
      </div>
    </div>
  );
};
export default App;

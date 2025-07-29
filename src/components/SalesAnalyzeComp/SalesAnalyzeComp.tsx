import { SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, Select } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import { request } from '@umijs/max';

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
interface Props {
  options: any;
}
const App: React.FC<Props> = (props) => {
  const { options } = props;
  const [afterUpdateTime, setAfterUpdateTime] = useState<string | null>(); //上新时间之后
  const [beforeUpdateTime, setBeforeUpdateTime] = useState<string | null>(); //上新时间之前
  const [afterInvoiceTime, setAfterInvoiceTime] = useState<string | null>(); //订单时间之后
  const [beforeInvoiceTime, setBeforeInvoiceTime] = useState<string | null>(); //订单时间之前

  const [productType, setProductType] = useState<any[]>([]); //产品的选择的类别
  const [productStatus, setProductStatus] = useState<string>(); //产品的上架状态
  //时间的选择
  const onRangeChange = (
    dates: null | (Dayjs | null)[],
    dateStrings: string[],
    search: string,
  ) => {
    if (dates) {
      if (search === 'new') {
        setAfterUpdateTime(dateStrings[0]);
        setBeforeUpdateTime(dateStrings[1]);
      } else if (search === 'invoice') {
        setAfterInvoiceTime(dateStrings[0]);
        setBeforeInvoiceTime(dateStrings[1]);
      }
      console.log('From: ', dates[0], ', to: ', dates[1]);
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    } else {
      if (search === 'new') {
        setAfterUpdateTime(null);
        setBeforeUpdateTime(null);
      } else if (search === 'invoice') {
        setAfterInvoiceTime(null);
        setBeforeInvoiceTime(null);
      }
    }
  };

  const dateFormat = 'YYYY-MM-DD';
  const handleChange = (value: string[]) => {
    console.log(`selected ${value},${value.length}`);
    setProductType(value);
  };
  const handleProductTypeChange = (value: string) => {
    console.log(`selected ${value}`);
    setProductStatus(value);
  };
  //提交搜索请求
  const handleSearch = () => {
    request('/admin/getSalesAnalyzeInfo', {
      params: {
        afterUpdateTime,
        beforeUpdateTime,
        afterInvoiceTime,
        beforeInvoiceTime,
        productType:
          productType.length === 0 ? '' : JSON.stringify(productType),
        productStatus,
      },
    });
  };
  return (
    <div>
      <div>
        <Button type="primary" onClick={handleSearch}>
          <SearchOutlined />
          按销量检索
        </Button>
      </div>
      <div>
        <label>上新期间:</label>
        <RangePicker
          allowClear
          presets={rangePresets}
          onChange={(dates: any, dateStrings) =>
            onRangeChange(dates, dateStrings, 'new')
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
        <label>订单期间:</label>
        <RangePicker
          allowClear
          presets={rangePresets}
          onChange={(dates: any, dateStrings) =>
            onRangeChange(dates, dateStrings, 'invoice')
          }
          value={
            afterInvoiceTime && beforeInvoiceTime
              ? [
                  dayjs(afterInvoiceTime, dateFormat),
                  dayjs(beforeInvoiceTime, dateFormat),
                ]
              : null
          }
        />
        <label>分类:</label>
        <Select
          mode="multiple"
          allowClear
          style={{ minWidth: 200 }}
          placeholder="请选择"
          onChange={handleChange}
          options={options}
        />
      </div>
      <div>
        <label>产品状态:</label>
        <Select
          defaultValue="all"
          style={{ width: 120 }}
          onChange={handleProductTypeChange}
          options={[
            { value: 'all', label: '全部' },
            { value: 'available', label: '在库' },
            { value: 'notavailable', label: '不在库' },
            { value: 'nostock', label: '无库存' },
            { value: 'notpublished', label: '未发布' },
          ]}
        />
        <label>发布人:</label>
        <Input disabled placeholder="暂时没做这个搜索" style={{ width: 200 }} />
      </div>
      <div>基础数据展示区</div>
      <div>数据图表区</div>
    </div>
  );
};
export default App;

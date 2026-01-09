import NumToString from '@/utils/NumToString';
import {
  AreaChartOutlined,
  BarChartOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { request } from '@umijs/max';
import { Input, message, Select } from 'antd';
import React, { Dispatch, SetStateAction, useState } from 'react';
import styles from './InvoiceAnalyzeHeader.less';
interface Props {
  setTotal: Dispatch<SetStateAction<number>>;
  setTableData: Dispatch<SetStateAction<any[]>>;
  listData: any[];
  yesterday: string;
  today: string;
}
const App: React.FC<Props> = (props) => {
  const { setTotal, setTableData, listData, today, yesterday } = props;
  console.log(today, yesterday);

  const [selectValue, setSelectValue] = useState('invoiceId');
  const [value, setValue] = useState(); //input的值
  const handleSelectChange = (e: any) => {
    setSelectValue(e);
  };
  // 按条件搜索
  const handleSearch = () => {
    request('/admin/secure/getInvoiceInfoByInvoiceId', {
      params: {
        value,
        selectValue,
      },
    }).then((data) => {
      if (data.result) {
        setTotal(data.data.invoiceData.length);
        setTableData(data.data.invoiceData);
      }
    });
  };
  const handleInputChange = (e: any) => {
    // 如果是手机 productid等 是不能为字符的
    if (
      selectValue === 'invoiceId' ||
      selectValue === 'productId' ||
      selectValue === 'paymentAmount' ||
      selectValue === 'mobilePhone'
    ) {
      let reg = /^[0-9]*$/;
      if (reg.test(e.target.value)) {
        setValue(e.target.value);
      } else {
        message.error('输入不能为数字之外的内容', 3);
      }
    } else {
      setValue(e.target.value);
    }
  };
  const switchToInvoiceAnalyze = () => { };
  const switchToSalesNumber = () => { };
  const buildRecentTwoDay = () => {
    let thList = listData.map((item, index: number) => {
      console.log(item);
      return (
        <tr key={index}>
          {index === 0 ? <td>{today}</td> : <td>{yesterday}</td>}
          <td>{item.count}</td>
          <td>{item.total}</td>
          <td>￥{NumToString(item.amount)}</td>
          <td>
            {' '}
            {item.count === 0 ? 0 : Math.floor((item.total / item.count) * 100)}
            %
          </td>
          <td>
            ￥
            {item.total === 0
              ? 0
              : NumToString(Math.floor(item.amount / item.total))}
          </td>
        </tr>
      );
    });
    return (
      <table className={styles.table}>
        <thead>
          <tr>
            <th>日期</th>
            <th>总订单数</th>
            <th>总成交订单</th>
            <th>总成交金额</th>
            <th>订单量支付比</th>
            <th>客单金额</th>
          </tr>
        </thead>
        <tbody>{thList}</tbody>
      </table>
    );
  };
  return (
    <div>
      <div className={styles.header}>
        <div onClick={switchToInvoiceAnalyze}>
          <AreaChartOutlined /> 订单分析
        </div>
        <div onClick={switchToSalesNumber}>
          <BarChartOutlined /> 销量分析
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.showTable}>{buildRecentTwoDay()}</div>
        <div className={styles.search}>
          <div>建议用订单编号/邮箱来搜索</div>
          <Select
            value={selectValue}
            style={{ width: 120, height: 32 }}
            onChange={handleSelectChange}
            options={[
              { value: 'invoiceId', label: '订单编号' },
              { value: 'productId', label: '产品id' },
              { value: 'firstName', label: 'firstName' },
              { value: 'lastName', label: 'lastName' },
              { value: 'paymentAmount', label: '金额' },
              { value: 'mobilePhone', label: '手机' },
              { value: 'updateEmail', label: '邮箱' },
            ]}
          />
          <Input
            style={{ width: 160 }}
            // type="number"
            // min={0}
            value={value}
            onChange={handleInputChange}
            addonAfter={
              <SearchOutlined
                style={{ height: 20, width: 20 }}
                onClick={handleSearch}
              />
            }
            placeholder="搜索"
          />
        </div>
      </div>
    </div>
  );
};
export default App;

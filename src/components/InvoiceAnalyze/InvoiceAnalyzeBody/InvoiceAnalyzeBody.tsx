import { DownOutlined } from '@ant-design/icons';
import { DatePicker, DatePickerProps, message, Select, Space } from 'antd';
import styles from './InvoiceAnalyzeBody.less';
import $ from 'jquery';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import InvoiceAnalyzeBodyTable from './InvoiceAnalyzeBodyTable';
import { request } from '@umijs/max';
import { tableDateType } from '../InvoiceAnalyze';
import { set } from 'rsuite/esm/internals/utils/date';
interface Props {
  tableData: tableDateType[];
  total: number;
  setTotal: Dispatch<SetStateAction<number>>;
  setTableData: Dispatch<SetStateAction<tableDateType[]>>;
}
const App: React.FC<Props> = (props) => {
  const { tableData, total, setTotal, setTableData } = props;
  const [dateTime, setDateTime] = useState('所有日期');

  const [date1, setDate1] = useState<any>(); //用于界面上时间表的展示
  const [date2, setDate2] = useState<any>(); //用于界面上时间表的展示
  const [day1, setDay1] = useState<any>(); //用于mysql查询
  const [day2, setDay2] = useState<any>(); //用于mysql查询
  const [paymentStatus, setPaymentStatus] = useState('all'); //订单状态
  const [methodStatus, setMethodStatus] = useState('all'); //订单状态
  const [page, setPage] = useState(1); //table显示的页面
  const [pageSize, setPageSize] = useState(40); //显示的一页数量
  const [active, setActive] = useState(false)//是否显示回收站订单
  const onChange1: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
    setDate1(date);
    //dateString就能拿来mysql搜索
    setDay1(dateString);
  };
  const onChange2: DatePickerProps['onChange'] = (date, dateString) => {
    setDate2(date);
    console.log(date, dateString);
    //dateString就能拿来mysql搜索
    setDay2(dateString);
  };
  //切换下拉菜单显示
  const handleDateClick = () => {
    if ($('#myDate').css('display') === 'flex') {
      $('#myDate').css('display', 'none');
    } else {
      $('#myDate').css('display', 'flex');
      $('#myDate').css('position', 'absolute');
      $('#myDate').css('z-index', '9999');
    }
  };
  //   订单状态的改变
  const handlePaymentStatusChange = (val: string) => {
    setPaymentStatus(val);
  };
  const handleMethodStatusChange = (val: string) => {
    setMethodStatus(val);
  };
  useEffect(() => {
    if (day2 && day1 && day2 > day1) {
      setDateTime(`${day1}到${day2}`);
    }
    if (day2 && day1 && day2 === day1) {
      setDateTime(`${day1}`);
    }
    //day2不存在，
    if (!day2 && !day1) {
      setDateTime('所有日期');
    }
    if (!day2 && day1) {
      setDateTime(`${day1}至今`);
    }
    if (day2 && !day1) {
      setDateTime(`${day2}之前`);
    }
    if (day1 && day2 && day1 > day2) {
      setDateTime('');
      message.error('前面的时间不能超过后面的时间', 3);
    }
  }, [day1, day2]);
  useEffect(() => {
    if (day1 && day2 && day1 > day2) {
      //不正常
      return;
    }
    request('/admin/secure/getInvoiceInfo', {
      params: {
        afterDate: day1,
        beforeDate: day2,
        paymentStatus,
        methodStatus,
        isRecycleInvoice: active,
        page,
        pageSize,
      },
    }).then((data) => {
      if (data.result) {
        setTableData([...data.data.invoiceData]);
      }
    });
  }, [day1, day2, paymentStatus, methodStatus, page, pageSize, active]);
  useEffect(() => {
    if (day1 && day2 && day1 > day2) {
      //不正常
      return;
    }
    request('/admin/secure/getInvoiceCount', {
      params: {
        afterDate: day1,
        beforeDate: day2,
        paymentStatus,
        methodStatus,
        isRecycleInvoice: active,
      },
    }).then((data) => {
      if (data.result) {
        setTotal(data.data.count);
      }
    });
  }, [day1, day2, paymentStatus, methodStatus, active]);






  const refreshPage = () => {
    if (day1 && day2 && day1 > day2) {
      //不正常
      return;
    }
    request('/admin/secure/getInvoiceCount', {
      params: {
        afterDate: day1,
        beforeDate: day2,
        paymentStatus,
        methodStatus,
        isRecycleInvoice: active,
      },
    }).then((data) => {
      if (data.result) {
        setTotal(data.data.count);
      }
    });
    request('/admin/secure/getInvoiceInfo', {
      params: {
        afterDate: day1,
        beforeDate: day2,
        paymentStatus,
        methodStatus,
        isRecycleInvoice: active,
        page,
        pageSize,
      },
    }).then((data) => {
      if (data.result) {
        setTableData([...data.data.invoiceData]);
      }
    });

  }









  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: 340, height: 50 }}>
          <label>
            产品上传日期: {dateTime}{' '}
            <DownOutlined onClick={handleDateClick} style={{ fontSize: 12 }} />
          </label>
          <Space
            id="myDate"
            direction="vertical"
            className={styles.absolute}
            style={{ position: 'absolute', zIndex: 10 }}
          >
            <Space direction="horizontal">
              <DatePicker
                placeholder="该日期之后"
                onChange={onChange1}
                value={date1}
              />
              <DatePicker
                placeholder="该日期之前"
                onChange={onChange2}
                value={date2}
              />
            </Space>
          </Space>
        </div>
        <div style={{ width: 200 }}>
          <label>支付状态: </label>
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={handlePaymentStatusChange}
            value={paymentStatus}
            options={[
              { value: 'all', label: '所有' },
              { value: 'delivery', label: '快递中' },
              { value: 'received', label: '已送达' },
              { value: 'paid', label: '已支付' },
              { value: 'cancelled', label: '取消支付' },
              { value: 'unpaid', label: '支付确认中' },
            ]}
          />
        </div>
        <div style={{ width: 200 }}>
          <label>状态: </label>
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={handleMethodStatusChange}
            value={methodStatus}
            options={[
              { value: 'all', label: '所有' },
              { value: 'visa', label: 'visa' },
              { value: 'jcb', label: 'jcb' },
              { value: 'ae', label: 'ae' },
            ]}
          />
        </div>
        <div
          style={{
            display: 'flex',
          }}
        >
          <input
            type="checkbox"
            name=""
            id=""
            style={{
              marginBottom: 20,
            }}
            onClick={() => setActive(!active)}
          />
          <div style={{ marginTop: 5 }}>回收站订单</div>
        </div>
      </div>

      <div>
        {tableData ? (
          <InvoiceAnalyzeBodyTable
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            tableData={tableData}
            total={total}
            active={active}
            refreshPage={refreshPage}
          />
        ) : null}
      </div>
    </div>
  );
};
export default App;

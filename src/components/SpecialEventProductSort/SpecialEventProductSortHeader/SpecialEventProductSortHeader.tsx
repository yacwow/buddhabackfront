import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  TreeSelect,
  Button,
  Space,
  DatePicker,
  DatePickerProps,
  message,
} from 'antd';
import { useModel } from '@umijs/max';
import { request } from '@umijs/max';
interface Props {
  setTableData: Dispatch<SetStateAction<any[]>>;
  handleAllSelect: any;
  handleReverseSelect: any;
  handleSubmit: any;
  getQueryCategory: any;
  refreshBodyData: any;
  current: number;
  handleDelete: any;
  setIsRowSelectModalOpen: any;
  handleCurrentPageInsert: any;
  handleDifferentPageInsert: any;
}

const App: React.FC<Props> = (props) => {
  const {
    setTableData,
    handleAllSelect,
    handleReverseSelect,
    handleSubmit,
    getQueryCategory,
    refreshBodyData,
    current,
    handleDelete,
    setIsRowSelectModalOpen,
    handleCurrentPageInsert,
    handleDifferentPageInsert,
  } = props;

  const [canSendDate, setCanSendDate] = useState(true);
  const {
    day1,
    setDay1,
    day2,
    setDay2,
    setSalesInfo,
    setDataSize,
    setSelectedData,
  } = useModel('productSortData222');

  // 时间改变
  const onChange1: DatePickerProps['onChange'] = (date, dateString: string) => {
    //dateString就能拿来mysql搜索
    setDay1(dateString);
    console.log(dateString);
  };
  const onChange2: DatePickerProps['onChange'] = (date, dateString: string) => {
    //dateString就能拿来mysql搜索
    setDay2(dateString);
    console.log(dateString);
  };

  // 按时间的销量查询
  const handleQueryByTime = () => {
    if (canSendDate) {
      let path = location.pathname;
      let arr = path.split('/');
      request('/admin/getSpecialEventProductSaleInfo', {
        params: {
          code: arr[4],
          afterDate: day1,
          beforeDate: day2,
        },
      }).then((data) => {
        console.log(data);
        if (data.result) {
          console.log(data.data.resList);
          setSalesInfo(data.data);
        }
      });
    } else {
      message.error('查看选择的日期是否正确', 3);
    }
  };

  useEffect(() => {
    if (day1 && day2 && day1 > day2) {
      //不正常
      setCanSendDate(false);
    }
  }, [day1, day2]);
  useEffect(() => {
    refreshBodyData(1);
  }, []);
  return (
    <div>
      <div>
        <div>订单期间:</div>
        <div>
          <Space direction="horizontal">
            <DatePicker onChange={onChange1} />
            <DatePicker onChange={onChange2} />
          </Space>
        </div>
        <div>
          <Button
            type="primary"
            style={{ marginRight: 15 }}
            onClick={handleQueryByTime}
          >
            销量查询
          </Button>
          <Button type="primary" style={{ marginRight: 15 }}>
            销量排序（手动）目前没做
          </Button>
          <Button type="primary" style={{ marginRight: 15 }}>
            销量排序（自动）目前没做
          </Button>
        </div>
        <div style={{ marginTop: 20 }}>
          <Button
            style={{ marginRight: 25 }}
            type="primary"
            onClick={() => {
              setIsRowSelectModalOpen(true);
            }}
          >
            列数
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 5 }}
            onClick={handleCurrentPageInsert}
          >
            当前页批量插入
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={handleDifferentPageInsert}
          >
            跨页批量插入
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 5 }}
            onClick={handleAllSelect}
          >
            全选
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 5 }}
            onClick={handleReverseSelect}
          >
            反选
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 5 }}
            onClick={handleDelete}
          >
            删除
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 5 }}
            onClick={handleSubmit}
          >
            保存
          </Button>
        </div>
      </div>
    </div>
  );
};
export default App;

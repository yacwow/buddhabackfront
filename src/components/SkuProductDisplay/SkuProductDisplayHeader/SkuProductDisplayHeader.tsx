import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { DatePickerProps, message, TreeSelect } from 'antd';
import { Button, Select, DatePicker, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import $ from 'jquery';
import styles from './SkuProductDisplayHeader.less';
import { useModel } from '@umijs/max';
import { request } from '@umijs/max';

const { SHOW_PARENT } = TreeSelect;

const stockStatusTreeData = [
  {
    title: '全选',
    value: 'all',
    // key: '0-0',
    children: [
      {
        title: '在库',
        value: 'available',
        // key: '0-0-0',
      },
      {
        title: '不在库',
        value: 'notavailable',
        // key: '0-0-1',
      },
      {
        title: '无库存',
        value: 'nostock',
        // key: '0-0-2',
      },
      {
        title: '未发布',
        value: 'notpublished',
        // key: '0-0-3',
      },
    ],
  },
];
const options = [
  {
    label: '产品ID从低到高',
    value: 'productIdAsc',
    // key: '0-0-0',
  },
  {
    label: '产品ID从高到低',
    value: 'productIdDesc',
    // key: '0-0-0',
  },
  {
    label: '最新更新产品',
    value: 'updateTimeDesc',
    // key: '0-0-0',
  },
  {
    label: '最早更新产品',
    value: 'updateTimeAsc',
    // key: '0-0-0',
  },
  {
    label: '最新上传产品',
    value: 'uploadTimeDesc',
    // key: '0-0-1',
  },
  {
    label: '最早上传产品',
    value: 'uploadTimeAsc',
    // key: '0-0-1',
  },
  {
    label: '折后价格从低到高',
    value: 'price(Low to High)',
    // key: '0-0-2',
  },
  {
    label: '折后价格从高到低',
    value: 'price(High to Low)',
    // key: '0-0-3',
  },
];

interface Props {
  setTableData: Dispatch<SetStateAction<any>>;
}
const App: React.FC<Props> = (props) => {
  const { setTableData } = props;
  //两个时间选择的数据以及数据是否正确可以向后端发送
  const {
    day1,
    setDay1,
    day2,
    setDay2,
    setCanSendDate,
    canSendDate,
    pageSize,
    page,
    setMaxData,
    value,
    setValue,
    status,
    setStatus,
    sortParams,
    setSortParams,
  } = useModel('ProductDisplayHeaderData');

  const { treeDataArr } = useModel('global');
  const [dateTime, setDateTime] = useState('所有日期');

  const [date1, setDate1] = useState();
  const [date2, setDate2] = useState();
  //分类选择的变化
  const onChange = (newValue: string[]) => {
    setValue(newValue);
    console.log(newValue);
  };
  //库存状态函数
  const handleStatusChange = (val: string[]) => {
    console.log(val);
    setStatus(val);
  };
  //排序状态
  const handleSortStatusChange = (val: string) => {
    console.log(val);
    setSortParams(val);
  };
  const tProps = {
    treeData: treeDataArr,
    value,
    onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: '请选择分类',
    style: {
      width: 310,
    },
  };
  const stockStatusTProps = {
    treeData: stockStatusTreeData,
    value: status,
    onChange: handleStatusChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: '请选择库存状态',
    style: {
      width: 280,
    },
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
      //不正常
      setCanSendDate(false);
    }
  }, [day1, day2]);

  const onChange1: DatePickerProps['onChange'] = (
    date: any,
    dateString: any,
  ) => {
    console.log(date, dateString);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    date === null ? setDate1(undefined) : setDate1(date);
    //dateString就能拿来mysql搜索
    setDay1(dateString);
  };
  const onChange2: DatePickerProps['onChange'] = (
    date: any,
    dateString: any,
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    date === null ? setDate2(undefined) : setDate2(date);
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

  //按时间搜索
  const handleSearchByDate = () => {
    console.log(value, canSendDate);
    if (canSendDate) {
      request('/admin/secure/searchSkuProductByParams', {
        params: {
          beforeDate: day1,
          afterDate: day2,
          category: value.length > 0 ? JSON.stringify(value) : null,
          status: status.length > 0 ? JSON.stringify(status) : null,
          pageSize,
          page,
          sortParams,
        },
      }).then((data) => {
        if (data.result) {
          setTableData(data.data.data);
          setMaxData(data.data.count);
        } else {
          message.info('没找到相关信息', 3);
          setTableData([]);
          setMaxData(0);
        }
      });
    } else {
      message.info('日期选择有误,请检查', 3);
    }
  };
  //重置所有的数据
  const handleResetByDate = async () => {
    await Promise.all([
      setDate1(undefined),
      setDate2(undefined),
      setDay1(undefined),
      setDay2(undefined),
      setValue([]),
      setStatus(['all']),
      setCanSendDate(true),
    ]);
    // await request('/admin/secure/searchSkuProductByParams', {
    //   params: {
    //     beforeDate: undefined,
    //     afterDate: undefined,
    //     category: [],
    //     status: ['all'],
    //     pageSize: 40,
    //     page: 1,
    //     sortParams: "updateTime",
    //   },
    // }).then((data) => {
    //   if (data.result) {
    //     setTableData(data.data.data);
    //     setMaxData(data.data.count);
    //   } else {
    //     message.info('没找到相关信息', 3);
    //     setTableData([]);
    //     setMaxData(0);
    //   }
    // });
  };

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
        <div style={{ width: 350, display: 'flex' }}>
          <label style={{ width: 40 }}>分类: </label>
          <TreeSelect {...tProps} />
        </div>
        <div style={{ width: 350, display: 'flex' }}>
          <label>库存状态: </label>
          <TreeSelect {...stockStatusTProps} />
        </div>
        <div style={{ width: 350, display: 'flex' }}>
          <label>排序方式: </label>
          <Select
            options={options}
            style={{ width: 200 }}
            value={sortParams}
            onChange={handleSortStatusChange}
          />
        </div>
        <div>
          <Space
            direction="horizontal"
            style={{ position: 'absolute', zIndex: 1 }}
          >
            <Button type="primary" onClick={handleSearchByDate}>
              删选
            </Button>
            <Button onClick={handleResetByDate}>重置</Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default App;

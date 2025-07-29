import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './ProductSortHeader.less';
import {
  TreeSelect,
  Button,
  Space,
  DatePicker,
  DatePickerProps,
  message,
  Select,
  Modal,
} from 'antd';
import { history, useModel } from '@umijs/max';
import { request } from '@umijs/max';
interface Props {
  setTableData: Dispatch<SetStateAction<any[]>>;
  handleAllSelect: any;
  handleReverseSelect: any;
  handleHeaderSubmit: any;
  getQueryCategory: any;
  refreshBodyData: any;
  current: number;
  handleDelete: any;
}

const App: React.FC<Props> = (props) => {
  const {
    setTableData,
    handleAllSelect,
    handleReverseSelect,
    handleHeaderSubmit,
    getQueryCategory,
    refreshBodyData,
    current,
    handleDelete,
  } = props;

  const [selectShowedValue, setSelectShowedValue] = useState('');
  const [canSendDate, setCanSendDate] = useState(true);
  const [value, setValue] = useState(0); //第几个开始的value
  const [selectValue, setSelectValue] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    setDataSize,
    day1,
    setDay1,
    day2,
    setDay2,
    setSalesInfo,
    selectedData,
    setSelectedData,
  } = useModel('productSortData222');

  //主页的category的模块的数据
  const {
    categorySpecialEventSuccessFileList,
    setCategorySpecialEventSuccessFileList,
  } = useModel('categoryManagement');
  const { treeDataArr, setTreeDataArr } = useModel('global');
  useEffect(() => {
    console.log(selectShowedValue);
  }, [selectShowedValue]);
  //下拉框选择事件
  const handleSelect = (value: any) => {
    setSelectShowedValue(value);
    history.push(`/backend/productSort/categoryType/${value}`);
    if (canSendDate) {
      request('/admin/secure/getCategoryProductSaleInfo', {
        params: {
          categoryInfo: value,
          afterDate: day1,
          beforeDate: day2,
        },
      }).then((data) => {
        if (data.result) {
          setSalesInfo(data.data);
        }
      });
    }
    request('/admin/secure/getCategoryProductForSort', {
      params: {
        page: 1,
        categoryInfo: value,
      },
    }).then((data) => {
      console.log(data);
      if (data.result) {
        setTableData(data.data.resList);
        let tempSelectedData = [];
        for (let i = 0; i < data.data.resList.length; i++) {
          tempSelectedData.push(false);
        }
        setSelectedData([...tempSelectedData]);
        setDataSize(data.data.count);
      }
    });
  };

  // 右上角两个条件输入
  const handleInputChange = (e: any) => {
    setValue(e.target.value);
  };
  const handleSelectChange = (e: any) => {
    setSelectValue(e);
  };
  //右上角的条件排序
  const handleSortByInputValue = () => {
    request(`/admin/secure/SortProductByInStockDate`, {
      params: {
        target: value,
        categoryInfo: selectShowedValue,
      },
    }).then((data) => {
      if (data.result) {
        // 请求一边数据
        refreshBodyData(1);
        setIsModalOpen(false);
      }
    });
  };
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
      request('/admin/secure/getCategoryProductSaleInfo', {
        params: {
          categoryInfo: selectShowedValue,
          afterDate: day1,
          beforeDate: day2,
        },
      }).then((data) => {
        if (data.result) {
          setSalesInfo(data.data);
        }
      });
    } else {
      message.error('查看选择的日期是否正确', 3);
    }
  };

  useEffect(() => {
    // refreshBodyData(1);
    let path = location.pathname;
    let arr = path.split('/');
    if (arr.length >= 5) {
      const decodedString = decodeURIComponent(arr[4]);
      setSelectShowedValue(decodedString);
      request('/admin/secure/getCategoryProductForSort', {
        params: {
          page: 1,
          categoryInfo: decodedString,
        },
      }).then((data) => {
        console.log(data);
        if (data.result) {
          setTableData(data.data.resList);
          let tempSelectedData = [];
          for (let i = 0; i < data.data.resList.length; i++) {
            tempSelectedData.push(false);
          }
          setSelectedData([...tempSelectedData]);
          setDataSize(data.data.count);
        }
      });
    }
  }, []);
  useEffect(() => {
    if (day1 && day2 && day1 > day2) {
      //不正常
      setCanSendDate(false);
    }
  }, [day1, day2]);
  // useEffect(() => {
  //   let pathArr = location.pathname.split('/');
  //   if (pathArr.length >= 5) {
  //     request('/admin/secure/getCategoryProductSaleInfo', {
  //       params: {
  //         categoryInfo: pathArr[4],
  //         afterDate: day1,
  //         beforeDate: day2,
  //       },
  //     }).then((data) => {
  //       if (data.result) {
  //         setSalesInfo(data.data);
  //       }
  //     });
  //   }
  // }, []);
  useEffect(() => {
    if (
      treeDataArr.length === 0 ||
      categorySpecialEventSuccessFileList.length === 0
    ) {
      //为了获取分类下拉列表，同时懒得在做一个请求了
      request('/admin/secure/getHomePageCategoryInfo').then((data) => {
        if (data.result) {
          setTreeDataArr(data.data.categoryDetail);
          setCategorySpecialEventSuccessFileList(data.data.categoryInfo);
        }
      });
    }
  }, []);
  return (
    <div>
      <Modal
        title="确定"
        open={isModalOpen}
        onOk={handleSortByInputValue}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <p>
          确定要第: {value} 个后按照-- : {selectValue} --这样排序吗?
          <br />
          注意，该排序根据产品数量可能需要几分钟做完响应
        </p>
      </Modal>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <label>分类选择:</label>
          <TreeSelect
            showSearch
            // dropdownStyle={{ height: 1000, overflow: 'auto', minWidth: 600 }}
            placeholder="添加分类/大类的分类"
            popupMatchSelectWidth={false}
            onSelect={handleSelect}
            allowClear
            listHeight={400}
            style={{ width: 400 }}
            // treeCheckStrictly={true}
            // defaultValue={defaultSelectValue}
            value={selectShowedValue}
            // showArrow={false}
            treeDefaultExpandAll
            treeData={treeDataArr}
          />
        </div>

        <div>
          <div>
            <span>条件排序：第</span>
            <input
              type="number"
              min={0}
              value={value}
              onChange={handleInputChange}
            />
            <span>个商品后，按</span>
            <Select
              value={selectValue}
              style={{ width: 120 }}
              onChange={handleSelectChange}
              options={[{ value: '产品上传日期倒序', label: '产品上传日期倒序' }]}
            />
            <span>进行排序</span>
          </div>
          <div>
            <Button
              type="primary"
              style={{ float: 'right' }}
              onClick={() => {
                if (selectValue === '' || selectValue === undefined) {
                  message.error('请选择排序方式', 3);
                  return;
                } else {
                  setIsModalOpen(true);
                }
              }}
            >
              保存
            </Button>
          </div>
          <br />
          <br />
          {/* 最后操作：{' 周静'}:{' 2023-04-07 19:40:43'}{' '} */}
        </div>
      </div>

      <div>
        <div>订单期间:</div>
        <div>
          <Space direction="horizontal">
            <DatePicker onChange={onChange1} />
            <DatePicker onChange={onChange2} />
          </Space>
        </div>
        <div>
          <Button onClick={handleQueryByTime}>销量查询</Button>
          <Button>销量排序（手动）目前没做</Button>
          <Button>销量排序（自动）目前没做</Button>
          <Button onClick={handleAllSelect}>全选</Button>
          <Button onClick={handleReverseSelect}>反选</Button>
          <Button onClick={handleDelete}>删除</Button>
          <Button onClick={handleHeaderSubmit()} type="primary">
            保存
          </Button>
        </div>
      </div>
    </div>
  );
};
export default App;

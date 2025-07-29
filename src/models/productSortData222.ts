// 全局共享数据示例
import { useState } from 'react';
const useUser1 = () => {
  const [firstCategory2, setFirstCategory2] = useState(''); //下拉选项的初始数据
  const [secondCategory2, setSecondCategory2] = useState(''); //下拉选项的初始数据
  const [dataSize, setDataSize] = useState(0); //一共有多少数据
  const [salesInfo, setSalesInfo] = useState<any>([]); //销售数据
  const [tableData, setTableData] = useState<any>([]); //表单数据
  const [day1, setDay1] = useState<string>(); //判断几个日期前后
  const [day2, setDay2] = useState<string>(); //判断几个日期前后
  const [needUpdateData, setNeedUpdateData] = useState<any>([]); //真正需要更新的数据有哪些 单页乱七八糟排序的时候需要用到
  const [selectedData, setSelectedData] = useState<any>([]); //哪些图片被勾选了
  return {
    firstCategory2,
    setFirstCategory2,
    secondCategory2,
    setSecondCategory2,
    dataSize,
    setDataSize,
    salesInfo,
    setSalesInfo,
    tableData,
    setTableData,
    day1,
    setDay1,
    day2,
    setDay2,
    needUpdateData,
    setNeedUpdateData,
    selectedData,
    setSelectedData,
  };
};

export default useUser1;

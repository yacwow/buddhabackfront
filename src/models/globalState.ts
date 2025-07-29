import { useEffect } from 'react';
// 全局共享数据示例
import { useState } from 'react';

const useUser = () => {
  const [current, setCurrent] = useState('productContext'); //addproductnavigate的状态
  const [dataSource, setDataSource] = useState<string[][]>([]); //productsize初始数据，用于产品库存状态的表格使用，非尺码表使用
  const [firstCategory, setFirstCategory] = useState(''); //productCategory初始数据
  const [firstCategoryJap, setFirstCategoryJap] = useState(''); //productCategory初始数据
  const [secondCategory, setSecondCategory] = useState(''); //productCategory初始数据
  const [secondCategoryJap, setSecondCategoryJap] = useState(''); //productCategory初始数据
  // const [productSizeCount, setProductSizeCount] = useState(dataSource.length); //productSize有几行数据，目前应该用不到
  const [dataSizeString, setDataSizeString] = useState(''); //产品的尺寸的字符串
  const [tableHead, setTableHead] = useState<
    {
      values?: string[];
      transName: string;
      firstName: string;
    }[]
  >([{ transName: 'Size', firstName: '尺码' }]); //产品尺码表头
  const [tableData, setTableData] = useState<string[][]>([['']]); //产品尺码表内容
  const [sizeVariable, setSizeVaribale] = useState<
    {
      priceVariate: string;
      variateValue: number;
      name: string;
    }[]
  >([{ priceVariate: '+', variateValue: 0, name: '' }]); //就那个产品size导致不同价格的一个鬼东西
  const [isProductSizeStandard, setIsProductSizeStandard] = useState(false); //该产品尺寸是不是标准尺寸，不需要额外尺寸
  const [sizeVariableMap, setSizeVariableMap] = useState<{
    [key: string]: {
      priceVariate: string;
      variateValue: string;
      name: string;
    };
  }>({});
  useEffect(() => {
    let str = window.location.pathname.split('/');
    if (str.length > 0) {
      setCurrent(str[str.length - 1]);
    }
  }, []);
  return {
    current,
    setCurrent,
    dataSource,
    setDataSource,
    firstCategory,
    setFirstCategory,
    firstCategoryJap,
    setFirstCategoryJap,
    secondCategory,
    setSecondCategory,
    secondCategoryJap,
    setSecondCategoryJap,
    // productSizeCount,
    // setProductSizeCount,
    dataSizeString,
    setDataSizeString,
    tableHead,
    setTableHead,
    tableData,
    setTableData,
    sizeVariable,
    setSizeVaribale,
    isProductSizeStandard,
    setIsProductSizeStandard,
    sizeVariableMap,
    setSizeVariableMap,
  };
};

export default useUser;

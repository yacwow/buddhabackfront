// 全局共享数据示例
import { useEffect, useState } from 'react';


const useUser = () => {
  const [day1, setDay1] = useState(); //判断几个日期前后
  const [day2, setDay2] = useState(); //判断几个日期前后
  const [canSendDate, setCanSendDate] = useState(true); //能否往后端申请数据
  const [page, setPage] = useState(1); //第几页的数据
  const [maxData, setMaxData] = useState<number>(); //一共有多少数据
  const [pageSize, setPageSize] = useState(40); //一页的数据个数
  const [productIds, setProductIds] = useState<number[]>([]); //当前页的product id
  const [value, setValue] = useState<string[]>([]); //productdisplayheader的category，直接用一个就能搞定
  const [status, setStatus] = useState<string[]>(['all']); //productdisplayheader的状态
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [sortParams, setSortParams] = useState('productIdDesc');

  useEffect(() => {
    // 初始化或更新时执行的逻辑 ))
    const searchParams = new URLSearchParams(window.location.search);
    const page = searchParams.get('page')
      ? Number(searchParams.get('page'))
      : 1;
    setPage(page);
  }, []);
  return {
    day1,
    setDay1,
    day2,
    setDay2,
    canSendDate,
    setCanSendDate,
    page,
    setPage,
    maxData,
    setMaxData,
    pageSize,
    setPageSize,
    productIds,
    setProductIds,
    value,
    setValue,
    status,
    setStatus,
    selectedRowKeys,
    setSelectedRowKeys,
    sortParams,
    setSortParams,
  };
};

export default useUser;

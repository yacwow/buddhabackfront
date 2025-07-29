import { DataType } from '@/components/EditSpecialEventProduct/EditSpecialEventProductBody/EditSpecialEventProductBodyTable/EditSpecialEventProductBodyTable';
// 全局共享数据示例
import { useState } from 'react';

const useUser = () => {
  const [specialEventProductTableData, setSpecialEventProductTableData] =
    useState<DataType | any>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [productIdList, setProductIdList] = useState<number[]>([]);
  const [code, setCode] = useState('');
  const [total, setTotal] = useState<number>();
  return {
    specialEventProductTableData,
    setSpecialEventProductTableData,
    page,
    setPage,
    pageSize,
    setPageSize,
    selectedRowKeys,
    setSelectedRowKeys,
    productIdList,
    setProductIdList,
    code,
    setCode,
    total,
    setTotal,
  };
};

export default useUser;

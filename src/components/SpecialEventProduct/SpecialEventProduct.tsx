import { formatTimeFromStr } from '@/utils/format';
import { NavLink } from '@umijs/max';
import { request } from '@umijs/max';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

interface DataType {
  key: React.Key;
  categoryId: string;
  description: string;
  code: string;
  href: string;
  countNumber: number;
  updatedTime: string | null;
  createdTime: string | null;
  active: boolean;
}
const columns: ColumnsType<DataType> = [
  {
    title: 'ID',
    dataIndex: 'categoryId',
    sorter: (a, b) => +a.categoryId - +b.categoryId,
  },
  {
    title: '名称',
    dataIndex: 'description',
    render: (description: string, oneLineData) => {
      return (
        <div>
          <NavLink to={oneLineData.href}>{description}</NavLink>
        </div>
      );
    },
  },
  {
    title: '代码',
    dataIndex: 'code',
    render: (code: string, oneLineData) => {
      return (
        <div>
          <NavLink to={oneLineData.href}>{code}</NavLink>
        </div>
      );
    },
  },
  {
    title: '显示数量',
    dataIndex: 'countNumber',
  },
  {
    title: '是否启用',
    dataIndex: 'active',
    render: (active: boolean) => {
      if (active) {
        return (
          <div
            style={{
              width: 30,
              textAlign: 'center',
              color: 'white',
              background: '#5cb85c',
            }}
          >
            是
          </div>
        );
      } else {
        return (
          <div
            style={{
              width: 30,
              textAlign: 'center',
              color: 'red',
              background: '#5cb85c',
            }}
          >
            否
          </div>
        );
      }
    },
  },
  {
    title: '创建日期',
    dataIndex: 'createdTime',
  },
  {
    title: '更新日期',
    dataIndex: 'updatedTime',
  },
];
const App: React.FC = () => {
  const [tableData, setTableData] = useState<any>([]);
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    const tempData: DataType[] = [];
    for (let i = 0; i < tableData.length; i++) {
      tempData.push({
        key: i,
        categoryId: tableData[i].specialEventid,
        description: tableData[i].description,
        code: tableData[i].promotioncode,
        href: '/backend/editSpecialEventProduct/' + tableData[i].promotioncode,
        countNumber: tableData[i].count,
        updatedTime: tableData[i].updatetime
          ? formatTimeFromStr(tableData[i].updatetime)
          : null,
        createdTime: tableData[i].createtime
          ? formatTimeFromStr(tableData[i].createtime)
          : null,
        active: tableData[i].active,
      });
    }
    setData(tempData);
  }, [tableData]);
  useEffect(() => {
    //请求到所有的数据
    request('/admin/secure/getAllSpecialEventDescription').then((data) => {
      console.log(data);
      if (data.result) {
        setTableData(data.data.specialEvent);
        console.log(data.data.specialEvent);
      }
    });
  }, []);
  return (
    <div style={{ minWidth: 1200 }}>
      {tableData && tableData.length > 0 ? (
        <Table
          pagination={{
            hideOnSinglePage: true,
            pageSize: 100,
            total: 100,
          }}
          columns={columns}
          dataSource={data}
        />
      ) : null}
    </div>
  );
};
export default App;

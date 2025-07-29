import { ColumnsType } from 'antd/es/table';
import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { formatTimeFromStr } from '@/utils/format';
import { request } from '@umijs/max';
import { NavLink } from '@umijs/max';

interface DataType {
  key: number;
  accountName: string;
  email: string;
  level: string;
  lastTimeLogin: number;
  active: boolean;
}

const App: React.FC = () => {
  //下面四个是tabel四件套
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<any[]>([]);

  const onShowSizeChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };
  const columns: ColumnsType<DataType> = [
    {
      title: '管理员名字',
      dataIndex: 'accountName',
      key: 'accountName',
      render: (accountName) => <div>{accountName}</div>,
    },
    {
      title: '管理员邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => {
        return <div>{email}</div>;
      },
    },
    {
      title: '最后一次登录时间',
      dataIndex: 'lastTimeLogin',
      key: 'lastTimeLogin',
      render: (lastTimeLogin: string) => {
        return (
          <div>{lastTimeLogin ? formatTimeFromStr(lastTimeLogin) : ''}</div>
        );
      },
      sorter: (a: any, b: any) => {
        return a.lastTimeLogin - b.lastTimeLogin;
      },
    },
    {
      title: '是否为活跃管理员',
      dataIndex: 'active',
      key: 'active',
      render: (active: string) => {
        return <div>{active ? '是' : '否'}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.active - b.active;
      },
    },
  ];
  useEffect(() => {
    request('/admin/secure/getAllAdminUser', {
      params: {
        page: page,
        pageSize,
      },
    }).then((data) => {
      if (data.result) {
        setTotal(data.data.number);
        let adminList = data.data.adminList;
        let tableData = [];
        for (let i = 0; i < adminList.length; i++) {
          let map: any = {};
          map.key = i;
          map.email = adminList[i].adminemail;
          map.accountName = adminList[i].adminname;
          map.level = adminList[i].level;
          map.lastTimeLogin = adminList[i].lastlogin;
          map.active = adminList[i].active;
          tableData.push(map);
        }
        setData(tableData);
      }
    });
  }, [page, pageSize]);

  return (
    <div>
      <h3>
        <NavLink
          to={'/backend/addAdminAccount'}
          style={{
            marginRight: 20,
            border: '2px solid #f40',
            textDecoration: 'none',
          }}
        >
          添加管理员
        </NavLink>
        <NavLink
          to={'/backend/changeAdminAccountActivity'}
          style={{
            marginRight: 20,
            border: '2px solid #f40',
            textDecoration: 'none',
          }}
        >
          禁用/启用管理员
        </NavLink>
      </h3>
      <Table
        columns={columns}
        pagination={{
          showSizeChanger: true,
          defaultCurrent: page,
          defaultPageSize: pageSize,
          onChange: onShowSizeChange,
          total: total,
          pageSizeOptions: [40, 100, 200, 500],
        }}
        dataSource={data}
      />
    </div>
  );
};
export default App;

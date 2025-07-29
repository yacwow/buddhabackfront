import { Button, Input, message, Modal } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './ModifyUserComp.less';
import { formatTimeFromStr } from '@/utils/format';
import { request } from '@umijs/max';

interface DataType {
  key: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  lastLogin: string;
  deduction: number;
  level: string;
}

const App: React.FC = () => {
  //下面四个是tabel四件套
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<any[]>([]);

  const [email, setEmail] = useState<string>(); //用户邮箱搜索的值
  const [userId, setUserId] = useState<string>(); //用户id搜索的值

  const [transferEmail, setTransferEmail] = useState<
    string | undefined | null
  >(); //用来触发上传的
  const [transferUserId, setTransferUserId] = useState<
    string | undefined | null
  >(); //用来触发上传的

  const [isModalOpen, setIsModalOpen] = useState(false); //打开modal
  const [isModal2Open, setIsModal2Open] = useState(false); //再三确认的modal
  const [needDeleteId, setNeedDeleteId] = useState<number | undefined | null>(); //展示在modal并最后上传删除的
  const [targetUser, setTargetUser] = useState<any>(); //展示在model的信息,是个map
  const onShowSizeChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };
  const columns: ColumnsType<DataType> = [
    {
      title: '用户id(点击进入删除页面)',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId) => (
        <Button
          type="primary"
          onClick={async () => {
            for (let i = 0; i < data.length; i++) {
              if (data[i].userId === userId) {
                setTargetUser(data[i]);
              }
            }
            await setNeedDeleteId(userId);
            setIsModalOpen(true);
          }}
        >
          {userId}
        </Button>
      ),
      sorter: (a: any, b: any) => {
        return a.invoiceId - b.invoiceId;
      },
    },
    {
      title: '用户名',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (firstName: string) => {
        return <div>{firstName}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.firstName - b.firstName;
      },
    },
    {
      title: '用户姓',
      dataIndex: 'lastName',
      key: 'lastName',
      sorter: (a: any, b: any) => {
        return a.lastName - b.lastName;
      },
    },
    {
      title: '用户邮箱',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: any, b: any) => {
        return a.email - b.email;
      },
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (lastLogin: string) => {
        return <div>{formatTimeFromStr(lastLogin)}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.lastLogin - b.lastLogin;
      },
    },
    {
      title: '用户积分',
      dataIndex: 'deduction',
      key: 'deduction',
      sorter: (a: any, b: any) => {
        return a.deduction - b.deduction;
      },
    },
    {
      title: '实际订单价格',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => {
        return <div>{level}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.level - b.level;
      },
    },
    {
      title: '进入详情修改页面',
      dataIndex: 'action',
      key: 'action',
      render: (level: string, record) => {
        return (
          <a
            href={`/backend/modifySingleUserDetail?${record.email}`}
            target="_blank"
            rel="noreferrer"
          >
            跳转到用户详情
          </a>
        );
      },
    },
  ];
  useEffect(() => {
    request('/admin/secure/getCustomerInfoByParams', {
      params: {
        page: page,
        pageSize,
        email: transferEmail,
        userId: transferUserId,
      },
    }).then((data) => {
      if (data.result) {
        setTotal(data.data.number);
        let userList = data.data.userList;
        let tableData = [];
        for (let i = 0; i < userList.length; i++) {
          let map: any = {};
          map.key = i;
          map.userId = userList[i].userid;
          map.firstName = userList[i].firstname;
          map.lastName = userList[i].lastname;
          map.email = userList[i].email;
          map.lastLogin = userList[i].lastlogin;
          map.deduction = userList[i].deduction;
          map.level = userList[i].level;
          tableData.push(map);
        }
        setData(tableData);
      }
    });
  }, [page, pageSize, transferEmail, transferUserId]);
  //根据条件删除某个用户（真的删掉了）
  const handleSubmitDelete = () => {
    request('/admin/secure/deleteCustomerById', {
      params: {
        userId: needDeleteId,
        page,
        pageSize,
      },
    }).then((data) => {
      if (data.result) {
        if (data.code === 20001) {
          message.error({ content: '删除失败/该用户不存在，等下再试试看' }, 4);
          setIsModalOpen(false);
          setIsModal2Open(false);
          return;
        }
        setTotal(data.data.number);
        let userList = data.data.userList;
        let tableData = [];
        for (let i = 0; i < userList.length; i++) {
          let map: any = {};
          map.key = i;
          map.userId = userList[i].userid;
          map.firstName = userList[i].firstname;
          map.lastName = userList[i].lastname;
          map.email = userList[i].email;
          map.lastLogin = userList[i].lastlogin;
          map.deduction = userList[i].deduction;
          map.level = userList[i].level;
          tableData.push(map);
        }
        setData(tableData);
        setIsModal2Open(false);
        setIsModalOpen(false);
        message.info({ content: '删除成功' }, 4);
      }
    });
  };
  return (
    <div>
      <Modal
        title="再次确认要删除该用户"
        open={isModal2Open}
        onOk={handleSubmitDelete}
        onCancel={() => {
          setIsModal2Open(false);
          setIsModalOpen(false);
        }}
      >
        <p>该处删除之后无法恢复，请确认</p>
      </Modal>
      <Modal
        title="确定要删除的用户"
        open={isModalOpen}
        onOk={() => setIsModal2Open(true)}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        className={styles.model1}
      >
        <p>需要删除的用户id：{needDeleteId}</p>

        {targetUser && targetUser.firstName ? (
          <p>用户名：{targetUser.firstName}</p>
        ) : null}
        {targetUser && targetUser.lastName ? (
          <p>用户姓：{targetUser.lastName}</p>
        ) : null}
        {targetUser && targetUser.email ? (
          <p>用户email：{targetUser.email}</p>
        ) : null}
        {targetUser && targetUser.lastLogin ? (
          <p>用户最后一次登录：{formatTimeFromStr(targetUser.lastLogin)}</p>
        ) : null}
        {targetUser && targetUser.deduction ? (
          <p>用户积分：{targetUser.deduction}</p>
        ) : null}
        {targetUser && targetUser.level ? (
          <p>用户级别：{targetUser.level}</p>
        ) : null}
      </Modal>
      {/* 搜索用户的组件 */}
      <h3>按条件来搜索用户</h3>
      <label>按用户注册邮箱模糊搜索</label> <br />
      <Input
        placeholder="通过邮箱搜索用户"
        style={{ width: 500 }}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <br />
      <Button
        type="primary"
        style={{ marginTop: 20, marginBottom: 20 }}
        onClick={() => {
          setTransferEmail(email);
          setTransferUserId(null);
        }}
      >
        搜索
      </Button>
      <br />
      <label>按用户id模糊搜索</label> <br />
      <Input
        placeholder="通过用户id,不推荐"
        style={{ width: 500 }}
        value={userId}
        onChange={(e) => {
          setUserId(e.target.value);
        }}
      />
      <br />
      <Button
        type="primary"
        style={{ marginTop: 20 }}
        onClick={() => {
          setTransferEmail(null);
          setTransferUserId(userId);
        }}
      >
        搜索
      </Button>
      <h3>用户展示</h3>
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

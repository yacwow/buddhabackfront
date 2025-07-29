import { Button, Input, message, Modal } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './ChangeUserActiveComp.less';
import { formatTimeFromStr } from '@/utils/format';
import { request } from '@umijs/max';

interface DataType {
  key: number;
  email: string;
  createdTime: string;
  lastTimeEmailed: number;
}

const App: React.FC = () => {
  //下面四个是tabel四件套
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [email, setEmail] = useState<string>(); //用户邮箱搜索的值

  const [transferEmail, setTransferEmail] = useState<
    string | undefined | null
  >(); //用来触发上传的
  const [transferUserId, setTransferUserId] = useState<
    string | undefined | null
  >(); //用来触发上传的

  const [isModalOpen, setIsModalOpen] = useState(false); //打开modal
  const [needDeleteEmail, setNeedDeleteEmail] = useState<
    number | undefined | null
  >(); //展示在modal并最后上传删除的
  const [targetUser, setTargetUser] = useState<any>(); //展示在model的信息,是个map
  const onShowSizeChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };
  const columns: ColumnsType<DataType> = [
    {
      title: '用户邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <Button
          type="primary"
          onClick={async () => {
            for (let i = 0; i < data.length; i++) {
              if (data[i].email === email) {
                setTargetUser(data[i]);
              }
            }
            await setNeedDeleteEmail(email);
            setIsModalOpen(true);
          }}
        >
          {email}
        </Button>
      ),
      sorter: (a: any, b: any) => {
        return a.invoiceId - b.invoiceId;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      render: (createdTime: string) => {
        return <div>{formatTimeFromStr(createdTime)}</div>;
      },
      sorter: (a: any, b: any) => {
        return a.createdTime - b.createdTime;
      },
    },
    {
      title: '最后一次发送邮件时间',
      dataIndex: 'lastTimeEmailed',
      key: 'lastTimeEmailed',
      render: (lastTimeEmailed: string) => {
        return (
          <div>{lastTimeEmailed ? formatTimeFromStr(lastTimeEmailed) : ''}</div>
        );
      },
      sorter: (a: any, b: any) => {
        return a.lastTimeEmailed - b.lastTimeEmailed;
      },
    },
  ];
  useEffect(() => {
    request('/admin/secure/getCustomerSubscribeByParams', {
      params: {
        page: page,
        pageSize,
        email: transferEmail,
        userId: transferUserId,
      },
    }).then((data) => {
      if (data.result) {
        setTotal(data.data.number);
        let promotionEmails = data.data.promotionEmails;
        let tableData = [];
        for (let i = 0; i < promotionEmails.length; i++) {
          let map: any = {};
          map.key = i;
          map.email = promotionEmails[i].useremail;
          map.createdTime = promotionEmails[i].createdtime;
          map.lastTimeEmailed = promotionEmails[i].lasttimeemailed;
          tableData.push(map);
        }
        setData(tableData);
      }
    });
  }, [page, pageSize, transferEmail, transferUserId]);
  //根据条件取消订阅
  const handleChangeSubscribeStatus = () => {
    request('/admin/secure/deleteCustomerSubscribeByEmail', {
      params: {
        email: needDeleteEmail,
        page,
        pageSize,
      },
    }).then((data) => {
      if (data.result) {
        if (data.code === 20001) {
          message.error(
            { content: '删除失败/不存在该订阅账户，等下再试试看' },
            4,
          );
          setIsModalOpen(false);
          return;
        }
        setTotal(data.data.number);
        let promotionEmails = data.data.promotionEmails;
        let tableData = [];
        for (let i = 0; i < promotionEmails.length; i++) {
          let map: any = {};
          map.key = i;
          map.email = promotionEmails[i].useremail;
          map.createdTime = promotionEmails[i].createdtime;
          map.lastTimeEmailed = promotionEmails[i].lasttimeemailed;
          tableData.push(map);
        }
        setIsModalOpen(false);
        setData(tableData);
      }
    });
  };
  return (
    <div>
      <Modal
        title="取消用户订阅"
        open={isModalOpen}
        onOk={handleChangeSubscribeStatus}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        className={styles.model1}
      >
        <p>需要取消用户订阅：{needDeleteEmail}</p>

        {targetUser && targetUser.createdTime ? (
          <p>订阅日期：{formatTimeFromStr(targetUser.createdTime)}</p>
        ) : null}
        {targetUser && targetUser.lastTimeEmailed ? (
          <p>最后一次发邮件日期：{targetUser.lastTimeEmailed}</p>
        ) : null}
      </Modal>
      {/* 搜索用户的组件 */}
      <h3>按条件来搜索用户，订阅用户可能是未注册的</h3>
      <label>按用户邮箱模糊搜索</label> <br />
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

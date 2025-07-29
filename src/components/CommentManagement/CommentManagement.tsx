import React, { useEffect, useState } from 'react';
import { Image, message, Switch, Table } from 'antd';
import './CommentManagement.css';
import { request } from '@umijs/max';
import { formatTimeWithHours } from '@/utils/format';
import { ColumnsType } from 'antd/es/table';
import CommentManagementHeader from './CommentManagementHeader';
import { commentDataSourceType } from '@/components/AddProduct/Comment/Comment';



const App: React.FC = () => {
  const [commentDataSource, setCommentDataSource] = useState<
    commentDataSourceType[]
  >([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(40);
  const [afterUpdateTime, setAfterUpdateTime] = useState<string | null>(); //上新时间之后
  const [beforeUpdateTime, setBeforeUpdateTime] = useState<string | null>(); //上新时间之前
  const [commentStatus, setCommentStatus] = useState<string>('all'); //comment是否展示的状态
  const [total, setTotal] = useState(0);
  const [auditStatus, setAuditStatus] = useState('all');
  useEffect(() => {
    request('/admin/secure/getAllCommentByParams', {
      params: {
        afterUpdateTime,
        beforeUpdateTime,
        commentStatus,
        auditStatus,
        page,
        pageSize,
      },
    }).then((data) => {
      if (data.result) {
        let commentList = data.data.commentList.map(
          (item: any, index: number) => {
            item.key = index;
            return item;
          },
        );
        setCommentDataSource(commentList);
        setTotal(data.data.total);
      }
    });
  }, [pageSize, page]);

  //改变当前行是否活跃
  const handleChange = (needChangeItem: any) => {
    console.log(needChangeItem);
    const newData = structuredClone(commentDataSource).filter((item) => {
      if (item.key !== needChangeItem.key) {
        return item;
      } else {
        item.active = !item.active;
        return item;
      }
    });

    setCommentDataSource([...newData]);
  };

  //改变当前行是否helpful
  const handleChangeHelpful = (needChangeItem: any) => {
    console.log(needChangeItem);
    const newData = structuredClone(commentDataSource).filter((item) => {
      if (item.key !== needChangeItem.key) {
        return item;
      } else {
        item.helpful = !item.helpful;
        return item;
      }
    });

    setCommentDataSource([...newData]);
  };

  const defaultColumns: ColumnsType<commentDataSourceType> = [
    {
      title: '名字,点击获取邮箱',
      dataIndex: 'name',
      width: '10%',
      render: (_, record: commentDataSourceType) => {
        // console.log(record);
        return record.invoiceId === null || +record.invoiceId === 0 ? (
          <div
            onClick={() => {
              if (record.invoiceId === null || +record.invoiceId === 0) {
                message.error(
                  { content: '这是个虚假的评论', style: { marginTop: '30vh' } },
                  4,
                );
                return;
              }
            }}
          >
            {record.name}
          </div>
        ) : (
          <div
            onClick={() => {
              request('/admin/secure/getCustomerEmailByInvoiceId', {
                params: {
                  invoiceId: record.invoiceId,
                },
              }).then((data) => {
                if (data.result) {
                  message.info(
                    {
                      content: `该用户的邮箱为：${data.data.email}`,
                      style: { marginTop: '30vh' },
                    },
                    10,
                  );
                }
              });
            }}
          >
            {record.name}
          </div>
        );
      },
    },
    {
      title: '评分',
      dataIndex: 'mark',
      width: '5%',
    },
    {
      title: '尺码标准',
      dataIndex: 'accurateFit',
      width: '5%',
    },
    {
      title: '品质',
      dataIndex: 'quality',
      width: '5%',
    },
    {
      title: '性价比',
      dataIndex: 'affordability',
      width: '5%',
    },
    {
      title: '样式',
      dataIndex: 'style',
      width: '5%',
    },
    {
      title: '产品链接',
      dataIndex: 'productId',
      width: '8%',
      render: (_, record: commentDataSourceType) => {
        // console.log(record);
        return (
          <a
            target="_blank"
            href={`${window.location.protocol}//${window.location.hostname}/Mainproduct/${record.productId}`}
            rel="noreferrer"
          >
            {record.productId}
          </a>
        );
      },
    },
    {
      title: '内容',
      dataIndex: 'content',
      width: '25%',
    },

    {
      title: '购买颜色',
      dataIndex: 'color',
      width: '8%',
    },
    {
      title: '购买尺码',
      dataIndex: 'size',
      width: '8%',
    },
    {
      title: '图片',
      dataIndex: 'imgSrcList',
      width: '20%',
      render: (_, record: commentDataSourceType) => {
        console.log(record);
        let imgSrcListData = record.imgSrcList
          ?.split(';;')
          .filter((item) => item !== '');
        console.log(imgSrcListData);
        if (imgSrcListData === undefined || imgSrcListData === null) {
          return null;
        }
        return imgSrcListData.map((item: string, index: number) => {
          return (
            <Image
              style={{ display: 'inline-block' }}
              width={60}
              height={60}
              src={item}
              key={index}
            />
          );
        });
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '12%',
      render: (_, record: commentDataSourceType) => {
        // console.log(record);
        return <div>{formatTimeWithHours(record.createTime)}</div>;
      },
    },
    {
      title: '审核人员',
      dataIndex: 'author',
      width: '8%',
      render: (_, record: commentDataSourceType) => {
        // console.log(record);
        return (
          <div>
            {record.author === 'system' ? (
              <div>未审核</div>
            ) : record.author ? (
              <div>{record.author}审核</div>
            ) : (
              <div></div>
            )}
          </div>
        );
      },
      sorter: (a: any, b: any) => {
        return a.author - b.author;
      },
    },
    {
      title: '订单编号0为假订单',
      dataIndex: 'invoiceId',
      width: '10%',
    },
    {
      title: '是否helpful',
      dataIndex: 'helpful',
      width: '10%',
      render: (_, record: { key: React.Key; helpful: boolean }) => (
        <>
          <div>该条评论是否helpful</div>
          <Switch
            checkedChildren="是"
            unCheckedChildren="否"
            checked={record.helpful}
            onChange={() => handleChangeHelpful(record)}
          />
        </>
      ),
      sorter: (a: any, b: any) => {
        return a.active - b.active;
      },
    },
    {
      title: '操作评论',
      dataIndex: 'operation',
      width: '10%',
      render: (_, record: { key: React.Key; active: boolean }) => (
        <>
          <div>是否开启该条评论</div>
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            checked={record.active}
            onChange={() => handleChange(record)}
          />
        </>
      ),
      sorter: (a: any, b: any) => {
        return a.active - b.active;
      },
    },
    {
      title: '审核状态',
      dataIndex: 'audit',
      width: '10%',
      render: (_, record: { audit: boolean }) => (
        <div>{record.audit ? "已审核" : "未审核"}</div>
      ),
      sorter: (a: any, b: any) => {
        return a.audit - b.audit;
      },
    },
  ];

  return (
    <div style={{ width: 1500, margin: '0 auto' }}>
      <h3>修改评论是否展示在前台</h3>
      <div>
        备注：未审核但是展示的一般是刚开始的虚假信息，后期数据库维护了就没了
      </div>
      <CommentManagementHeader
        afterUpdateTime={afterUpdateTime}
        setAfterUpdateTime={setAfterUpdateTime}
        beforeUpdateTime={beforeUpdateTime}
        setBeforeUpdateTime={setBeforeUpdateTime}
        commentStatus={commentStatus}
        setCommentStatus={setCommentStatus}
        setPage={setPage}
        setPageSize={setPageSize}
        page={page}
        pageSize={pageSize}
        setCommentDataSource={setCommentDataSource}
        commentDataSource={commentDataSource}
        setTotal={setTotal}
        auditStatus={auditStatus}
        setAuditStatus={setAuditStatus}
      />
      {commentDataSource.length > 0 ? (
        <Table
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={commentDataSource}
          tableLayout="fixed"
          pagination={{
            total: total,
            current: page,
            pageSize,
            pageSizeOptions: ['40', '100', '200', '500'],
            position: ['topRight'],
            onChange(page1, pageSize1) {
              if (pageSize1 !== pageSize) {
                setPage(1);
                setPageSize(pageSize1);
              } else {
                setPage(page1);
              }
            },
          }}
          columns={defaultColumns}
        />
      ) : null}
    </div>
  );
};

export default App;

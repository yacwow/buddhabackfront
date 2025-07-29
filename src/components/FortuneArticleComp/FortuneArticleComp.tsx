import { formatTimeFromStr } from '@/utils/format';
import { NavLink } from '@umijs/max';
import { request } from '@umijs/max';
import { ColumnsType } from 'antd/es/table';
import { Image, Switch, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './FortuneArticleComp.less';
import { TableRowSelection } from 'antd/es/table/interface';
import styles1 from './AddFortuneArticleComp/AddFortuneArticleComp.less';

interface DataType {
  key: React.Key;
  id: string;
  imgSrc: string;
  introduction: string;
  author: string;
  createDate: string;
  updateDate: string;
  rank: number;
  month: number | null;
  year: number | null;
  masked: boolean | null;
  active: boolean;
}
const columns: ColumnsType<DataType> = [
  {
    title: 'ID',
    dataIndex: 'id',
    sorter: (a, b) => +a.id - +b.id,
  },
  {
    title: '缩略图',
    width: 100,
    render: (imgSrc: string, record) => {
      return record.masked ? <div className={styles1.showMask}
        style={{
          '--start-year-angle': `${(record.year === null ? 1900 : record.year - 1900) % 12 * 30}deg`,
          '--start-month-angle': `${(record.month === null ? 0 : record.month - 1) % 12 * 30}deg`,
          backgroundImage: `url(${record.imgSrc})`,
          width: 200, height: 200,
          backgroundSize: 'cover',
        } as React.CSSProperties}></ div> : <Image src={imgSrc} style={{ width: 100 }}></Image>;
    },
    dataIndex: 'imgSrc',
  },
  {
    title: '文章简介',
    render: (introduction: string, onelineData: any) => {
      // console.log(onelineData);
      return (
        <NavLink
          to={`/backend/addfortuneArticle/${onelineData.id}`}
          style={{ display: 'inline-block', width: 60 }}
        >
          {introduction}
        </NavLink>
      );
    },
    dataIndex: 'introduction',
  },

  {
    title: '操作员',
    dataIndex: 'author',
  },

  {
    title: '入库时间',
    render: (createDate: string) => {
      return <div style={{ width: 60 }}>{formatTimeFromStr(createDate)}</div>;
    },
    dataIndex: 'createDate',
    sorter: (a, b) => {
      let stringA = a.createDate.toUpperCase() || '0'; // ignore upper and lowercase
      let stringB = b.createDate.toUpperCase() || '0'; // ignore upper and lowercase
      if (stringA < stringB) {
        return -1;
      }
      if (stringA > stringB) {
        return 1;
      }
      return 0;
    },
  },
  {
    title: '更新时间',
    render: (updateDate: string) => {
      return <div style={{ width: 60 }}>{updateDate ? formatTimeFromStr(updateDate) : null}</div>;
    },
    dataIndex: 'updateDate',
    sorter: (a, b) => {
      let stringA = a.updateDate.toUpperCase() || '0'; // ignore upper and lowercase
      let stringB = b.updateDate.toUpperCase() || '0'; // ignore upper and lowercase
      if (stringA < stringB) {
        return -1;
      }
      if (stringA > stringB) {
        return 1;
      }
      return 0;
    },
  },
  {
    title: '展示顺序',
    dataIndex: 'rank',
    sorter: (a, b) => +a.rank - +b.rank,
  },
  {
    title: '年',
    dataIndex: 'year',
    sorter: (a, b) => (a.year ?? 0) - (b.year ?? 0),
  },
  {
    title: '月',
    dataIndex: 'month',
    sorter: (a, b) => (a.month ?? 0) - (b.month ?? 0),
  },
  {
    title: '是否遮罩',
    dataIndex: 'masked',
    render: (masked: boolean | null) => {
      return (
        <div style={{ width: 60 }}>
          <Switch
            checkedChildren="遮罩"
            unCheckedChildren="不遮罩"
            checked={masked ?? false}
          />
        </div>
      )
    },
    sorter: (a, b) => +(a.masked ?? 0) - +(b.masked ?? 0),
  },
  {
    title: '是否展示',
    dataIndex: 'active',
    render: (active: boolean) => {
      return (
        <div style={{ width: 60 }}>
          <Switch
            checkedChildren="展示"
            unCheckedChildren="不展示"
            checked={active}
          />
        </div>
      );
    },
    sorter: (a, b) => +a.active - +b.active,
  },
];
const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState();
  const [fortuneArticleList, setFortuneArticleList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  useEffect(() => {
    request('/admin/secure/showMyCollectionsInfo', {
      params: {
        page,
        pageSize,
      },
    }).then((data) => {
      if (data.result) {
        setTotal(data.data.count);
        // let articleList=data.data.articleList;
        setFortuneArticleList(data.data.articleList);
      }
    });
  }, [page, pageSize]);

  //页码变化
  const handelPageSizeChange = (page: number, pagesize: number) => {
    console.log(page, pagesize);
    setPageSize(pagesize);
    setPage(page);
    setSelectedRowKeys([]);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };
  return (
    <div className={styles.container}>
      <Table
        className="mainShowTable"
        pagination={{
          position: ['topRight'],
          pageSize: pageSize,
          pageSizeOptions: [40, 100, 200],
          showQuickJumper: true,
          onChange(page, pageSize) {
            handelPageSizeChange(page, pageSize);
          },
          total: total,
        }}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={fortuneArticleList}
      />
    </div>
  );
};
export default App;

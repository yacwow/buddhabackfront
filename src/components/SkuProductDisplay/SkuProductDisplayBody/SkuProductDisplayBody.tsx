import React from 'react';
import { Image, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import { formatTimeFromStr } from '@/utils/format';
import { useModel } from '@umijs/max';
import { NavLink } from '@umijs/max';
import './SkuProductDisplayBody.css';

interface DataType {
  key: React.Key;
  productId: string;
  bigImgSrc: string;
  productDescription: string;
  href: string;
  generalHref: string;
  firstLevelCategory: string;
  secondLevelCategory: string;
  thirdLevelCategory: string;
  newPrice: number;
  purchasePrice: number;
  soldNum: number;
  lastSoldTime: string;
  stockStatus: string;
  stock: number;
  posterName: string;
  editStatus: string;
  postedTime: string;
}
const enToCh = {
  available: '在库',
  notavailable: '不在库',
  nostock: '无库存',
  notpublished: '未发布',
};

const columns: ColumnsType<DataType> = [
  {
    title: 'ID',
    dataIndex: 'productId',
    sorter: (a, b) => +a.productId - +b.productId,
  },
  {
    title: '缩略图',
    width: 100,
    render: (bigImgSrc: string) => {
      return <Image src={bigImgSrc} style={{ width: 100 }}></Image>;
    },
    dataIndex: 'bigImgSrc',
  },
  {
    title: '产品介绍',
    render: (productDescription: string, onelineData: any) => {
      // console.log(onelineData);
      return (
        <NavLink
          to={`/backend/product/productContext/${onelineData.productId}`}
          rel="noreferrer"
          style={{ display: 'inline-block', width: 60 }}
        >
          {productDescription}
        </NavLink>
      );
    },
    dataIndex: 'productDescription',
  },
  {
    title: '固定链接',
    render: (generalHref: string, onelineData: any) => {
      // console.log(onelineData);
      return (
        <div style={{ width: 60 }}>
          <a
            href={
              `${window.location.protocol}//${window.location.hostname}` +
              onelineData.generalHref
            }
            target="_blank"
            rel="noreferrer"
          >
            {generalHref}
          </a>
        </div>
      );
    },
    dataIndex: 'generalHref',
  },
  {
    title: '一级分类',
    dataIndex: 'firstLevelCategory',
  },
  {
    title: '二级分类',
    dataIndex: 'secondLevelCategory',
  },
  {
    title: '价格',
    dataIndex: 'newPrice',
    sorter: (a, b) => a.newPrice - b.newPrice,
  },
  {
    title: '采集价',
    dataIndex: 'purchasePrice',
    sorter: (a, b) => a.purchasePrice - b.purchasePrice,
  },
  {
    title: '销量',
    dataIndex: 'soldNum',
    sorter: (a, b) => a.soldNum - b.soldNum,
  },
  {
    title: '最近一次出单',
    dataIndex: 'lastSoldTime',
  },
  {
    title: '库存状态',
    render: (stock: string) => {
      // console.log(onelineData);
      if (stock === 'available') {
        return (
          <div
            style={{
              width: 40,
              backgroundColor: 'green',
              color: 'white',
              textAlign: 'center',
            }}
          >
            {enToCh[stock]}
          </div>
        );
      } else if (stock === 'notavailable') {
        return (
          <div
            style={{
              width: 40,
              backgroundColor: 'red',
              color: 'white',
              textAlign: 'center',
            }}
          >
            {enToCh[stock]}
          </div>
        );
      } else if (stock === 'notpublished') {
        return (
          <div
            style={{
              width: 40,
              backgroundColor: 'red',
              color: 'white',
              textAlign: 'center',
            }}
          >
            {enToCh[stock]}
          </div>
        );
      } else if (stock === 'nostock') {
        return (
          <div
            style={{
              width: 40,
              backgroundColor: 'red',
              color: 'white',
              textAlign: 'center',
            }}
          >
            {enToCh[stock]}
          </div>
        );
      }
    },
    dataIndex: 'stockStatus',
  },
  {
    title: '库存',
    dataIndex: 'stock',
    sorter: (a, b) => a.stock - b.stock,
  },
  {
    title: '操作员',
    dataIndex: 'posterName',
  },
  {
    title: '编辑状态',
    render: (editStatus: string) => {
      return (
        <div
          style={{
            width: 60,
            overflow: 'hidden',
            textOverflow: ' ellipsis', //文本溢出显示省略号
            whiteSpace: 'nowrap',
          }}
        >
          {editStatus}
        </div>
      );
    },
    dataIndex: 'editStatus',
    sorter: (a, b) => {
      let stringA = a.editStatus.toUpperCase() || '0'; // ignore upper and lowercase
      let stringB = b.editStatus.toUpperCase() || '0'; // ignore upper and lowercase
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
    title: '入库时间',
    render: (postedTime: string) => {
      return <div style={{ width: 60 }}>{formatTimeFromStr(postedTime)}</div>;
    },
    dataIndex: 'postedTime',
    sorter: (a, b) => {
      let stringA = a.postedTime.toUpperCase() || '0'; // ignore upper and lowercase
      let stringB = b.postedTime.toUpperCase() || '0'; // ignore upper and lowercase
      if (stringA < stringB) {
        return -1;
      }
      if (stringA > stringB) {
        return 1;
      }
      return 0;
    },
  },
];

interface Props {
  tableData: any[];
}
const App: React.FC<Props> = (props) => {
  const { tableData } = props;
  const {
    setPage,
    page,
    pageSize,
    setPageSize,
    maxData,
    selectedRowKeys,
    setSelectedRowKeys,
  } = useModel('ProductDisplayHeaderData');
  const data: DataType[] = [];
  //data,别展开了，烦
  for (let i = 0; i < tableData.length; i++) {
    data.push({
      key: i,
      productId: tableData[i].productId,
      bigImgSrc: tableData[i].bigImgSrc,
      productDescription: tableData[i].productDescription,
      generalHref: tableData[i].href,
      href: `/backend/product/productContext/${tableData[i].productId}`,
      firstLevelCategory: tableData[i].firstLevelCategory,
      secondLevelCategory: tableData[i].secondLevelCategory,
      thirdLevelCategory: tableData[i].thirdLevelCategory,
      newPrice: tableData[i].newPrice,
      purchasePrice: tableData[i].purchasePrice,
      soldNum: tableData[i].soldNum,
      lastSoldTime: tableData[i].lastSoldTime,
      stockStatus: tableData[i].stockStatus,
      stock: tableData[i].stock,
      posterName: tableData[i].posterName,
      editStatus: tableData[i].editStatus,
      postedTime: tableData[i].postedTime,
    });
  }
  // const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  //页码变化
  const handelPageSizeChange = (page: number, pagesize: number) => {
    console.log(page, pagesize);
    setPageSize(pagesize);
    setPage(page);
    setSelectedRowKeys([]);
    history.replaceState(null, '', `?page=${page}`);
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
        current: page,
        total: maxData,
      }}
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data}
    />
  );
};

export default App;

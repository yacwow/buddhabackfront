import React, { useEffect, useState } from 'react';
import { Image, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import { formatTimeFromStr } from '@/utils/format';
import { useModel } from '@umijs/max';
import { request } from '@umijs/max';
import { NavLink } from '@umijs/max';

export interface DataType {
  key: React.Key;
  productId: string;
  bigImgSrc: string;
  stockStatus: string;
  productDescription: string;
  href: string;

  newPrice: number;
  lastOrderTime: string;
  count: number;
  countAfterPromotion: number;
  updateTime: string;
  categoryRankNum: number;
  index: number;
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
          target="_blank"
          rel="noreferrer"
        >
          {productDescription}
        </NavLink>
      );
    },
    dataIndex: 'productDescription',
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
              backgroundColor: 'gray',
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
      }
    },
    dataIndex: 'stockStatus',
  },
  // {
  //   title: '固定链接',
  //   render: (href: string, onelineData: any) => {
  //     // console.log(onelineData);
  //     return (
  //       <div style={{ width: 60 }}>
  //         <a
  //           href={'http://192.168.0.102:8001' + onelineData.href}
  //           target="_blank"
  //           rel="noreferrer"
  //         >
  //           {href}
  //         </a>
  //       </div>
  //     );
  //   },
  //   dataIndex: 'href',
  // },
  {
    title: '固定链接',
    render: (href: string, onelineData: any) => {
      // console.log(onelineData);
      return (
        <div style={{ width: 60 }}>
          <a
            href={
              `${window.location.protocol}//${window.location.hostname}` +
              onelineData.href
            }
            target="_blank"
            rel="noreferrer"
          >
            {href}
          </a>
        </div>
      );
    },
    dataIndex: 'href',
  },
  {
    title: '价格',
    dataIndex: 'newPrice',
    sorter: (a, b) => a.newPrice - b.newPrice,
  },
  {
    title: '最新出单时间',
    dataIndex: 'lastOrderTime',
    render: (lastOrderTime: string) => {
      if (lastOrderTime === null) return;
      return (
        <div style={{ width: 60 }}>{formatTimeFromStr(lastOrderTime)}</div>
      );
    },
  },
  {
    title: '总销量',
    dataIndex: 'count',
    sorter: (a, b) => a.count - b.count,
  },
  {
    title: '加入后销量',
    dataIndex: 'countAfterPromotion',
    sorter: (a, b) => a.countAfterPromotion - b.countAfterPromotion,
  },
  {
    title: '排序',
    dataIndex: 'index',
    sorter: (a, b) => a.index - b.index,
  },
  {
    title: '商品排序分数',
    dataIndex: 'categoryRankNum',
    sorter: (a, b) => a.categoryRankNum - b.categoryRankNum,
  },

  {
    title: '入库时间',
    render: (updateTime: string) => {
      return <div style={{ width: 60 }}>{formatTimeFromStr(updateTime)}</div>;
    },
    dataIndex: 'updateTime',
    sorter: (a, b) => {
      let stringA = a.updateTime.toUpperCase() || '0'; // ignore upper and lowercase
      let stringB = b.updateTime.toUpperCase() || '0'; // ignore upper and lowercase
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

const App: React.FC = () => {
  const {
    specialEventProductTableData,
    selectedRowKeys,
    setSelectedRowKeys,
    code,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    setTotal,
    setSpecialEventProductTableData,
    setCode,
  } = useModel('addSpecialEventProductData');
  const data: DataType[] = [];
  // //data,别展开了，烦
  for (let i = 0; i < specialEventProductTableData.length; i++) {
    data.push({
      key: i,
      productId: specialEventProductTableData[i].productId,
      bigImgSrc: specialEventProductTableData[i].bigImgSrc,
      stockStatus: specialEventProductTableData[i].stockStatus,
      productDescription: specialEventProductTableData[i].productDescription,
      href: specialEventProductTableData[i].href,
      newPrice: specialEventProductTableData[i].newPrice,
      lastOrderTime: specialEventProductTableData[i].lastOrderTime || null,
      count:
        specialEventProductTableData[i].countAfterPromotion +
        specialEventProductTableData[i].countBeforePromotion,
      countAfterPromotion: specialEventProductTableData[i].countBeforePromotion,
      updateTime: specialEventProductTableData[i].updateTime,
      categoryRankNum: specialEventProductTableData[i].categoryRankNum,
      index: i + 1,
    });
  }
  // const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  //页码变化
  const handelPageSizeChange = (page: number, pageSize: number) => {
    console.log(page, pageSize);
    setPageSize(pageSize);
    setPage(page);
    setSelectedRowKeys([]);
    request('/admin/secure/requestSpecialEventTableInfo', {
      params: {
        code,
        page,
        pageSize,
      },
    }).then((data) => {
      console.log(data);
      setTotal(data.data.count);
      setSpecialEventProductTableData(data.data.specialEventProductList);
    });
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
  useEffect(() => {
    let pathArr = location.pathname.split('/');
    if (pathArr.length >= 4) {
      setCode(pathArr[3]);
    }
  }, []);

  return (
    <Table
      pagination={{
        position: ['topRight'],
        pageSize: pageSize,
        pageSizeOptions: [40, 100, 200, 400, 500],
        onChange(page, pageSize) {
          handelPageSizeChange(page, pageSize);
        },
        total: total,
      }}
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data}
    />
  );
};

export default App;

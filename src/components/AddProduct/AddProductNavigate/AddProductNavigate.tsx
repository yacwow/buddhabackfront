import React, { useEffect } from 'react';
import { MenuProps, Tabs, TabsProps } from 'antd';
import { history } from '@umijs/max';
import { useModel } from '@umijs/max';
import ProductContext from '../ProductContext';
import ProductCategory from '../ProductCategory';
import ProductSize from '../ProductSize';
import ProductDescription from '../ProductDescription';
import Comment from '../Comment';
import ProductSourceAndStockStatus from '../ProductSourceAndStockStatus';

const items: TabsProps['items'] = [
  {
    label: <div style={{ width: 100, textAlign: 'center' }}>信息</div>,
    children: <ProductContext />,
    key: 'productContext',
  },
  {
    label: <div style={{ width: 100, textAlign: 'center' }}>分类</div>,
    children: <ProductCategory />,
    key: 'productCategory',
  },
  {
    label: <div style={{ width: 100, textAlign: 'center' }}>尺码表</div>,
    children: <ProductSize />,
    key: 'productSize',
  },
  {
    label: <div style={{ width: 100, textAlign: 'center' }}>产品特征</div>,
    children: <ProductDescription />,
    key: 'productDescription',
  },
  {
    label: <div style={{ width: 100, textAlign: 'center' }}>评论</div>,
    key: 'comment',
    children: <Comment />,
  },
  {
    label: (
      <div style={{ width: 100, textAlign: 'center' }}>商品来源与库存</div>
    ),
    key: 'productSourceAndStockStatus',
    children: <ProductSourceAndStockStatus />,
  },
];

const App: React.FC = () => {
  const { current, setCurrent } = useModel('globalState');

  const onChange = (key: string) => {
    console.log(key);
  };
  useEffect(() => {
    let arr = location.pathname.split('/');
    if (arr.length >= 4) {
      setCurrent(arr[3]);
    }
  }, []);
  return (
    // <Menu
    //   style={{ width: 1200, margin: '0 auto', border: '1px solid black' }}
    //   onClick={onClick}
    //   selectedKeys={[current]}
    //   mode="horizontal"
    //   items={items}
    // />
    <Tabs
      style={{ width: 1300, margin: '0 auto', border: '1px solid black' }}
      defaultActiveKey="1"
      items={items}
      onChange={onChange}
    />
  );
};

export default App;

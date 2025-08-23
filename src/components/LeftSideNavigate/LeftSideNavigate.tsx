import React from 'react';
import {
  AppstoreOutlined,
  MailOutlined,
  BankOutlined,
  LogoutOutlined,
  DatabaseOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, MenuProps, Switch } from 'antd';
import { Menu } from 'antd';
import { NavLink } from '@umijs/max';
import { useModel } from '@umijs/max';
import { history } from '@umijs/max';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

// submenu keys of first level
// const rootSubmenuKeys = ['sub1', 'sub2', 'sub3', 'sub4', 'sub6'];

const App: React.FC = () => {
  const {
    theme,
    setTheme,
    selectedKey,
    setSelectedKey,
    level,
    openKeys,
    setOpenKeys,
  } = useModel('global');


  const handleClick = () => {
    localStorage.removeItem('token');
    history.push('/backend/login');
  };
  const items: MenuItem[] = [
    getItem('商品', 'sub1', <MailOutlined />, [
      getItem(
        <NavLink to="/backend/showAllProduct">{'商品总览'}</NavLink>,
        '1',
      ),
      //谨慎替换为navlink，换了会因为umijs的问题，导致/productcontext/${productId}跳转到/productcontext的时候不会重新刷新，会保留原有产品的数据
      getItem(
        <NavLink to="/backend/product/productContext">{'添加商品'}</NavLink>,
        '2',
      ),
      getItem(<NavLink to="/backend/category">{'商品分类总览'}</NavLink>, '3'),
      getItem(
        <NavLink to="/backend/category/addCategory">
          {'产品分类展示图'}
        </NavLink>,
        '4',
      ),
      level === 'superadmin'
        ? getItem(
          <NavLink to="/backend/productSort/categoryType/">
            {'商品分类排序'}
          </NavLink>,
          '5',
        )
        : null,
    ]),
    getItem('勾选类', 'sub2', <AppstoreOutlined />, [
      getItem(
        <NavLink to="/backend/specialEventProduct">{'勾选类总览'}</NavLink>,
        '6',
      ),
      level === 'superadmin'
        ? getItem(
          <NavLink to="/backend/addSpecialEvent">{'添加新的勾选类'}</NavLink>,
          '7',
        )
        : null,
    ]),
    level === 'superadmin'
      ? getItem('网站数据设置', 'sub6', <DatabaseOutlined />, [
        getItem('页面设置相关', 'sub10', null, [
          getItem(
            <NavLink to="/backend/webDataSet/frequestSearchParams">
              {'限时，搜索相关'}
            </NavLink>,
            '14',
          ),
          getItem(
            <NavLink to="/backend/webDataSet/homePageData">
              {'主页数据设置相关'}
            </NavLink>,
            '35',
          ),
          getItem(
            <NavLink to="/backend/webDataSet/categorySpecialEvent">
              {'主页category的勾选以及其他'}
            </NavLink>,
            '12',
          ),
          getItem(
            <NavLink to="/backend/webDataSet/structurePicture">
              {'主页顶部banner'}
            </NavLink>,
            '28',
          ),
          getItem(
            <NavLink to="/backend/webDataSet/showCategoryInHomePageBottom">
              {'主页底部分类展示的排序'}
            </NavLink>,
            '40',
          ),
          getItem(
            <NavLink to="/backend/webDataSet/cartMayLike">
              {'购物车底部mayLike类'}
            </NavLink>,
            '42',
          ),
        ]),

        getItem(
          <NavLink to="/backend/commentManagement">{'评论管理'}</NavLink>,
          '26',
        ),
        getItem('运势预测文章相关', 'sub11', null, [
          getItem(
            <NavLink to="/backend/fortuneArticle">
              {'运势预测文章总览'}
            </NavLink>,
            '43',
          ),
          getItem(
            <a href="/backend/addfortuneArticle" >
              {'添加运势预测文章'}
            </a>,
            '44',
          ),
          getItem(
            <NavLink to="/backend/insideBlogArticle">
              {'展示全部内部博客'}
            </NavLink>,
            '83',
          ),
          getItem(
            <a href="/backend/addInsideBlogArticle" >
              {'添加内部博客'}
            </a>,
            '84',
          ),
        ]),
      ])
      : null,
    getItem('销售', 'sub3', <BankOutlined />, [
      getItem(
        <NavLink to="/backend/invoiceAnalyze">{'销售分析'}</NavLink>,
        '8',
      ),
      getItem(
        <NavLink to="/backend/deliveryPage">{'快递管理相关'}</NavLink>,
        '32',
      ),
      // getItem('有问题订单', 'sub11', null, [
      //   getItem(
      //     <NavLink to="/backend/webDataSet/badInvoiceSet">
      //       {'未审核订单'}
      //     </NavLink>,
      //     '15',
      //   ),
      //   getItem(
      //     <NavLink to="/backend/webDataSet/auditedBadInvoiceSet">
      //       {'已审核的有问题的订单'}
      //     </NavLink>,
      //     '16',
      //   ),
      // ]),
      getItem('图表分析', '9'),
    ]),
    level === 'superadmin'
      ? getItem('超级管理员操作', 'sub4', <SettingOutlined />, [
        getItem('管理员展示', 'sub9', null, [
          getItem(
            <NavLink to="/backend/showAdminUser">{'查看所有管理员'}</NavLink>,
            '25',
          ),
          getItem(
            <NavLink to="/backend/addAdminAccount">{'添加管理员'}</NavLink>,
            '17',
          ),
          getItem(
            <NavLink to="/backend/changeAdminAccountActivity">
              {'禁用/启用管理员'}
            </NavLink>,
            '18',
          ),
        ]),
        getItem('用户相关', 'sub7', null, [
          getItem(
            <NavLink to="/backend/checkUserEmailInfo">
              {'回复用户邮件'}
            </NavLink>,
            '19',
          ),
          getItem(
            <NavLink to="/backend/showAllCoupon">
              {'发送出去的折扣码展示'}
            </NavLink>,
            '22',
          ),
          getItem(
            <NavLink to="/backend/grantNewCoupon">
              {'给用户发折扣码'}
            </NavLink>,
            '21',
          ),
          getItem(
            <NavLink to="/backend/customerSalesHistoryByCode/">
              {'指定code销售记录'}
            </NavLink>,
            '51',
          ),
          getItem(
            <NavLink to="/backend/modifyUser">{'修改用户地址信息'}</NavLink>,
            '23',
          ),
          getItem(
            <NavLink to="/backend/changeUserActive">{'取消订阅'}</NavLink>,
            '24',
          ),
          getItem(
            <NavLink to="/backend/sendPromotionEmail">{'群发推广邮件'}</NavLink>,
            '34',
          ),
        ]),
        getItem(
          <NavLink to="/backend/emailManagement">{'邮件模板管理'}</NavLink>,
          '29',
        ),
        getItem(
          <NavLink to="/backend/redisFlush">
            {<span style={{ color: '#f40' }}>{'危险，慎点'}</span>}
          </NavLink>,
          '20',
        ),
      ])
      : null,
    getItem(
      <NavLink to="/backend/changeAdminAccountEmail">改变管理员信息</NavLink>,
      'sub8',
      <UserOutlined />,
    ),
    getItem(
      <Button type="primary" onClick={handleClick}>
        {'登出'}
      </Button>,
      'sub5',
      <LogoutOutlined />,
    ),
  ];
  //   const [openKeys, setOpenKeys] = useState(['sub1']);

  //   const [theme, setTheme] = useState<MenuTheme>('light');
  const changeTheme = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };
  //   const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
  //     const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
  //     if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
  //       setOpenKeys(keys);
  //     } else {
  //       setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  //     }
  //   };

  return (
    <div style={{ position: 'relative' }}>
      <Menu
        defaultOpenKeys={openKeys}
        theme={theme}
        mode="inline"
        selectedKeys={selectedKey}
        onSelect={(e: any) => {
          console.log(e.selectedKeys);
          setSelectedKey(e.selectedKeys);
        }}
        openKeys={openKeys}
        onOpenChange={(openKeys: string[]) => {
          console.log(openKeys);
          setOpenKeys(openKeys);
        }}
        style={{ width: 256, minHeight: '1400px', height: '100%' }}
        items={items}
      />
      <Switch
        checked={theme === 'dark'}
        onChange={changeTheme}
        checkedChildren="Dark"
        unCheckedChildren="Light"
        style={{ position: 'absolute', left: 0, bottom: 100 }}
      />
    </div>
  );
};

export default App;

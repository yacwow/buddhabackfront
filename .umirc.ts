import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  dva: {
    // immer: true,
  },
  https: {},
  access: {},
  clientLoader: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '',
  },
  jsMinifier: 'esbuild',
  jsMinifierOptions: {
    drop: ['console', 'debugger'],
  },
  // plugins: ['@/plungin.js'],
  proxy: {
    '/admin': {
      target: 'http://localhost:666/',
      changeOrigin: true,
    },
  },
  links: [{ rel: 'icon', href: '/img/myFavicon.webp' }],
  routes: [
    {
      name: '添加勾选分类',
      path: '/backend/addSpecialEvent',
      component: './AddSpecialEvent',
    },
    {
      name: '换算比例',
      path: '/backend/ratioCurrency',
      component: './RatioCurrencyComp',
    },
    {
      name: '添加管理员',
      path: '/backend/addAdminAccount',
      component: './CreateAdminAcccount',
    },
    {
      name: '禁用/启用管理员',
      path: '/backend/changeAdminAccountActivity',
      component: './CreateAdminAcccount/ChangeAdminActivity',
    },
    {
      name: '改变管理员信息',
      path: '/backend/changeAdminAccountEmail',
      component: './CreateAdminAcccount/ChangeAdminEmail',
    },
    {
      name: '查看用户发过来的邮件',
      path: '/backend/checkUserEmailInfo',
      component: '@/pages/UserEmail',
    },
    {
      name: '超级危险的操作',
      path: '/backend/redisFlush',
      component: '@/pages/RedisFlushComp',
    },
    {
      name: '展示所有的折扣码',
      path: '/backend/showAllCoupon',
      component: '@/pages/ShowAllCoupon',
    },
    {
      name: '给用户发折扣码',
      path: '/backend/grantNewCoupon',
      component: '@/pages/GrantNewCoupon',
    },
    {
      name: '改变原有的折扣',
      path: '/backend/changeCoupon',
      component: '@/pages/ChangeCoupon',
    },
    {
      name: '限时，搜索相关',
      path: '/backend/webDataSet/frequestSearchParams',
      component: '@/pages/WebDataSet/FrequentSearchParamsSet',
    },
    {
      name: '运势预测文章总览',
      path: '/backend/fortuneArticle',
      component: './FortuneArticle',
    },
    {
      name: '添加运势预测文章',
      path: '/backend/addfortuneArticle/*',
      component: './FortuneArticle/AddFortuneArticle',
    },
      {
      name: '添加/更新内部博客',
      path: '/backend/addInsideBlogArticle/*',
      component: './InsideBlog/AddInsideBlog',
    },
          {
      name: '展示全部内部博客',
      path: '/backend/insideBlogArticle',
      component: './InsideBlog',
    },
    {
      name: '指定code销售记录',
      path: '/backend/customerSalesHistoryByCode/*',
      component: './CustomerSalesByCode',
    },
    {
      name: '产品分类',
      path: '/backend/category',
      routes: [
        { path: '/backend/category', component: '@/pages/Category' },
        {
          path: '/backend/category/addCategory/*',
          component: '@/pages/Category/AddCategory',
        },
      ],
    },
    {
      name: '添加/修改勾选位商品',
      path: '/backend/editSpecialEventProduct/:id',
      component: './EditSpecialEventProduct',
    },
    {
      name: '欢迎页面',
      path: '/backend/home',
      component: './Home',
    },
    {
      name: '订单分析',
      path: '/backend/invoiceAnalyze',
      component: './InvoiceAnalyze',
    },
    {
      name: '订单分析',
      path: '/backend/salesAnalyze',
      component: './SalesAnalyze',
    },
    {
      name: '单张订单',
      path: '/backend/invoice/:id',
      component: './SingleInvoiceSet',
    },
    {
      name: '用户使用个人优惠码情况',
      path: '/backend/getPersonalCouponUsage/:id/:id',
      component: './PersonalCouponUsageComp',
    },
    {
      name: '快递订单展示',
      path: '/backend/deliveryPage',
      component: './DeliveryPage',
    },
    {
      name: '单张快递订单',
      path: '/backend/deliverySingleInvoicePage/:id',
      component: './DeliverySingleInvoicePage',
    },
    {
      name: '登录',
      path: '/backend/login',
      component: './Login',
    },
    {
      name: '产品',
      path: '/backend/product',
      routes: [
        {
          name: '添加/修改产品具体信息',
          path: '/backend/product/productContext/*',
          component: '@/pages/Product',
        },
        {
          path: '/backend/product/productCategory/*',
          component: '@/pages/Product/ProductCategory',
        },
        {
          path: '/backend/product/productSize/*',
          component: '@/pages/Product/ProductSize',
        },
        {
          path: '/backend/product/productDescription/*',
          component: '@/pages/Product/ProductDescription',
        },
        {
          path: '/backend/product/comment/*',
          component: '@/pages/Product/ProductComment',
        },
        {
          path: '/backend/product/productSourceAndStockStatus/*',
          component: '@/pages/Product/ProductSourceAndStock',
        },
      ],
    },
    {
      name: '分类产品排序',
      path: '/backend/productSort/categoryType/*',
      component: '@/pages/ProductSort',
    },

    {
      name: '展示所有的产品',
      path: '/backend/showAllProduct',
      component: './ShowAllProduct',
    },

    {
      name: '勾选位产品',
      path: '/backend/specialEventProduct',
      component: './SpecialEventProduct',
    },

    {
      name: '产品排序',
      path: '/backend/productSort/eventType/:id',
      component: '@/pages/SpecialEventProductSort',
    },

    {
      name: '主页顶部banner',
      path: '/backend/webDataSet/structurePicture',
      component: '@/pages/WebDataSet/StructurePictureSet',
    },
    {
      name: '购物车底部mayLike类',
      path: '/backend/webDataSet/cartMayLike',
      component: '@/pages/WebDataSet/CartMayLike',
    },
    {
      name: '主页数据设置相关',
      path: '/backend/webDataSet/homePageData',
      component: '@/pages/WebDataSet/HomePageDataSet',
    },
    // {
    //   name: '有问题的订单',
    //   path: '/backend/webDataSet/badInvoiceSet',
    //   component: '@/pages/WebDataSet/BadInvoiceSet',
    // },

    {
      name: '主页底部分类展示的排序',
      path: '/backend/webDataSet/showCategoryInHomePageBottom',
      component: '@/pages/WebDataSet/ShowCategoryInHomePageBottom',
    },
    // {
    //   name: '已审核的有问题的订单',
    //   path: '/backend/webDataSet/auditedBadInvoiceSet',
    //   component: '@/pages/WebDataSet/AuditedBadInvoiceSet',
    // },
    {
      name: '主页category的勾选设置及其它',
      path: '/backend/webDataSet/categorySpecialEvent',
      component: '@/pages/WebDataSet/CategorySpecialEvent',
    },

    {
      name: '用户状态展示',
      path: '/backend/modifyUser',
      component: '@/pages/ModifyUser',
    },
    {
      name: '改变用户活跃',
      path: '/backend/changeUserActive',
      component: '@/pages/ModifyUser/ChangeUserActive',
    },
    {
      name: '查看所有管理员',
      path: '/backend/showAdminUser',
      component: '@/pages/ShowAdminUserInfo',
    },
    {
      name: '评论管理',
      path: '/backend/commentManagement',
      component: '@/pages/CommentManagementPage',
    },
    {
      name: '邮件内容管理',
      path: '/backend/emailManagement',
      component: './EmailManagementPage',
    },
    {
      name: '修改用户信息',
      path: '/backend/modifySingleUserDetail',
      component: './ModifyUser/ModifySingleUserDetailPage',
    },
    {
      name: '群发推广邮件',
      path: '/backend/sendPromotionEmail',
      component: '@/pages/ModifyUser/SendSubscriptionEmail',
    },
    {
      name: 'test',
      path: '/backend/test',
      component: './Test',
    },

    { path: '/backend/*', component: '@/pages/404' },
  ],
  npmClient: 'yarn',
});

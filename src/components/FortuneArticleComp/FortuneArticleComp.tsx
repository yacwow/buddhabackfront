import { formatTimeFromStr } from '@/utils/format';
import { NavLink } from '@umijs/max';
import { request } from '@umijs/max';
import { ColumnsType } from 'antd/es/table';
import { Image, Modal, Spin, Switch, Table } from 'antd';
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
  homePageShowed: boolean | null;
}

const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState();
  const [fortuneArticleList, setFortuneArticleList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false)
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


  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const [error, setError] = useState("")
  //下面几个是需要上传的内容
  const [fortuneId, setFortuneId] = useState("")
  const [type, setType] = useState("")
  const [active, setActive] = useState<boolean>()
  //这个是如果修改首页失败的控制变量
  const [homePageActive, setHomePageActive] = useState(false);

  const handleOk = () => {
    if (homePageActive) {
      setIsModalOpen(false)
      setHomePageActive(false);
      return;
    }
    setLoading(true);
    request("/admin/secure/changeFortuneActive", { params: { type, page, pageSize, active, id: fortuneId } }).then(data => {
      if (data.result) {
        setLoading(false);
        setTotal(data.data.count);
        // let articleList=data.data.articleList;
        setFortuneArticleList(data.data.articleList);
        setIsModalOpen(false);
      }
    })
    setTimeout(() => {
      setLoading(prev => {
        if (prev) return false;
        return prev;
      });
      setIsModalOpen(false);
    }, 5000);

  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  const handleSwitchChange = (type: string, active: boolean, id: string, month: number | null, year: number | null, showed: boolean, homePageShowed: boolean | null) => {
    console.log(active, type, homePageShowed)
    //判断现在的日期，同时判断是否展示

    if (type === "fortuneActive" && active && month !== null && year !== null) {
      // 当前时间
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1; // getMonth 返回 0-11，所以要 +1

      // 允许的最大年月 = 当前年月 + 1 个月
      let allowedYear = currentYear;
      let allowedMonth = currentMonth + 1;
      if (allowedMonth > 12) {
        allowedMonth = 1;
        allowedYear += 1;
      }

      // 判断是否超过允许的年月
      if (year > allowedYear || (year === allowedYear && month > allowedMonth)) {
        setError(`注意：展示的是 ${allowedYear} 年 ${allowedMonth} 月，这个月份在当前月之后两个月了。确定需要修改，则点击确认，否则取消`)
        setActive(active);
        setType(type)
        setFortuneId(id);
        showModal();
        return;
      }
    }


    if (type === "homePageShowed" && active && !showed) {
      setError(`不能展示一个在fortune主题页面都不展示的文章，请先勾选展示选项`)
      showModal();
      setHomePageActive(true)
      return;
    }
    setLoading(true);
    request("/admin/secure/changeFortuneActive", { params: { type, page, pageSize, active, id } }).then(data => {
      if (data.result) {
        setLoading(false);
        setTotal(data.data.count);
        // let articleList=data.data.articleList;
        setFortuneArticleList(data.data.articleList);
      }
    })
    setTimeout(() => {
      setLoading(prev => {
        if (prev) return false;
        return prev;
      });
    }, 5000);
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
            {masked ? <span>{"遮罩"}</span> :
              <span>{"不遮罩"}</span>}
          </div>
        )
      },
      sorter: (a, b) => +(a.masked ?? 0) - +(b.masked ?? 0),
    },
    {
      title: '是否展示',
      dataIndex: 'active',
      render: (active: boolean, oneLineData) => {
        return (
          <div style={{ width: 60 }}>
            <Switch
              checkedChildren="展示"
              unCheckedChildren="不展示"
              checked={active}
              onChange={(e) => {
                handleSwitchChange("fortuneActive", e, oneLineData.id, oneLineData.month, oneLineData.year, oneLineData.active, oneLineData.homePageShowed)
              }}
            />
          </div>
        );
      },
      sorter: (a, b) => +a.active - +b.active,
    },
    {
      title: '首页?',
      dataIndex: 'homePageShowed',
      render: (homePageShowed: boolean, oneLineData) => {
        return (
          <div style={{ width: 60 }}>
            <Switch
              checkedChildren="展示"
              unCheckedChildren="不展示"
              checked={homePageShowed}
              onChange={(e) => {
                handleSwitchChange("homePageShowed", e, oneLineData.id, oneLineData.month, oneLineData.year, oneLineData.active, oneLineData.homePageShowed)
              }}
            />
          </div>
        );
      },
      sorter: (a, b) => +(a.homePageShowed ?? 0) - +(b.homePageShowed ?? 0),
    },
  ];
  return (
    <div className={styles.container} style={{ position: "relative", height: "100%" }}>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>{error}</p>
      </Modal>
      {loading ? <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}>
        <div style={{ height: "100%", display: "flex", justifyContent: 'center', alignItems: "center" }}>
          <Spin size='large' />
        </div>
      </div> : <Table
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
      />}
    </div>
  );
};
export default App;

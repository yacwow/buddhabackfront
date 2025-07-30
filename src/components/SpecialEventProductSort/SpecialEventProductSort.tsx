import { useModel } from '@umijs/max';
import React, { useState } from 'react';
import styles from '@/components/ProductSort/ProductSort.less';
import {
  Button,
  Input,
  message,
  Modal,
  Pagination,
  Radio,
  RadioChangeEvent,
} from 'antd';
import $ from 'jquery';
import { insertSomeProduct } from '@/utils/findOutExist';
import { request } from '@umijs/max';
import ProductSortBody from '../ProductSort/ProductSortBody';
import SpecialEventProductSortHeader from './SpecialEventProductSortHeader';
// 列数选择里面的框
const options = [
  { label: '二行', value: 2 },
  { label: '四行', value: 4 },
];
const getQueryCategory = () => {
  let path = location.pathname;
  let arr = path.split('/');
  let secondCategory = '';
  let firstCategory = '';
  if (arr.length === 5) {
    firstCategory = arr[4];
  } else if (arr.length === 6) {
    firstCategory = arr[4];
    secondCategory = arr[5];
  }
  return {
    firstCategory,
    secondCategory,
  };
};

// @ts-nocheck
const App: React.FC = () => {
  const {
    tableData,
    setTableData,

    dataSize,
    setSelectedData,
    selectedData,
    setDataSize,
  } = useModel('productSortData222');
  // 批量插入 获取的id
  const [productListData, setProductListData] = useState<any>([]);
  const [productListIndex, setProductListIndex] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDifferentPageOpen, setIsModalDifferentPageOpen] =
    useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRowSelectModalOpen, setIsRowSelectModalOpen] = useState(false);
  const [isCacheModalOpen, setIsCacheModalOpen] = useState(false);
  const [value1, setValue1] = useState(4); //每一行列数选择
  const [line, setLine] = useState(1); //行
  const [row, setRow] = useState(1); //列
  const [index, setIndex] = useState<number>(1); //序号
  const [page, setPage] = useState(1); //modal里面的目标要去第几页
  const [current, setCurrent] = useState(1); //翻页的第几页
  const [differentPageInsert, setDifferentPageInsert] = useState('');
  const onChange1 = ({ target: { value } }: RadioChangeEvent) => {
    setValue1(value);
  };
  //重新请求数据，为了展示用，主要用于跨页插入和删除之后
  const refreshBodyData = (e: number) => {
    let path = location.pathname;
    let arr = path.split('/');
    request('/admin/getSpecialEventProductForSort', {
      params: {
        code: arr[4],
        page: e,
      },
    }).then((data) => {
      if (data.result) {
        let tempSelectedData = [];
        for (let i = 0; i < data.data.resList.length; i++) {
          tempSelectedData.push(false);
        }
        setSelectedData([...tempSelectedData]);
        setDataSize(data.data.count);
        setTableData(data.data.resList);
      }
    });
  };
  // 无论当前页或者是跨页的批量，都要先获取一些信息
  const getInfoBeforeBundleInsert = async () => {
    let productList = [];
    let indexList = [];

    for (let i = 0; i < selectedData.length; i++) {
      if (selectedData[i] === true) {
        productList.push(tableData[i].idproduct);
        indexList.push(i);
      }
    }
    await setProductListData([...productList]);
    await setProductListIndex([...indexList]);
  };
  // 当前页批量插入，也可能是一个
  const handleCurrentPageInsert = async () => {
    await getInfoBeforeBundleInsert();
    setIsModalOpen(true);
  };
  // 当前页批量插入的排序
  const changeTableData = () => {
    // 根据productlistdate改变tabledata，应该自动就会刷新了
    if (productListData.length === 0) {
      setIsModalOpen(false);
      message.info('需要先选中要排序的商品', 3);
    } else {
      let insertTarget;
      if (row && line) {
        insertTarget = (+line - 1) * 4 + +row;
        if (insertTarget < 0 || line < 0 || line > 15 || row < 0 || row > 4) {
          message.error('行列有问题', 3);
          return;
        }
      } else if (index) {
        if (index < 0 || index > 60) {
          message.error('序号', 3);
        }
        insertTarget = +index;
      }
      console.log(insertTarget);
      if (insertTarget === undefined) {
        message.error('需要提供具体的行列或者目标序列', 3);
        return;
      }

      setTableData([
        ...insertSomeProduct(
          tableData,
          productListIndex[0],
          productListData,
          insertTarget - 1,
        ),
      ]);
      let tempSelectedData = selectedData.map(() => false);
      setSelectedData([...tempSelectedData]);
      setIsModalOpen(false);
    }
    setLine(1);
    setRow(1);
    setIndex(1);
  };
  // 不同页批量插入，当然可能是一个
  const handleDifferentPageInsert = async () => {
    await getInfoBeforeBundleInsert();
    setIsModalDifferentPageOpen(true);
  };
  const insertProductsIntoDifferentPages = () => {
    let insertTarget;
    if (page && row && line) {
      if (page === current) {
        message.error('同页排序请使用当前页批量插入功能', 3);
        return;
      }
      insertTarget = (+page - 1) * 60 + (+line - 1) * 4 + +row - 1;
      if (insertTarget < 0) {
        message.error('行列有问题', 3);
        return;
      }
    } else if (index) {
      if (index >= (current - 1) * 60 && index <= current * 60) {
        message.error('同页排序请使用当前页批量插入功能', 3);
        return;
      }
      insertTarget = +index;
    }
    console.log(insertTarget, insertTarget);
    if (insertTarget === undefined) {
      message.error('需要提供具体的行列或者目标序列', 3);
      return;
    }
    console.log(productListData);
    let path = location.pathname;
    let arr = path.split('/');
    // 在服务器上排序，比较快
    request('/admin/updateTheBundleSpecialEventProduct', {
      params: {
        productList: JSON.stringify(productListData),
        insertTarget,
        code: arr[4],
      },
    }).then((data) => {
      if (data.result) {
        refreshBodyData(current);
      }
    });

    setIsModalDifferentPageOpen(false);
  };
  // header的全选和反选
  const handleAllSelect = () => {
    let tempSelectedData = [];
    for (let i = 0; i < tableData.length; i++) {
      tempSelectedData.push(true);
    }
    setSelectedData([...tempSelectedData]);
  };
  const handleReverseSelect = () => {
    let tempSelectedData = [];
    for (let i = 0; i < tableData.length; i++) {
      tempSelectedData.push(!selectedData[i]);
    }
    setSelectedData([...tempSelectedData]);
  };
  //翻页的处理
  const handlePageSizeChange = (e: number) => {
    setCurrent(e);
    refreshBodyData(e);
  };
  // modal的行列序号
  const handleChangeLine = (e: any) => {
    if (e.target.value < 0) return;
    setLine(e.target.value);
  };
  const handleChangeRow = (e: any) => {
    if (e.target.value < 0) return;
    setRow(e.target.value);
  };
  const handleChangeIndex = (e: any) => {
    if (e.target.value < 0) return;
    setIndex(e.target.value);
  };
  const handleChangePage = (e: any) => {
    if (e.target.value < 0) return;
    setPage(e.target.value);
  };
  // modal的展示序号的最上面带样式的产品号的删除
  const handleFilterProductListData = (item: number) => {
    let newProductListData = productListData.filter((product: number) => {
      return product !== item;
    });
    setProductListData([...newProductListData]);
  };
  // modal的展示序号通过input添加添加
  const handleAddProductListData = (e: any) => {
    let path = location.pathname;
    let arr = path.split('/');
    if (isNaN(e.target.value)) {
      message.error('必须是数字，请检查', 3);
      return;
    }
    // 判断是否已经是在productList里面了
    if (productListData.indexOf(+e.target.value.trim()) >= 0) {
      message.error('已选中该产品', 3);
      setDifferentPageInsert('');
      return;
    }
    // 先请求信息，查看是否属于该类产品，如果是就返回该产品的基础信息
    request(`/admin/secure/getSingleSpecialEventProductInfo`, {
      params: {
        productId: e.target.value.trim(),
        code: arr[4],
      },
    }).then((data) => {
      if (data.result) {
        // 获取了数据
        setProductListData([...productListData, data.data.idproduct]);
        setDifferentPageInsert('');
      } else {
        message.error('不是当前勾选类的产品/不存在该商品', 3);
      }
    });
  };
  // 当前页保存
  const handleSubmit = () => {
    // 把tabledate给搞一下，只需要productid和rank
    let list = [];
    for (let i = 0; i < tableData.length; i++) {
      let map: any = {};
      map.productId = tableData[i].idproduct;
      map.rank = tableData[i].rank;
      list.push(map);
    }
    console.log(list);
    let path = location.pathname;
    let arr = path.split('/');
    request('/admin/secure/updateOneEventSpecialEventProductRank', {
      params: {
        code: arr[4],
        list: JSON.stringify(list),
      },
    }).then((data) => {
      if (data.result) {
        message.success('保存成功', 3);
        refreshBodyData(current);
      } else {
        message.error({ content: data.message }, 3);
      }
    });
  };
  // 本质上就是把序号清为0
  const handleDelete = async () => {
    await getInfoBeforeBundleInsert();
    setIsDeleteModalOpen(true);
  };
  const updateRankToLast = () => {
    let path = location.pathname;
    let arr = path.split('/');
    // 在服务器上排序，比较快
    request('/admin/updateTheBundleSpecialEventProductToLast', {
      params: {
        productList: JSON.stringify(productListData),
        code: arr[4],
      },
    }).then((data) => {
      if (data.result) {
        refreshBodyData(current);
      }
    });

    setIsDeleteModalOpen(false);
  };
  //清除缓存，本质上就是把所有的商品重新按原有的序号排序一遍,数字从1开始加
  const handleRefresh = () => {
    let path = location.pathname;
    let arr = path.split('/');
    request('/admin/secure/updateOneEventAllSpecialEventProductRank', {
      params: {
        code: arr[4],
      },
    }).then((data) => {
      if (data.result) {
        setIsCacheModalOpen(false);
        window.location.reload();
      }
    });
  };
  // 列数选择用的
  const changeRowLine = () => {
    // 本质上就是改变body的宽度
    if (value1 === 2) {
      $('.productSortBodyForDisplay').css('width', '420px');
    } else {
      $('.productSortBodyForDisplay').css('width', '800px');
    }
    setIsRowSelectModalOpen(false);
  };
  return (
    <div style={{ position: 'relative', minWidth: 1200 }}>
      <Modal
        title="当前页批量插入确认"
        open={isModalOpen}
        onOk={changeTableData}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <div className={styles.modal}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              minHeight: 200,
              border: '1px solid black',
              padding: 5,
            }}
          >
            {productListData.map((item: number, index: number) => {
              return (
                <div
                  key={index}
                  className={styles.showProduct}
                  onClick={() => handleFilterProductListData(item)}
                >
                  {item}
                  <span className={styles.close}></span>
                </div>
              );
            })}
          </div>
          <div>
            {productListData.map((item: number) => {
              return item + ',';
            })}
          </div>
          <p>
            插入至{' '}
            <input
              type="number"
              value={line}
              min={1}
              max={15}
              onChange={handleChangeLine}
            />
            行{' '}
            <input
              type="number"
              value={row}
              min={1}
              max={4}
              onChange={handleChangeRow}
            />
            列
          </p>
          <p>
            或者插入至
            <input type="number" value={index} onChange={handleChangeIndex} />
            序号
          </p>
          <p>两个都填写的话按上面为准操作</p>
        </div>
      </Modal>
      <Modal
        title="跨页批量插入确认"
        open={isModalDifferentPageOpen}
        onOk={insertProductsIntoDifferentPages}
        onCancel={() => {
          setIsModalDifferentPageOpen(false);
        }}
      >
        <div className={styles.modal}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              minHeight: 200,
              border: '1px solid black',
              padding: 5,
            }}
          >
            {productListData.map((item: number, index: number) => {
              return (
                <div
                  key={index}
                  className={styles.showProduct}
                  onClick={() => handleFilterProductListData(item)}
                >
                  {item}
                  <span className={styles.close}></span>
                </div>
              );
            })}
          </div>
          <div>
            {productListData.map((item: number) => {
              return item + ',';
            })}
          </div>
          <Input
            style={{ width: 400 }}
            value={differentPageInsert}
            onChange={(e) => setDifferentPageInsert(e.target.value)}
            placeholder={'添加更多的商品，每一个请按回车添加,可以非当前页'}
            onPressEnter={handleAddProductListData}
          />
          <p>
            插入至{' '}
            <input
              type="number"
              value={page}
              min={1}
              max={Math.ceil(dataSize / 60)}
              onChange={handleChangePage}
            />
            页
            <input
              type="number"
              value={line}
              min={1}
              max={15}
              onChange={handleChangeLine}
            />
            行{' '}
            <input
              type="number"
              value={row}
              min={1}
              max={4}
              onChange={handleChangeRow}
            />
            列
          </p>
          <p>
            或者插入至
            <input
              type="number"
              value={index}
              min={1}
              max={dataSize}
              onChange={handleChangeIndex}
            />
            序号
          </p>
          <p>两个都填写的话按上面为准操作</p>
        </div>
      </Modal>
      <Modal
        title="删除确认"
        open={isDeleteModalOpen}
        onOk={updateRankToLast}
        onCancel={() => {
          setIsDeleteModalOpen(false);
        }}
      >
        <div className={styles.modal}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              minHeight: 200,
              border: '1px solid black',
              padding: 5,
            }}
          >
            {productListData.map((item: number, index: number) => {
              return (
                <div
                  key={index}
                  className={styles.showProduct}
                  onClick={() => handleFilterProductListData(item)}
                >
                  {item}
                  <span className={styles.close}></span>
                </div>
              );
            })}
          </div>
          <p>确定要将这些产品排序放到最后面吗？</p>
        </div>
      </Modal>
      <Modal
        title="列数选择"
        open={isRowSelectModalOpen}
        onOk={changeRowLine}
        onCancel={() => {
          setIsRowSelectModalOpen(false);
        }}
      >
        <div>
          <div>
            <Radio.Group
              options={options}
              onChange={onChange1}
              value={value1}
              optionType="button"
              defaultValue={4}
            />
          </div>
          <p>请选择每行展示的列数</p>
        </div>
      </Modal>
      <Modal
        title="确定"
        open={isCacheModalOpen}
        onOk={handleRefresh}
        onCancel={() => {
          setIsCacheModalOpen(false);
        }}
      >
        <p>确定要预排序吗</p>
      </Modal>
      <p style={{ color: '#f40' }}>
        如果该勾选类最近新增过产品，可以先用
        <strong style={{ fontWeight: 800, fontSize: 20 }}> 一次 </strong>
        预排序，避免后续排序出错
      </p>
      <SpecialEventProductSortHeader
        setTableData={setTableData}
        handleAllSelect={handleAllSelect}
        handleReverseSelect={handleReverseSelect}
        handleSubmit={handleSubmit}
        getQueryCategory={getQueryCategory}
        refreshBodyData={refreshBodyData}
        current={current}
        handleDelete={handleDelete}
        setIsRowSelectModalOpen={setIsRowSelectModalOpen}
        handleCurrentPageInsert={handleCurrentPageInsert}
        handleDifferentPageInsert={handleDifferentPageInsert}
      />
      <div style={{ width: 800, margin: '0 auto' }}>
        <Pagination
          current={current}
          pageSize={60}
          total={dataSize}
          showQuickJumper
          showSizeChanger={false}
          onChange={handlePageSizeChange}
        />
      </div>

      {tableData.length > 0 ? <ProductSortBody tableData={tableData} /> : null}
      <div
        style={{
          position: 'fixed',
          top: 300,
          left: 300,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Button onClick={handleCurrentPageInsert}>当前页批量插入</Button>
        <Button onClick={handleDifferentPageInsert}>跨页批量插入</Button>
        <Button
          onClick={() => {
            setIsRowSelectModalOpen(true);
          }}
        >
          列数
        </Button>
        <Button onClick={handleSubmit}>保存</Button>
        <Button
          onClick={() => {
            setIsCacheModalOpen(true);
          }}
        >
          预排序
        </Button>
        <Button onClick={handleDelete}>删除</Button>
      </div>
      <div style={{ width: 800, margin: '0 auto' }}>
        <Pagination
          current={current}
          pageSize={60}
          total={dataSize}
          showQuickJumper
          showSizeChanger={false}
          onChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
};
export default App;

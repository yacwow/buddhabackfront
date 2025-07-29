import { request } from '@umijs/max';
import { NavLink } from '@umijs/max';
import { useModel } from '@umijs/max';
import { Button, Input, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './EditSpecialEventProductBodyHeader.less';
interface Props {}
const App: React.FC<Props> = (props) => {
  const {
    selectedRowKeys,
    setSelectedRowKeys,
    setSpecialEventProductTableData,
    specialEventProductTableData,
    productIdList,
    setProductIdList,
    code,
    page,
    pageSize,
    setCode,
  } = useModel('addSpecialEventProductData');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const getSelectIDs = async () => {
    console.log(selectedRowKeys);
    let productList = [];
    for (let i = 0; i < selectedRowKeys.length; i++) {
      productList.push(
        specialEventProductTableData[selectedRowKeys[i]].productId,
      );
    }
    console.log(productList);
    await setProductIdList(productList);
    setIsModalOpen(true);
  };
  const getAllIDs = async () => {
    setIsModalOpen1(true);
  };
  // 批量移除
  const removeSelectList = () => {
    let productList = [];
    for (let i = 0; i < selectedRowKeys.length; i++) {
      productList.push(
        `${specialEventProductTableData[selectedRowKeys[i]].productId}`,
      );
    }
    if (productList.length === 0) {
      message.info('选项不能为空', 3);
      return;
    }
    console.log(productList);
    request('/admin/deleteSpecialEventSelectedProduct', {
      params: {
        productList: JSON.stringify(productList),
        page,
        pageSize,
        code,
      },
    }).then((data) => {
      if (data.result) {
        // 在下面显示table的数据
        setSpecialEventProductTableData(data.data.specialEventProductList);
        setSelectedRowKeys([]);
      } else {
        message.error('出了点错误，刷新页面看看', 3);
      }
    });
  };
  useEffect(() => {
    let pathArr = location.pathname.split('/');
    if (pathArr.length >= 4) {
      setCode(pathArr[3]);
    }
  }, []);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Modal
        title="所有的产品id"
        open={isModalOpen1}
        onOk={() => {
          setIsModalOpen1(false);
        }}
        onCancel={() => {
          setIsModalOpen1(false);
        }}
      >
        <p>
          {specialEventProductTableData.map((item: any) => {
            return item.productId + ',';
          })}
        </p>
      </Modal>
      <Modal
        title="选中的产品"
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <p>
          {productIdList.map((item) => {
            return item + ',';
          })}
        </p>
      </Modal>
      <div>
        <div>手动选定商品</div>
        <div>
          <Button onClick={getAllIDs}>获取全部产品id</Button>
          <Button onClick={getSelectIDs}>获取所选产品id</Button>
          <Button>
            {' '}
            <NavLink to={`/backend/productSort/eventType/${code}`}>
              拖动修改商品排序
            </NavLink>{' '}
          </Button>
          <Button onClick={removeSelectList}>移除选中产品</Button>
        </div>
        <div>状态</div>
      </div>
      <div>
        <Input placeholder="搜索" />
      </div>
    </div>
  );
};
export default App;

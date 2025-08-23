import { useModel } from '@umijs/max';
import { Button, Input, message, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import ProductDisplayBody from './SkuProductDisplayBody';
import { request } from '@umijs/max';
import ProductDisplayHeader from './SkuProductDisplayHeader';
import styles from '@/components/ProductSort/ProductSort.less';

const App: React.FC = () => {
  const {
    day1,
    day2,
    canSendDate,
    productIds,
    setProductIds,
    setMaxData,
    page,
    pageSize,
    value,
    status,
    selectedRowKeys,
    setSelectedRowKeys,
    sortParams,
  } = useModel('ProductDisplayHeaderData');
  const {
    categorySpecialEventSuccessFileList,
    setCategorySpecialEventSuccessFileList,
  } = useModel('categoryManagement');
  const { treeDataArr, setTreeDataArr } = useModel('global');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchType, setSearchType] = useState('idProduct'); //右上角按产品搜索等等的可能性
  const [searchParam, setSearchParam] = useState(''); //右上角搜索的值
  const [tableData, setTableData] = useState<any>([]);
  const [stockStatus, setStockStatus] = useState<string>('available');
  const [submitPending, setSubmitPending] = useState(false);
  const handleChange = (value: string) => {
    setSearchType(value);
  };
  const handleInputChange = (e: any) => {
    setSearchParam(e.target.value.trim());
  };
  //处理右上角搜索请求
  const handleRequstSearch = () => {
    if (searchType === 'idProduct' && !isNaN(+searchParam)) {
      request('/admin/searchSkuProductByInput', {
        params: { searchType, searchParam },
      }).then((data) => {
        if (data.result) {
          setTableData(data.data.data);
          setSelectedRowKeys([]);
          setMaxData(1);
        } else {
          message.info('没找到相关信息', 5);
        }
      });
    } else {
      message.info('产品id不能为字符', 5);
    }
  };
  //处理左上角获取id
  const handleGetAllProductIds = () => {
    if (tableData.length === 0) return;
    let ids = [];
    for (let i = 0; i < selectedRowKeys.length; i++) {
      console.log(i, selectedRowKeys, tableData);
      // ids += tableData[selectedRowKeys[i]].productId + ';';
      ids.push(tableData[selectedRowKeys[i]].productId);
      console.log(tableData[selectedRowKeys[i]].productId);
    }
    setProductIds(ids);
    setIsModalOpen(true);
  };
  // modal的展示序号的最上面带样式的产品号的删除的处理函数
  const handleFilterProductListData = (item: number) => {
    let newProductListData = productIds.filter((product: number) => {
      return product !== item;
    });
    setProductIds([...newProductListData]);
  };
  //改变下拉状态
  const handleChangeStock = (value: string) => {
    setStockStatus(value);
  };
  const changeTableData = () => {
    if (productIds.length === 0) {
      message.info({ content: '必须有产品id' }, 4);
      return;
    }
    setSubmitPending(true);
    request('/admin/changeProductStatus', {
      method: 'POST',
      data: {
        productIds: JSON.stringify(productIds),
        stockStatus,
      },
    }).then((data) => {
      if (data.result) {
        message.info({ content: '修改成功', style: { marginTop: '40vh' } }, 4);
        setSubmitPending(false);
        setIsModalOpen(false);
        setSelectedRowKeys([]);
        //改变tabledata的库存状态
        let newTableData = structuredClone(tableData).map((item: any) => {
          if (productIds.includes(item.productId)) {
            item.stockStatus = stockStatus;
            return item;
          } else {
            return item;
          }
        });
        setTableData(newTableData);
      }
    });
  };
  useEffect(() => {
    console.log(value, status, canSendDate);
    if (canSendDate) {
      request('/admin/secure/searchSkuProductByParams', {
        params: {
          beforeDate: day1,
          afterDate: day2,
          category: value.length > 0 ? JSON.stringify(value) : null,
          status: status.length > 0 ? JSON.stringify(status) : null,
          pageSize,
          page,
          sortParams,
        },
      }).then((data) => {
        if (data.result) {
          setTableData(data.data.data);
          setMaxData(data.data.count);
        } else {
          message.info('没找到相关信息', 3);
          setTableData([]);
          setMaxData(0);
        }
      });
    } else {
      message.info('日期选择有误,请检查', 3);
    }
  }, [page, pageSize, sortParams, value, status, day1, day2]);
  useEffect(() => {
    if (
      treeDataArr.length === 0 ||
      categorySpecialEventSuccessFileList.length === 0
    ) {
      //为了获取分类下拉列表，同时懒得在做一个请求了
      request('/admin/secure/getHomePageCategoryInfo').then((data) => {
        if (data.result) {
          // let tempTreeDataArr = [];
          // tempTreeDataArr.push(...data.data.categoryDetail);
          // tempTreeDataArr.push({
          //   title: "Best Seller",
          //   value: "/bestSeller?page=1",
          //   key: "/bestSeller?page=1",
          // });
          // tempTreeDataArr.push({
          //   title: "Discount-70%",
          //   value: "/saveUpTo70?page=1",
          //   key: "/saveUpTo70?page=1",
          // });
          // tempTreeDataArr.push({
          //   title: "Trending Now",
          //   value: "/trending?page=1",
          //   key: "/trending?page=1",
          // });
          // tempTreeDataArr.push({
          //   title: "自定义",
          //   value: "",
          //   key: "自定义",
          // });
          // setTreeDataArr(tempTreeDataArr);
          setTreeDataArr(data.data.categoryDetail)
          setCategorySpecialEventSuccessFileList(data.data.categoryInfo);
        }
      });
    }
  }, []);
  const [input, setInputValue] = useState('');
  //modal里面的批量插入
  const handleBundleSkuProduct = () => {
    let dom = document.querySelectorAll('#myBundleSkuProduct')[0];
    let val = dom.innerHTML;
    let valArr = val.split(';');
    let newProductIds = [];
    for (let i = 0; i < valArr.length; i++) {
      const parsedValue = parseInt(valArr[i], 10); // Convert to number (base 10)

      // Check if the parsedValue is NaN (not a number)
      if (isNaN(parsedValue)) {
        message.error({ content: '输入的数据有错误' }, 4);
        return;
      } else {
        // If it is a number, update the array element with the parsed value
        newProductIds.push(parsedValue);
      }
    }
    console.log(newProductIds);
    newProductIds = [...productIds, ...newProductIds];
    const uniqueArray = [...new Set(newProductIds)];
    setProductIds(uniqueArray);
    dom.innerHTML = '';
    console.log(val);
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'sticky',
          zIndex: 2,
          top: 0,
          height: 50,
          background: '#fff',
        }}
      >
        <div>
          <Button type="primary" onClick={handleGetAllProductIds}>
            获取所选所有产品的id
          </Button>
          <Modal
            title="批量改变产品库产品状态"
            open={isModalOpen}
            onCancel={() => {
              setIsModalOpen(false);
            }}
            footer={null}
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
                {productIds.map((item: number, index: number) => {
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
                {productIds.map((item: number) => {
                  return item + ',';
                })}
              </div>
              <div>
                <Input
                  placeholder="插入新的产品id,回车输入"
                  type={'number'}
                  style={{ width: 250 }}
                  value={input}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                  onKeyDown={(e: any) => {
                    if (e.key === 'Enter') {
                      let value = e.target.value;
                      e.target.value = '';
                      let newProductIds = structuredClone(productIds);
                      newProductIds = [...newProductIds, +value];
                      const uniqueArray = [...new Set(newProductIds)];
                      setProductIds(uniqueArray);
                      setInputValue('');
                    }
                  }}
                />
              </div>
              <div>
                <h3>批量导入，产品id用英文;来分割,用下面的输入键导入</h3>
                <Input.TextArea id={'myBundleSkuProduct'} />
                <Button onClick={handleBundleSkuProduct}>批量导入</Button>
              </div>
              <div>
                <h4>
                  在库和无库存则会展示在前端，不在库和未发布则不展示
                  <br />
                  原本在库/无库存的产品如果修改为不在库/未发布则同时丢失该商品勾选类和分类的展示以及排序
                </h4>
                <Select
                  defaultValue="available"
                  style={{ width: 150 }}
                  value={stockStatus}
                  onChange={handleChangeStock}
                  options={[
                    { value: 'available', label: '在库' },
                    { value: 'notavailable', label: '不在库' },
                    { value: 'nostock', label: '无库存' },
                    { value: 'notpublished', label: '未发布' },
                  ]}
                />
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                取消
              </Button>
              <Button
                style={{ marginLeft: 10 }}
                type="primary"
                onClick={changeTableData}
                disabled={submitPending}
              >
                {submitPending ? '后端修改中' : '确定'}
              </Button>
            </div>
          </Modal>
        </div>
        <div style={{ display: 'flex' }}>
          <Select
            defaultValue="idProduct"
            style={{ width: 120, height: 30 }}
            onChange={handleChange}
            options={[{ value: 'idProduct', label: '产品id' }]}
          />
          <Input
            style={{ width: 240 }}
            value={searchParam}
            onChange={handleInputChange}
            placeholder="搜索"
            addonAfter={<SearchOutlined onClick={handleRequstSearch} />}
          />
        </div>
      </div>
      <div
        style={{
          top: 50,
          position: 'sticky',
          zIndex: 2,
          background: '#fff',
          height: 50,
        }}
      >
        <ProductDisplayHeader setTableData={setTableData} />
      </div>
      <div>
        {tableData ? <ProductDisplayBody tableData={tableData} /> : null}
      </div>
    </div>
  );
};
export default App;

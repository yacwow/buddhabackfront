import React, { useEffect, useState } from 'react';
import { Button, Input, message, Modal, Select, Switch } from 'antd';
import styles from './EditSpecialEventProductHeader.less';
import { request } from '@umijs/max';
import { useModel } from '@umijs/max';
interface Props {
  initialValue: any;
}
const App: React.FC<Props> = (props) => {
  const { initialValue } = props;
  console.log(initialValue);
  const {
    page,
    pageSize,
    setSpecialEventProductTableData,
    code,
    setCode,
    setTotal,
  } = useModel('addSpecialEventProductData');
  // const [form] = Form.useForm();
  const [description, setDescription] = useState();
  const [promotionCode, setPromotionCode] = useState();
  const [showCount, setShowCount] = useState();

  const [switch1, setSwitch1] = useState(false); //控制是否启用勾选
  const [switch2, setSwitch2] = useState(false); //控制是否启用促销
  const [productListData, setProductListData] = useState<string>('');
  const [promotionType, setPromotionType] = useState('');
  const [promotionMinValue, setPromotionMinValue] = useState<number | null>(); //折扣最小值
  const [promotionMaxValue, setPromotionMaxValue] = useState<number | null>(); //折扣最大值
  const [marketMinValue, setMarketMinValue] = useState<number | null>(); //市场价，具体值
  const [marketMaxValue, setMarketMaxValue] = useState<number | null>(); //市场价，具体值
  const [marketMinPercentValue, setMarketMinPercentValue] = useState<
    number | null
  >(); //市场价，比例
  const [marketMaxPercentValue, setMarketMaxPercentValue] = useState<
    number | null
  >(); //市场价，比例

  const [minStockNumber, setMinStockNumber] = useState<number | null>(); //最小库存
  const [maxStockNumber, setMaxStockNumber] = useState<number | null>(); //最小库存

  const [isModalOpen, setIsModalOpen] = useState(false); //剔除所有产品的modal框
  const [isModalOpen1, setIsModalOpen1] = useState(false); //批量移除产品的modal框
  // 控制是否启用勾选
  const handleSwitch1Change = (checked: boolean) => {
    setSwitch1(checked);
  };
  //控制是否启用促销
  const handleSwitch2Change = (checked: boolean) => {
    setSwitch2(checked);
  };
  // 全部删除
  const handleAllDelete = async () => {
    request('/admin/secure/deleteAllSpecialEventProduct', {
      params: {
        code,
      },
    }).then((data) => {
      if (data.result) {
        setSpecialEventProductTableData([]);
        setIsModalOpen(false);
      } else {
        message.error('出了点错误，刷新页面看看', 3);
      }
    });
  };
  // 1003243,1003245,1003246,1003256,1003268,1003279,1003281,1003286,1003287,
  // 批量删除
  const handleBundleDelete = () => {
    let productList = productListData.split(',');
    productList = productList.filter((item: string) => {
      if (item.length !== 0 && !isNaN(+item)) return item;
      return null;
    });
    console.log(productList);
    if (productList.length === 0) {
      message.info('选项不能为空', 3);
      return;
    }
    // console.log(page, pageSize, code);
    request('/admin/secure/deleteSpecialEventSelectedProduct', {
      params: {
        productList: JSON.stringify(productList),
        page,
        pageSize,
        code,
      },
    }).then((data) => {
      if (data.result) {
        // 在下面显示table的数据
        console.log(data.data.data);
        setSpecialEventProductTableData(data.data.specialEventProductList);
        setTotal(data.data.count);
        setProductListData('');
        setIsModalOpen(false);
        setIsModalOpen1(false);
        message.info({ content: '删除成功' }, 3);
      } else {
        message.error('出了点错误，刷新页面看看', 3);
      }
    });
  };
  // 批量导入
  const handleBundleImport = async () => {
    let productList = productListData.trim().split(',');
    let newProductList: string[] = [];
    productList.map((item: string) => {
      if (item.length !== 0 && !isNaN(+item)) {
        console.log(item);
        newProductList.push(`${parseInt(item)}`);
      }
      return null;
    });
    // console.log(NewproductList);
    request('/admin/secure/updateSpecialEventProduct', {
      params: {
        code,
        productList: JSON.stringify(newProductList),
        page,
        pageSize,
      },
    }).then((data) => {
      if (data.result) {
        // 在下面显示table的数据
        console.log(data.data.data);
        setSpecialEventProductTableData(data.data.specialEventProductList);
        message.info({ content: '添加成功', style: { marginTop: '40vh' } }, 4);
        setProductListData('');
      } else {
        message.error('出了点错误，刷新页面看看', 3);
      }
    });
  };
  // 最上面的保存按键
  const handleSave = () => {
    request('/admin/secure/updateBasicSpecialEvent', {
      params: {
        code,
        description,
        showCount,
        specialCodeActive: switch1,
        promotionCodeActive: switch2,
      },
    }).then((data) => {
      if (data.result) {
        message.info('成功改变基础信息', 3);
      } else {
        message.error('修改基础信息失败，刷新页面重新提交', 3);
      }
    });
  };
  // 最上面的保存并退出
  const handleSaveAndQuit = () => {
    request('/admin/secure/updateBasicSpecialEvent', {
      params: {
        code,
        description,
        showCount,
        specialCodeActive: switch1,
        promotionCodeActive: switch2,
      },
    }).then((data) => {
      if (data.result) {
        history.back();
      } else {
        message.error('修改基础信息失败，刷新页面重新提交', 3);
      }
    });
  };
  // 赋初值
  const resetToInitialValue = () => {
    setCode(initialValue.code);
    setDescription(initialValue.description);
    setPromotionCode(initialValue.promotionCode);
    setShowCount(initialValue.showCount);
    setSwitch1(initialValue.specialCodeActive);
    setSwitch2(initialValue.promotionCodeActive);
    setPromotionType(initialValue.promotioncategory);
    if (initialValue.promotioncategory === 'deduct') {
      let valueArr = initialValue.fixdiscount.split('-');
      if (valueArr.length === 2) {
        setPromotionMinValue(valueArr[0]);
        setPromotionMaxValue(valueArr[1]);
      }
    } else if (initialValue.promotioncategory === 'percent') {
      let valueArr = initialValue.percentdiscount.split('-');
      if (valueArr.length === 2) {
        setPromotionMinValue(valueArr[0]);
        setPromotionMaxValue(valueArr[1]);
      }
    }
  };
  //最上面的取消，也就是返回到了后台请求回来的值。如果保存过了就不行了。
  const handleUnSave = () => {
    resetToInitialValue();
  };
  // 红框里面的促销折扣种类的改变
  const handlePromotionMethodChange = (e: any) => {
    setPromotionType(e);
  };
  //促销取消的函数
  const handlePromotionUnSave = () => {
    setSwitch2(false);
    setPromotionType('');
    setPromotionMaxValue(null);
    setPromotionMinValue(null);
  };
  // 促销保存按钮
  const handlePromotionSave = () => {
    if (
      switch2 === true &&
      (promotionType == null ||
        promotionType === '' ||
        promotionMaxValue === null ||
        promotionMinValue === null)
    ) {
      message.error(
        {
          content: '开启折扣必须要有具体的折扣类型和具体数值',
          style: { marginTop: '40vh' },
        },
        4,
      );
      return;
    }
    if (
      promotionMaxValue !== null &&
      promotionMaxValue !== undefined &&
      promotionMinValue !== null &&
      promotionMinValue !== undefined &&
      promotionMaxValue < promotionMinValue
    ) {
      message.error(
        {
          content: '右边必须大于等于左边',
          style: { marginTop: '40vh' },
        },
        4,
      );
      return;
    }
    request('/admin/secure/updateProductNewPriceBaseOnPromotion', {
      params: {
        code,
        promotionType,
        active: switch2,
        promotionMaxValue,
        promotionMinValue,
      },
    }).then((data) => {
      console.log(data);
      if (data.result) {
        message.info({ content: '修改成功', style: { marginTop: '40vh' } }, 4);
      }
    });
  };
  // 促销保存并退出
  const handlePromotionSaveAndQuit = () => {};

  //改变该勾选类的库存数量
  const handleChangeStockNumber = () => {
    if (minStockNumber && maxStockNumber && minStockNumber <= maxStockNumber) {
      request('/admin/updateStockNumberOfProduct', {
        params: { min: minStockNumber, max: maxStockNumber, code },
      }).then((data) => {
        if (data.result) {
          message.info(
            { content: '修改成功', style: { marginTop: '40vh' } },
            4,
          );
        }
      });
    } else {
      message.error(
        { content: '信息缺少/信息错误', style: { marginTop: '40vh' } },
        4,
      );
    }
  };
  useEffect(() => {
    let pathArr = location.pathname.split('/');
    if (pathArr.length >= 4) {
      setCode(pathArr[3]);
    }
  }, []);

  useEffect(() => {
    resetToInitialValue();
  }, [initialValue]);
  return (
    <div>
      <Modal
        title="全部删除确认"
        open={isModalOpen}
        onOk={handleAllDelete}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <p>确定要全部删除吗</p>
        <p>如果删除的产品超过200个，则可能后台会超时-过一分钟后刷新再看</p>
      </Modal>
      <Modal
        title="批量删除确认"
        open={isModalOpen1}
        onOk={handleBundleDelete}
        onCancel={() => {
          setIsModalOpen1(false);
        }}
      >
        <p>确定要全部删除吗</p>
      </Modal>
      <div className={styles.display}>
        <div className={styles.inside}>
          <label>
            介绍<span style={{ color: 'red', fontSize: 16 }}>*</span>{' '}
          </label>
          <Input
            placeholder="介绍"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <label>仅后台可见，可作为备注使用</label>
        </div>

        <div className={styles.inside}>
          <label>
            代码 <span style={{ color: 'red', fontSize: 16 }}>*</span>
          </label>
          <Input
            placeholder="代码"
            value={code}
            disabled
            defaultValue={initialValue.code}
          />
          <label>
            只允许英文字母、阿拉伯数字、英文横线(-)以及英文下划线(_)
          </label>
        </div>
      </div>
      <div className={styles.display}>
        <div className={styles.inside}>
          <label>
            显示个数 <span style={{ color: 'red', fontSize: 16 }}>*</span>
          </label>
          <Input
            placeholder="显示个数"
            type={'number'}
            value={showCount}
            onChange={(e) => {
              setShowCount(e.target.value);
            }}
          />
          <label>输入正整数，最多显示多少个商品</label>
        </div>

        <div className={styles.inside}>
          <label>
            促销管理code,必须和上面的代码是一致的{' '}
            <span style={{ color: 'red', fontSize: 16 }}>*</span>
          </label>
          <Input placeholder="促销管理code" value={promotionCode} disabled />
          <label>
            绑定促销管理code (勾选位更新保存后，绑定的促销管理产品id同步更新)
          </label>
        </div>
      </div>
      <div className={styles.inside}>
        <div style={{ marginBottom: 20 }}>
          <div>是否启用此勾选</div>
          <Switch checked={switch1} onChange={handleSwitch1Change} />
          <span>{switch1 ? '已开启' : '已关闭'}</span>
        </div>
      </div>
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <Button type="primary" style={{ marginRight: 20 }} onClick={handleSave}>
          保存
        </Button>
        <Button
          type="primary"
          style={{ marginRight: 60 }}
          onClick={handleSaveAndQuit}
        >
          保存并退出
        </Button>
        <Button onClick={handleUnSave}>取消</Button>
      </div>
      {code === 'secondOneHalf' ? null : (
        <div style={{ marginTop: 30, border: '1px solid red', width: '45%' }}>
          <h4>
            红框内为单独的控制价格模块，选择后保存/保存退出都会改变产品的最终展示价格，
            注意同一个产品在不同的勾选类的问题。
          </h4>
          <div className={styles.inside}>
            <div>促销折扣是否开启</div>
            <Switch checked={switch2} onChange={handleSwitch2Change} />
            <span>{switch2 ? '已开启' : '已关闭'}</span>
          </div>
          <div>
            <div>促销折扣种类</div>
            <Select
              style={{ width: 100 }}
              value={promotionType}
              onChange={handlePromotionMethodChange}
            >
              <Select.Option value="deduct">按具体值</Select.Option>
              <Select.Option value="percent">按比例</Select.Option>
            </Select>
            <label style={{ marginLeft: 20 }}>输入具体数值：</label>
            <Input
              placeholder="请输入最小比例"
              style={{ width: 150 }}
              type="number"
              value={promotionMinValue}
              onChange={(e) => {
                setPromotionMinValue(+e.target.value);
              }}
            />
            至
            <Input
              placeholder="请输入最大比例"
              style={{ width: 150 }}
              type="number"
              value={promotionMaxValue}
              onChange={(e) => {
                setPromotionMaxValue(+e.target.value);
              }}
            />
          </div>
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <Button
              type="primary"
              style={{ marginRight: 20 }}
              onClick={handlePromotionSave}
            >
              促销保存
            </Button>
            <Button
              type="primary"
              style={{ marginRight: 60 }}
              onClick={handlePromotionSaveAndQuit}
              disabled
            >
              促销保存并退出
            </Button>
            <Button onClick={handlePromotionUnSave}>
              促销取消/需要再次保存才生效
            </Button>
          </div>

          <div>
            <h4>改变该勾选类的产品库存，必须最小和最大都填写</h4>
            库存的范围：
            <Input
              style={{ width: 200 }}
              placeholder="库存最小值"
              type="number"
              value={minStockNumber}
              onChange={(e) => {
                if (+e.target.value === 0) {
                  setMinStockNumber(null);
                  return;
                }
                setMinStockNumber(+e.target.value);
              }}
            />
            至
            <Input
              style={{ width: 200 }}
              placeholder="库存最大值"
              type="number"
              value={maxStockNumber}
              onChange={(e) => {
                if (+e.target.value === 0) {
                  setMaxStockNumber(null);
                  return;
                }
                setMaxStockNumber(+e.target.value);
              }}
            />
            <div></div>
            <Button onClick={handleChangeStockNumber}>改变产品库存</Button>
          </div>
        </div>
      )}

      <div className={styles.display}>
        <div className={styles.inside}>
          <label>
            {' '}
            手动选定商品批量导入(请填写产品id,多个ID之间支持用英文逗号隔开)-建议每次插入少于60个
          </label>
          <Input.TextArea
            placeholder="多个产品用英文逗号间隔"
            value={productListData}
            onChange={(e) => {
              setProductListData(e.target.value);
            }}
            style={{ minHeight: 100, wordWrap: 'break-word' }}
          />
        </div>
      </div>
      <div style={{ marginBottom: 30 }}>
        <Button
          type="primary"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          剔除所有产品
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: 100, marginRight: 10 }}
          onClick={() => {
            setIsModalOpen1(true);
          }}
        >
          确定批量移除
        </Button>
        <Button type="primary" onClick={handleBundleImport}>
          确认批量导入
        </Button>
      </div>
    </div>
  );
};
export default App;

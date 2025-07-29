import { request } from '@umijs/max';
import { useModel } from '@umijs/max';
import { Button, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './ProductBasicInfo.less';
const App: React.FC = () => {
  const {
    originValue,
    setOriginValue,
    valueBeforeDiscount,
    setValueBeforeDiscount,
    stockNum,
    setStockNum,
    setFraudSoldAmount,
    fraudSoldAmount,
    setFraudCommentNum,
    fraudCommentNum,
    setProductRemark,
    productRemark,
    productWeight,
    fraudWishList,
    setProductWeight,
    setFraudWishList,
    setTruePrice,
    truePrice,
  } = useModel('productDetail');
  const [initialRatio, setInitialRatio] = useState<any>();
  useEffect(() => {
    request('/admin/secure/getCurrencyRatio').then((data) => {
      if (data.result) {
        if (data.data.currencyRatio) {
          console.log('in');
          const rows = data.data.currencyRatio.split('&&');
          const newData = rows.map((row: string, index: number) => {
            const [
              minPrice,
              maxPrice,
              coefficient,
              exchangeRate,
              purchaseCost,
              adjustment,
              budgetRangeMin,
              budgetRangeMax,
            ] = row.split(';;');

            return {
              key: index + 1,
              minPrice: parseFloat(minPrice),
              maxPrice: parseFloat(maxPrice),
              coefficient: parseFloat(coefficient),
              exchangeRate: parseFloat(exchangeRate),
              purchaseCost: parseFloat(purchaseCost),
              adjustment: parseFloat(adjustment),
              budgetRangeMin: parseFloat(budgetRangeMin),
              budgetRangeMax: parseFloat(budgetRangeMax),
            };
          });
          setInitialRatio(newData);
        } else {
          setInitialRatio([]);
        }
      }
    });
  }, []);
  //根据true price算出价格
  const handleCalculate = () => {
    if (initialRatio.length === 0) {
      message.error(
        { content: '没有预设的比例，请先设置', style: { marginTop: 300 } },
        4,
      );
      return;
    }
    let i = 0;
    for (; i < initialRatio.length; i++) {
      if (
        truePrice > initialRatio[i].minPrice &&
        truePrice < initialRatio[i].maxPrice
      ) {
        break;
      }
    }
    if (i >= initialRatio.length) {
      message.error(
        { content: '不在预设比例范围内，请先修改', style: { marginTop: 300 } },
        4,
      );
      return;
    }
    //按照i的标准进行计算
    let newValueBeforeDiscount =
      +truePrice * initialRatio[i].coefficient * initialRatio[i].exchangeRate +
      initialRatio[i].purchaseCost +
      initialRatio[i].adjustment;
    setValueBeforeDiscount(newValueBeforeDiscount);
  };
  return (
    <div className={styles.container}>
      <div className={styles.display}>
        <div>
          <label>市场价</label>
          <span style={{ color: '#ee0000', fontWeight: 'bold', fontSize: 16 }}>
            【必填,正数】
          </span>
          <Input
            prefix="$"
            suffix="Dollar"
            type="text"
            min="0"
            step="0.01"
            value={originValue}
            onChange={(e) => {
              let inputValue = e.target.value;
              // 移除前导的0
              if (inputValue.length > 1 && inputValue.startsWith('0')) {
                inputValue = inputValue.replace(/^0+/, '');
              }

              // 使用正则表达式验证输入是否为有效的金额格式
              if (/^\d+(\.\d{0,2})?$/.test(inputValue)) {
                setOriginValue(inputValue);
              }
            }}
            placeholder="Example:98.00"
          />
          <p>请输入产品市场价</p>
        </div>
        <div>
          <div>
            <label>价格(活动折扣之前)</label>{' '}
            <span
              style={{ color: '#ee0000', fontWeight: 'bold', fontSize: 16 }}
            >
              【必填,正整数】
            </span>
            <Input
              prefix="$"
              suffix="Dollar"
              type="number"
              min="0"
              step="0.01"
              value={valueBeforeDiscount}
              onChange={(e) => {
                let inputValue = e.target.value;
                // 移除前导的0
                if (inputValue.length > 1 && inputValue.startsWith('0')) {
                  inputValue = inputValue.replace(/^0+/, '');
                }
                // 使用正则表达式验证输入是否为有效的金额格式
                if (/^\d+(\.\d{0,2})?$/.test(inputValue)) {
                  setValueBeforeDiscount(inputValue);
                }
              }}
              placeholder="Example:88.00"
            />
            <p>产品折扣之前价格</p>
          </div>
        </div>
      </div>
      <div className={styles.display}>
        <div>
          <label>采集价 </label>{' '}
          <span style={{ color: '#ee0000', fontWeight: 'bold', fontSize: 16 }}>
            【必填,正数】
          </span>
          <Input
            prefix="￥"
            suffix="RMB"
            type="number"
            min="0"
            step="0.01"
            value={truePrice}
            onChange={(e) => {
              let inputValue = e.target.value;
              // 移除前导的0
              if (inputValue.length > 1 && inputValue.startsWith('0')) {
                inputValue = inputValue.replace(/^0+/, '');
              }
              // 使用正则表达式验证输入是否为有效的金额格式
              if (/^\d+(\.\d{0,2})?$/.test(inputValue)) {
                setTruePrice(inputValue);
              }
            }}
            placeholder="Example:98.00"
          />
        </div>
        <div>
          <label>根据采集价计算价格 </label>{' '}
          <a target="_blank" href="/backend/ratioCurrency">
            设置/展示具体换算比例
          </a>
          <Button
            style={{ display: 'block' }}
            type="primary"
            onClick={handleCalculate}
          >
            计算
          </Button>
        </div>
      </div>

      <div className={styles.display}>
        <div>
          <label>库存 </label>
          <input
            type="number"
            min="0"
            step="1"
            value={stockNum}
            onChange={(e) => {
              setStockNum(+e.target.value);
            }}
          />
          <p>留空或者填写0则为无法购买</p>
        </div>

        <div>
          <label>销量 </label>
          <input
            type="number"
            min="0"
            step="1"
            value={fraudSoldAmount}
            onChange={(e) => {
              setFraudSoldAmount(+e.target.value);
            }}
          />
          销量（自动更新）：0
        </div>
      </div>

      <div className={styles.remark}>
        <label>商品备注 </label>
        <textarea
          placeholder="商品备注，内部交流使用，只会在后台看到此字段"
          value={productRemark}
          onChange={(e) => {
            setProductRemark(e.target.value);
          }}
        ></textarea>
      </div>
      <div className={styles.remark}>
        <label>
          商品备注日文和中文输入会有输入问题，在本行写完后复制到上一行{' '}
        </label>
        <textarea placeholder="不写入服务器，单纯用来复制黏贴到上面的商品备注里"></textarea>
      </div>
      <div className={styles.display}>
        <div>
          <label>产品重量 </label>
          <input
            type="number"
            min="0"
            value={productWeight}
            onChange={(e) => {
              setProductWeight(+e.target.value);
            }}
          />
        </div>
        <div>
          <label>收藏计数(虚拟) </label>
          <input
            type="number"
            min="0"
            step="1"
            value={fraudWishList}
            onChange={(e) => {
              setFraudWishList(+e.target.value);
            }}
          />
          虚拟收藏（自动更新）：0
        </div>
      </div>
    </div>
  );
};
export default App;

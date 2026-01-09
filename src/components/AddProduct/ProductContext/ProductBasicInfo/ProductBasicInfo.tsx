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
              deliveryCost,
              adjustment,
              additionProfit,
              budgetRangeMin,
              budgetRangeMax,
            ] = row.split(';;');

            return {
              key: index + 1,
              minPrice: parseFloat(minPrice),
              maxPrice: parseFloat(maxPrice),
              coefficient: parseFloat(coefficient),
              deliveryCost: parseFloat(deliveryCost),
              adjustment: parseFloat(adjustment),
              additionProfit: parseFloat(additionProfit),
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
    console.log(truePrice, initialRatio)
    for (; i < initialRatio.length; i++) {
      if (
        truePrice > initialRatio[i].minPrice &&
        truePrice <= initialRatio[i].maxPrice
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
      +truePrice * initialRatio[i].coefficient + initialRatio[i].deliveryCost +
      initialRatio[i].additionProfit +
      initialRatio[i].adjustment;
    // 随机选择小数部分结尾
    const endings = [0.99, 0.98, 0.97, 0.96, 0.95];
    const randomEnding = endings[Math.floor(Math.random() * endings.length)];

    // 保留整数部分，加上随机小数部分
    const finalValue = Math.floor(newValueBeforeDiscount) + randomEnding;

    setValueBeforeDiscount("" + finalValue);
    // finalValue 已经计算好并带随机结尾
    const minMultiplier = 1.15;
    const maxMultiplier = 1.4;

    // 随机生成 1.2~1.4 的系数
    const randomMultiplier = Math.random() * (maxMultiplier - minMultiplier) + minMultiplier;

    // original 价格
    const originalPrice = +(finalValue * randomMultiplier).toFixed(2); // 保留两位小数
    setOriginValue("" + originalPrice);
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

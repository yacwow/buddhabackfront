// 全局共享数据示例
import { useState } from 'react';

const useUser = () => {
  const [originValue, setOriginValue] = useState('0');
  const [valueBeforeDiscount, setValueBeforeDiscount] = useState('0');
  const [buyPrice, setBuyPrice] = useState('0');
  const [truePrice, setTruePrice] = useState('0');
  const [stockNum, setStockNum] = useState(9999);
  const [fraudSoldAmount, setFraudSoldAmount] = useState(0);
  const [fraudCommentNum, setFraudCommentNum] = useState('');
  const [fraudCommentSummary, setFraudCommentSummary] = useState('');
  const [productRemark, setProductRemark] = useState('');
  const [productWeight, setProductWeight] = useState(0);
  const [fraudWishList, setFraudWishList] = useState(0);
  return {
    originValue,
    setOriginValue,
    valueBeforeDiscount,
    setValueBeforeDiscount,
    buyPrice,
    setBuyPrice,
    truePrice,
    setTruePrice,
    setStockNum,
    stockNum,
    fraudSoldAmount,
    setFraudSoldAmount,
    fraudCommentNum,
    setFraudCommentNum,
    productRemark,
    setProductRemark,
    productWeight,
    fraudWishList,
    setProductWeight,
    setFraudWishList,
    fraudCommentSummary,
    setFraudCommentSummary,
  };
};

export default useUser;

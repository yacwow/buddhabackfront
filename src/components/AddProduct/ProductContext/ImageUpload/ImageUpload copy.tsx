import { insertProductPictureForOneProduct } from '@/utils/findOutExist';
import { request } from '@umijs/max';
import { useModel } from '@umijs/max';
import { Button, message, Image, Input, InputNumber } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './ImageUpload.less';
interface Props {
  weekSale?: number;
  sortSold?: number;
  weekOrder?: number;
  sortOrder?: number;
  url: string;
  sortNum?: number;
  color: string;
  color2?: string;
  index: number;
  item: {
    weekSale?: number;
    sortSold?: number;
    weekOrder?: number;
    sortOrder?: number;
    url: string;
    sortNum?: number;
    color: string;
    color2?: string;
    priceVariate?: string;
    variateValue?: string;
    index: number;
    listPrice: number;
    price: number;
  };
}
const App: React.FC<Props> = (props) => {
  const {
    weekSale = 0,
    sortSold = 0,
    weekOrder = 0,
    sortOrder = 0,
    // price = 0,
    // commentNum = 0,
    url = '',
    sortNum = 0,
    index,
    color = '',
    item,
  } = props;
  // console.log(sortNum);
  // console.log(item);
  const {
    successFileList,
    setSuccessFileList,
    setBigImgSuccessList,
    productId,
    smallImgSuccessList,
    setSmallImgSuccessList
  } = useModel('productUpdateData');
  const handleDragStart = (e: any) => {
    // console.log(productId);
    console.log(e);
    // e.dataTransfer.setData('productId', productId);
    console.log(e.nativeEvent.target);
    e.nativeEvent.target.style.opacity = '0.5';
    e.dataTransfer.setData('index', sortNum);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragEnd = (e: any) => {
    e.nativeEvent.target.style.opacity = '1';
  };
  const handleDragOver = (e: any) => {
    e.preventDefault();
  };
  const handleDropDom = (e: any) => {
    e.preventDefault();
    let newIndex = e.dataTransfer.getData('index');
    console.log(newIndex);
    if (+newIndex === sortNum) {
      return;
    }
    console.log(+newIndex, sortNum);

    let newSuccessFileList = insertProductPictureForOneProduct(
      successFileList,
      +newIndex,
      sortNum,
    );
    console.log(newSuccessFileList);
    setSuccessFileList([...newSuccessFileList]);

    setBigImgSuccessList([{ url: newSuccessFileList[0].url, size: 0 }]);
  };

  //   input输入 enter事件
  const handleKeyDown = (e: any) => {
    let newSuccessFileList = structuredClone(successFileList);
    for (let i = 0; i < newSuccessFileList.length; i++) {
      if (newSuccessFileList[i].index === item.index) {
        newSuccessFileList[i].color = e.target.value;
      }
    }
    setSuccessFileList(newSuccessFileList);

    





  };

  const handleDeletePicture = (targetUrl: string) => {
    // console.log(targetUrl);
    // let url = require('url');
    // let obj = url.parse(targetUrl, true);
    // let delPath = obj.path;
    // console.log('obj.path', obj.path);

    //删除该url
    request(`/admin/secure/deletePicture`, {
      params: { delPath: targetUrl, productId: +productId },
    }).then((data) => {
      if (data.result) {
        //删除成功
        message.success('删除成功');
        let newSuccessFileList = successFileList.filter((item) => {
          return item.url !== targetUrl;
        });
        let sortedSmallImgSrc = newSuccessFileList.map(
          (item: any, index: number) => {
            item.sortNum = newSuccessFileList.length - index;
            return item;
          },
        );
        if (sortedSmallImgSrc.length === 0) {
          setBigImgSuccessList([{ url: '', size: 0 }]);
        } else {
          setBigImgSuccessList([{ url: sortedSmallImgSrc[0].url, size: 0 }]);
        }

        setSuccessFileList(sortedSmallImgSrc);
      } else {
        message.error('删除失败');
      }
    });
  };
  useEffect(() => { }, [successFileList]);

  const [draggableState, setDraggableState] = useState(true);
  //下面pricevariable的部分的输入框
  const handlePriceVariable = (
    item: {
      weekSale?: number;
      sortSold?: number;
      weekOrder?: number;
      sortOrder?: number;
      url: string;
      sortNum?: number;
      color: string;
      color2?: string;
      priceVariate?: string;
      variateValue?: string;
      index: number;
    },
    value: string,
    index: number,
  ) => {
    console.log(value, index, successFileList);
    if (index === 1) {
      let newSuccessFileList = structuredClone(successFileList);
      newSuccessFileList.map((item1) => {
        if (item.index === item1.index) {
          item1.priceVariate = value;
        }
        return item1;
      });
      setSuccessFileList(newSuccessFileList);
    } else if (index === 2) {
      let newSuccessFileList = structuredClone(successFileList);
      newSuccessFileList.map((item1) => {
        if (item.index === item1.index) {
          item1.variateValue = value;
        }
        return item1
      });
      setSuccessFileList(newSuccessFileList);
    }
  };
  return (
    <div
      id={`${productId}`}
      className={styles.container}
      draggable={draggableState}
      onDragStart={(e) => handleDragStart(e)}
      onDragOver={handleDragOver}
      onDrop={handleDropDom}
      onDragEnd={handleDragEnd}
      style={{ height: 320 }}
    >
      <div style={{ position: 'relative' }}>
        {/* <img src={url} alt="" style={{ height: 140, width: 140 }} /> */}
        <Image
          style={{
            border: 'none',
            pointerEvents: 'none',
          }}
          width={140}
          height={140}
          src={`${url}`}
        />
      </div>
      <div>
        <input
          placeholder="请输入颜色，可以为空"
          className={styles.input}
          data-rank={sortNum}
          onChange={handleKeyDown}
          value={color}
          onClick={() => {
            setDraggableState(false);
          }}
          onBlur={() => {
            setDraggableState(true);
          }}
        />
        {item.color ? (
          <div>
            折扣之前价格：
            <Input
              value={item.priceVariate ? item.priceVariate : ''}
              style={{ width: 140 }}
              onChange={(e) => {
                const value = e.target.value;
                // 只获取最后一位字符
                const lastChar = value[value.length - 1];
                console.log(value, lastChar);
                // 如果最后一位字符是 '+' 或者 '-'
                if (lastChar === '+' || lastChar === '-') {
                  handlePriceVariable(item, lastChar, 1);
                }
              }}
            />
            折扣价:
            <InputNumber
              min="0"
              step="0.01"
              value={item.variateValue ? item.variateValue : ''}
              style={{ width: 140 }}
              onChange={(value) => {
                // 如果输入为 null，则传递 0 给处理函数
                if (value === null) {
                  handlePriceVariable(item, '0', 2);
                  return; // 停止执行后续逻辑
                }
                // 将输入值转换为字符串，以便进行正则匹配
                const valueStr = String(value);
                // 使用正则表达式验证输入是否是一个两位小数的数字
                if (/^\d+(\.\d{0,2})?$/.test(valueStr)) {
                  handlePriceVariable(item, value, 2);
                }
              }}
            />
          </div>
        ) : (
          <div style={{ height: 110 }}></div>
        )}
        <div>
          <Button danger onClick={() => handleDeletePicture(url)}>
            点击删除图片
          </Button>
        </div>
        {/*
        <p> 出单时间:2023-04-07</p>
        <p style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#00008b' }}>
            周销量:<span>{weekSale}</span>
          </span>
          <span>
            销量:<span>{sortSold}</span>
          </span>
        </p>
        <p style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#00008b' }}>
            周下单:<span>{weekOrder}</span>
          </span>
          <span>
            下单:<span>{sortOrder}</span>
          </span>
        </p> */}
        {/* <p> 价格:{price} </p> */}
      </div>
    </div>
  );
};
export default App;

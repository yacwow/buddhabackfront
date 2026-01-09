
import { useModel } from '@umijs/max';
import { Button, message, Image, } from 'antd';
import React, { useState } from 'react';
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
  groupIndex: number;
  itemIndex: number;
  setDraggableState: React.Dispatch<React.SetStateAction<boolean>>;
  draggableState: boolean
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
    groupIndex,
    itemIndex,
    setDraggableState,
    draggableState,
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

  const [inputValues, setInputValues] = useState<string>(color);


  const handleDragStart = (e: any) => {
    // // 如果是 input 触发的事件，则不拖拽
    // console.log((e.target as HTMLElement).tagName)
    // const activeEl = document.activeElement;
    // console.log(activeEl)
    // if ((e.target as HTMLElement).tagName === 'INPUT') {
    //   e.preventDefault(); // 阻止默认拖拽行为
    //   return;
    // }
    // e.stopPropagation(); // 阻止事件冒泡
    // // console.log(productId);
    // console.log(e);
    // // e.dataTransfer.setData('productId', productId);
    // console.log(e.nativeEvent.target);
    e.nativeEvent.target.style.opacity = '0.9';
    e.dataTransfer.setData('groupIndex', groupIndex);
    e.dataTransfer.setData('itemIndex', itemIndex);
    // console.log(groupIndex, itemIndex)
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragEnd = (e: any) => {
    e.nativeEvent.target.style.opacity = '1';
    // 新增：强制重置拖拽状态
    e.dataTransfer.clearData();
    e.dataTransfer.setDragImage(document.createElement("img"), 0, 0); // 清除拖拽预览
  };
  const handleDragOver = (e: any) => {
    e.preventDefault();
  };
  const handleDropDom = (e: any) => {
    e.preventDefault();
    e.stopPropagation(); // 阻止事件冒泡

    // 获取拖拽源的 groupIndex 和 itemIndex
    const newGroupIndex = +e.dataTransfer.getData('groupIndex');
    const newItemIndex = +e.dataTransfer.getData('itemIndex');

    // console.log(newGroupIndex, newItemIndex,);//0 1
    // console.log(groupIndex, itemIndex)//1 0
    // 如果是拖拽到自己身上，直接返回
    if (newGroupIndex === groupIndex && newItemIndex === itemIndex) return;

    // 深拷贝数组
    let newSmallImgSuccessList = structuredClone(smallImgSuccessList);

    // 获取拖拽源项
    const sourceItem = newSmallImgSuccessList[newGroupIndex][newItemIndex];

    // 如果是同数组内的拖拽
    if (newGroupIndex === groupIndex) {
      // 交换位置
      const fromItem = newSmallImgSuccessList[groupIndex][newItemIndex];
      const toItem = newSmallImgSuccessList[groupIndex][itemIndex];
      newSmallImgSuccessList[groupIndex][itemIndex] = fromItem;
      newSmallImgSuccessList[groupIndex][newItemIndex] = toItem;
    }
    // 如果是跨数组的拖拽
    else {
      // 获取目标项
      const targetItem = newSmallImgSuccessList[groupIndex][itemIndex];

      // 检查目标数组是否有相同 url
      if (newSmallImgSuccessList[groupIndex]?.some(item => item.url === sourceItem.url)) {
        message.error("目标组存在相同 url 的项，拖拽操作无效");
        return;
      }
      if (newSmallImgSuccessList[newGroupIndex]?.some(item => item.url === targetItem.url)) {
        message.error("被拖拽组存在相同 url 的项，拖拽操作无效");
        return;
      }
      const newTargetItem = newSmallImgSuccessList[newGroupIndex][newItemIndex];
      const newTargetItmColor = newTargetItem.color;
      const targetItemColor = targetItem.color;
      newTargetItem.color = targetItemColor;
      targetItem.color = newTargetItmColor;
      // 互换两个数组中的指定项
      newSmallImgSuccessList[newGroupIndex][newItemIndex] = targetItem;
      newSmallImgSuccessList[groupIndex][itemIndex] = sourceItem;
    }

    // 更新状态
    setSmallImgSuccessList(newSmallImgSuccessList);
    setBigImgSuccessList([{ url: newSmallImgSuccessList[0][0].url, size: 0 }]);
  };


  //   input输入 enter事件
  const handleKeyDown = (groupIndex: number, itemIndex: number, color: string) => {
    console.log(groupIndex, itemIndex, color, smallImgSuccessList)

    let newColor = color.trim(); // 清除前后空格
    // if (newColor === inputValues.trim()) return;
    setSmallImgSuccessList((prev) => {
      let newList = structuredClone(prev); // 深拷贝数组，防止引用问题

      const targetItem = newList[groupIndex]?.[itemIndex];
      if (!targetItem) return prev; // 如果目标项不存在，直接返回原数据

      // 删除原位置的项
      newList[groupIndex].splice(itemIndex, 1);

      // 处理颜色，空字符串归类到 "No Color"
      let key; // 如果输入为空，则归类到 "No Color"
      if (newColor.trim() === "") {
        setInputValues("")
        key = "No Color"
      } else {
        key = newColor.trim()
      }
      // 查找目标组
      let targetGroup = newList.find(group => group[0]?.color === key);
      console.log(targetGroup)
      if (targetGroup) {
        targetGroup.push({ ...targetItem, color: newColor.trim() });
      } else {
        // 如果没有该颜色组，则创建新组
        if (key === "No Color") {
          console.log(targetItem)
          let noColorGroup = newList.find(group => group[0]?.color === "");
          const noColorGroupIndex = newList.findIndex(group => group[0]?.color === "");
          if (noColorGroup) {
            newList[noColorGroupIndex] = [...noColorGroup, { ...targetItem, color: "" }]
          } else {
            newList.push([{ ...targetItem, color: newColor.trim() }]); // "No Color" 组创建
          }

        } else {
          // 如果颜色有值，确保只有该颜色项归类
          console.log(targetItem)
          newList.push([{ ...targetItem, color: newColor.trim() }]);
        }
      }

      // 移除空的组
      newList = newList.filter(group => group.length > 0);
     
      //这个代码其实本身不需要的，但是存在一种可能，整个产品由于某种原因所有的图片都没有颜色但是实实在在的上传上去了，
      //这种情况下，如果没有下面的代码，那么addproduct组件里面的时候，不能通过message.info('必须有一张小图有颜色', 3); 这一行的自测
      const successFileList = newList.flat().map(item => ({
        ...item,
        listPrice: item.listPrice ?? 0   // 如果 listPrice 缺失，则补成 0 或你想要的默认值
      }));
      setSuccessFileList(successFileList);



      return [...newList]; // 更新状态并强制重新渲染
    });

  };

  const handleDeletePicture = (itemIndex: number, groupIndex: number) => {
    // console.log(targetUrl);
    // let url = require('url');
    // let obj = url.parse(targetUrl, true);
    // let delPath = obj.path;
    // console.log('obj.path', obj.path);

    // //删除该url
    // request(`/admin/secure/deletePicture`, {
    //   params: { delPath: targetUrl, productId: +productId },
    // }).then((data) => {
    //   if (data.result) {
    //     //删除成功
    //     message.success('删除成功');
    //     let newSuccessFileList = successFileList.filter((item) => {
    //       return item.url !== targetUrl;
    //     });
    //     let sortedSmallImgSrc = newSuccessFileList.map(
    //       (item: any, index: number) => {
    //         item.sortNum = newSuccessFileList.length - index;
    //         return item;
    //       },
    //     );
    //     if (sortedSmallImgSrc.length === 0) {
    //       setBigImgSuccessList([{ url: '', size: 0 }]);
    //     } else {
    //       setBigImgSuccessList([{ url: sortedSmallImgSrc[0].url, size: 0 }]);
    //     }

    //     setSuccessFileList(sortedSmallImgSrc);
    //   } else {
    //     message.error('删除失败');
    //   }
    // });
    //目前不在后台删除oss的图片，不需要上传上去；
    message.success('删除成功');
    // 深拷贝数组
    let newSmallImgSuccessList = structuredClone(smallImgSuccessList);

    // 检查源组是否有效
    if (!newSmallImgSuccessList[groupIndex] || newSmallImgSuccessList[groupIndex].length === 0) {
      console.error("源组无效或为空");
      return;
    }

    // 删除指定位置的项
    newSmallImgSuccessList[groupIndex].splice(itemIndex, 1);

    // 如果删除后数组为空，移除该组
    if (newSmallImgSuccessList[groupIndex].length === 0) {
      newSmallImgSuccessList.splice(groupIndex, 1);
    }

    // 更新状态
    setSmallImgSuccessList(newSmallImgSuccessList);
    setBigImgSuccessList([{ url: newSmallImgSuccessList[0]?.[0]?.url || "", size: 0 }]);
  };





  return (
    <div
      draggable={draggableState}
      id={`${url + groupIndex + itemIndex}`}
      className={styles.container}
      onDragStart={(e) => handleDragStart(e)}
      onDragOver={handleDragOver}
      onDrop={handleDropDom}
      onDragEnd={handleDragEnd}
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
          placeholder="请输入颜色"
          className={styles.input}
          data-rank={sortNum}
          onChange={(e) => {
            setInputValues(e.target.value)
          }}
          value={inputValues}
          draggable={false}
          onBlur={(e) => {
            if (smallImgSuccessList[groupIndex][itemIndex].color === e.target.value.trim()) {
            } else {
              handleKeyDown(groupIndex, itemIndex, e.target.value)
            }

            setDraggableState(true);
          }}
          onMouseDown={() => {
            setDraggableState(false);
          }}

          style={{ pointerEvents: 'auto' }} // 🚨 确保 input 独立响应点击
        />
        {/* {item.color ? (
          <div>
            价格变化(只能+/-)：
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
            值:
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
        )} */}
        <div>
          <Button danger onClick={() => handleDeletePicture(itemIndex, groupIndex)}>
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

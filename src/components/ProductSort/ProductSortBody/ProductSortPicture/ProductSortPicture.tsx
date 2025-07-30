import { checkExists, insertOneProduct } from '@/utils/findOutExist';
import { request } from '@umijs/max';
import { useModel } from '@umijs/max';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './ProductSortPicture.less';
import { NavLink } from '@umijs/max';
interface Props {
  // clicked: boolean;
  rank: number;
  weekSale?: number;
  sortSold?: number;
  weekOrder?: number;
  sortOrder?: number;
  price: number;
  productId: number;
  commentNum?: number;
  categoryRank?: number;
  bigimgsrc: string;
}
const App: React.FC<Props> = (props) => {
  const {
    rank,
    weekSale = 0,
    sortSold = 0,
    weekOrder = 0,
    sortOrder = 0,
    price,
    productId,
    commentNum = 0,
    bigimgsrc,
  } = props;
  const [checked, setChecked] = useState(false);
  const [inputValue, setInputValue] = useState('');
  //   每一张照片都有input 可能会修改tabledata
  const { tableData, setTableData, selectedData, setSelectedData } =
    useModel('productSortData222');

  const handleDragStart = (e: any) => {
    // console.log(productId);
    // console.log(e);
    // e.dataTransfer.setData('productId', productId);
    console.log(e.nativeEvent.target);
    e.nativeEvent.target.style.opacity = '0.5';
    console.log(e.nativeEvent.target);
    e.dataTransfer.setData('index', rank - 1);
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
    if (newIndex === rank - 1) {
      return;
    }
    setTableData([...insertOneProduct(tableData, newIndex, rank - 1)]);
  };

  const handleClick = () => {
    console.log(selectedData);
    let tempSelectedData = JSON.parse(JSON.stringify(selectedData));
    tempSelectedData[rank - 1] = !tempSelectedData[rank - 1];
    selectedData[rank - 1] = !selectedData[rank - 1];
    console.log(selectedData);
    setSelectedData([...tempSelectedData]);
    setChecked(selectedData[rank - 1]);
    // setTest(!test);
  };
  //   input输入 enter事件
  const handleKeyDown = (e: any) => {
    // console.log(e);
    if (isNaN(+e.target.value)) {
      message.error('必须是数字，请检查', 3);
      return;
    }
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      //如果是同一个页面的数据，那么直接修改tabledata并返回
      let targetRank = e.target.dataset.rank; //在哪个框输入的,注意从1开始的
      //   let targetCategoryRank = e.target.dataset.categoryrank; //该输入框排序的值是多少
      //   let produtId = e.target.dataset.product; //从这个productid之前的 每个的rank都需要+1
      if (+e.target.value === productId) return;
      let val = checkExists(tableData, e.target.value);
      if (val !== false) {
        setTableData([...insertOneProduct(tableData, +val, targetRank - 1)]);
      } else {
        let path = location.pathname;
        let arr = path.split('/');
        if (arr[3] === 'eventType') {
          // 先请求信息，查看是否属于该类产品，如果是就返回该产品的基础信息
          request(`/admin/secure/getSingleSpecialEventProductInfo`, {
            params: {
              productId: e.target.value.trim(),
              code: arr[4],
            },
          }).then((data) => {
            if (data.result) {
              // 获取了数据,把数据插入到table里面去
              let tempTableData = [...tableData];
              let newInsertProduct = data.data;
              newInsertProduct.rank = tableData[0].rank + 1;
              tempTableData.splice(0, 0, newInsertProduct);
              setTableData([...tempTableData]);
            } else {
              message.error('不是当前勾选类的产品/不存在该商品', 3);
            }
          });
        } else {
          if (arr[3] === 'categoryType' && arr.length >= 6) {
            const decodedString = decodeURIComponent(arr[5]);
            // 先请求信息，查看是否属于该类产品，如果是就返回该产品的基础信息
            request(`/admin/secure/getSingleProductInfo`, {
              params: {
                productId: +e.target.value,
                categoryInfo: decodedString,
              },
            }).then((data) => {
              if (data.result) {
                // 获取了数据,把数据插入到table里面去
                let tempTableData = [...tableData];
                let newInsertProduct = data.data;
                newInsertProduct.rank = tableData[0].rank + 1;
                tempTableData.splice(0, 0, newInsertProduct);
                setTableData([...tempTableData]);
              } else {
                message.error('不是当前分类的产品/不存在该商品', 3);
              }
            });
          } else {
            message.error('url有点问题，程序员的锅', 3);
          }
        }
      }
      setInputValue('');
    }
  };
  useEffect(() => {
    setChecked(selectedData[rank - 1]);
  }, [selectedData[rank - 1]]);
  return (
    <div
      id={`${productId}`}
      className={styles.container}
      draggable
      onDragStart={(productId) => handleDragStart(productId)}
      onDragOver={handleDragOver}
      onDrop={handleDropDom}
      onDragEnd={handleDragEnd}
    >
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: 8, left: 8 }}>
          <input
            type="checkbox"
            checked={checked}
            onChange={handleClick}
            style={{ width: 30, height: 30 }}
          />
        </div>
        <div className={styles.rank}>{rank}</div>
        <img
          src={bigimgsrc}
          style={{
            border: 'none',
            width: 190,
            height: 190,
            pointerEvents: 'none',
          }}
        />
        <span className={styles.line}>
          {Math.floor((rank - 1) / 4) + 1}行{rank % 4 === 0 ? 4 : rank % 4}列
        </span>
      </div>
      <div>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="请输入产品id"
          className={styles.input}
          type="number"
          data-rank={rank}
          onKeyDown={handleKeyDown}
        />
        <p style={{ color: '#108EE9' }}>
          <NavLink
            style={{ color: '#108EE9', textDecoration: 'none' }}
            to={`/backend/product/productContext/${productId}`}
          >
            商品ID:{productId}
          </NavLink>
          <span style={{ float: 'right' }}>评论数:{commentNum}</span>
        </p>
        <p> 最近出单时间:2023-04-07</p>
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
        </p>
        <p> 价格:${price} </p>
      </div>
    </div>
  );
};
export default App;

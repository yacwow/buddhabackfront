import React from 'react';
import styles from './SingleHomePagePictureComp.less';
import { NavLink } from '@umijs/max';
interface Props {
  homePageProductTableData: {
    bigImgSrc: string;
    href: string;
    listPrice: string;
    newPrice: number;
    productId: number;
    stockStatus: string;
  }[];
  setHomePageProductTableData: any;
  setProductIdList: any;
}
const App: React.FC<Props> = (props) => {
  const {
    homePageProductTableData,
    setHomePageProductTableData,
    setProductIdList,
  } = props;
  const handleDragStart = (e, productId, index) => {
    // console.log(productId);
    // console.log(e);
    // e.dataTransfer.setData('productId', productId);

    e.nativeEvent.target.style.opacity = '0.5';

    e.dataTransfer.setData('index', index);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragEnd = (e) => {
    e.nativeEvent.target.style.opacity = '1';
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDropDom = (e, productId, index) => {
    e.preventDefault();
    let newIndex = e.dataTransfer.getData('index');
    console.log(newIndex);
    if (newIndex === index) {
      return;
    }
    console.log(newIndex, index);
    let newHomePageProductTableData = structuredClone(homePageProductTableData);
    let originOne = newHomePageProductTableData[newIndex];
    let targetOne = newHomePageProductTableData[index];
    newHomePageProductTableData[newIndex] = targetOne;
    newHomePageProductTableData[index] = originOne;
    setHomePageProductTableData(newHomePageProductTableData);
    let productIds = '';
    for (let i = 0; i < newHomePageProductTableData.length; i++) {
      productIds += newHomePageProductTableData[i].productId + ',';
    }
    setProductIdList(productIds);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'start',
        flexWrap: 'wrap',
      }}
    >
      {homePageProductTableData.map((item, index: number) => {
        return (
          <div
            key={index}
            id={`${item.productId}`}
            className={styles.container}
            draggable
            onDragStart={(e) => handleDragStart(e, item.productId, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropDom(e, item.productId, index)}
            onDragEnd={handleDragEnd}
          >
            <div style={{ position: 'relative' }}>
              <div className={styles.rank}>{index}</div>
              <img
                src={item.bigImgSrc}
                style={{
                  border: 'none',
                  width: 190,
                  height: 190,
                  pointerEvents: 'none',
                }}
              />
            </div>
            <div>
              <p style={{ color: '#108EE9' }}>
                <NavLink
                  style={{ color: '#108EE9', textDecoration: 'none' }}
                  to={`/backend/product/${item.productId}`}
                >
                  商品ID:{item.productId}
                </NavLink>
              </p>
              <p> 原价格:{item.listPrice} </p>
              <p> 新价格:{item.newPrice} </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default App;

import { useModel } from '@umijs/max';
import React from 'react';
import ProductSortPicture from './ProductSortPicture';
import styles from './ProductSortBody.less';

interface Props {
  tableData: any[];
}

const App: React.FC<Props> = (props) => {
  const { tableData } = props;
  const { salesInfo } = useModel('productSortData222');

  const buildLi = () => {
    return tableData.map((item, index: number) => {
      let pro: any = {};
      if (salesInfo[item.idproduct]) {
        pro.weekSale = salesInfo[item.idproduct].weekSale
          ? salesInfo[item.idproduct].weekSale
          : 0;
        pro.weekOrder = salesInfo[item.idproduct].weekSold
          ? salesInfo[item.idproduct].weekSold
          : 0;
        pro.sortSold = salesInfo[item.idproduct].sortSold
          ? salesInfo[item.idproduct].sortSold
          : 0;
        pro.sortOrder = salesInfo[item.idproduct].sortOrder
          ? salesInfo[item.idproduct].sortOrder
          : 0;
      } else {
        pro.weekSale = 0;
        pro.weekOrder = 0;
        pro.sortSold = 0;
        pro.sortOrder = 0;
      }
      return (
        <ProductSortPicture
          key={index}
          // clicked={selectedData[index]}
          rank={index + 1}
          price={item.price}
          commentNum={item.commentNum}
          productId={item.idproduct}
          // categoryRank={item.rank}
          bigimgsrc={item.bigimgsrc}
          {...pro}
        />
      );
    });
  };

  return (
    <div className={`${styles.container} productSortBodyForDisplay`}>
      {buildLi()}
    </div>
  );
};
export default App;

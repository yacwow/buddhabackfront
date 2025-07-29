import LayOut from '@/components/LayOut';
import CartMayLikeComp from '@/components/WebDesignData/CartMayLikeComp';
import { request, useModel } from '@umijs/max';
import React, { useEffect, useState } from 'react';
const App: React.FC = () => {
  const {
    setCategorySpecialEventSuccessFileList,
  } = useModel('categoryManagement');
  const { treeDataArr, setTreeDataArr } = useModel('global');
  const [selectedCategories, setSelectedCategories] = useState<
    { title: string; value: string }[]
  >([]);
  useEffect(() => {
    if (treeDataArr.length === 0) {
      //为了获取分类下拉列表，同时懒得在做一个请求了
      request('/admin/secure/getHomePageCategoryInfo').then((data) => {
        if (data.result) {
          let tempTreeDataArr = [];
          tempTreeDataArr.push(...data.data.categoryDetail);
          tempTreeDataArr.push({
            title: "Best Seller",
            value: "/bestSeller?page=1",
            key: "/bestSeller?page=1",
          });
          tempTreeDataArr.push({
            title: "Discount-70%",
            value: "/saveUpTo70?page=1",
            key: "/saveUpTo70?page=1",
          });
          tempTreeDataArr.push({
            title: "Trending Now",
            value: "/trending?page=1",
            key: "/trending?page=1",
          });
          tempTreeDataArr.push({
            title: "自定义",
            value: "",
            key: "自定义",
          });
          setTreeDataArr(tempTreeDataArr);
          setCategorySpecialEventSuccessFileList(data.data.categoryInfo);
        }
      });
    }
    //获取cart下面分类的信息
    request('/admin/secure/getCartMayLikeData').then((data) => {
      if (data.result) {
        setSelectedCategories(JSON.parse(data.data.cartMayLikeData));
      }
    });
  }, []);
  return (
    <LayOut>
      <CartMayLikeComp
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
    </LayOut>
  );
};
export default App;

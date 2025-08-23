import LayOut from '@/components/LayOut';
import ShowCategoryInHomePageBottomComp from '@/components/WebDesignData/ShowCategoryInHomePageBottomComp';
import { request, useModel } from '@umijs/max';
import React, { useEffect } from 'react';

const App: React.FC = () => {
  const { treeDataArr, setTreeDataArr, setHomeBottomCategoryInfo } =
    useModel('global');
  const {
    categorySpecialEventSuccessFileList,
    setCategorySpecialEventSuccessFileList,
  } = useModel('categoryManagement');
  useEffect(() => {
    if (
      treeDataArr.length === 0 ||
      categorySpecialEventSuccessFileList.length === 0
    ) {
      //为了获取分类下拉列表，同时懒得在做一个请求了
      request('/admin/secure/getHomePageCategoryInfo').then((data) => {
        if (data.result) {
          // let tempTreeDataArr = [];
          // tempTreeDataArr.push(...data.data.categoryDetail);
          // tempTreeDataArr.push({
          //   title: "Best Seller",
          //   value: "/bestSeller?page=1",
          //   key: "/bestSeller?page=1",
          // });
          // tempTreeDataArr.push({
          //   title: "Discount-70%",
          //   value: "/saveUpTo70?page=1",
          //   key: "/saveUpTo70?page=1",
          // });
          // tempTreeDataArr.push({
          //   title: "Trending Now",
          //   value: "/trending?page=1",
          //   key: "/trending?page=1",
          // });
          // tempTreeDataArr.push({
          //   title: "自定义",
          //   value: "",
          //   key: "自定义",
          // });
          // setTreeDataArr(tempTreeDataArr);
          setTreeDataArr(data.data.categoryDetail)
          setCategorySpecialEventSuccessFileList(data.data.categoryInfo);
        }
      });
    }

    request('/admin/secure/getHomeBottomCategoryInfo').then((data) => {
      if (data.result) {
        setHomeBottomCategoryInfo(data.data.homeBottomCategoryInfo);
      }
    });
  }, []);
  return (
    <LayOut>
      <h3>目前该组件没用--直接从衣服那个项目抄过来的，那个项目是三个level的category，这个是两个，想用以后改</h3>
      <ShowCategoryInHomePageBottomComp />
    </LayOut>
  );
};
export default App;

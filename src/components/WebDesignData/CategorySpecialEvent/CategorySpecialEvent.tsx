import { request } from '@umijs/max';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import StructurePictureImgUpload from '../StructurePicture/StructurePictureImgUpload';
import FirstLevelCategoryDrawer from './FirstLevelCategoryDrawer';
import { useModel } from '@umijs/max';

const App: React.FC = () => {
  //主页的category的模块的数据
  const {
    categorySpecialEventSuccessFileList,
    setCategorySpecialEventSuccessFileList,
  } = useModel('categoryManagement');
  const { treeDataArr, setTreeDataArr } = useModel('global');

  const [leftDrawerCategoryInfo, setLeftDrawerCategoryInfo] = useState<
    { imgSrc: string; categoryName: string; myCategoryId: number }[]
  >([]); //左侧drawer的数据
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
    request('/admin/secure/getFirstLevelCategoryInfo').then((data) => {
      if (data.result) {
        setLeftDrawerCategoryInfo(data.data.firstLevelCategoryInfo);
      }
    });
  }, []);
  const [categoryTreeDataArr, setCategoryTreeDataArr] = useState<
    {
      imgSrc?: string;
      title: string;
      value: string;
      categoryId?: number;
      author?: string;
      updateTime?: string;
      children?: {
        imgSrc: string;
        title: string;
        value: string;
        categoryId: number;
        author: string;
        updateTime: string;
        children: {
          imgSrc: string;
          title: string;
          value: string;
          categoryId: number;
          author: string;
          updateTime: string;
        }[];
      }[];
    }[]
  >([]);
  useEffect(() => {
    if (treeDataArr.length > 0) {
      let tempTreeDataArr = [];
      tempTreeDataArr.push(...treeDataArr);
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
      setCategoryTreeDataArr(tempTreeDataArr);
    }
  }, [treeDataArr]);

  useEffect(() => {
    console.log(leftDrawerCategoryInfo);
  }, [leftDrawerCategoryInfo]);
  return (
    <div>
      请选择所有的你想显示在前端主页的Category
      <br />
      {
        <StructurePictureImgUpload
          treeDataArr={categoryTreeDataArr}
          controlledParam="category"
          setSuccessFileList={setCategorySpecialEventSuccessFileList}
          successFileList={categorySpecialEventSuccessFileList}
        />
      }
      <div style={{ marginTop: 40 }}></div>
      <h3 style={{ color: 'red' }}>侧边栏一级分类的图片，目前前端没做该图片的展示</h3>
      <div style={{ display: 'flex', marginRight: 20, flexWrap: 'wrap' }}>
        {leftDrawerCategoryInfo.map((item, index) => {
          return (
            <FirstLevelCategoryDrawer
              key={index}
              infoList={item}
              setLeftDrawerCategoryInfo={setLeftDrawerCategoryInfo}
              leftDrawerCategoryInfo={leftDrawerCategoryInfo}
            />
          );
        })}
      </div>
      <Button
        type="primary"
        onClick={() => {
          request('/admin/secure/uploadFirstLevelCategoryPic', {
            params: { info: JSON.stringify(leftDrawerCategoryInfo) },
          }).then((data) => {
            if (data.result) {
              message.info({ content: 'success' }, 4);
            } else {
              message.error({ content: 'error' }, 4);
            }
          });
        }}
      >
        保存一级分类图片信息
      </Button>
    </div>
  );
};
export default App;

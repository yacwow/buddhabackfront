import { request } from '@umijs/max';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import StructurePictureImgUpload from '../StructurePicture/StructurePictureImgUpload';
import { bannerlistDataType } from '../StructurePicture/type';
import SingleHomePageComp from './SingleHomePageComp';
interface Props {}

const App: React.FC<Props> = (props) => {
  const [homePageInfoList, setHomePageInfoList] = useState([]); //所有原有的数据
  const [newHomePageInfo, setNewHomePageInfo] = useState<number[]>([]); //新增，主要用于map方法
  const [campaignsData, setCampaignsData] = useState<bannerlistDataType[]>([]); //lw CAMPAIGNS的数据
  useEffect(() => {
    request('/admin/secure/getAllHomePageData').then((data) => {
      if (data.result) {
        setHomePageInfoList(data.data.homePageInfo);
      }
    });
    request('/admin/secure/getHomePageCAMPAIGNS').then((data) => {
      if (data.result) {
        setCampaignsData(data.data.LWCAMPAIGNS);
      }
    });
  }, []);

  return (
    <div>
      <h2>
        该区域为主页轮播展示产品的模块控制。目前有闪订等，可自行添加，会展示在主页shop
        by category下面
      </h2>
      {homePageInfoList.map((item, index) => {
        return (
          <SingleHomePageComp
            key={index}
            productInfo={item}
            homePageInfoList={homePageInfoList}
            setHomePageInfoList={setHomePageInfoList}
          />
        );
      })}
      {newHomePageInfo.map((item, index) => {
        console.log(item);
        return (
          <SingleHomePageComp
            key={index}
            number={item}
            newHomePageInfo={newHomePageInfo}
            setNewHomePageInfo={setNewHomePageInfo}
            homePageInfoList={homePageInfoList}
            setHomePageInfoList={setHomePageInfoList}
          />
        );
      })}
      <Button
        onClick={() => {
          console.log(newHomePageInfo.length);
          let homepage = structuredClone(newHomePageInfo);
          homepage.push(newHomePageInfo.length);
          setNewHomePageInfo(homepage);
        }}
        type="primary"
        size="large"
        style={{ position: 'fixed', left: 1200, top: 100 }}
      >
        主页添加新的模块
      </Button>

      <div style={{ height: 300 }}></div>
      <h3 style={{ color: 'red' }}>主页的LW CAMPAIGNS设置</h3>
      <span>图片需要是300*477这种相似比例的，否则看上去很蠢</span>
      {
        <StructurePictureImgUpload
          successFileList={campaignsData}
          setSuccessFileList={setCampaignsData}
          controlledParam={'LWCAMPAIGNS'}
        />
      }
    </div>
  );
};
export default App;

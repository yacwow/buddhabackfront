import { request } from '@umijs/max';

import React, { useEffect, useState } from 'react';
import StructurePictureImgUpload from './StructurePictureImgUpload';
import { bannerlistDataType } from './type';

const App: React.FC = () => {
  const [fourthImgListData, setFourthImgListData] = useState<
    bannerlistDataType[]
  >([]);

  useEffect(() => {
    request('/admin/secure/getHomePageTopBanner').then((data) => {
      if (data.result) {
        setFourthImgListData(data.data.topBannerList);
      }
    });
  }, []);

  return (
    <div>
      <h2>主页顶部轮播图</h2>
      {fourthImgListData ? (
        <StructurePictureImgUpload
          controlledParam="homepageline1"
          successFileList={fourthImgListData}
          setSuccessFileList={setFourthImgListData}
          isTop={true}
        />
      ) : null}
    </div>
  );
};
export default App;

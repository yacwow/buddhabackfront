import { request } from '@umijs/max';
import React, { useEffect, useState } from 'react';
import styles from './EveryPageHeadPicture.less';
import { EveryPageHeadPicture } from './EveryPageHeadPictureDataType';
import EveryPageHeadPictureUpload from './EveryPageHeadPictureUpload';
interface Props {}
const App: React.FC<Props> = (props) => {
  const [bestSellerHeaderPictureList, setBestSellerHeaderPictureList] =
    useState<EveryPageHeadPicture[]>([]);
  const [dailyNewHeaderPictureList, setDailyNewHeaderPictureList] = useState<
    EveryPageHeadPicture[]
  >([]);
  const [discountHeaderPictureList, setDiscountHeaderPictureList] = useState<
    EveryPageHeadPicture[]
  >([]);
  const [timesellerHeaderPictureList, setTimesellerrHeaderPictureList] =
    useState<EveryPageHeadPicture[]>([]);
  useEffect(() => {
    request('/admin/getEachHeadPicture').then((data) => {
      if (data.result) {
        setBestSellerHeaderPictureList(
          data.data.headerPictureList['/bestSeller'],
        );
        setDailyNewHeaderPictureList(data.data.headerPictureList['/dailyNew']);
        setDiscountHeaderPictureList(data.data.headerPictureList['/discount']);
        setTimesellerrHeaderPictureList(
          data.data.headerPictureList['/timeseller'],
        );
      }
    });
  }, []);
  return (
    <div style={{ height: 1100, overflowY: 'scroll' }}>
      <div style={{ border: '1px solid black' }}>
        <h3>/bestSeller页首信息</h3>
        {
          <EveryPageHeadPictureUpload
            successFileList={bestSellerHeaderPictureList}
            setSuccessFileList={setBestSellerHeaderPictureList}
            updateUrl="/bestseller"
          />
        }
      </div>
      <div style={{ border: '1px solid black' }}>
        <h3>/dailyNew页首信息</h3>
        {
          <EveryPageHeadPictureUpload
            successFileList={dailyNewHeaderPictureList}
            setSuccessFileList={setDailyNewHeaderPictureList}
            updateUrl="/dailyNew"
          />
        }
      </div>
      <div style={{ border: '1px solid black' }}>
        <h3>/discount页首信息</h3>
        {
          <EveryPageHeadPictureUpload
            successFileList={discountHeaderPictureList}
            setSuccessFileList={setDiscountHeaderPictureList}
            updateUrl="/discount"
          />
        }
      </div>
      <div style={{ border: '1px solid black' }}>
        <h3>/timeseller页首信息</h3>
        {
          <EveryPageHeadPictureUpload
            successFileList={timesellerHeaderPictureList}
            setSuccessFileList={setTimesellerrHeaderPictureList}
            updateUrl="/timeseller"
          />
        }
      </div>
    </div>
  );
};
export default App;

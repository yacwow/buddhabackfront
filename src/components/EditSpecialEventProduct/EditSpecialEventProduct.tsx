import { request } from '@umijs/max';
import { useModel } from '@umijs/max';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './EditSpecialEventProduct.less';
import EditSpecialEventProductBody from './EditSpecialEventProductBody';
import EditSpecialEventProductHeader from './EditSpecialEventProductHeader';
interface Props {}
const App: React.FC<Props> = (props) => {
  const {
    specialEventProductTableData,
    setSpecialEventProductTableData,
    page,
    pageSize,
    setTotal,
  } = useModel('addSpecialEventProductData');
  const [initialValue, setInitialValue] = useState({});

  useEffect(() => {
    let pathArr = location.pathname.split('/');
    console.log(pathArr[3]);
    request('/admin/secure/requestSpecialEventInfo', {
      params: {
        specialCode: pathArr[3],
        page,
        pageSize,
      },
    }).then((data) => {
      console.log(data);
      if (data.result) {
        let initial: any = {};
        initial.description = data.data.basicInfo.description;
        initial.code = data.data.basicInfo.specialCode;
        initial.promotionCode = data.data.basicInfo.promotionCode;
        initial.showCount = data.data.basicInfo.count;
        initial.specialCodeActive = data.data.basicInfo.specialCodeActive;
        if (data.data.promotionInfo) {
          initial.promotionCodeActive = data.data.promotionInfo.active;
          initial.fixdiscount = data.data.promotionInfo.fixdiscount;
          initial.promotioncategory = data.data.promotionInfo.promotioncategory;
          initial.percentdiscount = data.data.promotionInfo.percentdiscount;
        }
        setInitialValue(initial);
        setSpecialEventProductTableData(
          data.data.resMap.specialEventProductList,
        );
        setTotal(data.data.resMap.count);
      }
    });
  }, []);
  return (
    <div>
      <EditSpecialEventProductHeader initialValue={initialValue} />

      {specialEventProductTableData.length > 0 ? (
        <>
          <EditSpecialEventProductBody />
        </>
      ) : null}
    </div>
  );
};
export default App;

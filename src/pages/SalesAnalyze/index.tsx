import LayOut from '@/components/LayOut';
import SalesAnalyzeComp from '@/components/SalesAnalyzeComp';
import { request } from '@umijs/max';
import { SelectProps } from 'antd';
import React, { useEffect } from 'react';

const App: React.FC = () => {
  const options: SelectProps['options'] = [];
  useEffect(() => {
    request('/admin/getAllProductType').then((data) => {
      if (data.result) {
        // setProductType(data.data.data);
        let productList = data.data.data;

        for (let i = 0; i < productList.length; i++) {
          options.push({
            label: productList[i].name,
            value: productList[i].type,
          });
        }
      }
    });
  }, []);
  return (
    <LayOut>
      <SalesAnalyzeComp options={options} />
    </LayOut>
  );
};
export default App;

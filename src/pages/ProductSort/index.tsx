import LayOut from '@/components/LayOut';
import ProductSort from '@/components/ProductSort';
import React, { useEffect } from 'react';
const App: React.FC = () => {
  useEffect(() => {
    document.title = '分类产品排序'; // 英文标题
  }, []);
  return (
    <LayOut>
      <ProductSort />
    </LayOut>
  );
};
export default App;

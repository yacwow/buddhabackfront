import AddProduct from '@/components/AddProduct';
import ProductSourceAndStockStatus from '@/components/AddProduct/ProductSourceAndStockStatus';
import LayOut from '@/components/LayOut';
import React from 'react';

const App: React.FC = () => {
  return (
    <LayOut>
      <AddProduct>
        <ProductSourceAndStockStatus />
      </AddProduct>
    </LayOut>
  );
};
export default App;

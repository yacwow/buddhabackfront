import AddProduct from '@/components/AddProduct';
import ProductCategory from '@/components/AddProduct/ProductCategory';
import LayOut from '@/components/LayOut';
import React from 'react';

const App: React.FC = () => {
  return (
    <LayOut>
      <AddProduct>
        <ProductCategory />
      </AddProduct>
    </LayOut>
  );
};
export default App;

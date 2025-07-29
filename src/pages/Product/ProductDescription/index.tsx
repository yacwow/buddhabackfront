import AddProduct from '@/components/AddProduct';
import ProductDescription from '@/components/AddProduct/ProductDescription';
import LayOut from '@/components/LayOut';
import React from 'react';

const App: React.FC = () => {
  return (
    <LayOut>
      <AddProduct>
        <ProductDescription />
      </AddProduct>
    </LayOut>
  );
};
export default App;

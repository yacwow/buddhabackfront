import AddProduct from '@/components/AddProduct';
import ProductSize from '@/components/AddProduct/ProductSize';
import LayOut from '@/components/LayOut';
import React from 'react';

const App: React.FC = () => {
  return (
    <LayOut>
      <AddProduct>
        <ProductSize />
      </AddProduct>
    </LayOut>
  );
};
export default App;

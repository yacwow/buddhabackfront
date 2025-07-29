import AddProduct from '@/components/AddProduct';
import ProductContext from '@/components/AddProduct/ProductContext';
import LayOut from '@/components/LayOut';
import React from 'react';

const App: React.FC = () => {
  return (
    <LayOut>
      <AddProduct>
        <ProductContext />
      </AddProduct>
    </LayOut>
  );
};
export default App;

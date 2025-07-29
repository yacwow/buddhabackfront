import AddProduct from '@/components/AddProduct';
import Comment from '@/components/AddProduct/Comment';
import LayOut from '@/components/LayOut';
import React from 'react';

const App: React.FC = () => {
  return (
    <LayOut>
      <AddProduct>
        <Comment />
      </AddProduct>
    </LayOut>
  );
};
export default App;

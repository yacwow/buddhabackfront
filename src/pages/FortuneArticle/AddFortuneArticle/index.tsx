import AddFortuneArticleComp from '@/components/FortuneArticleComp/AddFortuneArticleComp';
import LayOut from '@/components/LayOut';
import React from 'react';
interface Props {}
const App: React.FC<Props> = (props) => {
  return (
    <LayOut>
      <AddFortuneArticleComp />
    </LayOut>
  );
};
export default App;

import FortuneArticleComp from '@/components/FortuneArticleComp';
import LayOut from '@/components/LayOut';
import React from 'react';
interface Props {}
const App: React.FC<Props> = (props) => {
  return (
    <LayOut>
      <FortuneArticleComp />
    </LayOut>
  );
};
export default App;

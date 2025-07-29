import LayOut from '@/components/LayOut';
import HomePageComp from '@/components/WebDesignData/HomePageComp';
import React from 'react';
interface Props {}
const App: React.FC<Props> = (props) => {
  return (
    <LayOut>
      <HomePageComp />
    </LayOut>
  );
};
export default App;

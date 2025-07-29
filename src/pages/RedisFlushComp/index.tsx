import LayOut from '@/components/LayOut';
import RedisFlush from '@/components/RedisFlush';
import React from 'react';

const App: React.FC = () => {
  return (
    <LayOut>
      <RedisFlush />
    </LayOut>
  );
};
export default App;

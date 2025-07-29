import CategoryDisplay from '@/components/CategoryDisplay';
import LayOut from '@/components/LayOut';

import React from 'react';

const App: React.FC = () => {
  return (
    <LayOut>
      {' '}
      <CategoryDisplay />
    </LayOut>
  );
};
export default App;

import LayOut from '@/components/LayOut';
import FrequentSearchParams from '@/components/WebDesignData/FrequentSearchParams';
import { request } from '@umijs/max';
import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [searchParams, setSearchParams] = useState('');

  useEffect(() => {
    request('/admin/getFrequestSearchParams').then((data) => {
      if (data.result) {
        setSearchParams(data.data.searchParams);
      }
    });
  }, []);
  return (
    <LayOut>
      <FrequentSearchParams searchParams={searchParams} />
    </LayOut>
  );
};
export default App;

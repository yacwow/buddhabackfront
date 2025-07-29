import LayOut from '@/components/LayOut';
import RatioCurrency from '@/components/RatioCurrency';
import { request } from '@umijs/max';
import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [initialRatio, setInitialRatio] = useState<any>();
  useEffect(() => {
    request('/admin/secure/getCurrencyRatio').then((data) => {
      if (data.result) {
        if (data.data.currencyRatio) {
          console.log('in');
          const rows = data.data.currencyRatio.split('&&');
          const newData = rows.map((row: string, index: number) => {
            const [
              minPrice,
              maxPrice,
              coefficient,
              exchangeRate,
              purchaseCost,
              adjustment,
              budgetRangeMin,
              budgetRangeMax,
            ] = row.split(';;');

            return {
              key: index + 1,
              minPrice: parseFloat(minPrice),
              maxPrice: parseFloat(maxPrice),
              coefficient: parseFloat(coefficient),
              exchangeRate: parseFloat(exchangeRate),
              purchaseCost: parseFloat(purchaseCost),
              adjustment: parseFloat(adjustment),
              budgetRangeMin: parseFloat(budgetRangeMin),
              budgetRangeMax: parseFloat(budgetRangeMax),
            };
          });
          setInitialRatio(newData);
        } else {
          setInitialRatio([]);
        }
      }
    });
  }, []);
  return (
    <LayOut>
      {initialRatio && <RatioCurrency initialRatio={initialRatio} />}
    </LayOut>
  );
};
export default App;

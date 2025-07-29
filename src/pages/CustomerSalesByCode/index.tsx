import CustomerSalesComp from '@/components/CustomerSalesComp';
import LayOut from '@/components/LayOut';
import React from 'react';

interface Props {}
const CustomerSalesByCode:React.FC<Props> = () => {
  return (
    <LayOut>
        <CustomerSalesComp/>
    </LayOut>
  );
};

export default CustomerSalesByCode;
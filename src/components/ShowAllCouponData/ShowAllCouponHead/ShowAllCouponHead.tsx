import { request } from '@umijs/max';
import { Button, Input, message, Select } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';
interface Props {
  setTableData: Dispatch<SetStateAction<any>>;
  setTotal: Dispatch<SetStateAction<any>>;
  setSearch: Dispatch<SetStateAction<string>>;
  setInputValue: Dispatch<SetStateAction<string>>;
  inputValue: string;
  search: string;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}
const App: React.FC<Props> = (props) => {
  const {
    setTableData,
    setTotal,
    setSearch,
    search,
    setInputValue,
    inputValue,
    setPage,
  } = props;

  const handleChange = (value: string) => {
    setSearch(value);
  };
  const handleSearch = () => {
    if (inputValue === '') {
      message.error(
        { content: '请输入要搜索的内容', style: { marginTop: '20vh' } },
        4,
      );
      return;
    }
    request('/admin/secure/getCouponListByParams', {
      params: {
        page: 1,
        search,
        inputValue,
      },
    }).then((data) => {
      if (data.result) {
        setTotal(data.data.total);
        let newCoupon = data.data.couponList;
        for (let i = 0; i < newCoupon.length; i++) {
          newCoupon[i].key = i;
          newCoupon[i].discountType = newCoupon[i].discountamount
            ? 'amount'
            : 'percent';
        }
        setTableData(newCoupon);
      }
    });
  };
  const handleSearchPersonPromotion = () => {
    request('/admin/secure/getAllPersonalPromotion').then((data) => {
      if (data.result) {
        setTotal(data.data.total);
        let newCoupon = data.data.couponList;
        for (let i = 0; i < newCoupon.length; i++) {
          newCoupon[i].key = i;
          newCoupon[i].discountType = newCoupon[i].discountamount
            ? 'amount'
            : 'percent';
        }
        setTableData(newCoupon);
      }
    });
  };
  const handleSearchAll = () => {
    setInputValue('');
    setPage(1);
    request('/admin/secure/getAllCouponList', {
      params: {
        page: 1,
      },
    }).then((data) => {
      if (data.result) {
        setTotal(data.data.total);
        let newCoupon = data.data.couponList;
        for (let i = 0; i < newCoupon.length; i++) {
          newCoupon[i].key = i;
          newCoupon[i].discountType = newCoupon[i].discountamount
            ? 'amount'
            : 'percent';
        }
        setTableData(newCoupon);
      }
    });
  };
  return (
    <div>
      <Input
        style={{ width: 500 }}
        placeholder="根据下拉框的条件进行搜索"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Select
        value={search}
        style={{ width: 120 }}
        onChange={handleChange}
        options={[
          { value: 'email', label: '用户邮箱' },
          { value: 'codeNumber', label: '优惠码' },
          { value: 'codeType', label: '优惠码名称' },
        ]}
      />
      <Button
        type="primary"
        onClick={handleSearch}
        style={{ marginLeft: 20, marginRight: 20 }}
      >
        搜索
      </Button>
      <Button
        type="primary"
        onClick={handleSearchPersonPromotion}
        style={{ marginLeft: 20, marginRight: 20 }}
      >
        展示所有个人推广
      </Button>
      <Button type="primary" onClick={handleSearchAll}>
        重置
      </Button>
    </div>
  );
};
export default App;

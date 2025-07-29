import { formatTimeWithHours } from '@/utils/format';
import { request } from '@umijs/max';
import { Button, Input, message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
// import NormalDiscountData from './NormalDiscountData';
// import { timelyDiscountDataType } from './type';

interface Props {
  searchParams: string;
}
const App: React.FC<Props> = (props) => {
  const { searchParams } = props;
  const [searchValue, setSearchValue] = useState<
    { value: string; type: string }[]
  >([{ value: 'attract wealth', type: 'category' }]); //我们提供的搜索内容
  const [discountExpireTime, setDiscountExpireTime] = useState('');
  const [secondHalfPriceExpireTime, setSecondHalfPriceExpireTime] =
    useState('');
  const [timesellerExpireTime, setTimesellerExpireTime] = useState('');
  const [expireData, setExpireData] = useState<{
    [key: string]: {
      name: string;
      expireTime: string;
    };
  }>();
  // const [timeLyDiscountList, setTimeLyDiscountList] = useState<
  //   timelyDiscountDataType[]
  // >([]);

  //修改搜索关键词
  const handleSubmit = () => {
    console.log(searchValue);
    const newSearchValue = searchValue.filter((item) => item.value !== '');
    setSearchValue(newSearchValue);

    request('/admin/updateFrequestSearchParams', {
      params: {
        searchParams: JSON.stringify(newSearchValue),
      },
    }).then((data) => {
      if (data.result) {
        message.info('常用的用户搜索关键词修改成功！', 3);
      } else {
        message.error('出了点小问题,没保存成功', 3);
      }
    });
  };
  //过期时间设置
  const handleExpireTimeSubmit = () => {
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (discountExpireTime && regex.test(discountExpireTime) === false) {
      message.error('discount的格式不对', 3);
      return;
    }
    if (
      secondHalfPriceExpireTime &&
      regex.test(secondHalfPriceExpireTime) === false
    ) {
      message.error('secondHalfPrice的格式不对', 3);
      return;
    }
    if (timesellerExpireTime && regex.test(timesellerExpireTime) === false) {
      message.error('timeseller的格式不对', 3);
      return;
    }

    request('/admin/updateWebSiteExpireDate', {
      params: {
        discountExpireTime,
        timesellerExpireTime,
        secondHalfPriceExpireTime,
      },
    }).then((data) => {
      if (data.result) {
        message.info('修改成功了', 3);
      } else {
        message.error('修改有点问题,刷新了再看看', 3);
      }
    });
  };

  useEffect(() => {
    request('/admin/getWebSiteExpireDate').then((data) => {
      if (data.result) {
        setExpireData(data.data);
      }
    });
    // request('/admin/getTimelyDiscountInformation').then((data) => {
    //   if (data.result) {
    //     let discountList = data.data.timelyDiscountList;
    //     console.log(discountList);
    //     for (let i = 0; i < discountList.length; i++) {
    //       discountList[i]['expireDate'] = formatTimeWithHours(
    //         discountList[i]['expireDate'],
    //       );
    //       discountList[i]['startDate'] = formatTimeWithHours(
    //         discountList[i]['startDate'],
    //       );
    //     }
    //     setTimeLyDiscountList(data.data.timelyDiscountList);
    //   }
    // });
  }, []);
  useEffect(() => {
    if (searchParams) {
      setSearchValue(JSON.parse(searchParams));
    }
  }, [searchParams]);
  useEffect(() => {
    if (!expireData) return;
    if (expireData.timeseller) {
      setTimesellerExpireTime(
        formatTimeWithHours(expireData.timeseller.expireTime),
      );
    }
    if (expireData.discount) {
      setDiscountExpireTime(
        formatTimeWithHours(expireData.discount.expireTime),
      );
    }
    if (expireData.secondHalfPrice) {
      setSecondHalfPriceExpireTime(
        formatTimeWithHours(expireData.secondHalfPrice.expireTime),
      );
    }
  }, [expireData]);
  const handleChange = (value: string, type: string, index: number) => {
    let newSearchValue = structuredClone(searchValue);
    if (type === 'value') {
      newSearchValue[index].value = value;
    } else if (type === 'type') {
      newSearchValue[index].type = value;
    }
    setSearchValue(newSearchValue);
  };
  return (
    <div>
      <h2>当前页面的所有保存都是直接修改，如果不满意修改结果就在保存一次</h2>
      <div style={{ marginTop: 40, border: '1px solid black' }}>
        <h3>
          m端常用的用户搜索关键词设置,需要用英文的逗号分割，不然前台不显示
        </h3>
        <div>
          <div style={{ display: 'flex' }}>
            {searchValue.map((item, index) => {
              return (
                <div style={{ width: 200, marginRight: 15 }} key={index}>
                  <span>搜索的关键字</span>
                  <Input
                    placeholder="输入搜索的关键字"
                    value={item.value}
                    onChange={(e) => {
                      console.log(e.target.value);
                      handleChange(e.target.value, 'value', index);
                    }}
                  />
                  <span>按什么提供搜索内容</span>
                  <Select
                    onChange={(e) => {
                      console.log(e);

                      handleChange(e, 'type', index);
                    }}
                    value={item.type}
                    style={{ width: 200 }}
                    options={[
                      { value: 'category', label: 'category' },
                      { value: 'productId', label: 'productId' },
                      { value: 'productTitle', label: 'product title' },
                    ]}
                  />
                  <Button
                    danger
                    onClick={() => {
                      let newSearchValue = structuredClone(searchValue);
                      if (index >= 0 && index < newSearchValue.length) {
                        newSearchValue.splice(index, 1); // 删除索引为 index 的元素
                      }
                      setSearchValue(newSearchValue); // 更新状态
                    }}
                  >
                    删除该列
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
        <Button
          type="primary"
          style={{ display: 'block', marginTop: 30 }}
          onClick={() => {
            let newSearchValue = structuredClone(searchValue);
            newSearchValue.push({ type: 'category', value: '' });
            setSearchValue(newSearchValue);
          }}
        >
          增加搜索词条
        </Button>
        <Button type="primary" onClick={handleSubmit} style={{ marginTop: 30 }}>
          保存
        </Button>
      </div>
      <div style={{ marginTop: 40, border: '1px solid black' }}>
        <h3>网页限时设置，每个时钟都可以设置时间，过期后自动续三天</h3>
        <div style={{ color: 'red' }}>
          格式必须是 :<b style={{ fontSize: 18 }}>2000-01-01 00:00:00</b>
          必须是英文符号
        </div>
        <div>
          <span>网址</span>
          <span>/discount</span>
        </div>

        <div>
          <span>过期时间</span>
          <input
            type="text"
            placeholder="目前为空"
            value={discountExpireTime}
            onChange={(e) => {
              setDiscountExpireTime(e.target.value);
            }}
          />
        </div>
        <div>
          <span>网址</span>
          <span>/secondHalfPrice</span>
        </div>
        <div>
          <span>过期时间</span>
          <input
            type="text"
            placeholder="目前为空"
            value={secondHalfPriceExpireTime}
            onChange={(e) => {
              setSecondHalfPriceExpireTime(e.target.value);
            }}
          />
        </div>
        <div>
          <span>网址</span>
          <span>/timeseller</span>
        </div>
        <div>
          <span>过期时间</span>
          <input
            type="text"
            placeholder="目前为空"
            value={timesellerExpireTime}
            onChange={(e) => {
              setTimesellerExpireTime(e.target.value);
            }}
          />
        </div>
        <Button type="primary" onClick={handleExpireTimeSubmit}>
          保存
        </Button>
      </div>
      {/* <div style={{ marginTop: 40, border: '1px solid black' }}>
        <h3>限时折扣的一些设置数据</h3>
        <div style={{ color: 'red' }}>
          时间的格式必须是 :<b style={{ fontSize: 18 }}>2000-01-01 00:00:00</b>
          必须是英文符号
        </div>
        {timeLyDiscountList.map((item, index: number) => {
          return (
            <div key={index} style={{ border: '2px solid #ccc' }}>
              <b>第{index}个限时折扣</b>
              <div style={{ display: 'flex' }}>
                <span>限时折扣的id</span>
                <input
                  id={`couponListId-${index}`}
                  type="number"
                  defaultValue={item.couponListId}
                  disabled
                />
                <span>限时折扣的code码</span>
                <input
                  id={`codeNumber-${index}`}
                  type="text"
                  value={item.codeNumber}
                  onChange={(e) =>
                    handleTimeDiscountInputChange(e, index, 'codeNumber')
                  }
                />
                <span>限时折扣要求</span>
                <input
                  id={`applyAmount-${index}`}
                  type="number"
                  value={item.applyAmount}
                  onChange={(e) =>
                    handleTimeDiscountInputChange(e, index, 'applyAmount')
                  }
                />
              </div>
              <div style={{ display: 'flex' }}>
                <span>限时折扣数额</span>
                <input
                  id={`discountAmount-${index}`}
                  type="number"
                  value={item.discountAmount}
                  onChange={(e) =>
                    handleTimeDiscountInputChange(e, index, 'discountAmount')
                  }
                />
                <span>限时折扣开始时间</span>
                <input
                  id={`startDate-${index}`}
                  type="text"
                  value={item.startDate}
                  onChange={(e) =>
                    handleTimeDiscountInputChange(e, index, 'startDate')
                  }
                />
                <span>限时折扣过期时间</span>
                <input
                  id={`expireDate-${index}`}
                  type="text"
                  value={item.expireDate}
                  onChange={(e) =>
                    handleTimeDiscountInputChange(e, index, 'expireDate')
                  }
                />
              </div>
            </div>
          );
        })}
        <Button type="primary" onClick={handleTimeDiscountSubmit}>
          保存
        </Button>
      </div>
      <div>
        <NormalDiscountData />
      </div> */}
    </div>
  );
};
export default App;

////如果上面部分想用，几个函数在下面
// //限时折扣的每一个数字的变化
// const handleTimeDiscountInputChange = (
//   e: any,
//   index: number,
//   str: string,
// ) => {
//   let newTimelyDiscountList: any = structuredClone(timeLyDiscountList);
//   if (str === 'applyAmount' || str === 'discountAmount') {
//     newTimelyDiscountList[index][str] = +e.target.value;
//   } else {
//     newTimelyDiscountList[index][str] = e.target.value;
//   }

//   setTimeLyDiscountList(newTimelyDiscountList);
//   console.log(newTimelyDiscountList);
// };
// //限时折扣的提交
// const handleTimeDiscountSubmit = () => {
//   //挨个检查数据是不是合格 1.code不能相同，2.discount和apply必须是数字，3 两个时间必须格式正确
//   const datetimePattern = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
//   let codeNumberList = [];
//   for (let i = 0; i < timeLyDiscountList.length; i++) {
//     let codeNumber = timeLyDiscountList[i]['codeNumber'];
//     let applyAmount = timeLyDiscountList[i]['applyAmount'];
//     let discountAmount = timeLyDiscountList[i]['discountAmount'];
//     let expireDate = timeLyDiscountList[i]['expireDate'];
//     let startDate = timeLyDiscountList[i]['startDate'];
//     codeNumberList.push(codeNumber);
//     if (typeof applyAmount !== 'number') {
//       message.error(`第${i}个的限时折扣要求必须是数字`, 3);
//       return;
//     }
//     if (typeof discountAmount !== 'number') {
//       message.error(`第${i}个的限时折扣数额必须是数字`, 3);
//       return;
//     }
//     if (!datetimePattern.test(expireDate)) {
//       message.error(`第${i}个的限时折扣开始时间格式不符合`, 3);
//       return;
//     }
//     if (!datetimePattern.test(startDate)) {
//       message.error(`第${i}个的限时折扣过期时间格式不符合`, 3);
//       return;
//     }
//   }
//   if (codeNumberList.length !== new Set(codeNumberList).size) {
//     message.error('请检查code码，必须是唯一的', 3);
//     return;
//   }
//   request('/admin/updateTimelyDiscountInformation', {
//     params: {
//       timeLyDiscountList: JSON.stringify(timeLyDiscountList),
//     },
//   }).then((data) => {
//     if (data.result) {
//       message.info('修改成功', 3);
//     } else {
//       message.error('有点错误,一般是时间范围的错误', 3);
//     }
//   });
// };

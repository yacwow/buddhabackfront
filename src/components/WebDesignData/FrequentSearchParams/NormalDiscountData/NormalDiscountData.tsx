import { formatTimeWithHours } from '@/utils/format';
import { request } from '@umijs/max';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { timelyDiscountDataType } from '../type';
interface Props {}
const App: React.FC<Props> = (props) => {
  const [normalDiscountList, setNormalDiscountList] = useState<
    timelyDiscountDataType[]
  >([]);
  //限时折扣的每一个数字的变化
  const handleNormalDiscountInputChange = (
    e: any,
    index: number,
    str: string,
  ) => {
    let newTimelyDiscountList: any = structuredClone(normalDiscountList);
    if (str === 'applyAmount' || str === 'discountAmount') {
      newTimelyDiscountList[index][str] = +e.target.value;
    } else {
      newTimelyDiscountList[index][str] = e.target.value;
    }

    setNormalDiscountList(newTimelyDiscountList);
    console.log(newTimelyDiscountList);
  };

  //普通折扣的提交
  const handleNormalDiscountSubmit = () => {
    //挨个检查数据是不是合格 1.code不能相同，2.discount和apply必须是数字，3 两个时间必须格式正确
    const datetimePattern = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

    for (let i = 0; i < normalDiscountList.length; i++) {
      let applyAmount = normalDiscountList[i]['applyAmount'];
      let discountAmount = normalDiscountList[i]['discountAmount'];
      let expireDate = normalDiscountList[i]['expireDate'];
      let startDate = normalDiscountList[i]['startDate'];
      if (typeof applyAmount !== 'number') {
        message.error(`第${i}个的普通折扣要求必须是数字`, 3);
        return;
      }
      if (typeof discountAmount !== 'number') {
        message.error(`第${i}个的普通折扣数额必须是数字`, 3);
        return;
      }
      if (!datetimePattern.test(expireDate)) {
        message.error(`第${i}个的普通折扣开始时间格式不符合`, 3);
        return;
      }
      if (!datetimePattern.test(startDate)) {
        message.error(`第${i}个的普通折扣过期时间格式不符合`, 3);
        return;
      }
    }
    console.log(normalDiscountList);
    request('/admin/updateNormalDiscountInformation', {
      params: {
        normalDiscountList: JSON.stringify(normalDiscountList),
      },
    }).then((data) => {
      if (data.result) {
        message.info('修改成功', 3);
      } else {
        message.error('有点错误,一般是时间范围的错误', 3);
      }
    });
  };
  useEffect(() => {
    request('/admin/getNormalDiscountListInformation').then((data) => {
      if (data.result) {
        let discountList = data.data.normalDiscountList;
        console.log(discountList);
        for (let i = 0; i < discountList.length; i++) {
          discountList[i]['expireDate'] = formatTimeWithHours(
            discountList[i]['expireDate'],
          );
          discountList[i]['startDate'] = formatTimeWithHours(
            discountList[i]['startDate'],
          );
        }
        setNormalDiscountList(data.data.normalDiscountList);
      }
    });
  }, []);
  return (
    <div style={{ marginTop: 40, border: '1px solid black' }}>
      <h3>普通折扣的一些设置数据</h3>
      <div style={{ color: 'red' }}>
        时间的格式必须是 :<b style={{ fontSize: 18 }}>2000-01-01 00:00:00</b>
        必须是英文符号
      </div>
      {normalDiscountList.map((item, index: number) => {
        return (
          <div key={index} style={{ border: '2px solid #ccc' }}>
            <b>第{index}个普通折扣</b>
            <div style={{ display: 'flex' }}>
              <span>普通折扣的id</span>
              <input
                id={`couponListId-${index}`}
                type="number"
                defaultValue={item.couponListId}
                disabled
              />
              <span>普通折扣要求</span>
              <input
                id={`applyAmount-${index}`}
                type="number"
                value={item.applyAmount}
                onChange={(e) =>
                  handleNormalDiscountInputChange(e, index, 'applyAmount')
                }
              />
            </div>
            <div style={{ display: 'flex' }}>
              <span>普通折扣数额</span>
              <input
                id={`discountAmount-${index}`}
                type="number"
                value={item.discountAmount}
                onChange={(e) =>
                  handleNormalDiscountInputChange(e, index, 'discountAmount')
                }
              />
              <span>普通折扣开始时间</span>
              <input
                id={`startDate-${index}`}
                type="text"
                value={item.startDate}
                onChange={(e) =>
                  handleNormalDiscountInputChange(e, index, 'startDate')
                }
              />
              <span>普通折扣过期时间</span>
              <input
                id={`expireDate-${index}`}
                type="text"
                value={item.expireDate}
                onChange={(e) =>
                  handleNormalDiscountInputChange(e, index, 'expireDate')
                }
              />
            </div>
          </div>
        );
      })}
      <Button type="primary" onClick={handleNormalDiscountSubmit}>
        保存
      </Button>
    </div>
  );
};
export default App;

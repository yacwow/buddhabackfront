import { useModel } from '@umijs/max';
import React, { useEffect, useState } from 'react';
import { Button, Checkbox, message } from 'antd';
import styles from './ShowCategoryInHomePageBottomComp.less';
import FrontShow from './FrontShow';
import { request } from '@umijs/max';

const App: React.FC = () => {
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState<
    {
      title: string;
      firstLevelIndex: number;
      secondLevelIndex: number;
      value: string;
      imgSrc: string;
      sub?: {
        title: string;
        value: string;
      }[];
    }[]
  >([]);
  //这个是上面一级类二级类的勾选，用于展示在下面
  const onChange = (
    e: any,
    title: string,
    value: string,
    firstLevelIndex: number,
    secondLevelIndex: number,
    imgSrc: string,
  ) => {
    console.log(`checked = ${e.target.checked}`);
    if (e.target.checked === true) {
      if (secondLevelIndex === -1) {
        //大类，如果里面有小类一样，则取消掉，添加大类
        let newSelectedCategoryTitle = structuredClone(selectedCategoryTitle);
        let filteredCategoryTitle = [];
        for (let i = 0; i < newSelectedCategoryTitle.length; i++) {
          if (newSelectedCategoryTitle[i].firstLevelIndex !== firstLevelIndex) {
            filteredCategoryTitle.push(newSelectedCategoryTitle[i]);
          }
        }
        filteredCategoryTitle.push({
          title,
          value,
          firstLevelIndex,
          secondLevelIndex,
          imgSrc,
        });
        setSelectedCategoryTitle(filteredCategoryTitle);
      } else {
        //小类，如果有一样的，不管，没有一样的，添加
        console.log("in123")
        let newSelectedCategoryTitle = structuredClone(selectedCategoryTitle);
        let hasSame = newSelectedCategoryTitle.some((item) => {
          return (
            item.firstLevelIndex === firstLevelIndex &&
            (item.secondLevelIndex === secondLevelIndex ||
              item.secondLevelIndex === -1)
          );
        });
        console.log("in123")
        if (hasSame) {
          return;
        } else {
          newSelectedCategoryTitle.push({
            title,
            value,
            firstLevelIndex,
            secondLevelIndex,
            imgSrc,
          });
          console.log("in123")
          setSelectedCategoryTitle(newSelectedCategoryTitle);
        }
      }
    } else {
      //取消该类，如果存在的话
      let newSelectedCategoryTitle = structuredClone(selectedCategoryTitle);
      newSelectedCategoryTitle = newSelectedCategoryTitle.filter((item) => {
        return item.title !== title;
      });
      setSelectedCategoryTitle(newSelectedCategoryTitle);
    }
  };

  //这个是下面的三级类的勾选
  const thirdLevelChange = (
    e: any,
    title: string,
    value: string,
    firstLevelIndex: number,
    secondLevelIndex: number,
  ) => {
    if (e.target.checked) {
      let newSelectedCategoryTitle = structuredClone(selectedCategoryTitle);
      for (let i = 0; i < newSelectedCategoryTitle.length; i++) {
        if (
          newSelectedCategoryTitle[i].firstLevelIndex === firstLevelIndex &&
          newSelectedCategoryTitle[i].secondLevelIndex === secondLevelIndex
        ) {
          let sub = newSelectedCategoryTitle[i].sub;
          if (sub && Array.isArray(sub)) {
            // 如果 sub 不为 null、undefined，并且是一个数组
            console.log('sub 是一个数组');
            let hasSameValue = sub.some((item) => {
              return item.title === title && item.value === value;
            });
            if (!hasSameValue) {
              sub.push({ title, value });
            }
          } else {
            newSelectedCategoryTitle[i].sub = [{ title, value }];
          }
        }
        setSelectedCategoryTitle(newSelectedCategoryTitle);
        console.log(newSelectedCategoryTitle);
      }
    } else {
      //删除掉这一个
      let newSelectedCategoryTitle = structuredClone(selectedCategoryTitle);
      for (let i = 0; i < newSelectedCategoryTitle.length; i++) {
        if (
          newSelectedCategoryTitle[i].firstLevelIndex === firstLevelIndex &&
          newSelectedCategoryTitle[i].secondLevelIndex === secondLevelIndex
        ) {
          let sub = newSelectedCategoryTitle[i].sub;
          if (sub && Array.isArray(sub)) {
            let newSub = [];
            for (let j = 0; j < sub.length; j++) {
              if (sub[j].title === title && sub[j].value === value) {
              } else {
                newSub.push(sub[j]);
              }
            }
            newSelectedCategoryTitle[i].sub = newSub;
          }
        }
        setSelectedCategoryTitle(newSelectedCategoryTitle);
        console.log(newSelectedCategoryTitle);
      }
    }
  };
  const { treeDataArr, homeBottomCategoryInfo } =
    useModel('global');
  //从后端请求过来的数据，转成selectedCategoryTitle
  //[{"title":"VACATION","value":"VACATION-c1-92","sub":[{"title":"Cami Dresses","value":"Cami Dresses-c3-92"},{"title":"Bikini Swimsuit","value":"Bikini Swimsuit-c3-98"},
  //{"title":"Floral Dresses","value":"Floral Dresses-c3-93"},{"title":"Cover Ups& Kimonos","value":"Cover Ups& Kimonos-c3-99"},{"title":"Boho Dresses","value":"Boho Dresses-c3-94"}]},
  //{"title":"High Jewelry","value":"High Jewelry-c1-122","sub":[{"title":"Necklaces","value":"Necklaces-c3-122"},{"title":"Earrings","value":"Earrings-c3-123"}]},
  //{"title":"ACC&SHOES","value":"ACC&SHOES-c1-100","sub":[{"title":"Boots","value":"Boots-c3-103"},{"title":"Bracelet","value":"Bracelet-c3-111"},{"title":"Rings","value":"Rings-c3-112"}]}]
  useEffect(() => {
    if (homeBottomCategoryInfo) {
      let categoryInfoArr: {
        title: string;
        value: string;
        imgSrc: string;
        firstLevelIndex?: number;
        secondLevelIndex?: number;
        sub: { title: string; value: string }[];
      }[] = JSON.parse(homeBottomCategoryInfo);
      let newSelectedCategoryTitle: any[] = [];
      for (let i = 0; i < categoryInfoArr.length; i++) {
        for (let j = 0; j < treeDataArr.length; j++) {
          if (
            categoryInfoArr[i].title === treeDataArr[j].title &&
            categoryInfoArr[i].value === treeDataArr[j].value
          ) {
            let newCategoryInfo = categoryInfoArr[i];
            newCategoryInfo.firstLevelIndex = j;
            newCategoryInfo.secondLevelIndex = -1;
            newSelectedCategoryTitle.push(newCategoryInfo);
            break;
          } else {
            for (let k = 0; k < treeDataArr[j].children.length; k++) {
              if (
                categoryInfoArr[i].title === treeDataArr[j].children[k].title &&
                categoryInfoArr[i].value === treeDataArr[j].children[k].value
              ) {
                let newCategoryInfo = categoryInfoArr[i];
                newCategoryInfo.firstLevelIndex = j;
                newCategoryInfo.secondLevelIndex = k;
                newSelectedCategoryTitle.push(newCategoryInfo);
                break;
              }
            }
          }
        }
      }
      setSelectedCategoryTitle(
        newSelectedCategoryTitle as {
          title: string;
          firstLevelIndex: number;
          secondLevelIndex: number;
          value: string;
          imgSrc: string;
          sub?: {
            title: string;
            value: string;
          }[];
        }[],
      );
    }
  }, [homeBottomCategoryInfo]);

  const buildCategorySelect = (item: {
    title: string;
    firstLevelIndex: number;
    secondLevelIndex: number;
    value: string;
  }) => {
    console.log(treeDataArr, item.firstLevelIndex, item.secondLevelIndex);
    if (item.secondLevelIndex === -1) {
      let children = treeDataArr;
      let subCategory = [];
      for (let i = 0; i < children.length; i++) {
        let subSubCategory = children[i].children;
        for (let j = 0; j < subSubCategory.length; j++) {
          subCategory.push(subSubCategory[j]);
        }
      }
      console.log(subCategory)
      return subCategory.map((item1, index) => {
        return (
          <Checkbox
            key={index}
            onChange={(e) =>
              thirdLevelChange(
                e,
                item1.title,
                item1.value,
                item.firstLevelIndex,
                -1,
              )
            }
            style={{ fontSize: 20, color: '#1677ff' }}
          >
            {item1.title}
          </Checkbox>
        );
      });
    } else {
      return treeDataArr[item.firstLevelIndex].children.map((item1, index2) => {
        return (
          <Checkbox
            key={index2}
            onChange={(e) =>
              thirdLevelChange(
                e,
                item1.title,
                item1.value,
                item.firstLevelIndex,
                item.secondLevelIndex,
              )
            }
            style={{ fontSize: 20, color: '#1677ff' }}
          >
            {item1.title}
          </Checkbox>
        );
      });
    }
  };

  //上传到后端
  const handleSave = () => {
    let updateDate: any[] = [];
    // eslint-disable-next-line array-callback-return
    selectedCategoryTitle.map((item) => {
      let map: any = {};
      map.title = item.title;
      map.value = item.value;
      map.imgSrc = item.imgSrc;
      let sub = item.sub;
      if (sub && Array.isArray(sub)) {
        map.sub = sub;
      }
      updateDate.push(map);
    });
    request('/admin/secure/UpdateHomeBottomCategoryInfo', {
      params: { updateDate: JSON.stringify(updateDate) },
    }).then((data) => {
      if (data.result) {
        message.info('保存成功', 5);
      } else {
        message.error('保存失败，晚点再试试看', 4);
      }
    });
  };

  //下面的几个函数是移动选中类信息 排序 的几个东西
  const handleDragStart = (e: any, index: number) => {
    // console.log(productId);
    // console.log(e);
    // e.dataTransfer.setData('productId', productId);
    console.log(e.nativeEvent.target);
    e.nativeEvent.target.style.opacity = '0.5';
    console.log(e.nativeEvent.target);
    e.dataTransfer.setData('index', index);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragEnd = (e: any) => {
    e.nativeEvent.target.style.opacity = '1';
  };
  const handleDragOver = (e: any) => {
    e.preventDefault();
  };
  const handleDropDom = (e: any, index: number) => {
    e.preventDefault();

    let newIndex = e.dataTransfer.getData('index');
    console.log(newIndex);
    console.log(index);
    if (newIndex === index) {
      return;
    }
    let newSelectedCategoryTitle = structuredClone(selectedCategoryTitle);
    let a = newSelectedCategoryTitle[newIndex];
    let b = newSelectedCategoryTitle[index];
    newSelectedCategoryTitle[newIndex] = b;
    newSelectedCategoryTitle[index] = a;
    setSelectedCategoryTitle(newSelectedCategoryTitle);
  };
  useEffect(() => {
    console.log(selectedCategoryTitle);
  }, [selectedCategoryTitle]);
  return (
    <div>
      {treeDataArr.map((item, index) => {
        return (
          <div key={index} style={{ marginBottom: 20 }}>
            大类：
            <Checkbox
              onChange={(e) =>
                onChange(e, item.title, item.value, index, -1, item.imgSrc)
              }
              style={{ fontSize: 20, color: '#1677ff' }}
            >
              {item.title}
            </Checkbox>
            <div style={{ marginLeft: 20 }}>
              小类：
              {item.children.map((item2, index2) => {
                return (
                  <Checkbox
                    onChange={(e) =>
                      onChange(
                        e,
                        item2.title,
                        item2.value,
                        index,
                        index2,
                        item.imgSrc,
                      )
                    }
                    key={index2}
                  >
                    {item2.title}
                  </Checkbox>
                );
              })}
            </div>
          </div>
        );
      })}
      <div>
        选中的类信息
        {treeDataArr.length > 0 &&
          selectedCategoryTitle.map((item, index) => {
            return (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropDom(e, index)}
                onDragEnd={handleDragEnd}
              >
                {item.title}
                <div style={{ marginLeft: 30 }} className={styles.outWrap}>
                  {buildCategorySelect(item)}
                </div>
              </div>
            );
          })}
      </div>
      <div>
        前端的展示：
        <FrontShow selectedCategoryTitle={selectedCategoryTitle} />
      </div>
      <Button onClick={handleSave} type="primary">
        保存
      </Button>
      <div style={{ height: 500 }}></div>
    </div>
  );
};
export default App;

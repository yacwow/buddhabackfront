import React, { useEffect } from 'react';
import { Checkbox } from 'antd';

import { useModel } from '@umijs/max';

const App: React.FC = () => {
  const { treeDataArr } = useModel('global');
  const { productCategoryInfo, setProductCategoryInfo } =
    useModel('productUpdateData');

  useEffect(() => {
    const isChecked = treeDataArr.some((node) =>
      node.children.some((child) =>
        productCategoryInfo.includes(child.value)
      )
    );
    console.log(isChecked)
  }, [productCategoryInfo]);
  const handleC2Click = (e: any, c1: string, c2: string) => {
    console.log(e)
    if (e.target.checked) {
      if (productCategoryInfo.includes(c1)) {
        //只需要再添加一个
        let newProductCategoryInfo = structuredClone(productCategoryInfo)
        newProductCategoryInfo.push(c2);
        setProductCategoryInfo(newProductCategoryInfo)
        console.log(newProductCategoryInfo)
      } else {
        //还需要添加c1
        let newProductCategoryInfo = structuredClone(productCategoryInfo)
        newProductCategoryInfo.push(c2);
        newProductCategoryInfo.push(c1);
        setProductCategoryInfo(newProductCategoryInfo)
        console.log(newProductCategoryInfo)
      }
    } else {
      //删除的话，只删除有的那一个，这只是个c2
      let newProductCategoryInfo = structuredClone(productCategoryInfo)
      newProductCategoryInfo = newProductCategoryInfo.filter((item) => {
        return item !== c2
      })
      setProductCategoryInfo(newProductCategoryInfo)
    }

  }

  const handleC1Click = (e: any, c1: string) => {
    console.log(e)
    if (e.target.checked) {
      if (productCategoryInfo.includes(c1)) {
        //不该存在这个情况
      } else {
        //需要添加c1
        let newProductCategoryInfo = structuredClone(productCategoryInfo)
        newProductCategoryInfo.push(c1);
        setProductCategoryInfo(newProductCategoryInfo)
        console.log(newProductCategoryInfo)
      }
    } else {
      //只需要删掉
      let newProductCategoryInfo = structuredClone(productCategoryInfo)
      newProductCategoryInfo = newProductCategoryInfo.filter((item) => {
        return item !== c1
      })
      setProductCategoryInfo(newProductCategoryInfo)
      console.log(newProductCategoryInfo)
    }

  }
  useEffect(() => {
    let newProductCategoryInfo = [];
    for (let i = 0; i < productCategoryInfo.length; i++) {
      for (let j = 0; j < treeDataArr.length; j++) {
        if (treeDataArr[j].value === productCategoryInfo[i]) {
          newProductCategoryInfo.push(productCategoryInfo[i])
          break;
        }
        for (let k = 0; k < treeDataArr[j].children.length; k++) {
          if (treeDataArr[j].children[k].value === productCategoryInfo[i]) {
            newProductCategoryInfo.push(productCategoryInfo[i])
            break;
          }
        }
      }
    }
    setProductCategoryInfo(newProductCategoryInfo)
  }, [productCategoryInfo]);
  return (
    <>
      <h3 style={{ width: 900, margin: '20px auto' }}>
        不同的分类主要用于同一件产品展示在不同的类目里面
      </h3>
      <div
        style={{
          width: 900,
          margin: '0 auto',
        }}
      >
        {/* {productCategoryInfo.map((item, index) => {
          return (
            <div key={index} style={{ height: 360 }}>
              <TreeSelect
                className={styles.mySelect}
                showSearch
                value={item}
                // defaultValue="Elegant Bodycon Dresses-c3-1"
                dropdownStyle={{ maxWidth: 300 }}
                placeholder="请选择分类"
                popupMatchSelectWidth={false}
                onSelect={(value) => handleSelect(value, index)}
                allowClear
                listHeight={300}
                style={{ width: 300, height: 30 }}
                // treeCheckStrictly={true}
                // showArrow={false}
                treeDefaultExpandAll
                treeData={treeDataArr}
              />
              <Button
                type={'primary'}
                onClick={() => {
                  let newProductCategory = structuredClone(productCategoryInfo);
                  newProductCategory = newProductCategory.filter(
                    (item1) => item1 !== item,
                  );
                  setProductCategoryInfo(newProductCategory);
                }}
              >
                删除该分类
              </Button>
            </div>
          );
        })} */}
        {treeDataArr.map((item, index) => {
          console.log(item.value)
          return <div key={index}>
            <div>
              <Checkbox checked={productCategoryInfo.some((categoryValue) => {
                return categoryValue === item.value
              })} onClick={(e) => handleC1Click(e, item.value)} /> --- {item.title}
            </div>
            {item.children.map((item1, index1) => {
              return <div key={index1}>
                <Checkbox checked={productCategoryInfo.some((categoryValue) => {
                  return categoryValue === item1.value
                })} onClick={(e) => handleC2Click(e, item.value, item1.value)} /> ------- {item1.title}
              </div>
            })}
          </div>
        })}





      </div>
      {/* <Button
        type={'primary'}
        onClick={() => {
          let newProductCategory = structuredClone(productCategoryInfo);
          newProductCategory.push('');
          setProductCategoryInfo(newProductCategory);
        }}
      >
        添加一个分类
      </Button> */}
    </>
  );
};

export default App;

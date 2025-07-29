import { useModel } from '@umijs/max';
import { Radio, RadioChangeEvent } from 'antd';
import React, { useEffect, useState } from 'react';
interface Props {
  combineList: { description: string; active: boolean }[];
  setCombineList: any;
  unActiveProduct: string[];
}
const App: React.FC<Props> = (props) => {
  const { combineList, setCombineList, unActiveProduct } = props;
  const { successFileList } = useModel('productUpdateData');
  const { dataSource } = useModel('globalState');
  const [colorList, setColorList] = useState<string[]>([]);
  const [sizeList, setSizeList] = useState<string[]>([]);
  useEffect(() => {
    console.log(successFileList, dataSource);
    //获取到successFileList和dataSource里面的color和サイズ/CM的值，并获取乘积
    let newColorList = [];
    for (let i = 0; i < successFileList.length; i++) {
      if (
        successFileList[i].color !== '' &&
        successFileList[i].color !== null &&
        successFileList[i].color !== undefined
      ) {
        newColorList.push(successFileList[i].color);
      }
    }
    setColorList(newColorList);
    let newSizeList = [];
    for (let i = 0; i < dataSource.length; i++) {
      newSizeList.push(dataSource[i][0]);
    }
    setSizeList(newSizeList);
    let newCombineList = [];
    for (let i = 0; i < newColorList.length; i++) {
      for (let j = 0; j < newSizeList.length; j++) {
        let str = `${newColorList[i]}-${newSizeList[j]}`;
        let newMap: any = {};
        newMap.description = str;
        if (unActiveProduct.includes(str)) {
          newMap.active = false;
        } else {
          newMap.active = true;
        }
        newCombineList.push(newMap);
      }
    }
    console.log(newCombineList);
    setCombineList(newCombineList);
  }, [successFileList, dataSource]);

  return (
    <div>
      <span>
        如果修改过产品的颜色/产品的尺寸，必须先保存产品具体信息，然后再切换回产品库存选项卡
      </span>
      <div>
        <div>
          <span
            style={{
              fontWeight: 700,
              display: 'inline-block',
              width: 150,
            }}
          >
            选项名称
          </span>
          <span>选项值</span>
        </div>
        <div>
          <span
            style={{
              display: 'inline-block',
              width: 150,
            }}
          >
            颜色
          </span>
          <span>
            {colorList.map((item, index: number) => {
              return (
                <span
                  key={index}
                  style={{
                    border: '1px solid black',
                    padding: '0,2px',
                    marginRight: 4,
                    display: 'inline-block',
                  }}
                >
                  {item}
                </span>
              );
            })}
          </span>
        </div>
        <div style={{ marginTop: 5 }}>
          <span
            style={{
              display: 'inline-block',
              width: 150,
            }}
          >
            尺码
          </span>
          <span>
            {sizeList.map((item, index: number) => {
              return (
                <span
                  key={index}
                  style={{
                    border: '1px solid black',
                    padding: '0,2px',
                    marginRight: 4,
                    display: 'inline-block',
                  }}
                >
                  {item}
                </span>
              );
            })}
          </span>
        </div>
        <h4>具体库存状态</h4>
        <div style={{ marginTop: 5 }}>
          {combineList.map((item, index: number) => {
            return (
              <div
                key={index}
                style={{ marginBottom: 10, borderBottom: '1px solid black' }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    minWidth: 400,
                    marginRight: 40,
                  }}
                >
                  {item.description}
                </span>

                <Radio.Group
                  onChange={(e: RadioChangeEvent) => {
                    let newCombineList = structuredClone(combineList);
                    newCombineList[index].active = e.target.value;
                    setCombineList(newCombineList);
                  }}
                  value={item.active}
                >
                  <Radio value={true}>有库存</Radio>
                  <Radio value={false}>无库存</Radio>
                </Radio.Group>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default App;

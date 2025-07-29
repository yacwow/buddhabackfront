import React from 'react';
import { Button, Input, InputNumber, Popconfirm } from 'antd';
import './ProductSize.css';
import { useModel } from '@umijs/max';



const App: React.FC = () => {
  const {
    tableHead,
    setTableHead,
    tableData,
    setTableData,
    isProductSizeStandard,
    sizeVariable,
    setSizeVaribale,
  } = useModel('globalState');
  // const { smallImgSuccessList } = useModel("productUpdateData")
  // 添加新的行
  const addRow = () => {
    console.log(tableData);
    setTableData([
      ...tableData,
      tableData[0] ? Array(tableData[0].length).fill('') : Array(1).fill(''),
    ]);
    let newSizeVariable = structuredClone(sizeVariable);
    newSizeVariable.push({ priceVariate: '+', variateValue: 0.0, name: '' });
    setSizeVaribale(newSizeVariable);
  };

  // 添加新的列
  const addColumn = () => {
    setTableData(tableData.map((row) => [...row, '']));
    setTableHead([...tableHead, { transName: '', firstName: '' }]);
  };
  //tablehead的input改变
  const handleTableHeadInput = (value: string, index: number, type: string) => {
    let newTablehead = structuredClone(tableHead).map((item, index2) => {
      if (index2 === index) {
        if (type === 'firstName') {
          item.firstName = value;
        } else {
          item.transName = value;
        }
        return item;
      } else {
        return item;
      }
    });
    setTableHead(newTablehead);
  };
  //tablebody的input改变
  const handleTableBodyInput = (
    value: string,
    rowIndex: number,
    colIndex: number,
  ) => {
    let newTableData = structuredClone(tableData).map((item, row1) => {
      if (row1 === rowIndex) {
        return item.map((insideItem, col1) => {
          if (col1 === colIndex) {
            return value;
          } else {
            return insideItem;
          }
        });
      } else {
        return item;
      }
    });
    if (colIndex === 0) {
      // let newSizeVariable = [];
      // for (let i = 0; i < newTableData.length; i++) {
      //   let newSizeMap = {
      //     priceVariate: '+',
      //     variateValue: 0.0,
      //     name: newTableData[i][0],
      //   };
      //   newSizeVariable.push(newSizeMap);
      // }
      let newSizeVariable = structuredClone(sizeVariable);
      console.log(newSizeVariable);
      newSizeVariable[rowIndex].name = value;
      setSizeVaribale(newSizeVariable);
    }
    setTableData(newTableData);
  };
  //删除行
  const handleDeleteRow = (rowIndex: number) => {
    let newTableData = [];
    let key = '';
    for (let i = 0; i < tableData.length; i++) {
      if (i !== rowIndex) {
        newTableData.push(tableData[i]);
      } else {
        key = tableData[i][0];
      }
    }
    console.log(newTableData);
    setTableData(newTableData);
    let newSizeVariable = [];
    console.log(key);
    for (let i = 0; i < sizeVariable.length; i++) {
      if (sizeVariable[i].name !== key) {
        newSizeVariable.push(sizeVariable[i]);
      }
    }
    setSizeVaribale(newSizeVariable);
  };
  //删除列
  const handleDeleteCol = (colIndex: number) => {
    let newTableData = [];
    for (let i = 0; i < tableData.length; i++) {
      let newTableRow = [];
      for (let j = 0; j < tableData[i].length; j++) {
        if (j !== colIndex) {
          newTableRow.push(tableData[i][j]);
        }
      }
      newTableData.push(newTableRow);
    }
    setTableData(newTableData);
    //还要改变tablehead的
    let newTableHead = [];
    for (let i = 0; i < tableHead.length; i++) {
      if (i !== colIndex) {
        newTableHead.push(tableHead[i]);
      }
    }
    setTableHead(newTableHead);
  };
  //下面pricevariable的部分的输入框
  const handlePriceVariable = (
    item: { priceVariate: string; variateValue: number; name: string },
    value: number | string,
    index: number,
  ) => {
    if (index === 1) {
      const newValue = value as string;
      let newSizeVariable = structuredClone(sizeVariable);
      newSizeVariable.map((item1) => {
        if (item.name === item1.name) {
          item1.priceVariate = newValue;
        }
        return item1;
      });
      setSizeVaribale(newSizeVariable);
    } else if (index === 2) {
      const newValue = value as number;
      let newSizeVariable = structuredClone(sizeVariable);
      newSizeVariable.map((item1) => {
        if (item.name === item1.name) {
          item1.variateValue = newValue;
        }
        return item1;
      });
      setSizeVaribale(newSizeVariable);
    }
    console.log(value, sizeVariable);
  };

  return (
    <div style={{ width: 1200, margin: '0 auto' }}>
      <div>
        <h3>
          有些产品有固定的尺码不需要特别标明具体的长度，则直接使用：标准尺寸/standard来作为首列，不需要第二列
          <br />
          否则必须用：尺寸/Size做第一列
        </h3>
        <Button onClick={addRow}>添加一行</Button>
        <Button onClick={addColumn} disabled={isProductSizeStandard}>
          添加一列
        </Button>

        <Button
          danger
          style={{ marginLeft: 50 }}
          onClick={() => {
            setTableData([
              ['One Size'],
              ['One Size with Warranty'],
              ['One Size with Reiki'],
              ['One Size with Reiki and Warranty'],
            ]);
            setSizeVaribale([
              { name: 'One Size', priceVariate: '+', variateValue: 0 },
              {
                name: 'One Size with Warranty',
                priceVariate: '+',
                variateValue: 9.99,
              },
              {
                name: 'One Size with Reiki',
                priceVariate: '+',
                variateValue: 7.99,
              },
              {
                name: 'One Size with Reiki and Warranty',
                priceVariate: '+',
                variateValue: 16.99,
              },
            ]);
          }}
        >
          标准尺码插入
        </Button>
        {/* <Button
          danger
          style={{ marginLeft: 50 }}
          onClick={() => {
            console.log(tableData)
            // 1️⃣ 获取所有不同的 color（去重 & 按顺序）
            const uniqueColors = Array.from(
              new Set(smallImgSuccessList.flat().map(item => item.color).filter(color => color !== ''))
            );

            // 2️⃣ 预定义 `One Size` 变体规则
            const baseVariants = [
              '',
              'with Warranty',
              'with Reiki',
              'with Reiki and Warranty',
            ];

            // 3️⃣ **按颜色拆分为二维数组**
            const newTableData = uniqueColors.flatMap(color =>
              baseVariants.map(variant => [variant ? `${color} ${variant}` : color])
            );
            console.log(newTableData)

            // 4️⃣ 预定义价格变体
            const baseVariations = [
              { priceVariate: '+', variateValue: 0 },
              { priceVariate: '+', variateValue: 9.99 },
              { priceVariate: '+', variateValue: 7.99 },
              { priceVariate: '+', variateValue: 16.99 },
            ];

            // 5️⃣ 生成 `sizeVariable`
            const newSizeVariable = uniqueColors.flatMap(color =>
              baseVariants.map((variant, index) => ({
                name: variant ? `${color} ${variant}` : color,
                priceVariate: baseVariations[index].priceVariate,
                variateValue: baseVariations[index].variateValue,
              }))
            );
            console.log(sizeVariable, newSizeVariable)
            // ✅ 更新状态
            setTableData(newTableData);
            setSizeVaribale(newSizeVariable);
          }}
        >
          根据图片颜色插入对应尺码
        </Button> */}
        <table className="product-size-table">
          <thead>
            <tr>
              {tableHead.map((title, index) => {
                return (
                  <th key={index}>
                    {
                      <div style={{ maxWidth: 300 }}>
                        <input
                          style={{ display: 'inline-block' }}
                          value={title.firstName}
                          onChange={(e) =>
                            handleTableHeadInput(
                              e.target.value,
                              index,
                              'firstName',
                            )
                          }
                        />
                        <input
                          style={{ display: 'inline-block' }}
                          value={title.transName}
                          onChange={(e) =>
                            handleTableHeadInput(
                              e.target.value,
                              index,
                              'transName',
                            )
                          }
                        />
                      </div>
                    }
                  </th>
                );
              })}
              <th style={{ textAlign: 'center' }} key={'caozuo'}>
                操作
              </th>
            </tr>
          </thead>
          {tableData ? (
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex}>
                      <input
                        value={cell}
                        onChange={(e) =>
                          handleTableBodyInput(
                            e.target.value,
                            rowIndex,
                            colIndex,
                          )
                        }
                      />
                    </td>
                  ))}
                  <td>
                    <Popconfirm
                      title="删除当前行"
                      description="确定删除当前行?"
                      onConfirm={() => handleDeleteRow(rowIndex)}
                      okText="确定"
                      cancelText="否"
                    >
                      <Button danger>删除行</Button>
                    </Popconfirm>
                  </td>
                </tr>
              ))}
              {tableData[0] ? (
                <tr key={'shanchucaozuo'}>
                  {tableData[0].map((row, colIndex) => {
                    // console.log(tableData);
                    if (colIndex === 0) {
                      return (
                        <td key={colIndex}>
                          <div style={{ textAlign: 'center' }}>操作</div>
                        </td>
                      );
                    } else {
                      return (
                        <td key={colIndex}>
                          <Popconfirm
                            title="删除当前列"
                            description="确定删除当前列?"
                            onConfirm={() => {
                              handleDeleteCol(colIndex);
                            }}
                            okText="确定"
                            cancelText="否"
                          >
                            <Button danger>删除列</Button>
                          </Popconfirm>
                        </td>
                      );
                    }
                  })}
                </tr>
              ) : null}
            </tbody>
          ) : null}
        </table>
      </div>
      <div>
        <h3>不同尺码价差，比如原价20的东西，希望s码前端显示22，则为+2.</h3>
        {sizeVariable.map((item, index) => {
          return (
            <div key={index} style={{ display: 'flex' }}>
              <span style={{ width: 300 }}>{item.name} :</span>
              <Input
                value={item.priceVariate}
                style={{ width: 200 }}
                onChange={(e) => {
                  const value = e.target.value;
                  // 只获取最后一位字符
                  const lastChar = value[value.length - 1];
                  // 如果最后一位字符是 '+' 或者 '-'
                  if (lastChar === '+' || lastChar === '-') {
                    handlePriceVariable(item, lastChar, 1);
                  }
                }}
              />
              <InputNumber
                min={0}
                value={item.variateValue}
                style={{ width: 200 }}
                onChange={(value) => {
                  // 如果输入为 null，则传递 0 给处理函数
                  console.log(value);
                  if (value === null) {
                    handlePriceVariable(item, 0.0, 2);
                    return; // 停止执行后续逻辑
                  }
                  // 将输入值转换为字符串，以便进行正则匹配
                  const valueStr = String(value);
                  console.log(valueStr);
                  // 使用正则表达式验证输入是否是一个两位小数的数字
                  if (/^\d+(\.\d{0,2})?$/.test(valueStr)) {
                    handlePriceVariable(item, +value, 2);
                  } else {
                    // If the value has more than two decimal places, truncate it to two decimal places
                    const truncatedValue = Number(value).toFixed(2);
                    handlePriceVariable(item, +truncatedValue, 2);
                  }
                  if (+valueStr === 0) {
                    handlePriceVariable(item, 0.0, 2);
                  }
                  console.log(valueStr);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;

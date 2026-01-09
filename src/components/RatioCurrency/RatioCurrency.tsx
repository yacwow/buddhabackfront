import React, { useState } from 'react';
import {
  Table,
  Input,
  Select,
  InputNumber,
  Form,
  Space,
  Button,
  message,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';

const ExpandableTable = (props: any) => {
  const { initialRatio } = props;
  console.log(initialRatio);
  const [data, setData] = useState(initialRatio);

  // Add the handleDeleteRow function to handle row deletion
  const handleDeleteRow = (key: any) => {
    const indexToDelete = data.findIndex(
      (item: { key: any }) => item.key === key,
    );

    if (indexToDelete !== -1) {
      const updatedData = data.slice(0, indexToDelete);
      setData(updatedData);
    }
  };

  // const handleChange = (
  //   key: string | number, // 这里当作 item.key（行 id）
  //   field: string,
  //   value: number | null,
  // ) => {
  //   const newData = [...data]; // 拷贝数组
  //   const numValue = value === null ? null : Number(value);

  //   // 找到要修改的那一行索引（注意：根据 item.key 匹配）
  //   const idx = newData.findIndex(item => item.key === key);
  //   if (idx === -1) {
  //     console.warn('找不到要修改的行，key=', key);
  //     return;
  //   }

  //   // ===== 校验：minPrice 不得大于本行 maxPrice =====
  //   if (field === 'minPrice' && numValue !== null) {
  //     const rowMax = Number(newData[idx].maxPrice);
  //     // if (numValue > rowMax) {
  //     //   message.error(
  //     //     { content: '最低值不能大于最大值,请先修改成本上限', style: { marginTop: 300 } },
  //     //     5,
  //     //   );
  //     //   return;
  //     // }

  //     // 更新 minPrice，然后按 minPrice 排序（保持表按 minPrice 升序）
  //     newData[idx] = { ...newData[idx], minPrice: numValue };
  //     newData.sort((a, b) => Number(a.minPrice) - Number(b.minPrice));
  //     setData(newData);
  //     return;
  //   }

  //   // ===== 处理 maxPrice 更新 =====
  //   if (field === 'maxPrice') {
  //     // 转成数字并修正精度（保留两位）
  //     const newMax = numValue === null ? null : Number(Number(numValue).toFixed(2));

  //     // 检查基本边界：不小于本行 minPrice
  //     const thisMin = Number(newData[idx].minPrice);
  //     if (newMax !== null && newMax < thisMin) {
  //       message.error(
  //         { content: '最大值不能小于最小值', style: { marginTop: 300 } },
  //         5,
  //       );
  //       return;
  //     }



  //     newData[idx] = { ...newData[idx], maxPrice: newMax };
  //     setData(newData);
  //     return;
  //   }

  //   // ===== 其它字段的通用更新（coefficient, adjustment 等）=====
  //   newData[idx] = { ...newData[idx], [field]: numValue };
  //   setData(newData);
  // };


  const handleChange = (
    key: string | number,
    field: string,
    value: number | null,
  ) => {
    const updatedData = data.map((item: { key: string | number }) => {
      if (item.key === key) {
        return {
          ...item,
          [field]: value,
        };
      }
      return item;
    });
    setData(updatedData);
  };

  const handleAddRow = () => {
    let newMinPrice = 0;
    if (data.length > 0) {
      const prevMaxPrice = data[data.length - 1].maxPrice;
      newMinPrice = Number((prevMaxPrice + 0.01).toFixed(2));
    }

    const newMaxPrice = newMinPrice;

    const newRow = {
      key: data.length,
      minPrice: newMinPrice,
      maxPrice: newMaxPrice,
      coefficient: 1,
      deliveryCost: 6,
      adjustment: 10,
      additionProfit: 0,
    };
    setData([...data, newRow]);
  };
  // const handleBudgetChange = (key: any, field: string, value: any) => {
  //   const updatedData = data.map((item: { key: any }) => {
  //     if (item.key === key) {
  //       return { ...item, [field]: value };
  //     }
  //     return item;
  //   });
  //   setData(updatedData);
  // };

  const calculateBudgetRange = (record: {
    key?: any;
    minPrice?: any;
    maxPrice?: any;
    coefficient?: any;
    adjustment?: any;
    additionProfit?: any;
    deliveryCost?: any;
  }) => {
    const {
      minPrice,
      maxPrice,
      coefficient,
      adjustment,
      deliveryCost, additionProfit
    } = record;

    const budgetRangeMin = (
      minPrice * coefficient + deliveryCost +
      (adjustment ? adjustment : 0) +
      (additionProfit ? additionProfit : 0)
    ).toFixed(2);

    const budgetRangeMax = (
      maxPrice * coefficient + deliveryCost +
      (additionProfit ? additionProfit : 0) +
      (adjustment ? adjustment : 0)
    ).toFixed(2);

    return { budgetRangeMin, budgetRangeMax };
  };
  const handleExtractData = () => {
    let str = '';
    let prevMaxPriceCeil = null;
    for (let i = 0; i < data.length; i++) {
      const { budgetRangeMin, budgetRangeMax } = calculateBudgetRange(data[i]);
      const currentMinPrice = parseFloat(data[i].minPrice);
      const currentMaxPrice = parseFloat(data[i].maxPrice);

      if (i > 0) {
        const prevMaxPrice = Number(data[i - 1].maxPrice);

        // 下一行最小值必须至少 +0.01
        const allowedMin = Number((prevMaxPrice + 0.01).toFixed(2));

        // 下一行最小值最多 +0.1
        const allowedMax = Number((prevMaxPrice + 0.1).toFixed(2));

        if (currentMinPrice < allowedMin || currentMinPrice > allowedMax) {
          message.error(
            {
              content: `成本区间不连续：第 ${i + 1} 行的最低价必须在 ${allowedMin} ~ ${allowedMax} 之间`,
              style: { marginTop: 300 },
            },
            5,
          );
          return;
        }
      }


      prevMaxPriceCeil = Math.ceil(currentMaxPrice);

      const interStr = `${currentMinPrice};;${currentMaxPrice};;${data[i].coefficient === null ? 0 : data[i].coefficient
        };;${data[i].deliveryCost === null ? 0 : data[i].deliveryCost};;${data[i].adjustment === null ? 0 : data[i].adjustment
        };;${data[i].additionProfit === null ? 0 : data[i].additionProfit};;${parseFloat(
          budgetRangeMin,
        )};;${parseFloat(budgetRangeMax)}`;

      str = str + interStr + (i === data.length - 1 ? '' : '&&');
    }

    // Do something with the extractedData, such as sending it to the server or processing it further
    request('/admin/secure/updateCurrencyRatio', {
      params: { str },
      method: 'POST',
    }).then((data) => {
      if (data.result) {
        message.info({ content: '保存成功', style: { marginTop: 300 } }, 5);
      }
    });
  };
  const columns = [
    {
      title: '成本区间',
      dataIndex: 'priceRange',
      key: 'priceRange',
      render: (
        _: any,
        record: {
          minPrice: any;
          key: any;
          maxPrice: string | number | readonly string[] | undefined;
        },
      ) => (
        <Space>
          <InputNumber
            value={record.minPrice}
            onChange={(value) => handleChange(record.key, 'minPrice', value)}
            placeholder="最低价"
          />
          <span>-</span>
          <Input
            value={record.maxPrice}
            onChange={(e) =>
              handleChange(record.key, 'maxPrice', + e.target.value)
            }
            placeholder="最高价"
            type="number"
            step={0.01}
          />
        </Space>
      ),
    },
    {
      title: '成本系数',
      dataIndex: 'coefficient',
      key: 'coefficient',
      render: (
        _: any,
        record: {
          coefficient: number;
          key: any;
        },
      ) => (
        <InputNumber
          value={record.coefficient}
          step={0.001}
          precision={3}
          min={0}
          onChange={(e) =>
            handleChange(record.key, 'coefficient', e)
          }
          placeholder="成本系数"
        />
      ),
    },
    {
      title: '快递费用',
      dataIndex: 'deliveryCost',
      key: 'deliveryCost',
      render: (_: any, record: { deliveryCost: any; key: any }) => (
        <InputNumber
          value={record.deliveryCost}
          onChange={(value) => handleChange(record.key, 'deliveryCost', value)}
          placeholder="快递费用"
        />
      ),
    },
    {
      title: '调整值',
      dataIndex: 'adjustment',
      key: 'adjustment',
      render: (
        _: any,
        record: {
          adjustment: number;
          key: any;
        },
      ) => (
        <InputNumber
          value={record.adjustment}
          onChange={(value) =>
            handleChange(record.key, 'adjustment', value)
          }
          placeholder="调整"
        />
      ),
    },
    {
      title: '超额利润',
      dataIndex: 'additionProfit',
      key: 'additionProfit',
      render: (
        _: any,
        record: {
          additionProfit: string | number | readonly string[] | undefined;
          key: any;
        },
      ) => (
        <Input
          value={record.additionProfit}
          onChange={(e) =>
            handleChange(record.key, 'additionProfit', +e.target.value)
          }
          placeholder="调整"
        />
      ),
    },
    {
      title: '预算换算结果区间',
      dataIndex: 'budgetRange',
      key: 'budgetRange',
      render: (_: any, record: { key: any }) => {
        const { budgetRangeMin, budgetRangeMax } = calculateBudgetRange(record);
        return (
          <Space>
            <div>{budgetRangeMin}</div>
            <span>-</span>
            <div>{budgetRangeMax}</div>
          </Space>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (_: any, record: { key: any }) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteRow(record.key)}
        >
          删除
        </Button>
      ),
    },
  ];
  return (
    <>
      <h3>
        如果不要的格子请用0填充，不然可能会出错。目前成本区间需要自己填写，并保证没有重叠部分
        <br />
        具体计算公式为：价格*系数+采购费用+调整+超额利润=预算换算结果
      </h3>

      {columns && (
        // @ts-ignore
        <Table dataSource={data} columns={columns} pagination={false} />
      )}
      <Button type="primary" onClick={handleAddRow}>
        增加行
      </Button>
      <Button
        type="primary"
        onClick={handleExtractData}
        style={{ marginLeft: '16px' }}
      >
        提交到后台
      </Button>
    </>
  );
};

export default ExpandableTable;

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

  const handleChange = (
    key: string | number,
    field: string,
    value: string | number,
  ) => {
    if (field === 'minPrice' && value > data[key].maxPrice) {
      // Ensure minPrice does not exceed maxPrice
      return;
    }

    // For maxPrice, store the value without ".99" suffix for data
    let newValue = value;
    if (field === 'maxPrice') {
      // Parse the float value without the ".99" suffix
      newValue = parseFloat(""+value);
    }

    const updatedData = data.map((item: { key: string | number }) => {
      if (item.key === key) {
        return {
          ...item,
          [field]: newValue,
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
      newMinPrice = parseInt(prevMaxPrice, 10) + 1;
    }

    const newMaxPrice = newMinPrice + 30 + 0.99; // Add ".99" part

    const newRow = {
      key: data.length + 1,
      minPrice: newMinPrice,
      maxPrice: newMaxPrice,
      coefficient: 65,
      exchangeRate: 1,
      purchaseCost: 1,
      adjustment: 800,
    };
    setData([...data, newRow]);
  };
  const handleBudgetChange = (key: any, field: string, value: any) => {
    const updatedData = data.map((item: { key: any }) => {
      if (item.key === key) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setData(updatedData);
  };

  const calculateBudgetRange = (record: {
    key?: any;
    minPrice?: any;
    maxPrice?: any;
    coefficient?: any;
    exchangeRate?: any;
    purchaseCost?: any;
    adjustment?: any;
  }) => {
    const {
      minPrice,
      maxPrice,
      coefficient,
      exchangeRate,
      purchaseCost,
      adjustment,
    } = record;

    const budgetRangeMin = (
      minPrice * coefficient * exchangeRate +
      (purchaseCost ? purchaseCost : 0) +
      (adjustment ? adjustment : 0)
    ).toFixed(2);

    const budgetRangeMax = (
      maxPrice * coefficient * exchangeRate +
      (purchaseCost ? purchaseCost : 0) +
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

      if (
        prevMaxPriceCeil !== null &&
        (Math.ceil(prevMaxPriceCeil) !== Math.floor(currentMinPrice) ||
          !data[i - 1].maxPrice.toString().endsWith('.99'))
      ) {
        // Error: The current minPrice is not the ceil value of the previous maxPrice
        // and the previous maxPrice does not end with ".99"
        message.error(
          { content: '大概率价格区间有错误', style: { marginTop: 300 } },
          5,
        );
        return;
      }

      prevMaxPriceCeil = Math.ceil(currentMaxPrice);

      const interStr = `${currentMinPrice};;${currentMaxPrice};;${data[i].coefficient === null ? 0 : data[i].coefficient
        };;${data[i].exchangeRate === null ? 0 : data[i].exchangeRate};;${data[i].purchaseCost === null ? 0 : data[i].purchaseCost
        };;${data[i].adjustment === null ? 0 : data[i].adjustment};;${parseFloat(
          budgetRangeMin,
        )};;${parseFloat(budgetRangeMax)}`;

      str = str + interStr + (i === data.length - 1 ? '' : '&&');
    }

    console.log('Extracted Data:', str);
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
      title: '价格区间',
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
              handleChange(record.key, 'maxPrice', e.target.value)
            }
            placeholder="最高价"
            type="number"
            step={0.01}
          />
        </Space>
      ),
    },
    {
      title: '系数',
      dataIndex: 'coefficient',
      key: 'coefficient',
      render: (
        _: any,
        record: {
          coefficient: string | number | readonly string[] | undefined;
          key: any;
        },
      ) => (
        <Input
          value={record.coefficient}
          onChange={(e) =>
            handleChange(record.key, 'coefficient', e.target.value)
          }
          placeholder="系数"
        />
      ),
    },
    {
      title: '汇率',
      dataIndex: 'exchangeRate',
      key: 'exchangeRate',
      render: (_: any, record: { exchangeRate: any; key: any }) => (
        <InputNumber
          value={record.exchangeRate}
          onChange={(value) => handleChange(record.key, 'exchangeRate', value)}
          placeholder="汇率"
        />
      ),
    },
    {
      title: '采购费用',
      dataIndex: 'purchaseCost',
      key: 'purchaseCost',
      render: (_: any, record: { purchaseCost: any; key: any }) => (
        <InputNumber
          value={record.purchaseCost}
          onChange={(value) => handleChange(record.key, 'purchaseCost', value)}
          placeholder="采购费用"
        />
      ),
    },
    {
      title: '调整',
      dataIndex: 'adjustment',
      key: 'adjustment',
      render: (
        _: any,
        record: {
          adjustment: string | number | readonly string[] | undefined;
          key: any;
        },
      ) => (
        <Input
          value={record.adjustment}
          onChange={(e) =>
            handleChange(record.key, 'adjustment', e.target.value)
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
            <InputNumber
              value={budgetRangeMin}
              onChange={(value) =>
                handleBudgetChange(record.key, 'budgetRangeMin', value)
              }
              placeholder="预算换算结果最小值"
            />
            <span>-</span>
            <InputNumber
              value={budgetRangeMax}
              onChange={(value) =>
                handleBudgetChange(record.key, 'budgetRangeMax', value)
              }
              placeholder="预算换算结果最大值"
            />
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
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
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
        如果不要的格子请用0填充，不然可能会出错
        <br />
        具体计算公式为：价格*系数*汇率+采购费用+调整
      </h3>
      {columns && (
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

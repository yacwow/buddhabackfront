import { useModel } from '@umijs/max';
import { request } from '@umijs/max';
import { Button, Input, InputNumber, message, Radio, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import type { TabsProps } from 'antd';
import ProductStockStatus from './ProductStockStatus';

const App: React.FC = () => {
  const [newValue, setNewValue] = useState<
    {
      url: string | undefined;
      price: number | undefined;
      description: string | undefined;
      active: number | undefined;
    }[]
  >([]);
  const [active, setActive] = useState('1');
  const [combineList, setCombineList] = useState<
    { description: string; active: boolean }[]
  >([]);
  const { productId } = useModel('productUpdateData');
  const [unActiveProduct, setUnActiveProduct] = useState<string[]>([]);
  useEffect(() => {
    let arr = location.pathname.split('/');
    if (arr.length >= 5) {
      request('/admin/secure/getProductSourceAndStockStatus', {
        params: {
          productId: arr[4],
        },
      }).then((data) => {
        if (data.result) {
          setNewValue(data.data.productSourceList);
          setUnActiveProduct(data.data.notActiveStock);
        }
      });
    }
  }, []);
  //产品来源每行的函数
  const buildLine = () => {
    return newValue.map((item, index: number) => {
      return (
        <div key={index}>
          <Input
            placeholder="产品原始url地址"
            style={{ width: 300, marginRight: 30 }}
            addonBefore={`${index + 1}.`}
            addonAfter={
              <a href={item.url} target={'_blank'} rel="noreferrer">
                查看
              </a>
            }
            value={item.url}
            onChange={(e) => {
              let value = structuredClone(newValue);
              value[index].url = e.target.value;
              setNewValue(value);
            }}
          />
          <InputNumber
            type={'number'}
            style={{ width: 150, marginRight: 30 }}
            placeholder={'输入产品的原始价格'}
            value={item.price}
            onChange={(e) => {
              console.log(e);
              let value = structuredClone(newValue);
              value[index].price = e ? +e : 0;
              setNewValue(value);
            }}
          />
          <Input
            style={{ width: 150, marginRight: 30 }}
            placeholder={'商品备注'}
            value={item.description}
            onChange={(e) => {
              console.log(e.target.value);
              let value = structuredClone(newValue);
              value[index].description = e.target.value;
              setNewValue(value);
            }}
          />
          <Radio.Group
            onChange={(e) => {
              console.log(e.target.value);
              let value = structuredClone(newValue);
              value[index].active = e.target.value;
              setNewValue(value);
            }}
            value={item.active}
          >
            <Radio value={true}>启动</Radio>
            <Radio value={false}>禁用</Radio>
          </Radio.Group>
        </div>
      );
    });
  };
  //新增一行
  const addNewLine = () => {
    setNewValue([
      ...newValue,
      { url: '', price: undefined, description: '', active: 1 },
    ]);
  };
  //保存数据，库存和来源一起上传
  const handleSave = () => {
    console.log(newValue);
    let uploadValue = [];
    for (let i = 0; i < newValue.length; i++) {
      if (
        newValue[i].url === '' ||
        newValue[i].price === 0 ||
        newValue[i].price === undefined ||
        newValue[i].price === null
      ) {
        continue;
      } else {
        uploadValue.push(newValue[i]);
      }
    }
    console.log(uploadValue);
    request('/admin/secure/updateProductSourceAndStockStatus', {
      method: 'POST',
      data: {
        productSource: JSON.stringify(uploadValue),
        productStockStatus: JSON.stringify(combineList),
        productId: +productId,
      },
    }).then((data) => {
      if (data.result) {
        message.info({ content: '保存成功', style: { marginTop: '40vh' } }, 4);
      } else {
        message.error({ content: '保存失败', style: { marginTop: '40vh' } }, 4);
      }
    });
  };
  const buildProductSource = () => {
    return (
      <>
        <h3>必须有原始url地址和价格，不然该行不会上传</h3>
        <span
          style={{
            width: 300,
            textAlign: 'center',
            display: 'inline-block',
            marginRight: 30,
          }}
        >
          产品原始url地址,必须是绝对地址
        </span>
        <span
          style={{
            width: 150,
            textAlign: 'center',
            display: 'inline-block',
            marginRight: 30,
          }}
        >
          产品原始价格
        </span>
        <span
          style={{
            width: 150,
            textAlign: 'center',
            display: 'inline-block',
            marginRight: 30,
          }}
        >
          产品备注
        </span>
        <span
          style={{
            width: 100,
            textAlign: 'center',
            display: 'inline-block',
            marginRight: 30,
          }}
        >
          产品状态
        </span>
        {buildLine()}
        <div></div>
        <Button style={{ marginTop: 10 }} type="primary" onClick={addNewLine}>
          添加一行
        </Button>
      </>
    );
  };
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `产品货源`,
      children: buildProductSource(),
    },
    {
      key: '2',
      label: `产品库存状态`,
      children: (
        <ProductStockStatus
          combineList={combineList}
          setCombineList={setCombineList}
          unActiveProduct={unActiveProduct}
        />
      ),
    },
  ];
  const onChange = (key: string) => {
    console.log(key);
    setActive(key);
  };
  return (
    <div>
      <h2>商品库存来源相关,只能对已经有产品id的产品进行修改</h2>
      <h2>
        这个保存和其他地方的保存不一样，必须单独点击保存才能存入，其他地方共享保存按钮
      </h2>
      <Tabs
        activeKey={active}
        items={items}
        onChange={onChange}
        style={{ minHeight: 600 }}
      />

      <div style={{ marginTop: 20 }}>
        <Button
          style={{ marginRight: 20 }}
          type={'primary'}
          onClick={handleSave}
        >
          保存产品来源与库存
        </Button>
      </div>
    </div>
  );
};
export default App;

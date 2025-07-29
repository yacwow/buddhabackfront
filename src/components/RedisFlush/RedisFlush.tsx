import { request } from '@umijs/max';
import { Button, message, Modal } from 'antd';
import React, { useState } from 'react';

const App: React.FC = () => {
  const [open, setOpen] = useState(false); //modal
  const [open1, setOpen1] = useState(false); //modal
  const handleRedisFresh = async () => {
    await request('/admin/secure/refreshRedis').then((data) => {
      if (data.result) {
        message.info({ content: '操作成功', style: { marginTop: 300 } }, 4);
        setOpen(false);
        setOpen1(false);
      } else {
        message.info({ content: '网络异常', style: { marginTop: 300 } }, 4);
        setOpen(false);
        setOpen1(false);
      }
    });
    setOpen(false);
    setOpen1(false);
  };
  // const [minStockNumber, setMinStockNumber] = useState<number | undefined>(); //最小库存
  // const [maxStockNumber, setMaxStockNumber] = useState<number | undefined>(); //最小库存
  // const [stockButtonActive, setStockButtonActive] = useState(false);
  const [categoryButtonActive, setCategoryButtonActive] = useState(false);
  const [wishNumberActive, setWishNumberActive] = useState(false);
  const handleWishNumberChange = () => {
    setWishNumberActive(true);



    request('/admin/secure/updateWishNumber').then((data) => {
      setWishNumberActive(false);
      if (data.result) {
        message.info(
          { content: '修改成功', style: { marginTop: '40vh' } },
          4,
        );
      } else {
        message.error(
          { content: '更新失败', style: { marginTop: '40vh' } },
          4,
        );
      }
    })
    setTimeout(() => {
      setWishNumberActive(false);
    }, 4000);
  }
  // //改变所有产品的库存数量
  // const handleChangeStockNumber = () => {
  //   if (minStockNumber && maxStockNumber && minStockNumber <= maxStockNumber) {
  //     setStockButtonActive(true);
  //     request('/admin/secure/updateStockNumberOfAllProduct', {
  //       params: { min: minStockNumber, max: maxStockNumber },
  //     }).then((data) => {
  //       if (data.result) {
  //         message.info(
  //           { content: '修改成功', style: { marginTop: '40vh' } },
  //           4,
  //         );
  //       } else {
  //         message.error(
  //           { content: '更新失败', style: { marginTop: '40vh' } },
  //           4,
  //         );
  //       }

  //       setStockButtonActive(false);
  //     });
  //   } else {
  //     message.error(
  //       { content: '信息缺少/信息错误', style: { marginTop: '40vh' } },
  //       4,
  //     );
  //   }
  // };
  //改变头图
  const handleCategoryFirstPicture = () => {
    setCategoryButtonActive(true);
    request('/admin/changeCategoryPictureAuto').then((data) => {
      if (data.result) {
        message.info({ content: '更新成功', style: { marginTop: '40vh' } }, 4);
      } else {
        message.error(
          { content: '部分/全部更新失败', style: { marginTop: '40vh' } },
          4,
        );
      }
      setCategoryButtonActive(false);
    });
  };

  return (
    <div>
      <Modal
        title="确定要执行本次操作么？"
        footer={null}
        open={open}
        closable={false}
        style={{ marginTop: '20vh' }}
      >
        <Button
          onClick={() => {
            setOpen1(true);
          }}
        >
          确定
        </Button>
        <Button
          onClick={() => {
            setOpen(false);
          }}
        >
          放弃本次操作
        </Button>
      </Modal>
      <Modal
        title="再次确定要执行本次操作么？"
        open={open1}
        footer={null}
        closable={false}
        style={{ marginTop: '25vh' }}
      >
        <Button onClick={handleRedisFresh}>再次确定</Button>
        <Button
          onClick={() => {
            setOpen(false);
            setOpen1(false);
          }}
        >
          放弃本次操作
        </Button>
      </Modal>
      <div style={{ color: '#f40', textAlign: 'center' }}>
        <h2>这是两个超级危险的按钮</h2>
        <h3>一般不是后台管理系统和前端展示有很大出入，千万别用</h3>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          height: 400,
          verticalAlign: 'center',
          alignItems: 'center',
        }}
      >
        <Button
          type="primary"
          onClick={() => {
            setOpen(true);
          }}
        >
          刷新整个缓存数据库
        </Button>
      </div>
      {/* <div>
        <h3 style={{ textAlign: 'center' }}>
          改变产品库存，所有的前端能展示的产品库存回归随机指定的值，
          <br />
          注意勾选类（特别是timeseller和discount的值，理论上不能超过100，不然可能前端有点展示的问题）
        </h3>
        <div
          style={{
            display: 'flex',
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          库存的范围：
          <Input
            style={{ width: 200 }}
            placeholder="库存最小值"
            type="number"
            value={minStockNumber}
            onChange={(e) => {
              if (+e.target.value === 0) {
                setMinStockNumber(undefined);
                return;
              }
              setMinStockNumber(+e.target.value);
            }}
          />
          至
          <Input
            style={{ width: 200 }}
            placeholder="库存最大值"
            type="number"
            value={maxStockNumber}
            onChange={(e) => {
              if (+e.target.value === 0) {
                setMaxStockNumber(undefined);
                return;
              }
              setMaxStockNumber(+e.target.value);
            }}
          />
        </div>

        <div></div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            height: 400,
            verticalAlign: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            type="primary"
            onClick={handleChangeStockNumber}
            disabled={stockButtonActive}
          >
            改变产品库存
          </Button>
        </div>
      </div> */}

      <div>
        <h3 style={{ textAlign: 'center' }}>
          给虚假的wishnumber 做一个-5~15的修正，现在产品少，还是比较快，以后产品数量超过五百就会比较慢
        </h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            height: 100,
            verticalAlign: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            type="primary"
            onClick={handleWishNumberChange}
            disabled={wishNumberActive}
          >
            修改number值
          </Button>
        </div>
      </div>


      <div>
        <h3 style={{ textAlign: 'center' }}>
          自动根据排序来更新分类页面的第一张图
          <br />
          url为：www.karmaandchi.com/categoryNav
        </h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            height: 100,
            verticalAlign: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            type="primary"
            onClick={handleCategoryFirstPicture}
            disabled={categoryButtonActive}
          >
            自动排序
          </Button>
        </div>
      </div>

    </div>
  );
};
export default App;

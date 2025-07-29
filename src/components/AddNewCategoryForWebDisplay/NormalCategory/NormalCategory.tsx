import React, { useEffect, useState } from 'react';
import { Button, message, Modal } from 'antd';
import { TreeSelect } from 'antd';
import { engToJap } from '@/constants/engToJap';
import { useModel } from '@umijs/max';
import BigImgUpload from '@/components/AddProduct/ProductContext/BigImgUpload';
import { request } from '@umijs/max';
import { history } from '@umijs/max';
// 输出的 treeData 类型
const treeData: TreeNode[] = [];
for (let i = 0; i < engToJap.length; i++) {
  let temp: TreeNode = { title: '', value: '' };
  // eslint-disable-next-line guard-for-in
  for (let key in engToJap[i] ) {
    let wrap = engToJap[i][key] ;
    temp.value = `${key};${wrap.name}`;
    temp.title = wrap.name;
    if (wrap.child === undefined) {
      continue;
    } else {
      temp.children = [];
      // eslint-disable-next-line guard-for-in
      for (let insideKey in wrap.child) {
        let insideTemp: TreeNode = {
          title: wrap.child[insideKey],
          value: `${key} ${insideKey};${wrap.name} ${wrap.child[insideKey]}`
        };
        temp.children.push(insideTemp);
      }
    }
  }
  treeData.push(temp);
}

// 定义数据结构类型
interface ChildMap {
  [childKey: string]: string;
}

interface Wrap {
  name: string;
  child?: ChildMap;
}

interface EngToJapItem {
  [key: string]: Wrap;
}

interface TreeNode {
  title: string;
  value: string;
  children?: TreeNode[];
}





const App: React.FC = () => {
  const {
    bigImgSuccessList,
    setBigImgSuccessList,
  } = useModel('addNewCategoryData');
  const {
    categorySpecialEventSuccessFileList,
    setCategorySpecialEventSuccessFileList,
  } = useModel('categoryManagement');
  const { treeDataArr, setTreeDataArr } = useModel('global');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [selectShowedValue, setSelectShowedValue] = useState('');
  useEffect(() => {
    if (
      treeDataArr.length === 0 ||
      categorySpecialEventSuccessFileList.length === 0
    ) {
      //为了获取分类下拉列表，同时懒得在做一个请求了
      request('/admin/secure/getHomePageCategoryInfo').then((data) => {
        if (data.result) {
          let tempTreeDataArr = [];
          tempTreeDataArr.push(...data.data.categoryDetail);
          tempTreeDataArr.push({
            title: "Best Seller",
            value: "/bestSeller?page=1",
            key: "/bestSeller?page=1",
          });
          tempTreeDataArr.push({
            title: "Discount-70%",
            value: "/saveUpTo70?page=1",
            key: "/saveUpTo70?page=1",
          });
          tempTreeDataArr.push({
            title: "Trending Now",
            value: "/trending?page=1",
            key: "/trending?page=1",
          });
          tempTreeDataArr.push({
            title: "自定义",
            value: "",
            key: "自定义",
          });
          setTreeDataArr(tempTreeDataArr);
          setCategorySpecialEventSuccessFileList(data.data.categoryInfo);
        }
      });
    }
  }, []);
  //下拉框选择事件
  const handleSelect = (value: string) => {
    console.log(value);
    setSelectShowedValue(value);
    request('/admin/secure/getCategoryPicture', {
      params: { categoryInfo: value },
    }).then((data) => {
      if (data.result) {
        let bigImg: any = {};
        bigImg.url = data.data.img;
        bigImg.size = 0;
        setBigImgSuccessList([bigImg]);
        console.log(bigImg);
      } else {
        message.error(`${data.result}`, 5);
      }
    });
  };
  //提交保存
  const submitParams = () => {
    if (bigImgSuccessList.length === 0) {
      message.info('需要添加图片', 3);
      setIsModalOpen(false);
      return;
    }
    console.log(bigImgSuccessList, selectShowedValue);
    //先获取所有的信息，然后再多一个图片地址信息，然后上传
    //发送request之后无论成功与否都关闭modal
    request('/admin/secure/uploadCategoryData', {
      params: {
        categoryInfo: selectShowedValue,
        imgSrc: bigImgSuccessList[0].url,
      },
    }).then((data) => {
      console.log(data);
      if (data.result) {
        message.info('保存成功', 3);
      } else {
        message.error('保存失败', 3);
      }

      setIsModalOpen(false);
    });
  };
  return (
    <div>
      <div>
        <div>产品类别 </div>
        <TreeSelect
          showSearch
          // defaultValue="Elegant Bodycon Dresses-c3-1"
          dropdownStyle={{ maxWidth: 300 }}
          placeholder="请选择分类"
          popupMatchSelectWidth={false}
          onSelect={(value) => handleSelect(value)}
          allowClear
          listHeight={300}
          style={{ width: 300, height: 30 }}
          // treeCheckStrictly={true}
          // showArrow={false}
          treeDefaultExpandAll
          treeData={treeDataArr}
        />
      </div>
      <BigImgUpload
        bigImgSuccessList={bigImgSuccessList}
        setBigImgSuccessList={setBigImgSuccessList}
      />

      <Button
        type="primary"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        保存
      </Button>
      <Button
        type="primary"
        onClick={() => {
          setIsModalOpen1(true);
        }}
        danger
      >
        放弃保存
      </Button>
      <Modal
        title="提交确认"
        open={isModalOpen}
        onOk={submitParams}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <p>确定要提交么？</p>
      </Modal>
      <Modal
        title="返回上一页"
        open={isModalOpen1}
        onOk={() => {
          history.back();
        }}
        onCancel={() => {
          setIsModalOpen1(false);
        }}
      >
        <p>确定不保存数据吗</p>
      </Modal>
    </div>
  );
};
export default App;

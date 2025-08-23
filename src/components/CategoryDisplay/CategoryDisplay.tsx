import { formatTimeFromStr } from '@/utils/format';
import { useModel } from '@umijs/max';
import { request } from '@umijs/max';
import { Table, Image } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

interface DataType {
  key: React.Key;
  categoryId: string;
  title: string;
  categoryLevel: string;
  href: string;
  countNumber: number;
  updatedTime: string;
  author: string;
  categoryHref: string;
  categoryImgUrl: string;
}
const columns: ColumnsType<DataType> = [
  {
    title: 'ID',
    dataIndex: 'categoryId',
    sorter: (a, b) => +a.categoryId - +b.categoryId,
  },
  {
    title: '标题',
    dataIndex: 'title',
    render: (title: string, onelineData) => {
      return (
        <a href={onelineData.categoryHref} target="_blank" rel="noreferrer">
          {title}
        </a>
      );
    },
  },
  {
    title: '图片',
    dataIndex: 'categoryImgUrl',
    render: (categoryImgUrl: string) => {
      return <Image src={categoryImgUrl} width={50} height={50} />;
    },
  },
  {
    title: '等级',
    dataIndex: 'categoryLevel',
    render: (categoryLevel: string) => {
      if (categoryLevel === '一级') {
        return (
          <div
            style={{
              width: 60,
              backgroundColor: 'rgb(200,40,0)',
              textAlign: 'center',
              color: 'white',
            }}
          >
            一级
          </div>
        );
      } else if (categoryLevel === '二级') {
        return (
          <div
            style={{
              width: 60,
              backgroundColor: 'rgb(100,100,200)',
              textAlign: 'center',
              color: 'white',
            }}
          >
            二级
          </div>
        );
      } else if (categoryLevel === '三级') {
        return (
          <div
            style={{
              width: 60,
              backgroundColor: 'rgb(100,200,100)',
              textAlign: 'center',
              color: 'white',
            }}
          >
            三级
          </div>
        );
      }
    },
  },
  {
    title: '固定链接',
    dataIndex: 'href',
    render: (href: string) => {
      return (
        <a
          href={`${window.location.protocol}//${window.location.hostname}${href} `}
          target="_blank"
          rel="noreferrer"
        >
          {href}
        </a>
      );
    },
  },
  {
    title: '更新时间',
    dataIndex: 'updatedTime',
  },
  {
    title: '作者',
    dataIndex: 'author',
  },
];
const App: React.FC = () => {
  const {
    categorySpecialEventSuccessFileList,
    setCategorySpecialEventSuccessFileList,
  } = useModel('categoryManagement');
  const { treeDataArr, setTreeDataArr } = useModel('global');
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    console.log(treeDataArr)
    const tempData: any[] = [];

    let key = 0;
    for (let i = 0; i < treeDataArr.length; i++) {

      let value = treeDataArr[i]['value'];
      if (value === "" || value === "/bestSeller?page=1" || value === "/saveUpTo70?page=1" || value === "/trending?page=1") {
        continue;
      }
      let title = treeDataArr[i]['title'];
      let imgSrc = treeDataArr[i]['imgSrc'];
      let categoryId = treeDataArr[i]['categoryId'];
      let updateTime = treeDataArr[i]['updateTime'];
      let author = treeDataArr[i]['author'];
      let categoryLevel = '一级';
      console.log(updateTime);
      tempData.push({
        key: key,
        categoryId,
        categoryImgUrl: imgSrc,
        title,
        categoryLevel,
        href: value,
        updatedTime:
          updateTime !== null && updateTime !== '' && updateTime !== undefined
            ? formatTimeFromStr(updateTime)
            : '',
        author,
        categoryHref: `/backend/productSort/categoryType/${value}`,
      });
      key++;
      let children = treeDataArr[i]['children'];
      if (children && Array.isArray(children)) {
        for (let j = 0; j < children.length; j++) {
          tempData.push({
            key: key,
            categoryId: children[j]['categoryId'],
            categoryImgUrl: children[j]['imgSrc'],
            title: children[j]['title'],
            categoryLevel: '二级',
            href: children[j]['value'],
            updatedTime:
              children[j]['updateTime'] !== null &&
                children[j]['updateTime'] !== '' &&
                children[j]['updateTime'] !== undefined
                ? formatTimeFromStr(children[j]['updateTime'])
                : '',
            author: children[j]['author'],
            categoryHref: `/backend/productSort/categoryType${children[j]['value']}`,
          });
          key++;
          let insideChildren = children[j]['children'];
          if (insideChildren && Array.isArray(insideChildren)) {
            for (let k = 0; k < insideChildren.length; k++) {
              tempData.push({
                key: key,
                categoryId: insideChildren[k]['categoryId'],
                categoryImgUrl: insideChildren[k]['imgSrc'],
                title: insideChildren[k]['title'],
                categoryLevel: '三级',
                href: insideChildren[k]['value'],
                updatedTime:
                  insideChildren[k]['updateTime'] !== null &&
                    insideChildren[k]['updateTime'] !== '' &&
                    insideChildren[k]['updateTime'] !== undefined
                    ? formatTimeFromStr(insideChildren[k]['updateTime'])
                    : '',
                author: insideChildren[k]['author'],
                categoryHref: `/backend/productSort/categoryType/${insideChildren[k]['value']}`,
              });
              key++;
            }
          }
        }
      }
    }
    console.log(tempData);
    setData(tempData);
  }, [treeDataArr]);
  useEffect(() => {
    if (
      treeDataArr.length === 0 ||
      categorySpecialEventSuccessFileList.length === 0
    ) {
      //为了获取分类的基本信息，同时懒得在做一个请求了
      request('/admin/secure/getHomePageCategoryInfo').then((data) => {
        if (data.result) {
                   // let tempTreeDataArr = [];
          // tempTreeDataArr.push(...data.data.categoryDetail);
          // tempTreeDataArr.push({
          //   title: "Best Seller",
          //   value: "/bestSeller?page=1",
          //   key: "/bestSeller?page=1",
          // });
          // tempTreeDataArr.push({
          //   title: "Discount-70%",
          //   value: "/saveUpTo70?page=1",
          //   key: "/saveUpTo70?page=1",
          // });
          // tempTreeDataArr.push({
          //   title: "Trending Now",
          //   value: "/trending?page=1",
          //   key: "/trending?page=1",
          // });
          // tempTreeDataArr.push({
          //   title: "自定义",
          //   value: "",
          //   key: "自定义",
          // });
          // setTreeDataArr(tempTreeDataArr);
          setTreeDataArr(data.data.categoryDetail)
          setCategorySpecialEventSuccessFileList(data.data.categoryInfo);
        }
      });
    }
  }, []);
  return (
    <div>
      {data.length ? (
        <Table
          pagination={{
            hideOnSinglePage: true,
            pageSize: 100,
            total: data.length,
          }}
          columns={columns}
          dataSource={data}
        />
      ) : null}
    </div>
  );
};
export default App;

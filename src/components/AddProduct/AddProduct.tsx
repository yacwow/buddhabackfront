import { formatTimeWithHours } from '@/utils/format';
import { request } from '@umijs/max';
import { useModel } from '@umijs/max';
import { Button, message, Modal, Tabs, TabsProps } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './AddProduct.less';
import AddProductHeader from './AddProductHeader';
import Comment from './Comment';
import ProductCategory from './ProductCategory';
import ProductContext from './ProductContext';
import ProductDescription from './ProductDescription';
import ProductSize from './ProductSize/ProductSize';
import ProductSourceAndStockStatus from './ProductSourceAndStockStatus';
import { generateWishlistNumber } from '@/utils/randomFraudWishList';
/**
 * 为了第一页的时候就能上传修改，只能请求放在这里，导致每次要请求六七个接口
 *
 *
 */

const App: React.FC = () => {
  // const { current } = useModel('globalState');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saved, setSaved] = useState(false)
  const {
    setFirstCategory,
    setSecondCategory,
    setDataSource,
    tableHead,
    tableData,
    setTableHead,
    setTableData,
    sizeVariable,
    setSizeVaribale,
    isProductSizeStandard,
    setIsProductSizeStandard,
  } = useModel('globalState');
  const {
    productDescription,
    successFileList,
    bigImgSuccessList,
    value1,
    productId,
    editStatus,
    commentDataSource,
    stockStatus,
    setBigImgSuccessList,
    setEditStatus,
    setSuccessFileList,
    smallImgSuccessList,
    setSmallImgSuccessList,
    setProductDescription,
    productCategoryInfo,
    setProductDescriptionMapData,
    setCommentDataSource,
    setStockStatus,
    setProductId,
    setTreeValue,
    setCommentCount,
    productDescriptionMapData,
    setProductCategoryInfo,
    commentSummary,
    commentScale,
    mp4Url,
    title2,
  } = useModel('productUpdateData');
  const {
    originValue,
    valueBeforeDiscount,
    stockNum,
    fraudSoldAmount,
    productRemark,
    productWeight,
    fraudWishList,
    truePrice,
  } = useModel('productDetail');

  const {
    setOriginValue,
    setValueBeforeDiscount,
    setStockNum,
    setFraudSoldAmount,
    setProductRemark,
    setProductWeight,
    setFraudWishList,
    setTruePrice,
  } = useModel('productDetail');

  const {
    setHref,
    setValue1,
    setTitle2,
    setMp4Url,
    setCommentScale,
    setCommentSummary,
    setSortType,
    sortType,
  } = useModel('productUpdateData');
  const {
    categorySpecialEventSuccessFileList,
    setCategorySpecialEventSuccessFileList,
  } = useModel('categoryManagement');
  const { treeDataArr, setTreeDataArr } = useModel('global');

  useEffect(() => {
    return () => {
      setProductId('');
      setValue1('');
      setTitle2('');
      setOriginValue('0');
      setValueBeforeDiscount('0');
      setTruePrice('0');
      setStockNum(0);
      setFraudSoldAmount(0);
      setProductRemark('');
      setProductWeight(0);
      setMp4Url([]);
      setSortType('');
      setProductDescription('');
      setFraudWishList(0);
      setBigImgSuccessList([]);
      setSuccessFileList([]);
      setSmallImgSuccessList([])
      setTableData([]);
      setCommentDataSource([]);
      setCommentScale([]);
      setCommentSummary([]);
      setProductCategoryInfo([]);
      setSizeVaribale([]);
      setEditStatus('');
      setStockStatus('');
    };
  }, []);
  useEffect(() => {
    console.log(successFileList)
  },[successFileList])
  //展开提交的modal 在提交之前先做一些简单的验证，省的容易出错
  const showModal = () => {
    // // console.log(bigImgSuccessList, successFileList);
    if (value1 === '') {
      message.info('标题漏填了', 3);
      return;
    }
    if (+originValue < 0 || +valueBeforeDiscount < 0 || +truePrice < 0) {
      message.info('价格|购入价不能为负数', 3);
      return;
    }

    if (Object.keys(bigImgSuccessList).length === 0) {
      message.info('需要有一张大图', 3);
      return;
    }
    console.log(successFileList)
    if (
      Object.keys(successFileList).length !== 0 &&
      successFileList.every((item) => item.color === '')
    ) {
      message.info('必须有一张小图有颜色', 3);
      return;
    }
    let newProductCategoryInfo = structuredClone(productCategoryInfo);
    newProductCategoryInfo = Array.from(
      new Set(newProductCategoryInfo.filter((item) => item !== '')),
    );
    setProductCategoryInfo(newProductCategoryInfo);
    if (newProductCategoryInfo.length === 0) {
      message.info('请选择产品分类', 3);
      return;
    }
    if (tableData.length === 0) {
      message.info('请输入产品尺寸表', 3);
      return;
    }
    // console.log(productDescription);
    // if (Object.keys(productDescription).length === 0) {
    //   message.info('请输入产品特征表', 3);
    //   return;
    // }

    setIsModalOpen(true);
  };
  const handleDetailSize = () => {
    //根据衣服尺寸的数据datasource合成一个需要上传的str
    if (isProductSizeStandard) {
      let arr = [
        { transName: 'standard', firstName: '标准尺寸', values: 'One Size' },
      ];
      return JSON.stringify(arr);
    } else {
      let values = [];
      for (let i = 0; i < tableData[0].length; i++) {
        let value = [];
        for (let j = 0; j < tableData.length; j++) {
          if (tableData[j].length !== tableData[0].length) {
            break;
          } else {
            value.push(tableData[j][i]);
          }
        }
        values.push(value);
      }
      let uploadList = [];
      for (let i = 0; i < tableHead.length; i++) {
        let map = tableHead[i];
        if (values.length > i) {
          console.log(values);
          map.values = values[i];
        }
        uploadList.push(map);
      }
      console.log(uploadList);
      return JSON.stringify(uploadList);
    }
  };



  const handleSmallImgSuccessList = () => {
    let list = [];
    let count = 0;
    for (let i = 0; i < smallImgSuccessList.length; i++) {
      for (let j = 0; j < smallImgSuccessList[i].length; j++) {
        count++;
      }
    }
    let deduct = 0;
    //目前listprice和price是根本没用的两个属性；用+和pricevariate来调节价格
    for (let i = 0; i < smallImgSuccessList.length; i++) {
      for (let j = 0; j < smallImgSuccessList[i].length; j++) {
        let map: any = {};
        map.url = smallImgSuccessList[i][j].url;
        map.color = smallImgSuccessList[i][j].color;
        map.listPrice = smallImgSuccessList[i][j].listPrice
          ? smallImgSuccessList[i][j].listPrice
          : 0.0;
        map.price = smallImgSuccessList[i][j].price ? smallImgSuccessList[i][j].price : 0.0;
        map.variateValue = smallImgSuccessList[i][j].variateValue ? smallImgSuccessList[i][j].variateValue : 0;
        map.priceVariate = smallImgSuccessList[i][j].priceVariate ? smallImgSuccessList[i][j].priceVariate : "+";
        map.rank = count - deduct;
        if (j === 0) {
          map.main = true;
        } else {
          map.main = false;
        }
        deduct++;
        list.push(map)
      }
    }

    return list;
  };

  const handleOk = () => {
    //上传信息，成功提示成功，然后无论是否成功都set掉

    //就那个尺码，根据datesource转化的
    let productSizeStr = handleDetailSize();
    let mp4 = '';
    for (let i = 0; i < mp4Url.length; i++) {
      mp4 += mp4Url[i].url;
      mp4 += ';;';
    }

    setSaved(true)

    request('/admin/secure/addOrUpdateOneProductDetailInfo', {
      method: 'POST',
      data: {
        productId,
        description: value1,
        description2: title2,
        marketPrice: +originValue,
        originPrice: +valueBeforeDiscount,
        purchasePrice: +truePrice,
        stock: stockNum,
        fraudSoldNum: fraudSoldAmount,
        insideDescription: productRemark,
        productWeight,
        mp4Url: mp4,
        sortType,
        function: productDescription,
        fraudWishListNum: (fraudWishList === null || fraudWishList === 0) ? generateWishlistNumber(commentDataSource.length) : fraudWishList,
        bigImgSrc: bigImgSuccessList[0].url,
        smallImgSrcList: JSON.stringify(handleSmallImgSuccessList()),
        productDetailSize: productSizeStr,
        commentData: JSON.stringify(commentDataSource),
        commentScale: JSON.stringify(commentScale),
        commentSummary: JSON.stringify(commentSummary),
        productCategoryInfo: JSON.stringify(productCategoryInfo),
        sizeVariable: JSON.stringify(sizeVariable),
        editStatus,
        stockStatus,
      },
    }).then((data) => {
      setSaved(false)
      if (data.result) {
        message.info({ content: '添加成功', style: { marginTop: '30vh' } }, 5);
        setProductId("" + data.data.productId);
        setHref(`/Mainproduct/${data.data.productId}`);
        // history.push('/backend/showAllProduct');
      } else {
        message.info(
          { content: data.message, style: { marginTop: '30vh' } },
          5,
        );
        if (data.data.productId) {
          setProductId(data.data.productId);
          setHref(`/Mainproduct/${data.data.productId}`);
        }
      }
    });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    let arr = location.pathname.split('/');

    if (arr.length >= 5) {
      setProductId(arr[4]);
      request(`/admin/secure/getProductDetailInformation/${arr[4]}`).then(
        (data) => {
          if (data.result) {
            //变成{Neckline:["Fresh","Cute"],Bag Style:[""Sweet heart collar""]，"Sweet heart collar":[]}变成
            //从[{"name":"Neckline","name2":"项链","value_name":"Fresh"},{"name":"Neckline","name2":"项链","value_name":"Cute"}...
            //产品介绍的基础信息
            setProductDescription(data.data.productDetailDescription);
            // console.log(oneTypeMapOuter);
            //尺码的基础信息
            let size = data.data.productDetailSize;

            let detailSizeArr = JSON.parse(size);
            let sortedList = [];
            let sortedHead = [];
            for (let i = 0; i < detailSizeArr.length; i++) {
              let transName = detailSizeArr[i]['transName'];
              let firstName = detailSizeArr[i]['firstName'];
              let values = detailSizeArr[i]['values'];
              if (!values) {
                continue;
              }
              let map: any = {};
              map.transName = transName;
              map.firstName = firstName;
              sortedList.push(values);
              sortedHead.push(map);
            }
            // console.log(sortedHead);
            setTableHead(sortedHead);
            let sizeVariables = JSON.parse(
              data.data.productContextInfo.sizeVariables,
            );
            setSizeVaribale(sizeVariables);
            let totalLine = [];
            if (sortedHead[0]['transName'].toUpperCase() === 'STANDARD') {
              //如果是标准的尺寸，则那边回复的也是标准的答案，不需要解析这么多，只要第一行
              setIsProductSizeStandard(true);
              for (let i = 0; i < sizeVariables.length; i++) {
                let oneLine = [];
                oneLine.push(sizeVariables[i]['name']);
                totalLine.push(oneLine);
              }

              setTableData(totalLine);

              setDataSource(totalLine);
            } else {
              for (let i = 0; i < sortedList[0].length; i++) {
                let oneLine = [];
                for (let j = 0; j < sortedList.length; j++) {
                  if (sortedList[j]) {
                    if (sortedList[j].length < sortedList[0].length) {
                      break;
                    }
                    oneLine.push(sortedList[j][i]);
                  }
                }
                totalLine.push(oneLine);
              }
              setTableData(totalLine);

              setDataSource(totalLine);
            }

            //分类
            setProductCategoryInfo(data.data.productCategoryInfo);
            //主页的基础信息
            let smallImgSrc: [color: string, listPrice: number, price: number, url: string, priceVariate: string, variateValue: number] = data.data.smallImgSrc;

            let sortedSmallImgSrc = smallImgSrc.map(
              (item: any, index: number) => {
                item.sortNum = smallImgSrc.length - index;
                item.color = item.color === null ? '' : item.color;
                item.index = index;
                return item;
              },
            );
            setSuccessFileList(sortedSmallImgSrc);


            const groupedMap = new Map<string, {
              url: string;
              size?: number;
              color: string;
              listPrice?: number;
              price: number;
              sortNum?: number;
              rank?: number;
              priceVariate?: string;
              variateValue?: string;
              index: number;
            }[]
            >();
            smallImgSrc.forEach((item: any, index) => {
              const key = item.color || "No Color"; // 归类无色的
              const formattedItem = {
                url: item.url,
                color: item.color,
                price: item.price,
                priceVariate: item.priceVariate,
                variateValue: item.variateValue,
                index,
              };
              if (!groupedMap.has(key)) {
                groupedMap.set(key, []);
              }
              groupedMap.get(key)?.push(formattedItem);
            });

            let newSmallImgSuccessList = Array.from(groupedMap.values())
            // console.log(newSmallImgSuccessList)
            setSmallImgSuccessList(newSmallImgSuccessList)
            setBigImgSuccessList([
              { url: data.data.productContextInfo.bigImgSrc, size: 0 },
            ]);
            setEditStatus(data.data.productContextInfo.editStatus);
            setOriginValue(data.data.productContextInfo.marketPrice);
            setValueBeforeDiscount(data.data.productContextInfo.originPrice);
            setTruePrice(data.data.productContextInfo.purchasePrice);
            setStockNum(data.data.productContextInfo.stock);
            setSortType(data.data.productContextInfo.sort);
            setFraudSoldAmount(data.data.productContextInfo.fraudSoldNum);
            setProductRemark(
              data.data.productContextInfo.insideDescription === null
                ? ''
                : data.data.productContextInfo.insideDescription,
            );
            setProductWeight(
              data.data.productContextInfo.productWeight === null
                ? 0
                : data.data.productContextInfo.productWeight,
            );
            // console.log(data.data.productContextInfo.commentScale);
            // console.log(data.data.productContextInfo.commentScale === '[]');
            // data.data.productContextInfo.commentScale === '[]'
            //   ? null
            //   : setCommentScale(
            //       JSON.parse(data.data.productContextInfo.commentScale),
            //     );
            // data.data.productContextInfo.commentSummary === '[]'
            //   ? null
            //   : setCommentSummary(
            //       JSON.parse(data.data.productContextInfo.commentSummary),
            //     );
            setFraudWishList(data.data.productContextInfo.fraudWishListNum);
            setStockStatus(data.data.productContextInfo.stockStatus);
            setValue1(data.data.productContextInfo.title);
            setTitle2(
              data.data.productContextInfo.title2 === null
                ? ''
                : data.data.productContextInfo.title2,
            );
            setHref(data.data.productContextInfo.url);
            if (data.data.productContextInfo.mp4) {
              let mp4Arr = data.data.productContextInfo.mp4.split(';;');
              let newMp4Url = mp4Arr.map((item: string, index: number) => {
                return { url: item, index, sortNum: index };
              });
              setMp4Url(newMp4Url);
            } else {
              setMp4Url([]);
            }
          }
        },
      );
      request(`/admin/secure/getProductCommentDetail/${arr[4]}`).then(
        (data) => {
          if (data.result) {
            let commentTable = data.data.commentTable;
            for (let i = 0; i < commentTable.length; i++) {
              commentTable[i]['createTime'] = formatTimeWithHours(
                commentTable[i]['createTime'],
              );
            }
            setCommentDataSource(commentTable);
            setCommentCount(data.data.commentTable.length);
          }
        },
      );
    } else {
      setProductId('');
      setFirstCategory('');
      setSecondCategory('');
      setTreeValue('');
      setCommentDataSource([]);
      setCommentCount(0);
      setDataSource([]);
      setSuccessFileList([]);
      setBigImgSuccessList([]);
      setEditStatus('');
      setOriginValue('0');
      setValueBeforeDiscount('0');
      setTruePrice('0');
      setStockNum(0);
      setFraudSoldAmount(0);
      setProductRemark('');
      setProductWeight(0);
      setFraudWishList(0);
      setStockStatus('');
      setProductDescription('');
    }

    if (
      treeDataArr.length === 0 ||
      categorySpecialEventSuccessFileList.length === 0
    ) {
      //为了获取分类下拉列表，同时懒得在做一个请求了
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

    if (Object.keys(productDescriptionMapData).length === 0) {
      request('/admin/secure/getProductGeneralDescription').then((data) => {
        if (data.result) {
          if (data.data.data === '') {
          } else {
            setProductDescriptionMapData(JSON.parse(data.data.data));
          }
        }
      });
    }
  }, []);

  const items: TabsProps['items'] = [
    {
      label: <div style={{ width: 100, textAlign: 'center' }}>信息</div>,
      children: <ProductContext />,
      key: 'productContext',
    },
    {
      label: <div style={{ width: 100, textAlign: 'center' }}>分类</div>,
      children: <ProductCategory />,
      key: 'productCategory',
    },
    {
      label: <div style={{ width: 100, textAlign: 'center' }}>尺码表</div>,
      children: <ProductSize />,
      key: 'productSize',
    },
    {
      label: <div style={{ width: 100, textAlign: 'center' }}>产品特征</div>,
      children: <ProductDescription />,
      key: 'productDescription',
    },
    {
      label: <div style={{ width: 100, textAlign: 'center' }}>评论</div>,
      key: 'comment',
      children: <Comment />,
    },
    {
      label: (
        <div style={{ width: 100, textAlign: 'center' }}>商品来源与库存</div>
      ),
      key: 'productSourceAndStockStatus',
      children: <ProductSourceAndStockStatus />,
    },
  ];
  const [activeKey, setActiveKey] = useState('productContext');
  const onChange = (key: string) => {
    setActiveKey(key);
  };
  useEffect(() => {
    let pathArr = window.location.pathname.split('/');
    if (pathArr.length >= 4) {
      setActiveKey(pathArr[3]);
    }
  }, []);
  return (
    <div>
      <div className={styles.container}>
        <AddProductHeader />
        <Tabs
          style={{ margin: '0 auto', border: '1px solid black' }}
          activeKey={activeKey}
          items={items}
          onChange={onChange}
        />
        <Modal
          title="确定提交？"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        ></Modal>
      </div>
      {!window.location.pathname.startsWith(
        '/backend/product/productSourceAndStockStatus',
      ) && (
          <div style={{ margin: '80px auto', width: 1200 }}>
            <Button
              type="primary"
              style={saved ? { marginRight: 20, color: "gray" } : { marginRight: 20 }}
              disabled={saved}
              onClick={showModal}
            >
              保存
            </Button>
            <Button danger>取消</Button>
          </div>
        )}
    </div>
  );
};
export default App;

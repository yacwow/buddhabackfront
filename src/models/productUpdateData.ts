// 全局共享数据示例
import { commentDataSourceType } from '@/components/AddProduct/Comment/Comment';
import { useState } from 'react';
const useUser = () => {
  const [successFileList, setSuccessFileList] = useState<
    {
      url: string;
      size?: number;
      color: string;
      listPrice: number;
      price: number;
      sortNum?: number;
      rank?: number;
      priceVariate?: string;
      variateValue?: string;
      index: number;
    }[]
  >([]); //小图真实的上传成功的图片
  const [smallImgSuccessList, setSmallImgSuccessList] = useState<
    {
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
    }[][]
  >([]); //
  const [bigImgSuccessList, setBigImgSuccessList] = useState<
    { url: string; size: number }[]
  >([{ url: '', size: 0 }]); //大图真实的上传成功的图片，限制为1张
  // const [productDetailSize, setProductDetailSize] = useState('')//尺寸 最后上传用的，好像不如最后直接合成来的舒服，不搞了
  const [productDescription, setProductDescription] = useState(''); //风格描述,上传用的
  const [productDescriptionMapData, setProductDescriptionMapData] = useState<{
    [key: string]: any;
  }>({}); //给productDescription用的

  const [commentData, setCommentData] = useState(''); //comment上传用的数据
  // 最上面的标题内容
  const [value, setValue] = useState('');
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [title2, setTitle2] = useState('');
  // 修改的是哪个productid
  const [productId, setProductId] = useState<string>('');
  //编辑的状态
  const [editStatus, setEditStatus] = useState('');
  //在库的状态
  const [stockStatus, setStockStatus] = useState('');
  //comment的值
  const [commentDataSource, setCommentDataSource] = useState<
    commentDataSourceType[]
  >([]);
  //productCategory的treeSelect数据
  const [treeValue, setTreeValue] = useState('');
  const [commentCount, setCommentCount] = useState(commentDataSource.length);
  const [href, setHref] = useState(''); //固定链接的地址
  const [productCategoryInfo, setProductCategoryInfo] = useState<string[]>([]);
  const [mp4Url, setMp4Url] = useState<
    { url: string; index: number; sortNum: number }[]
  >([]);
  const [commentScale, setCommentScale] = useState<
    { num: number; scale: number; starLevel: number }[]
  >([
    { num: 5, scale: 100, starLevel: 5 },
    { num: 0, scale: 0, starLevel: 4 },
    { num: 0, scale: 0, starLevel: 3 },
    { num: 0, scale: 0, starLevel: 2 },
    { num: 0, scale: 0, starLevel: 1 },
  ]);
  const [commentSummary, setCommentSummary] = useState<
    { score: number; name: string }[]
  >([
    { name: 'Ture to Size', score: 5 },
    { name: 'Value for Money', score: 5 },
    { name: 'Quality', score: 5 },
    { name: 'Style', score: 5 },
  ]);
  const [sortType, setSortType] = useState('');
  return {
    successFileList,
    setSuccessFileList,
    smallImgSuccessList,
    setSmallImgSuccessList,
    bigImgSuccessList,
    setBigImgSuccessList,
    productDescription,
    setProductDescription,
    productDescriptionMapData,
    setProductDescriptionMapData,
    commentData,
    setCommentData,
    value,
    setValue,
    value1,
    setValue1,
    value2,
    setValue2,
    productId,
    setProductId,
    editStatus,
    setEditStatus,
    stockStatus,
    setStockStatus,
    commentDataSource,
    setCommentDataSource,
    treeValue,
    setTreeValue,
    commentCount,
    setCommentCount,
    href,
    setHref,
    productCategoryInfo,
    setProductCategoryInfo,
    title2,
    setTitle2,
    mp4Url,
    setMp4Url,
    commentScale,
    setCommentScale,
    commentSummary,
    setCommentSummary,
    sortType,
    setSortType,
  };
};

export default useUser;

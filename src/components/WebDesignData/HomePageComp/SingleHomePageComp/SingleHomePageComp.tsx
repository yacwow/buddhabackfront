import {
  Button,
  DatePicker,
  Input,
  Modal,
  Switch,
  Upload,
  Image,
  message,
} from 'antd';
//@ts-ignore
import type { GetProp, UploadFile, UploadProps } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';
import styles from './SingleHomePageComp.less';
import SingleHomePagePictureComp from './SingleHomePagePictureComp';

//下面是upload的东西
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file as Blob);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

//下面是datepick的东西
//@ts-ignore
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { RangePicker } = DatePicker;
dayjs.extend(customParseFormat);

const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};
// eslint-disable-next-line arrow-body-style
const disabledDate: RangePickerProps['disabledDate'] = (current: any) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day');
};

// const disabledDateTime = () => ({
//   disabledHours: () => range(0, 24).splice(4, 20),
//   disabledMinutes: () => range(30, 60),
//   disabledSeconds: () => [55, 56],
// });
interface Props {
  productInfo?: {
    homePageDataId: number;
    description: string;
    imgSrc?: string;
    url: string;
    productShowLimit: string;
    date?: string;
    timeLimit?: boolean;
    homePageActive: boolean;
    productIdList?: string;
    rightTop?: string;
    homePageProductTableData?: {
      bigImgSrc: string;
      href: string;
      listPrice: string;
      newPrice: number;
      productId: number;
      stockStatus: string;
    }[];
  };
  number?: number;
  setNewHomePageInfo?: any;
  newHomePageInfo?: number[];
  homePageInfoList: any;
  setHomePageInfoList: any;
}
const App: React.FC<Props> = (props) => {
  const {
    productInfo,
    number,
    setNewHomePageInfo,
    newHomePageInfo,
    homePageInfoList,
    setHomePageInfoList,
  } = props;
  //下面都是upload组件自带的部分
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    );
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  //modal部分的代码--删除模块
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleHomePageCompDelete = async () => {
    if (!needToDeleteId) {
      message.error({ content: '不知道为什么没有需要删除的id 出错了' }, 3);
      return;
    }
    await request('/admin/secure/deleteHomePageData', {
      params: { needToDeleteId },
    }).then((data) => {
      if (data.result) {
        let newHomePageInfoList = homePageInfoList.filter((item: any) => {
          return item.homePageDataId !== needToDeleteId;
        });
        setHomePageInfoList(newHomePageInfoList);
        message.info({ content: '成功删除' }, 3);
      } else {
        message.error({ content: '网络错误' }, 3);
      }
    });
    //先删除，然后再关闭
    setIsModalOpen(false);
  };

  //modal部分的代码--批量删除产品
  const [productIdList, setProductIdList] = useState('');
  const [isModalOpen1, setIsModalOpen1] = useState(false); //批量移除产品的modal框
  const [homePageProductTableData, setHomePageProductTableData] = useState<
    {
      bigImgSrc: string;
      href: string;
      listPrice: string;
      newPrice: number;
      productId: number;
      stockStatus: string;
    }[]
  >([]);
  // 批量删除
  const handleBundleDelete = () => {
    let productList = productIdList.split(',');
    productList = productList.filter((item: string) => {
      if (item.length !== 0 && !isNaN(+item)) return item;
      return null;
    });
    console.log(productList);
    if (productList.length === 0) {
      message.info('选项不能为空', 3);
      return;
    }
    // console.log(page, pageSize, code);
    request('/admin/secure/deleteOneHomePageDataProductList', {
      params: {
        productList: JSON.stringify(productList),
        homePageDataId: productInfo?.homePageDataId,
      },
    }).then((data) => {
      if (data.result) {
        // 在下面显示table的数据
        // console.log(data.data.data);
        // setSpecialEventProductTableData(data.data.specialEventProductList);
        // setTotal(data.data.count);
        setHomePageProductTableData(data.data.homePageProductList);
        setProductIdList('');
        setIsModalOpen(false);
        setIsModalOpen1(false);
        message.info({ content: '删除成功' }, 3);
      } else {
        message.error('出了点错误，刷新页面看看', 3);
      }
    });
  };
  // 批量导入
  const handleBundleImport = async () => {
    let productList = productIdList.trim().split(',');
    let newProductList: string[] = [];
    productList.map((item: string) => {
      if (item.length !== 0 && !isNaN(+item)) {
        newProductList.push(`${parseInt(item)}`);
      }
      return null;
    });
    // console.log(NewproductList);
    request('/admin/secure/addOneHomePageDataProductList', {
      params: {
        homePageDataId: productInfo?.homePageDataId,
        productList: JSON.stringify(newProductList),
      },
    }).then((data) => {
      if (data.result) {
        // 在下面显示table的数据
        setHomePageProductTableData(data.data.homePageProductList);
        message.info({ content: '添加成功', style: { marginTop: '40vh' } }, 4);
        setProductIdList('');
      } else {
        message.error('出了点错误，刷新页面看看', 3);
      }
    });
  };
  const [isModalOpen2, setIsModalOpen2] = useState(false); //全部移除产品的modal框
  // 全部删除
  const handleAllDelete = async () => {
    request('/admin/secure/deleteOneHomePageDataAllProductList', {
      params: {
        homePageDataId: productInfo?.homePageDataId,
      },
    }).then((data) => {
      if (data.result) {
        // setSpecialEventProductTableData([]);
        setProductIdList('');
      } else {
        message.error('出了点错误，刷新页面看看', 3);
      }
      setIsModalOpen(false);
    });
  };
  //这是我自己写的部分
  const [needToDeleteId, setNeedToDeleteId] = useState<number>();
  const [singProductInfo, setSingleProductInfo] = useState<any>({});
  const [datePicker, setDatePicker] = useState<any>();
  //修改或者添加数据--保存该模块按钮
  const handleChangeHomePageInfo = () => {
    let uploadInfo: any = structuredClone(singProductInfo);
    console.log(uploadInfo);
    if (uploadInfo.timeLimit && datePicker) {
      uploadInfo.date = `${datePicker.$y}-${datePicker.$M + 1}-${
        datePicker.$D
      } ${datePicker.$H}:${datePicker.$m}:${datePicker.$s}`;
    }
    if (uploadInfo.timeLimit && !uploadInfo.date) {
      console.log('youcuowu');
      message.error(
        { content: '开启限时必须要有指定的时间', style: { marginTop: '30vh' } },
        5,
      );
      return;
    }

    if (!uploadInfo.description) {
      message.error(
        { content: '必须有具体的组件描述', style: { marginTop: '10vh' } },
        5,
      );
    }
    if (!uploadInfo.url) {
      message.error(
        { content: '必须有跳转链接', style: { marginTop: '10vh' } },
        5,
      );
    }
    if (!uploadInfo.rank) {
      uploadInfo.rank = 0;
    }
    if (!uploadInfo.homePageActive) {
      uploadInfo.homePageActive = false;
    }
    if (fileList.length > 0) {
      console.log(fileList);
      uploadInfo.imgSrc = fileList[0].response.url;
    }
    if (!uploadInfo.rightTop) {
      uploadInfo.rightTop = '';
    }
    console.log(uploadInfo);
    uploadInfo.homePageProductTableData = null;
    request('/admin/secure/updateHomePageData', {
      params: uploadInfo,
    }).then((data) => {
      if (data.result) {
        message.info({ content: '修改成功', style: { marginTop: '10vh' } }, 5);
        let newSingleProduct = structuredClone(singProductInfo);
        if (fileList.length > 0) {
          newSingleProduct.imgSrc = fileList[0].response.url;
        }
        newSingleProduct.homePageDataId = data.data.returnedId;
        setSingleProductInfo(newSingleProduct);
        setFileList([]);
      } else {
        message.error({ content: '修改失败', style: { marginTop: '10vh' } }, 5);
      }
    });
  };

  useEffect(() => {
    if (productInfo) {
      console.log(productInfo);
      setSingleProductInfo(productInfo);
      productInfo.date ? setDatePicker(dayjs(productInfo.date)) : null;
      if (productInfo.productIdList) {
        setProductIdList(productInfo.productIdList);
      }
      if (productInfo.homePageProductTableData) {
        console.log(productInfo.homePageProductTableData);
        setHomePageProductTableData(productInfo.homePageProductTableData);
      }
    }
  }, [productInfo]);
  return (
    <div style={{ border: '3px solid black', marginBottom: 5 }}>
      <Modal
        title="确定删除该整个组件吗"
        open={isModalOpen}
        onOk={handleHomePageCompDelete}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      ></Modal>
      <Modal
        title="全部删除确认"
        open={isModalOpen2}
        onOk={handleAllDelete}
        onCancel={() => {
          setIsModalOpen2(false);
        }}
      >
        <p>确定要全部删除吗</p>
        <p>如果删除的产品超过200个，则可能后台会超时-过一分钟后刷新再看</p>
      </Modal>
      <Modal
        title="批量删除确认"
        open={isModalOpen1}
        onOk={handleBundleDelete}
        onCancel={() => {
          setIsModalOpen1(false);
        }}
      >
        <p>确定要全部删除吗</p>
      </Modal>
      第一行原图，如果不需要第一行则删除:
      {singProductInfo.imgSrc && (
        <div>
          <Image width={200} src={singProductInfo.imgSrc} />
          <span
            onClick={() => {
              let newSingleProductInfo = structuredClone(singProductInfo);
              newSingleProductInfo.imgSrc = '';
              setSingleProductInfo(newSingleProductInfo);
            }}
          >
            删除这张图片
          </span>
        </div>
      )}
      <div></div>
      如果需要替换，则上传新的图片，可以上传多张，只有第一张会用于替换
      <br />
      上传：
      <Upload
        action="/admin/secure/upload"
        headers={{ token: localStorage.getItem('token') || '' }}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 4 ? null : uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img style={{ width: '100%' }} src={previewImage} />
      </Modal>
      是否开启限时：配合下面的截止时间主要用于类似flashsale的左上角倒计时的控制
      <Switch
        defaultChecked
        checkedChildren={'开启'}
        unCheckedChildren={'不开启'}
        checked={singProductInfo?.timeLimit ? true : false}
        onChange={(e) => {
          console.log(e);
          let newSingleProductInfo = structuredClone(singProductInfo);
          newSingleProductInfo.timeLimit = e;
          setSingleProductInfo(newSingleProductInfo);
        }}
      />
      <div></div>
      截止时间：
      <DatePicker
        format="YYYY-MM-DD HH:mm:ss"
        disabledDate={disabledDate}
        //   disabledTime={disabledDateTime}
        value={datePicker}
        showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
        onChange={(e: any) => {
          console.log(e);
          setDatePicker(e);
        }}
      />
      <div></div>
      组件描述(显示在前台该模块的右上角名字)：{' '}
      <Input
        value={singProductInfo?.description}
        onChange={(e) => {
          let newSingleProductInfo = structuredClone(singProductInfo);
          newSingleProductInfo.description = e.target.value;
          setSingleProductInfo(newSingleProductInfo);
        }}
      />
      <div></div>
      组件左上角的文字：如果有限时，则展示限时，否则展示该内容
      <Input
        value={singProductInfo?.rightTop}
        onChange={(e) => {
          let newSingleProductInfo = structuredClone(singProductInfo);
          newSingleProductInfo.rightTop = e.target.value;
          setSingleProductInfo(newSingleProductInfo);
        }}
      />
      {/* <div></div>
      组件关联勾选类(图片从勾选类同一个code里面找出,如果没有，则图片就没了)：{' '}
      <Input
        value={singProductInfo?.description}
        onChange={(e) => {
          let newSingleProductInfo = structuredClone(singProductInfo);
          newSingleProductInfo.description = e.target.value;
          setSingleProductInfo(newSingleProductInfo);
        }}
      /> */}
      <div></div>
      跳转链接(第一行原图/轮播最后的more跳转)：{' '}
      <Input
        value={singProductInfo?.url}
        onChange={(e) => {
          let newSingleProductInfo = structuredClone(singProductInfo);
          newSingleProductInfo.url = e.target.value;
          setSingleProductInfo(newSingleProductInfo);
        }}
      />
      <div></div>
      排序，用于规定这里的几个组件哪个先展示：
      <Input
        type={'number'}
        value={singProductInfo?.rank}
        onChange={(e) => {
          let newSingleProductInfo = structuredClone(singProductInfo);
          newSingleProductInfo.rank = e.target.value;
          setSingleProductInfo(newSingleProductInfo);
        }}
      />
      <div></div>
      是否展示该模块（如果改成不展示则只能后台看见，删除则直接数据消失）：
      <Switch
        checkedChildren={'展示'}
        unCheckedChildren={'不展示'}
        defaultChecked
        checked={singProductInfo?.homePageActive ? true : false}
        onChange={(e) => {
          let newSingleProductInfo = structuredClone(singProductInfo);
          newSingleProductInfo.homePageActive = e;
          console.log(e);
          setSingleProductInfo(newSingleProductInfo);
        }}
      />
      <div></div>
      <Button
        onClick={() => {
          handleChangeHomePageInfo();
        }}
        type="primary"
      >
        保存该模块
      </Button>
      <Button
        onClick={async () => {
          console.log(number);
          console.log(productInfo);
          if (number !== undefined) {
            let HomePageInfo = newHomePageInfo?.filter(
              (item) => item !== number,
            );
            setNewHomePageInfo(HomePageInfo);
          } else {
            console.log(productInfo?.homePageDataId);
            await setNeedToDeleteId(productInfo?.homePageDataId);
            await setIsModalOpen(true);
          }
        }}
        danger
      >
        删除该模块
      </Button>
      {productInfo?.homePageDataId && (
        <div>
          <div className={styles.display}>
            <div className={styles.inside}>
              <label>
                {' '}
                手动选定商品批量导入(请填写产品id,多个ID之间支持用英文逗号隔开)-建议每次插入少于60个
              </label>
              <Input.TextArea
                placeholder="多个产品用英文逗号间隔"
                value={productIdList}
                onChange={(e) => {
                  setProductIdList(e.target.value);
                }}
                style={{ minHeight: 100, wordWrap: 'break-word' }}
              />
            </div>
          </div>
          <div style={{ marginBottom: 30 }}>
            <Button
              type="primary"
              onClick={() => {
                setIsModalOpen2(true);
              }}
            >
              剔除所有产品
            </Button>
            <Button
              type="primary"
              style={{ marginLeft: 100, marginRight: 10 }}
              onClick={() => {
                setIsModalOpen1(true);
              }}
            >
              确定批量移除
            </Button>
            <Button type="primary" onClick={handleBundleImport}>
              确认批量导入
            </Button>
            <Button
              type="primary"
              onClick={() => {
                request('/admin/secure/updateHomePageMyskuListOrder', {
                  params: {
                    productIdList,
                    homePageDataId: productInfo.homePageDataId,
                  },
                }).then((data) => {
                  if (data.result) {
                    message.info({ content: '顺序保存成功' }, 4);
                  }
                });
              }}
            >
              保存新的顺序
            </Button>
          </div>
          <SingleHomePagePictureComp
            homePageProductTableData={homePageProductTableData}
            setHomePageProductTableData={setHomePageProductTableData}
            setProductIdList={setProductIdList}
          />
        </div>
      )}
    </div>
  );
};
export default App;

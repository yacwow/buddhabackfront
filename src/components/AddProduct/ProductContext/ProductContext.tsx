import { PlusOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';
import { useModel } from '@umijs/max';
import { Button, Input, message, Modal, Select, Upload } from 'antd';
import { RcFile, UploadFile, UploadProps } from 'antd/es/upload';
import React, { useEffect, useState } from 'react';
import BigImgUpload from './BigImgUpload';
import ImageUpload from './ImageUpload';
import ProductBasicInfo from './ProductBasicInfo';
import styles from './ProductContext.less';
import SmallImgUpload from './SmallImgUpload';
import ImageUploadWrap from './ImageUploadWrap';
interface Props { }
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const App: React.FC<Props> = (props) => {
  const {
    bigImgSuccessList,
    setBigImgSuccessList,
    editStatus,
    setEditStatus,
    stockStatus,
    setStockStatus,
    successFileList,
    setSuccessFileList,
    mp4Url,
    setMp4Url,
    sortType,
    setSortType,
    smallImgSuccessList,
    setSmallImgSuccessList
  } = useModel('productUpdateData');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    );
  };
  //处理下面正图上传
  const handlePictureStatusChange: UploadProps['onChange'] = ({
    file,
    fileList: newFileList,
  }) => {
    const { status, response } = file;
    // 上传完成？
    if (status === 'done') {
      // 服务端返回JSON：{result: true/false, url: ""}
      const { result, url } = response;
      console.log(result);
      if (result !== 'false') {
        setSmallImgSuccessList((prevList) => {
          const newFile = {
            url,
            size: +(file.size ? file.size / 1024 : 0).toFixed(2),
            listPrice: 0,
            price: 0,
            color: '',
            color2: '',
            index: 0, // 计算全局索引
          };

          // 查找是否有 color === '' 的 group
          const existingGroupIndex = prevList.findIndex(group => group.length > 0 && group[0].color === '');

          let newList;
          if (existingGroupIndex !== -1) {
            // 如果存在 color 为空的 group，添加到该 group
            newList = [...prevList];
            newList[existingGroupIndex] = [...newList[existingGroupIndex], newFile];
          } else {
            // 否则创建一个新的 group
            newList = [...prevList, [newFile]];
          }

          return newList;
        });

        // 只有当 bigImgSuccessList 为空时，才设置大图
        setBigImgSuccessList((prevBigList) => {
          if (prevBigList.length === 0) {
            return smallImgSuccessList.length > 0 && smallImgSuccessList[0].length > 0
              ? [{ url: smallImgSuccessList[0][0].url, size: 0 }]
              : [{ url, size: 0 }];
          }
          return prevBigList;
        });

        // antd的message方法
        message.success('上传成功');
      } else {
        message.error('上传失败');
      }
    }

    setFileList(newFileList);
  };

  //处理mp4的上传， 目前基本上没用到过
  const handleMP4StatusChange: UploadProps['onChange'] = ({
    file,
    fileList: newFileList,
  }) => {
    const { status, response } = file;
    // 上传完成？
    if (status === 'done') {
      // 服务端返回JSON：{result: true/false, url: ""}
      const { result, url } = response;
      console.log(result);
      if (result !== 'false') {
        setMp4Url((prevSuccessFileList) => [
          ...prevSuccessFileList,
          {
            url,
            size: +(file.size ? file.size / 1024 : 0).toFixed(2),
            color: '',
            rank: 0,
            color2: '',
            index: prevSuccessFileList.length,
            sortNum: prevSuccessFileList.length + 1,
          },
        ]);
        // antd的message方法
        message.success('上传成功');
      } else {
        message.error('上传失败');
      }
    }
  };


  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    setEditStatus(value);
  };
  const handleStockChange = (value: string) => {
    console.log(value);
    setStockStatus(value);
  };


  // const handleDropFromB = (newGroupIndex: number, newItemIndex: number, groupIndex: number) => {

  //   if (+newGroupIndex === groupIndex) return;

  //   setSmallImgSuccessList(prev => {
  //     let newList = structuredClone(prev);
  //     [newList[groupIndex], newList[+newGroupIndex]] = [newList[+newGroupIndex], newList[groupIndex]];
  //     return newList;
  //   });

  //   setBigImgSuccessList(prev => [{ url: smallImgSuccessList[0][0].url, size: 0 }]);
  // };

  const [draggableState, setDraggableState] = useState(true);


  return (
    <div className={styles.container}>
      <ProductBasicInfo />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 40,
        }}
      >
        <div style={{ minWidth: 500 }}>
          <h3> 商品的概略图上传，一般展示在轮播的地方</h3>
          <br />
          {bigImgSuccessList.length > 0 && bigImgSuccessList[0].url ? (
            <img
              style={{ width: 300, height: 300, objectFit: 'cover' }}
              src={bigImgSuccessList[0].url}
              alt=""
            />
          ) : null}
        </div>
        <div style={{ minWidth: 500 }}>
          <h3> 商品的video,会展示在产品的图片这边</h3>
          <br />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {mp4Url.map((item, index) => {
              return (
                <div key={index} style={{ width: 300 }}>
                  <video
                    controls
                    width={'300px'}
                    height="250px"
                    autoPlay={true}
                    loop={true}
                    src={item.url}
                    muted={true}
                    controlsList="nodownload noplaybackrate"
                  />
                  <div
                    style={{
                      width: 300,
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    地址：{item.url}
                  </div>
                  <Button
                    onClick={() => {
                      let newMp4Url = structuredClone(mp4Url).filter(
                        (insideItem) => {
                          return item.url !== insideItem.url;
                        },
                      );
                      setMp4Url(newMp4Url);
                    }}
                  >
                    删除
                  </Button>
                </div>
              );
            })}
          </div>

          <Upload
            action="/admin/secure/upload"
            listType="picture-card"
            headers={{ token: localStorage.getItem('token') || '' }}
            onChange={handleMP4StatusChange}
            multiple
          >
            {uploadButton}
          </Upload>
        </div>
      </div>
      <h3>color行前端具体显示的值;类似于BUNDLE & SAVE;CHOOSE YOUR STRING: </h3>
      <Input
        placeholder="如果不输入，则前端展示为Color"
        value={sortType}
        onChange={(e) => setSortType(e.target.value)}
      />
      <h3>
        产品图片修改区域，可拖拽修改。第一张自动为产品首图.拖拽之前请保存一次数据，不然会出错（以后优化）
      </h3>
      <div className={styles.smallPicture}>
        <div
          style={{
            marginBottom: 40,
            // display: 'flex',
            // justifyContent: 'start',
            // flexWrap: 'wrap',
          }}
        >

          {/* {successFileList.map((item, index: number) => {
            return <ImageUpload key={index} {...item} item={item} />;
          })} */}
          {smallImgSuccessList.map((item, groupIndex: number) => {
            return <ImageUploadWrap
              setDraggableState={setDraggableState}
              draggableState={draggableState}
              key={groupIndex}
              groupIndex={groupIndex}
              priceVariate={item[0].priceVariate ? item[0].priceVariate : "+"}
              variateValue={item[0].variateValue ? +item[0].variateValue : 0}
            >
              {item.map((item1: any, itemIndex) => {
                return <ImageUpload
                  setDraggableState={setDraggableState}
                  draggableState={draggableState}
                  key={`${item1.url}-${item1.color}`}
                  item={item1}
                  groupIndex={groupIndex}
                  itemIndex={itemIndex}
                  index={itemIndex}
                  color={item1.color}
                  url={item1.url}>
                </ImageUpload>
              })}
            </ImageUploadWrap>
          })}
        </div>

        <Upload
          action="/admin/secure/upload"
          listType="picture-card"
          fileList={fileList}
          headers={{ token: localStorage.getItem('token') || '' }}
          onPreview={handlePreview}
          onChange={handlePictureStatusChange}
          multiple
        >
          {uploadButton}
        </Upload>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={() => setPreviewOpen(false)}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
      <div style={{ content: '', display: 'table', clear: 'both' }}></div>

      <div style={{ marginTop: 20 }}>
        <div>编辑状态</div>
        <Select
          defaultValue="unedited"
          style={{ width: 500 }}
          value={editStatus}
          onChange={handleChange}
          options={[
            { value: 'edited', label: '已编辑' },
            { value: 'unedited', label: '未编辑' },
            { value: 'chinese_edit_finished', label: '中文编辑完成' },
            { value: 'foreign_edit_finished', label: '外文编辑完成' },
          ]}
        />
        <div style={{ marginTop: 20 }}>在库状态</div>
        <Select
          defaultValue="notavailable"
          style={{ width: 500 }}
          value={stockStatus}
          onChange={handleStockChange}
          options={[
            { value: 'available', label: '在库' },
            { value: 'notavailable', label: '不在库' },
            { value: 'nostock', label: '无库存' },
            { value: 'notpublished', label: '未发布' },
          ]}
        />
      </div>
    </div>
  );
};
export default App;

import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { message, Modal, Upload, Image, Button } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import styles from './SmallImgUploadForComment.less';
import type { commentDataSourceType } from '../Comment';
import { useModel } from '@umijs/max';
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
interface Props {
  record: commentDataSourceType;
  disabled: boolean;
}
const App: React.FC<Props> = ({ record, disabled }) => {
  const { commentDataSource, setCommentDataSource } =
    useModel('productUpdateData');
  const [successFileList, setSuccessFileList] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handleCancel = () => setPreviewOpen(false);

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
  useEffect(() => {
    let imgSrcList = record.imgSrcList;
    //别乱改，数据库就这么设计的string
    if (imgSrcList === null) return;
    let imgArr = imgSrcList.split(';;');
    if (imgArr.length > 1) {
      imgArr.pop();
      setSuccessFileList(imgArr);
    }
  }, []);
  //处理上传，这个也需要改变commentDataSource，不然后续上传没改动
  const handleChange: UploadProps['onChange'] = ({
    file,
    fileList: newFileList,
  }) => {
    const { status, response } = file;
    console.log('in222', status, file);
    // 上传完成？
    if (status === 'done') {
      console.log('in123');
      // 服务端返回JSON：{result: true/false, url: ""}
      const { result, url } = response;
      console.log(url);
      console.log('in123');
      if (result !== 'false') {
        //修改commentdatasource
        setCommentDataSource((prevCommentDataSource) => {
          const newChangedItem = structuredClone(record);
          const newImgArr = [...successFileList, url];
          const imgStr = newImgArr.join(';;') + ';;';
          newChangedItem.imgSrcList = imgStr;

          const newData = prevCommentDataSource.map((item) => {
            if (item.key !== record.key) {
              return item;
            } else {
              return newChangedItem;
            }
          });

          return [...newData];
        });
        setSuccessFileList((prevSuccessFileList) => [
          ...prevSuccessFileList,
          url,
        ]);
        console.log(successFileList);
        message.success('上传成功');
      } else {
        message.error('上传失败');
      }
    }
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );
  //删除，改变commentDataSource的数据仅更新数据库的src，图片本身就不删了，以后优化
  const handleDeletePicture = (targetUrl: string) => {
    //先去掉imgArr里面src那个，然后合并成一个，然后重新拼回去，和上面的函数差不多
    let newChangedItem = structuredClone(record);
    let newImgArr = structuredClone(successFileList);
    newImgArr.splice(newImgArr.indexOf(targetUrl), 1);
    let imgStr = newImgArr.join(';;') + ';;';
    newChangedItem.imgSrcList = imgStr;
    console.log(newImgArr);
    const newData = commentDataSource.map((item) => {
      if (item.key !== record.key) {
        return item;
      } else {
        return newChangedItem;
      }
    });
    setCommentDataSource([...newData]);
    //也要改变当前页面展示的数据
    setSuccessFileList(newImgArr);
  };

  const buildPicture = () => {
    return successFileList.map((item, index: number) => {
      return (
        <div key={index} className={styles.insideDiv}>
          <div>
            <Image
              style={{ display: 'inline-block' }}
              width={60}
              height={60}
              src={item}
            />
          </div>

          <div>
            <Button
              danger
              style={{
                width: 60,
                height: 20,
                fontSize: 12,
                textAlign: 'center',
                padding: 0,
              }}
              onClick={() => handleDeletePicture(item)}
            >
              点击删除
            </Button>
          </div>
        </div>
      );
    });
  };

  return (
    <div style={{ width: 349, position: 'relative' }}>

      {disabled && <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.5)",zIndex:99999 }}></div>}
      <>
        <div className={styles.showPic}>
          {successFileList?.length > 0 ? buildPicture() : <div> </div>}
        </div>
        <Upload
          action="/admin/secure/upload"
          listType="picture-card"
          fileList={fileList}
          headers={{ token: localStorage.getItem('token') || '' }}
          onPreview={handlePreview}
          onChange={handleChange}
          style={{ width: 60, height: 60 }}
          maxCount={9}
          multiple
        >
          {uploadButton}
        </Upload>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    </div>
  );
};

export default App;

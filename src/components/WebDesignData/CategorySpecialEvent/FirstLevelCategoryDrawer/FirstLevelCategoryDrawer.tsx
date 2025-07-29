import { PlusOutlined } from '@ant-design/icons';
import React, { SetStateAction, useState } from 'react';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { Button, message, Modal, TreeSelect, Upload } from 'antd';
interface Props {
  setLeftDrawerCategoryInfo: React.Dispatch<SetStateAction<any>>;
  leftDrawerCategoryInfo: {
    imgSrc: string;
    categoryName: string;
    myCategoryId: number;
  }[];
  infoList: { imgSrc: string; categoryName: string; myCategoryId: number };
}
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>上传</div>
  </div>
);
const App: React.FC<Props> = ({
  setLeftDrawerCategoryInfo,
  leftDrawerCategoryInfo,
  infoList,
}) => {
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
  const handleChange = (file: any, fileList: any, id: number) => {
    const { status, response } = file;
    console.log('in222', status, file);
    // 上传完成？
    if (status === 'done') {
      console.log('in123');
      // 服务端返回JSON：{result: true/false, url: ""}
      const { result, url } = response;
      console.log(url);
      console.log('in123');
      console.log(response);
      if (result !== 'false') {
        let newLeftDrawerCategoryInfo = leftDrawerCategoryInfo.map((item) => {
          if (item.myCategoryId === id) {
            item.imgSrc = url;
          }
          return item;
        });
        setLeftDrawerCategoryInfo(newLeftDrawerCategoryInfo);
        // antd的message方法
        message.success('上传成功');
      } else {
        message.error('上传失败');
      }
    }
    setFileList(fileList);
  };
  return (
    <div style={{ width: 300 }}>
      <div>
        <div>一级类名：{infoList.categoryName}</div>
        {infoList.imgSrc !== '' ? (
          <img
            src={infoList.imgSrc}
            alt=""
            style={{ width: 100, height: 100 }}
          />
        ) : (
          '暂无图片'
        )}
      </div>

      <Upload
        action="/admin/secure/upload"
        // customRequest={handleRequest}
        listType="picture-card"
        fileList={fileList}
        headers={{ token: localStorage.getItem('token') || '' }}
        onPreview={handlePreview}
        onChange={({ file, fileList }) =>
          handleChange(file, fileList, infoList.myCategoryId)
        }
        maxCount={1}
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
    </div>
  );
};
export default App;

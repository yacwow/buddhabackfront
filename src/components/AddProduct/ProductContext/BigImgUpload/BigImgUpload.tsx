import React, { Dispatch, SetStateAction, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { message, Modal, Upload, Image, Button } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import styles from './BigImgUpload.less';
import { request } from '@umijs/max';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
interface Props {
  bigImgSuccessList: { url: string; size: number }[];
  setBigImgSuccessList: Dispatch<
    SetStateAction<{ url: string; size: number }[]>
  >;
}
const App: React.FC<Props> = (props) => {
  const { bigImgSuccessList, setBigImgSuccessList } = props;
  console.log(bigImgSuccessList);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [disable, setDisable] = useState(false); //能否上传
  // const [successFileList, setSuccessFileList] = useState<{ url: string }[]>([]);
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

  const handleChange: UploadProps['onChange'] = async ({
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
        setBigImgSuccessList([
          ...bigImgSuccessList,
          {
            url,
            size: +(file.size ? file.size / 1024 : 0).toFixed(2),
          },
        ]);
        setDisable(true);
        // antd的message方法
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
  const handleDeletePicture = async (targetUrl: string) => {
    let url = require('url');
    let obj = url.parse(targetUrl, true);
    let delPath = obj.path;
    console.log(delPath);
    //删除该url
    request(`/admin/secure/deletePicture`, { params: { delPath } }).then(
      (data) => {
        if (data.result) {
          //删除成功
          message.success('删除成功');
          let newSuccessFileList = bigImgSuccessList.filter((item) => {
            return item.url !== targetUrl;
          });
          setBigImgSuccessList(newSuccessFileList);
          setDisable(false);
        } else {
          message.error('删除失败');
        }
      },
    );
  };

  const buildPicture = () => {
    return bigImgSuccessList.map((item, index: number) => {
      return (
        <div key={index} className={styles.insideDiv}>
          <div>
            <Image
              style={{ display: 'inline-block' }}
              width={100}
              src={`${item.url}`}
            />
          </div>
          <div>
            <div style={{ textAlign: 'center' }}>
              {item.size ? `${item.size}kb` : null}{' '}
            </div>
            <div style={{ overflow: 'hidden', textAlign: 'center' }}>
              {item.url ? item.url.split('/')[1] : null}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button danger onClick={() => handleDeletePicture(item.url)}>
              点击删除图片
            </Button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className={styles.container}>
      <h3>
        商品的概略图上传，一般展示在轮播的地方 <br />
        <span style={{ color: 'red' }}>
          只能有一张图，想上传下一张前请删除当前图片
        </span>{' '}
      </h3>

      <h4>
        图片展示区，
        <span style={{ color: 'red' }}>删除图片点击该区域的删除按钮</span>
      </h4>
      <div className={styles.showPic}>
        {bigImgSuccessList.length > 0 ? buildPicture() : <div> </div>}
      </div>
      <h4>
        图片上传区，
        <span style={{ color: 'red' }}>该区域的删除为假删除</span>
      </h4>
      <Upload
        disabled={disable}
        action="/admin/secure/upload"
        // customRequest={handleRequest}
        listType="picture-card"
        fileList={fileList}
        headers={{ token: localStorage.getItem('token') || '' }}
        onPreview={handlePreview}
        onChange={handleChange}
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

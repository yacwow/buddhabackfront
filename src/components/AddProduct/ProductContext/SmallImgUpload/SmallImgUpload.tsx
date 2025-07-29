import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { message, Modal, Upload, Image, Button, Input, Select } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import styles from './SmallImgUpload.less';
import { request } from '@umijs/max';
import { useModel } from '@umijs/max';

const numberList: { label: string; value: number }[] = [];

for (let i = 0; i <= 50; i++) {
  numberList.push({
    label: String(i),
    value: i,
  });
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const App: React.FC = () => {
  const { successFileList, setSuccessFileList } = useModel('productUpdateData');
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
  //处理上传
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
        setSuccessFileList((prevSuccessFileList) => [
          ...prevSuccessFileList,
          {
            url,
            size: +(file.size ? file.size / 1024 : 0).toFixed(2),
            color: '',
            rank: 0,
            price: 0,
            listPrice: 0,
            index: prevSuccessFileList.length,
          },
        ]);
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
  const handleDeletePicture = (targetUrl: string) => {
    let url = require('url');
    let obj = url.parse(targetUrl, true);
    let delPath = obj.path;
    //删除该url
    request(`/admin/secure/deletePicture`, { params: { delPath } }).then(
      (data) => {
        if (data.result) {
          //删除成功
          message.success('删除成功');
          let newSuccessFileList = successFileList.filter((item) => {
            return item.url !== targetUrl;
          });
          setSuccessFileList(newSuccessFileList);
        } else {
          message.error('删除失败');
        }
      },
    );
  };
  const handleSelectChange = (e: number, url: string) => {
    console.log(e, url);
    //根据url给successfilelist添加展示的级别（first）
    let newSuccessFileList = successFileList.map((item) => {
      if (item.url === url) {
        let newItem = { ...item };
        newItem.rank = +e;
        return newItem;
      } else {
        return item;
      }
    });
    setSuccessFileList(newSuccessFileList);
  };
  const handleInputBlur = (e: any, targetUrl: string) => {
    console.log(e.target.value);
    //根据url给successfilelist添加颜色
    let newSuccessFileList = successFileList.map((item) => {
      if (item.url === targetUrl) {
        let newItem = { ...item };
        newItem.color = e.target.value;
        return newItem;
      } else {
        return item;
      }
    });
    setSuccessFileList(newSuccessFileList);
  };
  const buildPicture = () => {
    return successFileList.map((item, index: number) => {
      return (
        <div key={index} className={styles.insideDiv}>
          <div>
            <Image
              style={{ display: 'inline-block' }}
              width={120}
              height={120}
              src={`${item.url}`}
            />
          </div>

          <div>
            <Button danger onClick={() => handleDeletePicture(item.url)}>
              点击删除图片
            </Button>
          </div>
          <div>照片颜色</div>
          <Input
            defaultValue={item.color}
            style={{ width: 120 }}
            onBlur={(e) => handleInputBlur(e, item.url)}
          />
          <div>数字越大展示越前</div>
          <Select
            defaultValue={item.rank}
            style={{ width: 120 }}
            onChange={(e) => handleSelectChange(e, item.url)}
            options={numberList}
          ></Select>
        </div>
      );
    });
  };

  return (
    <div style={{ width: 550 }}>
      <h3>
        小图上传/目前设计为，有颜色并且数字超过0的显示在颜色选择部分，
        目前没有优化，只能一次传一张照片
        <br />
        图片少于五张则全部展示在顶端（pc）同时商品详情也显示
        <br />
        图片多余八张则选择4-5张在顶端，同时剩下的展示在商品详情
      </h3>

      <h4>
        图片展示区，
        <span style={{ color: 'red' }}>删除图片点击该区域的删除按钮</span>
      </h4>
      <div className={styles.showPic}>
        {successFileList.length > 0 ? buildPicture() : <div> </div>}
      </div>

      <h4>
        图片上传区，
        <span style={{ color: 'red' }}>该区域的删除为假删除</span>
      </h4>
      <Upload
        action="/admin/secure/upload"
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

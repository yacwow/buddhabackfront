import React, { Dispatch, SetStateAction, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { message, Modal, Upload, Image, Button, Select } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import styles from './EveryPageHeadPictureUpload.less';
import { request } from '@umijs/max';
import { EveryPageHeadPicture } from '../EveryPageHeadPictureDataType';
const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>上传</div>
  </div>
);
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
interface Props {
  updateUrl: string;
  successFileList: EveryPageHeadPicture[];
  setSuccessFileList: Dispatch<SetStateAction<EveryPageHeadPicture[]>>;
}
const App: React.FC<Props> = (props) => {
  const { successFileList, setSuccessFileList, updateUrl } = props;
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
            // id单纯是这里修改数字啥的时候有用，后台反正都是全部删除了全部重新新增一遍
            idwebdatacontroller: -Math.floor(Math.random() * 1000),
            imgsrc: url,
            rank: 0,
            weburl: updateUrl,
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

  const handleDeletePicture = (targetUrl: string) => {
    console.log(targetUrl);
    let url = require('url');
    let obj = url.parse(targetUrl, true);
    let delPath = obj.path;
    console.log('obj.path', obj.path);
    //删除该url
    request(`/admin/secure/deletePicture`, { params: { delPath } }).then(
      (data) => {
        if (data.result) {
          //删除成功
          message.success('删除成功');
          let newSuccessFileList = successFileList.filter((item) => {
            return item.imgsrc !== targetUrl;
          });
          setSuccessFileList(newSuccessFileList);
        } else {
          message.error('删除失败');
        }
      },
    );
  };
  const handleSelectChange = (e: number, id: number) => {
    let newSuccessFileList = successFileList.map((item) => {
      if (item.idwebdatacontroller === id) {
        let newItem = { ...item };
        newItem.rank = +e;
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
              height={60}
              src={`${item.imgsrc}`}
            />
          </div>

          <div>
            <Button danger onClick={() => handleDeletePicture(item.imgsrc)}>
              点击删除图片
            </Button>
          </div>
          <div> 该图片跳转的页面</div>
          <input type="text" value={item.weburl} disabled />

          <div>
            多张图片就是轮播
            <br />
            不同地址数字超过0才显示
          </div>
          <Select
            defaultValue={item.rank}
            style={{ width: 120 }}
            onChange={(e) => handleSelectChange(e, item.idwebdatacontroller)}
            options={Array.from({ length: 20 }, (_, index) => ({
              label: index,
              value: index,
            }))}
          ></Select>
        </div>
      );
    });
  };
  const handleEveryPageHeaderPicture = () => {
    let allDeleted = false;
    if (successFileList === undefined || successFileList.length === 0) {
      allDeleted = true;
    }
    request('/admin/updateEveryPageHeaderPicture', {
      params: {
        allDeleted,
        weburl: updateUrl,
        successFileList: JSON.stringify(successFileList),
      },
    }).then((data) => {
      if (data.result) {
        message.info('保存成功', 3);
      }
    });
  };
  return (
    <div style={{ width: 1000 }}>
      <h4>
        图片展示区，
        <span style={{ color: 'red' }}>删除图片点击该区域的删除按钮</span>
      </h4>
      <div className={styles.showPic}>
        {successFileList?.length > 0 ? buildPicture() : <div> </div>}
      </div>

      <h4>
        图片上传区，
        <span style={{ color: 'red' }}>该区域的删除为假删除</span>
      </h4>
      <Upload
        action="/admin/secure/upload"
        // customRequest={handleRequest}
        listType="picture-card"
        fileList={fileList}
        headers={{ token: localStorage.getItem('token') || '' }}
        onPreview={handlePreview}
        onChange={handleChange}
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
      <Button type="primary" onClick={handleEveryPageHeaderPicture}>
        保存
      </Button>
    </div>
  );
};

export default App;

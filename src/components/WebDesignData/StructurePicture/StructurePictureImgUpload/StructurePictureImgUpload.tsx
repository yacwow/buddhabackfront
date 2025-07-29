import React, { Dispatch, SetStateAction, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  message,
  Modal,
  Upload,
  Image,
  Button,
  Select,
  Input,
  TreeSelect,
  Switch,
} from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import styles from './StructurePictureImgUpload.less';
import { request } from '@umijs/max';
import { bannerlistDataType } from '../type';
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
  treeDataArr?: any;
  controlledParam: string;
  successFileList: bannerlistDataType[];
  setSuccessFileList: Dispatch<SetStateAction<bannerlistDataType[]>>;
  isTop?: boolean; //是不是最最最顶部那些可能不见的轮播图
}
const App: React.FC<Props> = (props) => {
  const {
    successFileList,
    setSuccessFileList,
    controlledParam,
    treeDataArr,
    isTop = false,
  } = props;


  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handleCancel = () => setPreviewOpen(false);
  const [count, setCount] = useState(-1); //用来给newsbanner加id的
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
      console.log(response);
      if (result !== 'false') {
        setSuccessFileList((prevSuccessFileList) => [
          ...prevSuccessFileList,
          {
            imgsrc: url,
            url: '',
            showednum: 0,
            webdataid: count, // 可以考虑将count也使用函数式更新
            treeData: '',
          },
        ]);
        setCount((prevCount) => prevCount - 1);
        // antd的message方法
        message.success('上传成功');
      } else {
        message.error('上传失败');
      }
    }
    setFileList(newFileList);
  };
  const handleUrlLink = (e: any, id: number) => {
    let newSuccessFileList = structuredClone(successFileList);
    for (let i = 0; i < newSuccessFileList.length; i++) {
      if (newSuccessFileList[i].webdataid === id) {
        newSuccessFileList[i].url = e.target.value;
      }
    }
    setSuccessFileList(newSuccessFileList);
  };
  const handleDescriptionChange = (e: any, id: number) => {
    let newSuccessFileList = structuredClone(successFileList);
    for (let i = 0; i < newSuccessFileList.length; i++) {
      if (newSuccessFileList[i].webdataid === id) {
        newSuccessFileList[i].description = e.target.value;
      }
    }
    setSuccessFileList(newSuccessFileList);
  };

  //存在一种可能，删了图片没保存/网页坏了，这时候会出问题。先图片继续存在oss，以后可以优化（保存的时候删除）
  const handleDeletePicture = (targetUrl: string) => {
    let newSuccessFileList = successFileList.filter((item) => {
      return item.imgsrc !== targetUrl;
    });
    setSuccessFileList(newSuccessFileList);
    // console.log(targetUrl);
    // let url = require('url');
    // let obj = url.parse(targetUrl, true);
    // let delPath = obj.path;
    // console.log('obj.path', obj.path);
    // //删除该url
    // request(`/admin/secure/deletePicture`, { params: { delPath } }).then(
    //   (data) => {
    //     if (data.result) {
    //       //删除成功
    //       message.success('删除成功');
    //       let newSuccessFileList = successFileList.filter((item) => {
    //         return item.imgsrc !== targetUrl;
    //       });
    //       setSuccessFileList(newSuccessFileList);
    //     } else {
    //       message.error('删除失败');
    //     }
    //   },
    // );
  };
  const handleSelectChange = (e: number, id: number) => {
    let newSuccessFileList = successFileList.map((item) => {
      if (item.webdataid === id) {
        let newItem = { ...item };
        newItem.showednum = +e;
        return newItem;
      } else {
        return item;
      }
    });
    setSuccessFileList(newSuccessFileList);
  };
  const handleSwitchChange = (e: boolean, id: number) => {
    let newSuccessFileList = successFileList.map((item) => {
      if (item.webdataid === id) {
        let newItem = { ...item };
        newItem.hot = e;
        return newItem;
      } else {
        return item;
      }
    });
    setSuccessFileList(newSuccessFileList);
  };

  const onTreeSelectChange = (newValue: string, id: number) => {
    let newSuccessFileList = structuredClone(successFileList);
    for (let i = 0; i < newSuccessFileList.length; i++) {
      if (newSuccessFileList[i].webdataid === id) {
        newSuccessFileList[i].url = newValue;
        newSuccessFileList[i].treeData = newValue;
      }
    }
    setSuccessFileList(newSuccessFileList);
  };
  const buildPicture = () => {
    return successFileList.map((item, index: number) => {
      return (
        <div key={index} className={styles.insideDiv}>
          <div>
            <Image
              style={{ display: 'inline-block' }}
              width={150}
              height={150}
              src={`${item.imgsrc}`}
            />
          </div>

          <div>
            <Button danger onClick={() => handleDeletePicture(item.imgsrc)}>
              点击删除图片
            </Button>
          </div>
          {treeDataArr && (
            <TreeSelect
              style={{ width: '100%' }}
              value={item.url}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={treeDataArr}
              placeholder="Please select"
              multiple={false}
              treeDefaultExpandAll
              onChange={(value) => onTreeSelectChange(value, item.webdataid)}
            />
          )}
          <div> 跳转的页面</div>
          {/* {treeDataArr.some((item1: any) => {
            if (item1.value === item.url) return true;
            console.log(item)
            console.log("in1")
            if (item1.children) {
              console.log("in2")
              if (item1.children.some((childItem: any) => childItem.value === item.url)) {
                console.log("in3")
                return true;
              };
              if (item1.children && item1.children.some((childItem: any) => childItem.value === item.url)) {
                console.log("in4")
                return true;
              }
            }
            return false;
          }) ? "true" : "false"}
          {item.url} */}
          <input
            disabled={treeDataArr && item.url !== "" && treeDataArr.some((item1: any) => {
              if (item1.value === item.url) return true;
              console.log(item)
              console.log("in1")
              if (item1.children) {
                console.log("in2")
                if (item1.children.some((childItem: any) => childItem.value === item.url)) {
                  console.log("in3")
                  return true;
                };
                if (item1.children && item1.children.some((childItem: any) => childItem.value === item.url)) {
                  console.log("in4")
                  return true;
                }
              }
              return false;
            }) ? true : false}
            type="text"
            value={item.url}
            style={{ width: 160 }}
            onChange={(e) => {
              handleUrlLink(e, item.webdataid);
            }}
          />
          <div>选项介绍</div>
          <Input.TextArea
            style={{ width: 160, height: 70 }}
            value={item.description}
            onChange={(e) => {
              handleDescriptionChange(e, item.webdataid);
            }}
          />

          {isTop ? (
            <div>
              同地址如果有多张图片，为轮播，<br></br>否则就单纯展示一张图片
            </div>
          ) : (
            <>
              <div>
                同地址的数字大的才显示,
                <br />
                不同地址数字超过0才显示
              </div>
              <Select
                defaultValue={item.showednum}
                style={{ width: 120 }}
                onChange={(e) => handleSelectChange(e, item.webdataid)}
                options={Array.from({ length: 20 }, (_, index) => ({
                  label: index,
                  value: index,
                }))}
              ></Select>
            </>
          )}

          {!isTop && (
            <div>
              火热标志?：
              <Switch
                checkedChildren={'有'}
                unCheckedChildren={'没有'}
                checked={item.hot ? true : false}
                onChange={(e) => {
                  handleSwitchChange(e, item.webdataid);
                }}
              />
            </div>
          )}
        </div>
      );
    });
  };
  const handleHomePageBannerSave = () => {
    let allDeleted = false;
    if (successFileList === undefined || successFileList.length === 0) {
      allDeleted = true;
    }
    console.log(successFileList);
    let anyWrong = successFileList.some((item) => {
      if (item.showednum > 0) {
        if (!item.url) {
          return true;
        }
      }
      return false;
    })

    if (anyWrong) {
      message.error({ content: "前端展示的页面需要有跳转的url", style: { marginTop: "40vh" } }, 6);
      return;
    }
    request('/admin/secure/updateWebDataInfo', {
      params: {
        allDeleted,
        controlledParam,
        successFileList: JSON.stringify(successFileList),
      },
    }).then((data) => {
      if (data.result) {
        message.info({ content: '保存成功', style: { marginTop: '40vh' } }, 3);
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
        {successFileList.length > 0 ? buildPicture() : <div> </div>}
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
      <Button type="primary" onClick={handleHomePageBannerSave}>
        保存
      </Button>
    </div>
  );
};

export default App;

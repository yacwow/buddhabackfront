import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import React, { useState, useEffect } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { request } from '@umijs/max';
import {
    Button,
    Input,
    message,
    Upload, Image,
    Modal
} from 'antd';
import styles from '@/components/FortuneArticleComp/AddFortuneArticleComp/AddFortuneArticleComp.less';
import "@/components/FortuneArticleComp/AddFortuneArticleComp/AddFortuneArticleComp.css"
import { history } from '@umijs/max';
import { RcFile, UploadFile, UploadProps } from 'antd/es/upload';
import { PlusOutlined } from '@ant-design/icons';



const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const MyEditor = () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [successFileList, setSuccessFileList] = useState<
        {
            url: string;
        }[]
    >([]);

    // editor 实例
    const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法
    // 编辑器内容
    const [html, setHtml] = useState('');
    const [introduction, setIntroduction] = useState('');

    const [blogId, setBlogId] = useState('');
    const [update, setUpdate] = useState(false);




    useEffect(() => {
        let pathArr = location.pathname.split('/');
        // console.log(pathArr);
        if (pathArr.length > 3) {
            if (isNaN(+pathArr[3])) {
                message.info(
                    {
                        content: 'url有问题',
                        style: { marginTop: '40vh' },
                    },
                    5,
                );
                return;
            }
            setBlogId(pathArr[3]);
            request('/admin/secure/getSingleBlog', {
                params: { blogId: pathArr[3] },
            }).then((data) => {
                if (data.result) {
                    setUpdate(true);
                    setHtml(data.data.description);
                    setIntroduction(data.data.introduction);
                    if (data.data.imgSrc) setSuccessFileList([{ url: data.data.imgSrc }]);
                } else {
                    message.info(
                        {
                            content: '没找到这篇文章，不知道哪里有问题，麻烦重进一次',
                            style: { marginTop: '40vh' },
                        },
                        5,
                    );
                }
            });
        } else {
            setUpdate(false);
        }
    }, []);

    // 工具栏配置,全部都用，不需要配置
    const toolbarConfig: Partial<IToolbarConfig> = {}; // TS 语法

    //   // 编辑器配置
    //   const editorConfig: Partial<IEditorConfig> = {
    //     // TS 语法
    //     placeholder: '请输入内容...',
    //   };
    const editorConfig: Partial<IEditorConfig> = {
        placeholder: 'Start writing...',
        readOnly: false,
        autoFocus: true,
        scroll: true,
        MENU_CONF: {
            link: {
                linkTarget: '_self', // 配置链接在当前页面打开
            },
        },

    };

    // 及时销毁 editor ，重要！
    useEffect(() => {
        return () => {
            if (editor === null) return;
            editor.destroy();
            setEditor(null);
        };
    }, [editor]);



    const updateOrAddFortuneArticle = () => {
        request('/admin/secure/updateOrAddBlog', {
            method: 'POST',
            data: {
                update,
                introduction,
                html,
                blogId,
                imgSrc: successFileList.length > 0 ? successFileList[0].url : null,
            },
        }).then((data) => {
            if (data.result) {
                message.info({ content: '修改成功', style: { marginTop: '40vh' } }, 5);
                if (update) {
                } else {
                    setBlogId('' + data.data.id);
                    history.push(`/backend/addInsideBlogArticle/${data.data.id}`);
                }
                setUpdate(true);
            }
        });
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
                setSuccessFileList([
                    {
                        url,
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
        let url = require('url');
        let obj = url.parse(targetUrl, true);
        let delPath = obj.path;
        //删除该url
        request(`/admin/secure/deletePicture`, { params: { delPath } }).then(
            (data) => {
                if (data.result) {
                    //删除成功
                    message.success('删除成功');
                    setSuccessFileList([]);
                } else {
                    message.error('删除失败');
                }
            },
        );
    };
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
    // const [fixedHtml, setFixedHtml] = useState('');
    const buildPicture = () => {
        return successFileList.map((item, index: number) => {
            return (
                <div key={index} className={styles.insideDiv}>
                    <div>
                        {<Image
                            style={{ display: 'inline-block' }}
                            width={300}
                            height={300}
                            src={`${item.url}`}
                        />}
                    </div>

                    <div>
                        <Button danger onClick={() => handleDeletePicture(item.url)}>
                            点击删除图片
                        </Button>
                    </div>
                </div>
            );
        });
    };

    const uploadButton = (
        <div >
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
        </div>
    );
    return (
        <>


            博客添加页面，真正最后的展示在预测页面做修改，这里只是内容的编辑保存罢了

            <h2>图片，用于跳转前的小图</h2>
            <div>
                <h4>
                    图片展示区，
                    <span style={{ color: 'red' }}>删除图片点击该区域的删除按钮</span>
                </h4>
                <div className={styles.showPic}>
                    {successFileList.length > 0 ? buildPicture() : <div> </div>}
                </div>
                <h4>图片上传</h4>
                <Upload
                    action="/admin/secure/upload"
                    listType="picture-card"
                    maxCount={1}
                    fileList={fileList}
                    headers={{ token: localStorage.getItem('token') || '' }}
                    onPreview={handlePreview}
                    onChange={handleChange}

                >
                    {uploadButton}
                </Upload>
            </div>
            <h2>文章概述，用于跳转前简介</h2>
            <Input
                value={introduction}
                onChange={(e) => {
                    setIntroduction(e.target.value);
                }}
            />

            <h2>文章原文</h2>
            <div
                style={{
                    marginTop: 15,
                    border: '1px solid black',
                    minHeight: 200,
                    maxHeight: 800,
                    maxWidth: 750,
                    overflow: 'scroll',
                }}
                className={styles.contentContainer}
                dangerouslySetInnerHTML={{ __html: html }}
            />

            <div style={{ border: '1px solid #ccc', zIndex: 100, marginTop: 30 }}>
                <h2>文章原文编辑器</h2>
                <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                    mode="default"
                    style={{ borderBottom: '1px solid #ccc' }}
                />
                <Editor
                    defaultConfig={editorConfig}
                    value={html}

                    onCreated={setEditor}
                    onChange={(editor) =>
                        setHtml(editor.getHtml())}
                    mode="default"
                    style={{ minHeight: '500px', maxHeight: 800, overflowY: 'scroll' }}
                />
            </div>

            <div style={{ marginTop: 30 }}>
                {update ? (
                    <Button type="primary" onClick={updateOrAddFortuneArticle}>
                        修改文章
                    </Button>
                ) : (
                    <Button type="primary" onClick={updateOrAddFortuneArticle}>
                        添加文章
                    </Button>
                )}
            </div>

            <div style={{ marginTop: 500 }}>用不到的部分</div>
            <div>{html}</div>
            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export default MyEditor;

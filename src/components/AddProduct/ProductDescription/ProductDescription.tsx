import { useModel } from '@umijs/max';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { Button, Checkbox, Input, message, Select, SelectProps } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './ProductDescription.less';
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import './ProductDescription.less';
import './ProductDescription.css';
import { request } from '@umijs/max';

const App: React.FC = () => {
  const { setProductDescription, productDescription, productId } =
    useModel('productUpdateData');
  const [fixedHtml, setFixedHtml] = useState('');
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法

  useEffect(() => {
    console.log(productDescription);
  }, [productDescription]);

  const toolbarConfig: Partial<IToolbarConfig> = {}; // TS 语法
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
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <div
      style={{ width: 1200, margin: '0 auto', minHeight: 600 }}
      className="productDescription"
    >
      这里展示的是什么样子，前端的基本上是一样的（可能有些尺寸会自适应）
      {productDescription !== '' ? (
        <div
          dangerouslySetInnerHTML={{ __html: productDescription }}
          style={{ maxHeight: 600, overflowY: 'scroll' }}
        ></div>
      ) : null}
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
          value={productDescription}
          onCreated={setEditor}
          onChange={(editor) => setProductDescription(editor.getHtml())}
          mode="default"
          style={{ minHeight: '500px', maxHeight: 800, overflowY: 'scroll' }}
        />
      </div>
      <div>
        <div style={{ marginTop: 500 }}>用不到的部分</div>
        <div>{productDescription}</div>
        <Input.TextArea
          style={{ minHeight: 500 }}
          onChange={(e) => {
            setFixedHtml(e.target.value);
          }}
        />
        <Button
          disabled={productId === ''}
          onClick={() => {
            if (!isNaN(+productId)) {
              request('/admin/secure/updateFixedHtmlForProductFunctionDetail', {
                method: 'POST',
                data: {
                  fixedHtml,
                  productId,
                },
              }).then((data) => {
                if (data.result) {
                  if (data.code === 20001) {
                    message.info(
                      {
                        content: `${data.message}`,
                        style: { marginTop: '40vh' },
                      },
                      5,
                    );
                  } else {
                    message.info(
                      { content: '修改成功', style: { marginTop: '40vh' } },
                      5,
                    );
                  }
                } else {
                  message.info(
                    { content: '修改失败', style: { marginTop: '40vh' } },
                    5,
                  );
                }
              });
            }
          }}
        >
          专用保存
        </Button>
      </div>
    </div>
  );
};
export default App;

// useEffect(() => {
//   let arr = location.pathname.split('/');
//   if (arr.length >= 5) {
//     setProductId(arr[4]);
//     request(`/admin/getProductDetailDescriptionInfo/${arr[4]}`).then(
//       (data) => {
//         console.log(data);
//         if (data.result) {
//           console.log(data.data.productDetailDescription);
//           //'図案:無地 ,生地:コットン ポリエステル  ナイロン生地 リネン生地 ,スタイル:ボヘミアンスタイル エスニック系 ローマ系 スポーツ ,'
//           //改成{図案：{無地：無地},}格式
//           let descriptionArr = data.data.productDetailDescription.split(',');
//           let oneTypeMapOuter = {};
//           for (let i = 0; i < descriptionArr.length; i++) {
//             let oneTypeArr = descriptionArr[i].split(':');
//             let oneTypeMapInner = {};
//             let oneTypeDescrption = oneTypeArr[1].split(' ');
//             for (let j = 0; j < oneTypeDescrption.length; j++) {
//               if (oneTypeDescrption[j].trim() === '') continue;
//               oneTypeMapInner[oneTypeDescrption[j]] = oneTypeDescrption[j];
//             }
//             oneTypeMapOuter[oneTypeArr[0]] = oneTypeMapInner;
//           }
//           setProductDescription(oneTypeMapOuter);
//         }
//       },
//     );
//   }
//   request('/admin/getProductGeneralDescription').then((data) => {
//     if (data.result) {
//       setData(data.data.data);
//       console.log(data.data.data);
//     }
//   });
// }, []);

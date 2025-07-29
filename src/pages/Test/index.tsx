import TestMovement from './TestMovement/TestMovement';
import ProductBasicInfo from '@/components/AddProduct/ProductContext/ProductBasicInfo/ProductBasicInfo';

import React, { useEffect, useRef, useState } from 'react';
import BigImgUpload from '@/components/AddProduct/ProductContext/BigImgUpload';
import ProductContext from '@/components/AddProduct/ProductContext';
import AddProduct from '@/components/AddProduct';
import AddNewCategoryHeader from '@/components/AddNewCategoryForWebDisplay/AddNewCategoryHeader';
import AddNewCategoryForWebDisplay from '@/components/AddNewCategoryForWebDisplay';
import ProductDisplayHeader from '@/components/ProductDisplay/ProductDisplayHeader';
import ProductDisplayBody from '@/components/ProductDisplay/ProductDisplayBody';
import ProductDisplay from '@/components/ProductDisplay';
import NormalCategory from '@/components/AddNewCategoryForWebDisplay/NormalCategory';
import ProductSortPicture from '@/components/ProductSort/ProductSortBody/ProductSortPicture';
import CategoryDisplay from '@/components/CategoryDisplay';
import SpecialEventProductSort from '@/components/SpecialEventProductSort';
import LeftSideNavigate from '@/components/LeftSideNavigate';
import AddProductHeader from '@/components/AddProduct/AddProductHeader';
import { history } from '@umijs/max';
import AddSearchParams from '@/components/AddSearchParams';
import WebDesignData from '@/components/WebDesignData';
import SmallImgUpload from '@/components/AddProduct/ProductContext/SmallImgUpload';
import SmallImgUploadForComment from '@/components/AddProduct/Comment/SmallImgUploadForComment';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import WeChatComp from './WeChatComp';
interface Props { }
const App: React.FC<Props> = (props) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null); // 存储 editor 实例
  const [html, setHtml] = useState(""); // 存储编辑器内容
  const textareaRef = useRef<HTMLTextAreaElement>(null); // 用于引用 textarea
  const isInitialized = useRef(false); // 标志位，用于判断是否初始化完成

  // 设置 HTML 内容到编辑器
  const handleSetHtml = () => {
    if (editor && textareaRef.current) {
      editor.setHtml(textareaRef.current.value);
    }
  };

  // 编辑器配置
  const editorConfig = {
    placeholder: "Type here...",
    MENU_CONF: {
      uploadImage: {
        fieldName: "your-fileName",
        base64LimitSize: 10 * 1024 * 1024, // 10M 以下插入 base64
      },
    },
    onChange: (editor: IDomEditor) => {
      if (isInitialized.current) {
        console.log("onChange triggered"); // 只在初始化完成后触发
        setHtml(editor.getHtml()); // 更新编辑器内容
        console.log(editor.getHtml()); // 打印编辑器内容
      }
    },
  };

  // 组件卸载时销毁编辑器
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
        setEditor(null);
      }
    };
  }, [editor]);
  const [draggableState, setDraggableState] = useState(true);
  return (
    // <div className="page-container">
    //   <div className="page-right">
    //     {/* 文本域 */}
    //     <textarea
    //       id="editor-content-textarea"
    //       ref={textareaRef}
    //       style={{ width: "100%", height: "100px", outline: "none" }}
    //     />
    //     {/* 设置 HTML 按钮 */}
    //     <div style={{ marginTop: "10px" }}>
    //       <button id="btn-set-html" onClick={handleSetHtml}>
    //         Set HTML
    //       </button>
    //     </div>
    //     {/* 编辑器 */}
    //     <div style={{ border: "1px solid #ccc", marginTop: "20px" }}>
    //       <Toolbar
    //         editor={editor}
    //         mode="default"
    //         style={{ borderBottom: "1px solid #ccc" }}
    //       />
    //       <Editor
    //         onCreated={(editor) => {
    //           setTimeout(() => {
    //             setEditor(editor);
    //             isInitialized.current = true; // 延迟设置标志位
    //           }, 0);
    //         }}
    //         defaultConfig={editorConfig}
    //         style={{ height: "350px" }}
    //       />
    //     </div>
    //   </div>
    //   <div>{html}</div>
    // </div>
    // <WeChatComp userId='admin'/>
    <div style={{ border: "1px solid red", width: 200 }}
      draggable={draggableState}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
      }}>
      <img src="https://picture-for-buddha.oss-us-west-1.aliyuncs.com/images/e226799d-d172-4d5e-be56-fa78db854357.jpg" alt=""
        style={{ width: 140, height: 140, display: "block" }} />
      <input type="text" onMouseDown={() => {
        setDraggableState(false);
      }}
        onBlur={() => {
          setDraggableState(true)
        }} />
    </div>
  );
};
export default App;



// import AddProduct from '@/components/AddProduct';
// import ProductCategory from '@/components/AddProduct/ProductCategory';
// import BigImgUpload from '@/components/AddProduct/ProductContext/BigImgUpload';
// import UploadImg from '@/components/AddProduct/ProductContext/SmallImgUpload';
// import React, { useEffect } from 'react';
// import TestMovement from './TestMovement/TestMovement';
// import TestTable from './TestTable';
// import Swipe from './DNDMovement/Swipe.jsx'
// import DragAndDropPage from './MyOwnDrag/MyOwnDrag';
// import MyOwnDrag from './MyOwnDrag/MyOwnDrag';
// import "./index.css"
// interface Props {
// }
// class App extends React.PureComponent {
//   componentDidMount() {
//     new Draggable({
//       element: document.getElementsByClassName('list')[0]
//     });
//     console.log(document.getElementsByClassName('list')[0].children)
//   }
//   render() {
//     return (
//       <div className="container">
//         <ul className="list">
//           <li className="list-item"><div>123</div> <span>222</span> <div>333</div></li>
//           <li className="list-item"><div>123</div> <span>222</span> <div>333</div></li>
//           <li className="list-item"><div>123</div> <span>222</span> <div>333</div></li>
//           <li className="list-item"><div>123</div> <span>222</span> <div>333</div></li>
//           <li className="list-item"><div>123</div> <span>222</span> <div>333</div></li>
//           <li className="list-item"><div>123</div> <span>222</span> <div>333</div></li>
//           <li className="list-item"><div>123</div> <span>222</span> <div>333</div></li>
//           <li className="list-item"><div>123</div> <span>222</span> <div>333</div></li>
//           <li className="list-item"><div>123</div> <span>222</span> <div>333</div></li>
//         </ul>

//       </div>
//     )
//   }
// }

// export default App;

// class Draggable {
//   containerElement = null;
//   rectList = [];
//   isPointerDown = false;
//   drag = { element: null, index: 0, firstIndex: 0 };
//   clone = { element: null, x: 0, y: 0 };
//   diff = { x: 0, y: 0 };
//   referenceElement = null;
//   lastPointerMove = { x: 0, y: 0 };

//   constructor(options) {
//     console.log(options)
//     this.containerElement = options.element;

//     this.init();
//   }
//   init() {
//     this.getRectList();
//     this.bindEventListener();
//   }

//   getRectList() {
//     this.rectList.length = 0;
//     console.log(this.containerElement)
//     for (const item of this.containerElement.children) {
//       this.rectList.push(item.getBoundingClientRect());
//     }
//   }

//   onPointerDown(e) {
//     console.log(e,this.containerElement)
//     if (e.pointerType === 'mouse' && e.button !== 0) {
//       return;
//     }
//     if (e.target === this.containerElement) {
//       return;
//     }

//     this.isPointerDown = true;

//     this.containerElement.setPointerCapture(e.pointerId);

//     this.lastPointerMove.x = e.clientX;
//     this.lastPointerMove.y = e.clientY;

//     this.drag.element = e.target;
//     this.drag.element.classList.add('active');

//     const index = [].indexOf.call(this.containerElement.children, this.drag.element);
//     console.log(this.containerElement.children)
//     console.log( this.drag.element)
//     this.drag.index = index;
//     this.drag.firstIndex = index;

//     this.clone.x = this.rectList[index].left;
//     this.clone.y = this.rectList[index].top;

//     this.clone.element = this.drag.element.cloneNode(true);
//     document.body.appendChild(this.clone.element);

//     this.clone.element.style.transition = 'none';
//     this.clone.element.className = 'clone-item';
//     this.clone.element.style.transform = 'translate3d(' + this.clone.x + 'px, ' + this.clone.y + 'px, 0)';

//     for (const item of this.containerElement.children) {
//       item.style.transition = 'transform 500ms';
//     }
//   }
//   onPointerMove(e) {
//     if (this.isPointerDown) {
//       this.diff.x = e.clientX - this.lastPointerMove.x;
//       this.diff.y = e.clientY - this.lastPointerMove.y;

//       this.lastPointerMove.x = e.clientX;
//       this.lastPointerMove.y = e.clientY;

//       this.clone.x += this.diff.x;
//       this.clone.y += this.diff.y;

//       this.clone.element.style.transform = 'translate3d(' + this.clone.x + 'px, ' + this.clone.y + 'px, 0)';

//       for (let i = 0; i < this.rectList.length; i++) {
//         if (i !== this.drag.index && e.clientX > this.rectList[i].left && e.clientX < this.rectList[i].right &&
//           e.clientY > this.rectList[i].top && e.clientY < this.rectList[i].bottom) {
//           if (this.drag.index < i) {
//             for (let j = this.drag.index; j < i; j++) {
//               if (j < this.drag.firstIndex) {
//                 this.containerElement.children[j].style.transform = 'translate3d(0px, 0px, 0)';
//               } else {
//                 const x = this.rectList[j].left - this.rectList[j + 1].left;
//                 const y = this.rectList[j].top - this.rectList[j + 1].top;
//                 this.containerElement.children[j + 1].style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
//               }
//             }
//             this.referenceElement = this.containerElement.children[i + 1];
//           } else if (this.drag.index > i) {
//             for (let j = i; j < this.drag.index; j++) {
//               if (this.drag.firstIndex <= j) {
//                 this.containerElement.children[j + 1].style.transform = 'translate3d(0px, 0px, 0)';
//               } else {
//                 const x = this.rectList[j + 1].left - this.rectList[j].left;
//                 const y = this.rectList[j + 1].top - this.rectList[j].top;
//                 this.containerElement.children[j].style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
//               }
//             }
//             this.referenceElement = this.containerElement.children[i];
//           }
//           const x = this.rectList[i].left - this.rectList[this.drag.firstIndex].left;
//           const y = this.rectList[i].top - this.rectList[this.drag.firstIndex].top;
//           this.drag.element.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
//           this.drag.index = i;
//           break;
//         }
//       }
//     }
//   }
//   onPointerUp(e) {
//     if (this.isPointerDown) {
//       this.isPointerDown = false;

//       this.drag.element.classList.remove('active');
//       this.clone.element.remove();

//       for (const item of this.containerElement.children) {
//         item.style.transition = 'none';
//         item.style.transform = 'translate3d(0px, 0px, 0px)';
//       }

//       if (this.referenceElement !== null) {
//         this.containerElement.insertBefore(this.drag.element, this.referenceElement);
//       }
//     }
//   }
//   bindEventListener() {
//     this.containerElement.addEventListener('pointerdown', this.onPointerDown.bind(this));
//     this.containerElement.addEventListener('pointermove', this.onPointerMove.bind(this));
//     this.containerElement.addEventListener('pointerup', this.onPointerUp.bind(this));

//     window.addEventListener('scroll', this.getRectList.bind(this));
//     window.addEventListener('resize', this.getRectList.bind(this));
//     window.addEventListener('orientationchange', this.getRectList.bind(this));
//   }
// }

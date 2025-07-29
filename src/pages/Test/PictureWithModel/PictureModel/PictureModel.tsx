import React from 'react';
import styles from "./PictureModel.less";
// import {Icon} from 'antd';
// 用这个组件的时候，需要上层组件的position：relative！！！！！！！！！！！
interface Props {
    content: string,
}
const App: React.FC<Props> = (props) => {
    const { content } = props;
    return (
        <div className={styles.info}>
            <span className={styles.actions}>
                {content}
                {/* <Icon type='eye'/>
        <Icon type='delete'/> */}
            </span>
        </div>

    )
};
export default App;
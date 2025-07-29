import React from 'react';
// import { Image } from 'antd';
import PictureModel from './PictureModel';
import styles from "./PictureWithModel.less";
//@ts-ignore
import { LazyLoadImage } from "react-lazy-load-image-component";
import { NavLink } from '@umijs/max';

interface Props {
  imgSrc: string,
  content: string,
  rank: number,
  discount?: boolean,
  href:string
}
const App: React.FC<Props> = (props) => {
  const { imgSrc, content, rank, discount = false,href } = props;
  return (
    <NavLink className={styles.container} to={href}>
      <div className={styles.wrapper}>
          <LazyLoadImage className={styles.backImg} src={imgSrc}  height={600}></LazyLoadImage>
        <PictureModel content={content}></PictureModel>
        {rank > 0 ? rank <= 3 ? <LazyLoadImage src={`rankicon/icon-ran${rank}.png`} className={styles.rank}></LazyLoadImage>
          : <span className={styles.rankSpan}>{rank}</span> : null}
        {discount ? <LazyLoadImage src='img/discount.jpg' className={styles.discount}></LazyLoadImage> : null}
      </div>

      {/* {bottomLine ? <div className={styles.bottomLine}>
        <p>{bottomLine.detail}</p>
        <p>{bottomLine.price}</p>
      </div> : null} */}
    </NavLink>
  )
};
export default App;
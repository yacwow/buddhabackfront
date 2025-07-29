// 全局共享数据示例
import { useState } from 'react';
const useUser = () => {
    const [selectItem, setSelectItem] = useState('常规');//addproductnavigate的状态
    const [firstCategory1, setFirstCategory1] = useState("");//addNewCategory的normalCategory初始数据
    const [firstCategoryJap1, setFirstCategoryJap1] = useState("");//addNewCategory的normalCategory初始数据
    const [secondCategory1, setSecondCategory1] = useState("");//addNewCategory的normalCategory初始数据
    const [secondCategoryJap1, setSecondCategoryJap1] = useState("");//addNewCategory的normalCategory初始数据
    const [bigImgSuccessList, setBigImgSuccessList] = useState<{ url: string, size: number }[]>([]);//大图真实的上传成功的图片，限制为1张
    return {
        selectItem, setSelectItem,
        firstCategory1, setFirstCategory1, firstCategoryJap1, setFirstCategoryJap1, secondCategory1, setSecondCategory1, secondCategoryJap1, setSecondCategoryJap1,
        bigImgSuccessList, setBigImgSuccessList

    };
};

export default useUser;
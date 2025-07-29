export const checkExists = (
  tableData: { idproduct: number }[],
  productId: number,
) => {
  console.log(productId);
  for (let i = 0; i < tableData.length; i++) {
    console.log(tableData[i].idproduct);
    if (+tableData[i].idproduct === +productId) {
      return i;
    }
  }
  return false;
};
/**
 *以后可以优化，只更新几个，现在就闭着眼全部上传更新吧
 */
export const insertOneProduct = (
  tableData: { rank: number }[],
  productIndex: number,
  targetIndex: number,
) => {
  if (productIndex > targetIndex) {
    console.log('in32');
    // 从后往前插入
    // productindex的值挪到目标位置去并替代原来的rank值
    let newTableData = JSON.parse(JSON.stringify(tableData));
    let singleData = newTableData.splice(productIndex, 1)[0];
    singleData.rank = newTableData[targetIndex].rank;
    // 目标index之后的所有tabledata的rank都-1
    for (let i = targetIndex; i < productIndex; i++) {
      newTableData[i].rank = newTableData[i].rank - 1;
    }
    newTableData.splice(targetIndex, 0, singleData);
    return newTableData;
  } else {
    // 前面的数据插入到后面
    let newTableData = JSON.parse(JSON.stringify(tableData));
    let singleData = newTableData.splice(productIndex, 1)[0];
    singleData.rank = tableData[targetIndex].rank;
    //目标index之后的所有table rank+1
    for (let i = productIndex; i < targetIndex; i++) {
      newTableData[i].rank = newTableData[i].rank + 1;
    }
    newTableData.splice(targetIndex, 0, singleData);
    return newTableData;
  }
};

/**
 *根据成功上传的所有图片的集合以及要传入的位置和原来的位置，来调整单品图片的位置
 */
export const insertProductPictureForOneProduct = (
  successFileList: {
    url: string;
    size?: number;
    color: string;
    listPrice: number;
    price: number;
    sortNum?: number;
    rank?: number;
    priceVariate?: string;
    variateValue?: string;
    index: number;
  }[],
  productIndex: number,
  targetIndex: number,
) => {
  let newSuccessFileList = structuredClone(successFileList);
  let originData = newSuccessFileList[successFileList.length - productIndex];
  let newData = newSuccessFileList[successFileList.length - targetIndex];
  console.log(newSuccessFileList, productIndex, targetIndex);
  console.log(originData, newData);
  originData.sortNum = targetIndex;
  newData.sortNum = productIndex;
  newSuccessFileList[successFileList.length - productIndex] = newData;
  newSuccessFileList[successFileList.length - targetIndex] = originData;
  return newSuccessFileList;
};

/**
 *
 * @param tableData
 * @param productIndex 一群选出的product中的第一个的index
 * @param targetIndex
 * @returns
 */
export const insertSomeProduct = (
  tableData: { rank: number }[],
  productIndex: number,
  productListData: number[],
  targetIndex: number,
) => {
  console.log('inbuliaoa');
  if (productIndex > targetIndex) {
    console.log('in32', targetIndex);
    // 从后往前插入
    // productindex的值挪到目标位置去并替代原来的rank值
    let newTableData = JSON.parse(JSON.stringify(tableData));
    // 获取target位置的那个productinfo
    let targetProductInfo = newTableData[targetIndex];
    console.log(targetProductInfo);
    // 先把所有的找出来并合成新的一个数组
    let newDataList = [];
    for (let i = 0; i < productListData.length; i++) {
      for (let j = 0; j < newTableData.length; j++) {
        // eslint-disable-next-line eqeqeq
        if (newTableData[j].idproduct == productListData[i]) {
          newDataList.push(newTableData.splice(j, 1)[0]);
          continue;
        }
      }
    }
    // 剩下的targetindex可能因为截取的问题而变数字了
    let newTarget: number = 0;
    for (let i = 0; i < newTableData.length; i++) {
      if (newTableData[i].idproduct === targetProductInfo.idproduct) {
        newTarget = i;
        break;
      }
    }
    console.log(newTarget);
    // 全部在目标位置rank基础上往上加就行了
    for (let i = 0; i < newDataList.length; i++) {
      newDataList[i].rank =
        newTableData[newTarget].rank + newDataList.length - i;
    }

    if (newTarget === 0) {
    } else {
      // 目标之前的也需要加，而且加的更多
      for (let j = 0; j < newTarget; j++) {
        newTableData[j].rank += newDataList.length;
      }
    }
    newTableData.splice(newTarget, 0, ...newDataList);
    return newTableData;
  } else {
    console.log('in33');
    // 前面的数据插入到后面
    // productindex的值挪到目标位置去并替代原来的rank值
    let newTableData = JSON.parse(JSON.stringify(tableData));
    // 获取target位置的那个productinfo
    let targetProductInfo = newTableData[targetIndex];
    console.log(targetProductInfo);
    // 先把所有的找出来并合成新的一个数组
    let newDataList = [];
    for (let i = 0; i < productListData.length; i++) {
      for (let j = 0; j < newTableData.length; j++) {
        // eslint-disable-next-line eqeqeq
        if (newTableData[j].idproduct == productListData[i]) {
          newDataList.push(newTableData.splice(j, 1)[0]);
          continue;
        }
      }
    }
    // 剩下的targetindex可能因为截取的问题而变数字了
    let newTarget: number = 0;
    for (let i = 0; i < newTableData.length; i++) {
      if (newTableData[i].idproduct === targetProductInfo.idproduct) {
        newTarget = i;
        break;
      }
    }
    console.log(newTarget);
    // 全部在目标位置rank基础上往上加就行了
    for (let i = 0; i < newDataList.length; i++) {
      newDataList[i].rank =
        newTableData[newTarget].rank + newDataList.length - i;
    }

    if (newTarget === 0) {
    } else {
      // 目标之前的也需要加，而且加的更多
      for (let j = 0; j <= newTarget; j++) {
        newTableData[j].rank += newDataList.length;
      }
    }
    newTableData.splice(newTarget + 1, 0, ...newDataList);
    return newTableData;
  }
};

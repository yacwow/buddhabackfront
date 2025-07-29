const NumToString = (num: number) => {
    if(!num) return 0;
    let res = '';
    let count = 0;

    // 处理小数部分
    const [integerPart, decimalPart] = num.toString().split('.');

    let intNum = parseInt(integerPart, 10);

    do {
        if (count % 3 === 0 && count !== 0) {
            res = ',' + res;
        }
        count++;
        let num1 = intNum % 10;
        res = num1 + res;
        intNum = Math.floor(intNum / 10);
    } while (intNum > 0);

    if (decimalPart) {
        res += '.' + decimalPart;
    }

    return res;
};


export default NumToString
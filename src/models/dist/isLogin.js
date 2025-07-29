"use strict";
exports.__esModule = true;
var max_1 = require("@umijs/max");
var react_1 = require("react");
var useUser = function () {
    var _a = react_1.useState(0), num = _a[0], setNum = _a[1]; //总的cart的商品数
    var _b = react_1.useState(0), wishListNum = _b[0], setWishListNum = _b[1]; //总的红心数
    var _c = react_1.useState(0), invoiceNum = _c[0], setInvoiceNum = _c[1]; //搜索栏头像这里，总的发票数
    var _d = react_1.useState(false), isLogin = _d[0], setIsLogin = _d[1];
    var _e = react_1.useState(), userName = _e[0], setUserName = _e[1];
    var _f = react_1.useState(), userEmail = _f[0], setUserEmail = _f[1];
    react_1.useEffect(function () {
        var number = 0;
        var wishListNum = 0;
        console.log("in1");
        var str = localStorage.getItem("productList");
        if (str) {
            var newStr = JSON.parse(str);
            if (Array.isArray(newStr)) {
                for (var i = 0; i < newStr.length; i++) {
                    number += newStr[i].amount;
                }
            }
        }
        var wishListStr = localStorage.getItem("wishList");
        if (wishListStr) {
            var newWishListStr = JSON.parse(wishListStr);
            if (Array.isArray(newWishListStr)) {
                wishListNum = newWishListStr.length;
            }
        }
        setNum(number);
        setWishListNum(wishListNum);
        max_1.request("/api/secure/getUserInfo").then(function (data) {
            if (data.result) {
                setIsLogin(true);
                setUserName(data.data.data.userName);
                setUserEmail(data.data.data.email);
            }
        });
    }, []);
    react_1.useEffect(function () {
        if (isLogin === true) {
            max_1.request("/api/secure/queryNumberOfWishAndProductAndInvoiceNum").then(function (data) {
                if (data.result) {
                    setNum(data.data.productNum);
                    setWishListNum(data.data.wishNum);
                    setInvoiceNum(data.data.invoiceNum);
                }
            });
        }
    }, [isLogin]);
    return {
        isLogin: isLogin,
        setIsLogin: setIsLogin,
        userName: userName,
        setUserName: setUserName,
        userEmail: userEmail,
        setUserEmail: setUserEmail,
        num: num,
        setNum: setNum,
        wishListNum: wishListNum,
        setWishListNum: setWishListNum,
        invoiceNum: invoiceNum,
        setInvoiceNum: setInvoiceNum
    };
};
exports["default"] = useUser;

import React from 'react';
import {setCart} from './LocalStorage';

class Cart {
    constructor() {
    }

    removeCart = (cartList, cartItem) => {
        let filterData = cartList.filter(item => item.id !== cartItem.id);
        setCart(filterData);
    }

    getTotalCartCount = (cartList) => {
        if (cartList !== undefined && cartList !== null && cartList.length > 0) {
            return cartList.reduce((accum, item) => parseFloat(accum) + parseFloat(item.count), 0);
        } else {
            return 0;
        }
    }

    getItemCount = (cartList, cartItem) => {
        if (cartList !== undefined && cartList !== null && cartList.length > 0) {
            let itemData = cartList.filter(item => item.id === cartItem.id);
            if (itemData !== undefined && itemData !== null && itemData.length > 0) {
                return itemData[0].count;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    getTotalPrice = (cartList) => {
        if (cartList !== undefined && cartList !== null && cartList.length > 0) {
            return cartList.reduce(
                (accum, item) => parseFloat(accum) + parseFloat(item.subTotal),
                0,
            );
        } else {
            return 0;
        }
    }

    isProductExist = (cartList, cartItem) => {
        if (cartList !== undefined && cartList !== null && cartList.length > 0) {
            let itemIndex = cartList.findIndex(item => item.item.id === cartItem.id);
            if (itemIndex === -1) {
                return -1;
            } else {
                return itemIndex;
            }
        } else {
            return -1;
        }
    }
}

export default new Cart();

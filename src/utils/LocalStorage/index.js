import AsyncStorage from '@react-native-community/async-storage';

const KRISHNA_API_KEY = 'krishna_shop_api_key';
const KRISHNA_USER_DETAILS = 'krishna_shop_user_details';
const KRISHNA_CART = 'krishna_shop_cart';
const KRISHNA_PRODUCT_ITEM = 'krishna_shop_product_item';
const KRISHNA_WISHLIST = 'krishna_shop_wishlist';
const KRISHNA_IS_FIRST_TIME_OPEN = 'krishna_shop_firstTime';

export const getApiKey = async () => {
    try {
        return await AsyncStorage.getItem(KRISHNA_API_KEY);
    } catch (error) {
        console.log('Error fetching', error);
        return null;
    }
};

export const setApiKey = api => {
    AsyncStorage.setItem(KRISHNA_API_KEY, api);
};

export const getToken = async () => {
    try {
        let userDetails = await AsyncStorage.getItem(KRISHNA_USER_DETAILS);
        userDetails = JSON.parse(userDetails);
        return userDetails.token;
    } catch (error) {
        console.log('Error fetching', error);
        return null;
    }
};

export const getUserDetails = async () => {
    try {
        let userDetails = await AsyncStorage.getItem(KRISHNA_USER_DETAILS);
        userDetails = JSON.parse(userDetails);
        return userDetails;
    } catch (error) {
        console.log('Error fetching', error);
        return null;
    }
};

export const setUserDetails = user => {
    AsyncStorage.setItem(KRISHNA_USER_DETAILS, JSON.stringify(user));
};

export const setFirstTime = value => {
    AsyncStorage.setItem(KRISHNA_IS_FIRST_TIME_OPEN, JSON.stringify(value));
};

export const getFirstTime = async () => {
    try {
        let details = await AsyncStorage.getItem(KRISHNA_IS_FIRST_TIME_OPEN);
        details = JSON.parse(details);
        return details;
    } catch (error) {
        console.log('Error fetching', error);
        return null;
    }
};

export const getCart = async () => {
    try {
        let cartDetails = await AsyncStorage.getItem(KRISHNA_CART);
        cartDetails = JSON.parse(cartDetails);
        return cartDetails;
    } catch (error) {
        console.log('Error fetching', error);
        return null;
    }
};

export const setCart = cart => {
    AsyncStorage.setItem(KRISHNA_CART, JSON.stringify(cart));

};

export const getProductItem = async () => {
    try {
        let productDetails = await AsyncStorage.getItem(KRISHNA_PRODUCT_ITEM);
        productDetails = JSON.parse(productDetails);
        return productDetails;
    } catch (error) {
        console.log('Error fetching', error);
        return null;
    }
};

export const setWishlist = product => {
    AsyncStorage.setItem(KRISHNA_WISHLIST, JSON.stringify(product));
};

export const geWishlist = async () => {
    try {
        let wishlist = await AsyncStorage.getItem(KRISHNA_WISHLIST);
        wishlist = JSON.parse(wishlist);
        return wishlist;
    } catch (error) {
        console.log('Error fetching wishlist', error);
        return null;
    }
};

export const setProductItem = productItem => {
    AsyncStorage.setItem(KRISHNA_PRODUCT_ITEM, JSON.stringify(productItem));
};

export const logout = async () => {
    try {
        await AsyncStorage.clear();
        setFirstTime('true');
    } catch (e) {

    }
};

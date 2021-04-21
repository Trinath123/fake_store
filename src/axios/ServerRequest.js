import API, {BASE_URL} from './API';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-simple-toast';
import {getToken} from '../utils/LocalStorage';

export const CategoryImage = BASE_URL + 'assets/images/ProductImage/category/';
export const ProductImage = BASE_URL + 'assets/images/ProductImage/product/';

export const checkInternetConnection = () => {
    NetInfo.fetch().then((state) => {
        if (state.isConnected === false) {
            Toast.showWithGravity(
                'No internet connection',
                Toast.SHORT,
                Toast.BOTTOM,
            );
        }
    });
};

export const userLogin = async (phone, password, fcm_id) => {
    let body = null;
    if (fcm_id !== '') {
        body = {
            phone: phone,
            password: password,
            fcm_id: fcm_id,
        };
    } else {
        body = {
            phone: phone,
            password: password,
        };
    }
    return await API({
        method: 'POST',
        url: 'api/users/login/',
        data: body,
    }).then((res) => {
        return res;
    });
};

export const register = async (name, phone, email, password, fcm_id) => {
    let body = null;
    if (fcm_id !== '') {
        body = {
            name: name,
            phone: phone,
            email: email,
            password: password,
            fcm_id: fcm_id,
        };
    } else {
        body = {
            name: name,
            phone: phone,
            email: email,
            password: password,
        };
    }
    return await API({
        method: 'POST',
        url: 'api/users/register/',
        data: body,
    }).then((res) => {
        return res;
    });
};

export const resendOTP = async (phone) => {
    const body = {
        phone: phone,
    };
    return await API({
        method: 'POST',
        url: 'api/users/verify_resend_otp/',
        data: body,
    }).then((res) => {
        return res;
    });
};

export const verifyOTP = async (phone, otp) => {
    const body = {
        phone: phone,
        otp: otp,
    };
    return await API({
        method: 'POST',
        url: 'api/users/verify_otp/',
        data: body,
    }).then((res) => {
        return res;
    });
};

export const getAllBanners = async () => {
    return await API({
        method: 'GET',
        url: 'api/config/slider_images/',
    }).then((res) => {
        return res;
    });
};

export const getAllCategory = async (page, pageSize) => {
    return await API({
        method: 'GET',
        url: `categories`,
    }).then((res) => {
        return res;
    });
};

export const getAllOffers = async (page, pageSize) => {
    return await API({
        method: 'GET',
        url: `api/vouchers/list/?page=${page}&page_size=${pageSize}`,
    }).then((res) => {
        return res;
    });
};

export const getAllPopularCategory = async () => {
    return await API({
        method: 'GET',
        url: 'api/catalog/popular_categories/',
    }).then((res) => {
        return res;
    });
};

export const getAllPopularProduct = async (page, pageSize) => {
    return await API({
        method: 'GET',
        url: `api/catalog/popular_products/?page=${page}&page_size=${pageSize}`,
    }).then((res) => {
        return res;
    });
};

export const getAllNewProduct = async (page, pageSize) => {
    return await API({
        method: 'GET',
        url: `api/catalog/product/recently_added/?page=${page}&page_size=${pageSize}`,
    }).then((res) => {
        return res;
    });
};

export const getAllProducts = async (category_name) => {
    return await API({
        method: 'GET',
        url: `category/${category_name}`,
    }).then((res) => {
        return res;
    });
};

export const getProductDetails = async (category_name) => {
    return await API({
        method: 'GET',
        url: `category/${category_name}`,
    }).then((res) => {
        return res;
    });
};

export const getFavoriteProducts = async () => {
    return await API({
        method: 'GET',
        url: `api/catalog/wishlist/`,
    }).then((res) => {
        return res;
    });
};

export const getAddress = async () => {
    return await API({
        method: 'GET',
        url: `api/users/address/list/`,
    }).then((res) => {
        return res;
    });
};

export const getCurrencyData = async () => {
    return await API({
        method: 'GET',
        url: `api/catalog/currency_lists/`,
    }).then((res) => {
        return res;
    });
};

export const getDefaultAddress = async () => {
    return await API({
        method: 'GET',
        url: `api/users/address/default/`,
    }).then((res) => {
        return res;
    });
};

export const addAddress = async (address) => {
    return await API({
        method: 'POST',
        url: `api/users/address/create/`,
        data: address,
    }).then((res) => {
        return res;
    });
};

export const updateAddress = async (id, address) => {
    return await API({
        method: 'PUT',
        url: `api/users/address/${id}/update/`,
        data: address,
    }).then((res) => {
        return res;
    });
};
export const deleteAddress = async (id) => {
    return await API({
        method: 'DELETE',
        url: `api/users/address/${id}/delete/`,
    }).then((res) => {
        return res;
    });
};

export const updateUser = async (user) => {
    return await API({
        method: 'POST',
        url: 'api/v1/updateUser',
        data: user,
    }).then((res) => {
        return res;
    });
};
export const searchProduct = async (text) => {
    return await API({
        method: 'GET',
        url: `api/catalog/search/?search=${text}&page=1&page_size=100`,
    }).then((res) => {
        return res;
    });
};

export const favoriteProduct = async (id) => {
    return await API({
        method: 'POST',
        url: `api/catalog/product/${id}/wishlist/`,
    }).then((res) => {
        return res;
    });
};

export const orderPlace = async (orderDetails) => {
    return await API({
        method: 'Post',
        url: 'api/v1/placeorder',
        data: orderDetails,
    }).then((res) => {
        return res;
    });
};
export const getOrderDetails = async (page, pageSize) => {
    return await API({
        method: 'GET',
        url: `api/orders/list/?page=${page}&page_size=${pageSize}`,
    }).then((res) => {
        return res;
    });
};

export const getSingleOrderDetails = async (id) => {
    return await API({
        method: 'GET',
        url: `api/orders/${id}/details/`,
    }).then((res) => {
        return res;
    });
};

export const getCountry = async () => {
    return await API({
        method: 'GET',
        url: `api/locations/countries/`,
    }).then((res) => {
        return res;
    });
};

export const getState = async (id) => {
    return await API({
        method: 'GET',
        url: `api/locations/country/${id}/states/`,
    }).then((res) => {
        return res;
    });
};

export const getCity = async (id) => {
    return await API({
        method: 'GET',
        url: `api/locations/state/${id}/cities/`,
    }).then((res) => {
        return res;
    });
};

export const getZip = async (id) => {
    return await API({
        method: 'GET',
        url: `api/locations/city/${id}/pin/`,
    }).then((res) => {
        return res;
    });
};

export const getPin = async () => {
    return await API({
        method: 'GET',
        url: `api/locations/pin/`,
    }).then((res) => {
        return res;
    });
};

export const forgotPassword = async (mobile) => {
    const body = {
        phone: mobile,
    };
    return await API({
        method: 'POST',
        url: 'api/users/forget_password/',
        data: body,
    }).then((res) => {
        return res;
    });
};
export const checkCode = async (price, voucher_code) => {
    const body = {
        price: price,
        voucher_code: voucher_code,
    };
    return await API({
        method: 'POST',
        url: 'api/vouchers/voucher_validity/',
        data: body,
    }).then((res) => {
        return res;
    });
};

export const resetPassword = async (phone, otp, password) => {
    const body = {
        phone: phone,
        otp: otp,
        password: password,
    };
    return await API({
        method: 'PUT',
        url: 'api/users/confirm_forget_password/',
        data: body,
    }).then((res) => {
        return res;
    });
};
export const initiatePayment = async (total) => {
    const body = {
        total: total,
    };
    return await API({
        method: 'POST',
        url: 'api/payments/initiate/',
        data: body,
    }).then((res) => {
        return res;
    });
};
export const updatePayment = async (
    id,
    status,
    payment_response_id,
    payment_mode,
) => {
    const body = {
        status: status,
        txnid: payment_response_id,
        payment_mode: payment_mode,
    };
    return await API({
        method: 'PUT',
        url: `api/payments/${id}/status_update/`,
        data: body,
    }).then((res) => {
        return res;
    });
};

export const createOrder = async (payment_id, payment_status, price, address_id, voucher, voucher_price) => {
    const body = {
        payment_id,
        payment_status,
        price,
        address_id,
        voucher,
        voucher_price,
    };
    return await API({
        method: 'POST',
        url: 'api/carts/checkout/',
        data: body,
    }).then((res) => {
        return res;
    });
};

export const getBasket = async () => {
    return await API({
        method: 'GET',
        url: `api/carts/list/`,
    }).then((res) => {
        return res;
    });
};

export const AddtoCart = async (data) => {
    return await API({
        method: 'POST',
        url: 'api/carts/create_update/',
        data: data,
    }).then((res) => {
        return res;
    });
};

export const CARTADDREMOVEQUANTITY = async (basketID, lineID, cartdata) => {
    return await API({
        method: 'PATCH',
        url: `api/baskets/${basketID}/lines/${lineID}/`,
        data: cartdata,
    }).then((res) => {
        return res;
    });
};

export const getAdvertisementBanners = async () => {
    return await API({
        method: 'GET',
        url: 'api/config/promotion_images/?page_size=4&page=1',
    }).then((res) => {
        return res;
    });
};

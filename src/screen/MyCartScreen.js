import React, {Component} from 'react';

import {FlatList, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import AppStatusBar from '../components/AppStatusBar';
import {Color, Dimension, Fonts} from '../theme';
import ToolBar from '../components/ToolBar';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {getCart, getUserDetails, setCart} from '../utils/LocalStorage';
import Cart from '../utils/Cart';
import CartItem from '../components/CartItem';
import EmptyCart from '../assets/images/emptycart.png';
import LoadingButton from '../components/LoadingButton';
import {cartquantityaddremove, getCartByUser, postCart} from '../redux/actions/cartAction';
import {connect} from 'react-redux';
import Loading from '../components/Loading';

class MyCartScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartCount: 0,
            cartList: [],
            totalPrice: '',
            user: null,
            isLogin: true,
            isGetCart: false,
            currency: '',
        };
    }

    async componentDidMount() {
        this.reRenderSomething = this.props.navigation.addListener('focus', () => {
            this.init();
        });
    }

    init = async () => {
        await this.getCartQuantity();
    };

    getCartQuantity = async () => {
        let cart = await getCart();
        let totalPrice = cart.reduce((accum, item) => accum + item.subTotal, 0);

        this.setState({
            cartCount: Cart.getTotalCartCount(cart),
            cartList: cart,
            totalPrice: totalPrice,
        });
    };

    addToCart = async (params) => {
        let cart = await getCart();
        let cartListData = cart !== null ? cart : [];
        let itemIndex = Cart.isProductExist(cartListData, params);
        if (itemIndex === -1) {
            cartListData.push(params);
        } else {
            if (params.count > 0) {
                cartListData[itemIndex] = params;
            } else {
                cartListData = cartListData.filter(item => item.id !== params.id);
            }
        }
        console.log(cartListData);
        let totalCount = Cart.getTotalCartCount(cartListData);
        let totalPrice = cartListData.reduce(
            (accum, item) => accum + item.subTotal,
            0,
        );
        this.setState({
            cartCount: totalCount,
            cartList: cartListData,
            totalPrice: totalPrice,
        });
        setCart(cartListData);
    };

    isLogin = (params) => {
        if (!params) {
            this.props.navigation.navigate('Login');
        }
    };

    navigateToScreen = item => {
        this.props.navigation.navigate('ProductView', {
            screen: 'ProductView',
            params: {item: item},
        });
    };

    renderCartItem = (item) => {
        let count = Cart.getItemCount(this.state.cartList, item);
        return (
            <CartItem
                item={item.item}
                addToCart={this.addToCart}
                count={count}
                onPress={() => this.navigateToScreen(item.item)}
            />
        );
    };

    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                <AppStatusBar
                    backgroundColor={Color.colorPrimaryDark}
                    barStyle="light-content"
                />
                <ToolBar
                    title="My Cart"
                    icon="menu"
                    onPress={() => navigation.openDrawer()}
                />
                <View style={styles.toolBarDown}/>
                <View style={styles.box1}>
                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <FlatList
                            key={'flatList'}
                            data={this.state.cartList}
                            renderItem={({item, index}) => this.renderCartItem(item, index)}
                            keyExtractor={(item) => item.id}
                            extraData={this.state}
                            contentContainerStyle={{paddingBottom: 250}}
                            showsVerticalScrollIndicator={false}
                        />
                    </ScrollView>
                </View>
                {this.state.cartCount > 0
                    ?
                    (<View style={styles.box2}>
                        <View style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            borderColor: Color.borderColor,
                        }}>
                            <Text style={[styles.total_price, {color: Color.black, fontWeight: '300'}]}>
                                Your Order
                            </Text>
                            <Text style={styles.total_price}>
                                {this.state.currency} {this.state.totalPrice}
                            </Text>
                        </View>
                        <View style={{width: '100%'}}>
                            <TouchableOpacity
                                style={styles.checkout_container}
                                onPress={() => {
                                    this.props.navigation.navigate('ProductView', {
                                        screen: 'Checkout',
                                    });
                                }}>
                                <Text style={styles.checkout}>Checkout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>)
                    :
                    (<View style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 250,
                    }}>
                        <View style={styles.imgContainerStyle}>
                            <Image style={styles.imageStyle} source={EmptyCart}/>
                        </View>
                        <Text style={styles.title}>Empty Cart</Text>
                        <LoadingButton
                            style={{backgroundColor: Color.colorPrimaryDark}}
                            title="Shop Now"
                            onPress={() => {
                                this.props.navigation.navigate('Category');
                            }}
                        />
                    </View>)
                }
                <Loading ref="loading" indicatorColor={Color.colorPrimary}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Color.white,
    },
    toolBarDown: {
        height: 20,
        backgroundColor: Color.colorPrimaryDark,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
        top: 0,
    },
    box1: {
        display: 'flex',
        flexDirection: 'column',
    },
    box2: {
        width: Dimension.window.width,
        height: 100,
        position: 'absolute',
        flexDirection: 'column',
        backgroundColor: Color.white,
        display: 'flex',
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        bottom: 0,
    },
    scrollView: {
        backgroundColor: Color.white,
        flexDirection: 'column',
        display: 'flex',
    },
    total_price: {
        height: 50,
        paddingTop: 10,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        backgroundColor: Color.white,
        color: Color.colorPrimary,
    },
    checkout_container: {
        textAlign: 'center',
        height: 50,
        backgroundColor: Color.colorPrimary,
        color: Color.white,
        borderRadius: 7,
        bottom: 10,
    },
    checkout: {
        width: '100%',
        paddingTop: 10,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        color: Color.white,
    },
    imgContainerStyle: {
        height: 250,
        width: 250,
    },
    imageStyle: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        alignItems: 'center',
        resizeMode: 'center',
    },
    title: {
        color: Color.textColor,
        fontFamily: Fonts.primarySemiBold,
        fontSize: 20,
        marginBottom: 20,
    },
    btnStyle: {
        padding: 10,
        backgroundColor: Color.colorPrimaryDark,
        borderRadius: 20,
        margin: 20,
        fontSize: 16,
    },
});

export default MyCartScreen;

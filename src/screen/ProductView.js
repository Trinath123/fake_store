import React, {Component} from 'react';
import {Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View} from 'react-native';
import AppStatusBar from '../components/AppStatusBar';
import {Color, Fonts} from '../theme';
import ToolBar from '../components/ToolBar';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Loading from '../components/Loading';
import Icon from 'react-native-vector-icons/FontAwesome';
import BadgeIcon from '../components/BadgeIcon';
import Cart from '../utils/Cart';
import {favoriteProduct, getPin, getProductDetails} from '../axios/ServerRequest';
import {getCart, getUserDetails, setCart} from '../utils/LocalStorage';
import Dimension from '../theme/Dimension';

const {width, height} = Dimension.window;

class ProductView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartCount: 0,
            productItem: null,
            count: 0,
            cart: null,
            itemIndex: -1,
            token: '',
            liked: false,
            user: null,
            isLogin: false,
            pinData: [],
            result: false,
            message: '',
            pin: '',
            pinError: false,
            pinErrorMessage: '',
            isError: false,
        };
    }

    async componentDidMount() {
        let user = await getUserDetails();
        if (user !== undefined && user !== null && user !== '') {
            this.setState({user: user, isLogin: true});
        } else {
            this.setState({user: null, isLogin: false});
        }
        let item = null;
        if (this.props.route.params !== undefined) {
            item = this.props.route.params.item;
            if (item !== null) {
                this.setState({productItem: item});
                this.getCartQuantity(item);
            }
        }
        this.fetchPin();
    }

    getCartQuantity = async (item) => {
        let cart = await getCart();
        let cartCount = Cart.getTotalCartCount(cart);
        let productIndex = Cart.isProductExist(cart, item);
        let count = Cart.getItemCount(cart, item);
        this.setState({
            cartCount: cartCount,
            itemIndex: productIndex,
            cart: cart,
            count: count,
        });
    };

    fetchPin = () => {
        getPin().then((response) => {
            this.setState({pinData: response.data});
        }).catch((error) => {
            console.log(error);
            this.refs.loading.close();
        });
    };

    fetchCart = async (item) => {
        let cart = await getCart();
        let cartCount = Cart.getTotalCartCount(cart);
        let productIndex = Cart.isProductExist(cart, item);
        let count = Cart.getItemCount(cart, item);
        this.setState({
            cartCount: cartCount,
            itemIndex: productIndex,
            cart: cart,
            count: count,
        });
    };

    addToFavorite = (item) => {
        this.setState({liked: !this.state.liked});
    };

    setToCart = (item, id, value, price) => {
        let cart = {
            count: value,
            id: id,
            item: item,
            subTotal: parseFloat(price) * value,
        };
        this.addToCart(cart);
    };

    addToCart = async (params) => {
        const {cart, itemIndex} = this.state;
        let cartListData = cart !== null ? cart : [];

        if (itemIndex === -1) {
            cartListData.push(params);
        } else {
            if (params.count > 0) {
                cartListData[itemIndex] = params;
            } else {
                cartListData = cartListData.filter(item => item.id !== params.id);
            }
        }
        let totalCount = Cart.getTotalCartCount(cartListData);
        this.setState({
            cartCount: totalCount,
            cart: cartListData,
        });
        setCart(cartListData);
    };

    render() {
        const {navigation} = this.props;
        const {productItem, count} = this.state;
        return (
            <View style={styles.mainContainer}>
                <AppStatusBar
                    backgroundColor={Color.colorPrimary}
                    barStyle="light-content"
                />
                <ToolBar
                    title="ProductView"
                    icon="arrow-left"
                    onPress={() => navigation.goBack()}>
                    <BadgeIcon
                        icon="shopping-cart"
                        count={this.state.cartCount}
                        onPress={() => navigation.navigate('MyCart')}
                    />
                </ToolBar>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    {productItem !== undefined && productItem !== null
                        ?
                        (<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                            <View style={styles.imageContainer}>
                                <Image
                                    style={styles.productImage}
                                    source={{uri: productItem.image !== null ? productItem.image : null}}
                                />
                            </View>
                            <View style={styles.contentContainer}>
                                <View style={{
                                    marginTop: 2,
                                    marginBottom: 5,
                                    justifyContent: 'flex-start',
                                    paddingLeft: 20,
                                }}>
                                    <Text style={[styles.title, {fontSize: 22, fontWeight: '800'}]}>
                                        {productItem.title}
                                    </Text>
                                </View>
                                <View style={styles.price_option}>
                                    <Text style={styles.option}>
                                        {'₹ ' + productItem.price}
                                    </Text>
                                </View>
                                <View style={{
                                    marginTop: 2,
                                    marginBottom: 5,
                                    justifyContent: 'flex-start',
                                    paddingLeft: 20,
                                }}>
                                    <Text style={[styles.description, {fontSize: 20, fontWeight: '600'}]}>
                                        Product Description
                                    </Text>
                                </View>
                                <View style={{
                                    marginTop: 2,
                                    marginBottom: 5,
                                    justifyContent: 'flex-start',
                                    paddingLeft: 20,
                                }}>
                                    <Text style={styles.description}>{productItem.description}</Text>
                                </View>
                                <View>
                                    <View style={{
                                        marginTop: 2,
                                        marginBottom: 5,
                                        justifyContent: 'flex-start',
                                        paddingLeft: 20,
                                    }}>
                                        {this.state.result
                                            ?
                                            <Text style={this.state.isError
                                                ?
                                                {color: Color.red, fontSize: 16} : {
                                                    color: Color.seagreen,
                                                    fontSize: 16,
                                                }}>
                                                {this.state.message}
                                            </Text>
                                            :
                                            null
                                        }
                                    </View>
                                </View>
                            </View>
                        </ScrollView>)
                        :
                        null
                    }
                </KeyboardAvoidingView>
                <View style={styles.box2}>
                    <View style={{
                        width: '20%',
                        backgroundColor: Color.wishListBack,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        borderRadius: 7,
                        bottom: 5,
                    }}>
                        {this.state.liked
                            ?
                            <TouchableOpacity
                                activeOpacity={1} onPress={() => this.addToFavorite(productItem)}>
                                <Icon name="heart" size={24} color={Color.colorPrimary} style={{
                                    padding: 10,
                                    fontSize: 20,
                                }}/>
                            </TouchableOpacity>
                            :
                            (<TouchableOpacity
                                activeOpacity={1}
                                onPress={() => this.addToFavorite(productItem)}>
                                <Icon name="heart-o" size={24} color={Color.white} style={{
                                    padding: 10,
                                    fontSize: 20,
                                }}/>
                            </TouchableOpacity>)
                        }
                    </View>
                    <View style={{width: '75%'}}>
                        {productItem !== undefined && productItem !== null
                            ?
                            count > 0
                                ?
                                (<View style={styles.addToCart}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('MyCart')}>
                                        <Text style={styles.addToCartText}>Go To Cart</Text>
                                    </TouchableOpacity>
                                </View>)
                                :
                                (<View style={styles.addToCart}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => this.setToCart(
                                            productItem,
                                            productItem.id,
                                            count + 1,
                                            productItem.price,
                                        )}>
                                        <Text style={styles.addToCartText}>ADD TO
                                            CART{'₹' + productItem.price}</Text>
                                    </TouchableOpacity>
                                </View>)
                            :
                            null
                        }
                    </View>
                </View>
                <Loading ref="loading" indicatorColor={Color.colorPrimary}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Color.searchBackGroundColor,
        flexDirection: 'column',
    },
    scrollView: {
        flex: 1,
        flexDirection: 'column',
    },
    container: {
        flex: 1,
        zIndex: 99999999,
    },
    imageContainer: {
        display: 'flex',
        height: 300,
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.searchBackGroundColor,
    },
    productImage: {
        height: 200,
        width: 200,
    },
    box2: {
        width: Dimension.window.width,
        maxHeight: 50,
        backgroundColor: Color.white,
        bottom: 0,
        flexDirection: 'row',
        display: 'flex',
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'space-between',
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
    },
    checkout: {
        width: '100%',
        paddingTop: 10,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        color: Color.white,
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 10,
        backgroundColor: Color.white,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        flex: 0.7,
        minHeight: height - 300,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    rating: {
        flexDirection: 'row',
        borderRadius: 5,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: Color.colorPrimary,
    },
    title: {
        color: Color.gray,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: '600',
        marginTop: 20,
        fontFamily: Fonts.primarySemiBold,
        fontSize: 16,
    },
    description: {
        fontFamily: Fonts.primaryRegular,
        fontSize: 14,
        color: Color.gray,
    },
    counter: {
        fontFamily: Fonts.primarySemiBold,
        fontSize: 16,
        color: Color.black,
        textAlign: 'center',
        width: 30,
    },
    option: {
        fontFamily: Fonts.primarySemiBold,
        fontSize: 16,
        color: Color.sandybrown,
        textAlign: 'center',
    },
    discount_price: {
        fontFamily: Fonts.primaryLight,
        fontSize: 14,
        color: Color.grayLight,
        textAlign: 'center',
        marginLeft: 15,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
    },
    addToCartText: {
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 20,
        fontFamily: Fonts.primaryBold,
        color: Color.white,
    },
    plusBtn: {
        padding: 10,
    },
    addToCart: {
        position: 'absolute',
        zIndex: 999999999999,
        bottom: 10,
        width: '100%',
        backgroundColor: Color.colorPrimary,
        color: Color.white,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 7,
    },
    quantity: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: Color.white,
        color: Color.white,
        textAlign: 'center',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 33,
        width: 100,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        marginTop: 20,
    },
    price_option: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 20,
        paddingTop: 10,
    },
    checkPin: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        height: 60,
        paddingRight: 20,
        paddingLeft: 20,
    },
});

export default ProductView;

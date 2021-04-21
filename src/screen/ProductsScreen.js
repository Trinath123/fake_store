import React, {Component} from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import AppStatusBar from '../components/AppStatusBar';
import {Color, Fonts, Strings} from '../theme';
import ToolBar from '../components/ToolBar';
import BadgeIcon from '../components/BadgeIcon';
import {getAllProducts, searchProduct} from '../axios/ServerRequest';
import {getCart, setCart} from '../utils/LocalStorage';
import Cart from '../utils/Cart';
import Loading from '../components/Loading';
import EmptyProduct from '../assets/images/emptyproduct.png';
import {connect} from 'react-redux';
import SearchInput from '../components/UserInput/SearchInput';
import ProductGrid from '../components/ProductItem/ProductGrid';

class ProductsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryData: [],
            products: [],
            selected: false,
            cartCount: 0,
            cartList: [],
            category: null,
            page: 1,
            pageCount: 10,
            lastVisible: null,
            refreshing: false,
            loadMore: true,
            user: null,
            isLogin: true,
            isGetCart: false,
            categoryId: null,
            categoryName: '',
            totalItems: 0,
            searchText: '',
        };
    }

    async componentDidMount() {
        await this.init();
    }

    init = async () => {
        this.fetchProductsList(this.props.route.params.item);
        this.setState({categoryId: this.props.route.params.item, categoryName: this.props.route.params.item});
        let cart = await getCart();
        this.setState({
            cartList: await getCart(),
            cartCount: Cart.getTotalCartCount(cart),
            category: this.props.route.params.item,
        });
    };

    fetchProductsList = id => {
        this.setState({refreshing: true});
        if (this.state.loadMore) {
            this.refs.loading.show();
            getAllProducts(id)
                .then(response => {
                    console.log(response.data);
                    if (response.data.length < this.state.pageCount) {
                        this.setState({loadMore: false});
                    }
                    this.setState({totalItems: response.data.length});
                    let lastVisible = response.data[response.data.length - 1].id;
                    if (this.state.products.length >= this.state.pageCount) {
                        this.setState({
                            products: [...this.state.products, ...response.data],
                            lastVisible: lastVisible, page: this.state.page + 1,
                            refreshing: false,
                        });
                    } else {
                        this.setState({
                            products: response.data,
                            lastVisible: lastVisible, page: this.state.page + 1,
                            refreshing: false,
                        });
                    }
                    this.refs.loading.close();
                }).catch(error => {
                this.refs.loading.close();
            });
        }
    };

    retrieveMore = () => {
        if (this.state.loadMore) {
            this.fetchProductsList(this.state.categoryId);
        }
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
        this.setState({
            cartCount: totalCount,
            cartList: cartListData,
            selected: !this.state.selected,
        });
        setCart(cartListData);
    };

    isLogin = (params) => {
        if (!params) {
            this.props.navigation.navigate('Login');
        }
    };

    resetData = () => {
        this.setState({popularProduct: this.state.popularProduct});
    };

    navigateToScreen = item => {
        this.props.navigation.navigate('ProductView', {item: item});
    };

    renderProductItem = (item) => {
        let cart = Cart.getItemCount(this.state.cartList, item);
        return (
            <ProductGrid
                item={item}
                addToCart={this.addToCart}
                count={cart}
                onPress={() => this.navigateToScreen(item)}
            />
        );
    };

    onchangeSearchText = (text) => {
        this.setState({searchText: text});
        searchProduct(text)
            .then((response) => {
                this.setState({searchData: response.data.results});
            }).catch((error) => {
            console.log(error);
        });
    };

    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.mainContainer}>
                <AppStatusBar backgroundColor={Color.colorPrimaryDark} barStyle="light-content"/>
                <ToolBar
                    title={''}
                    icon="arrow-left"
                    onPress={() => navigation.goBack()}>
                    <BadgeIcon
                        icon="shopping-cart"
                        count={this.state.cartCount}
                        onPress={() => navigation.navigate('MyCart')}
                    />
                </ToolBar>
                <View style={styles.toolBarDown}>
                    <Text numberOfLines={1} style={styles.headingTitle}>{this.state.categoryName}{' Categories'}</Text>
                    <Text style={styles.headingCount}>{this.state.totalItems}{' Items'}</Text>
                </View>
                <View style={styles.searchContainer}>
                    <SearchInput
                        keyboardType="numeric"
                        placeholder={Strings.searchHint}
                        error={this.state.mobileError}
                        value={this.state.searchText}
                        errorMessage={this.state.mobileErrorMessage}
                        onChangeText={(text) => this.onchangeSearchText(text)}
                    />
                </View>
                <View style={{paddingLeft: 10, paddingRight: 10, marginBottom: 100}}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        key={'flatList1'}
                        data={this.state.products}
                        renderItem={({item, index}) => this.renderProductItem(item, index)}
                        keyExtractor={item => item.id}
                        extraData={this.state}
                        onEndReached={this.retrieveMore}
                        contentInset={{bottom: 150}}
                        contentContainerStyle={{paddingBottom: 150}}
                        // How Close To The End Of List Until Next Data Request Is Made
                        onEndReachedThreshold={0.01}
                        numColumns={2}
                        // Refreshing (Set To True When End Reached)
                        refreshing={this.state.refreshing}
                    />
                    {this.state.products.length === 0
                        ?
                        (<View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                            <View style={styles.imgContainerStyle}>
                                <Image style={styles.imageStyle} source={EmptyProduct}/>
                            </View>
                            <Text style={styles.title}>Empty Product</Text>
                        </View>)
                        :
                        null
                    }
                </View>
                <Loading ref="loading" indicatorColor={Color.colorPrimary}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Color.white,
        flexDirection: 'column',
    },
    scrollView: {
        flex: 1,
        backgroundColor: Color.white,
        flexDirection: 'column',
    },
    toolBarDown: {
        height: 70,
        backgroundColor: Color.colorPrimaryDark,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
        top: 0,
    },
    headingTitle: {
        fontSize: 22,
        fontFamily: Fonts.primaryBold,
        color: Color.white,
        paddingLeft: 20,
    },
    headingCount: {
        fontSize: 16,
        fontFamily: Fonts.primaryBold,
        color: Color.white,
        paddingLeft: 24,
        paddingBottom: 10,
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
        color: Color.gray,
        fontFamily: Fonts.primarySemiBold,
        fontSize: 20,
        marginBottom: 10,
    },
    searchContainer: {
        paddingTop: 10,
        paddingBottom: 5,
        paddingLeft: 20,
        paddingRight: 20,
    },
});


export default ProductsScreen;

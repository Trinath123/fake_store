import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, FlatList} from 'react-native';
import AppStatusBar from '../components/AppStatusBar';
import {Color, Fonts, Strings, Dimension} from '../theme';
import ToolBar from '../components/ToolBar';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {getCart} from '../utils/LocalStorage';
import BadgeIcon from '../components/BadgeIcon';
import Cart from '../utils/Cart';
import Loading from '../components/Loading';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {getAllCategory} from '../axios/ServerRequest';

class CategoryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartCount: 0,
            category: [],
            page: 1,
            pageCount: 10,
            lastVisible: null,
            refreshing: false,
            loadMore: true,
        };
    }

    async componentDidMount() {
        await this.init();
    }

    init = async () => {
        let cart = await getCart();
        this.fetchCategory();
        this.setState({cartCount: Cart.getTotalCartCount(cart)});
    };

    fetchCategory = () => {
        this.setState({refreshing: true});
        if (this.state.loadMore) {
            this.refs.loading.show();
            getAllCategory()
                .then(response => {
                    console.log(response.data);
                    let lastVisible = response.data[response.data.length - 1];
                    if (response.data.length < this.state.pageCount) {
                        this.setState({loadMore: false});
                    }
                    if (this.state.category.length >= this.state.pageCount) {
                        this.setState({
                            category: [...this.state.category, ...response.data],
                            lastVisible: lastVisible, page: this.state.page + 1,
                            refreshing: false,
                        });
                    } else {
                        this.setState({
                            category: response.data,
                            lastVisible: lastVisible, page: this.state.page + 1,
                            refreshing: false,
                        });
                    }
                    this.refs.loading.close();
                }).catch(error => {
                console.log(error);
                this.refs.loading.close();
            });
        }
    };

    retrieveMore = () => {
        if (this.state.loadMore) {
            this.fetchCategory();
        }
    };

    getImage = (item) => {
        let imageValue = '';
        switch (item) {
            case 'electronics' :
                return (
                    <Image
                        source={require('../assets/images/electronic_products.jpg')}
                        style={{height: 75, width: 75}}
                    />
                );
            case 'jewelery':
                return (
                    <Image
                        source={require('../assets/images/sathiya-10-pc-complete-jewellery-dulhan-set-complete-10-items-bridal-set-jewelry-sathiya-jewellers_600x600.jpg')}
                        style={{height: 75, width: 75}}
                    />
                );
            case 'men\'s clothing' :
                return (
                    <Image
                        source={require('../assets/images/istockphoto-887360960-612x612.jpg')}
                        style={{height: 75, width: 75}}
                    />
                );
            case 'women\'s clothing' :
                return (
                    <Image
                        source={require('../assets/images/istockphoto-935032524-612x612.jpg')}
                        style={{height: 75, width: 75}}
                    />
                );
        }
        return imageValue;
    };

    renderCategoryItem = (item, index) => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    this.props.navigation.navigate('ProductView', {
                        screen: 'Products',
                        params: {item: item},
                    });
                }}>
                <View style={styles.categoryItem}>
                    <View style={{flex: 0.2, marginLeft: 15}}>
                        <Text>{this.getImage(item)}</Text>
                    </View>
                    <View style={{flex: 0.6}}>
                        <Text style={[styles.title, {marginLeft: 30}]}>{item}</Text>
                    </View>
                    <View style={{flex: 0.2, alignSelf: 'center', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                        <Icon
                            name="angle-right"
                            size={18}
                            color={Color.colorPrimary}
                            style={{marginRight: 10}}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.mainContainer}>
                <AppStatusBar backgroundColor={Color.colorPrimaryDark} barStyle="light-content"/>
                <ToolBar
                    title="Category"
                    icon="menu"
                    onPress={() => navigation.openDrawer()}>
                    <BadgeIcon
                        icon="shopping-cart"
                        count={this.state.cartCount}
                        onPress={() => navigation.navigate('MyCart')}
                    />
                </ToolBar>
                <FlatList
                    data={this.state.category}
                    renderItem={({item, index}) => this.renderCategoryItem(item, index)}
                    keyExtractor={item => item}
                    onEndReached={this.retrieveMore}
                    // How Close To The End Of List Until Next Data Request Is Made
                    onEndReachedThreshold={0.01}
                    // Refreshing (Set To True When End Reached)
                    refreshing={this.state.refreshing}
                />
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
        padding: 20,
    },
    categoryItem: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 0.5,
        borderColor: Color.borderColor,
    },
    title: {
        fontFamily: Fonts.primarySemiBold,
        fontSize: 16,
    },
});
export default CategoryScreen;

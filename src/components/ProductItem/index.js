import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import {Color, Fonts, Strings, Dimension} from '../../theme';
import {favoriteProduct} from '../../axios/ServerRequest';

import Icon from 'react-native-vector-icons/FontAwesome';
import {TouchableOpacity} from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import {getUserDetails} from '../../utils/LocalStorage';

class ProductItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.item,
            count: this.props.count ? this.props.count : 0,
            cart: null,
            liked: this.props.item.user_is_favorite,
            user: null,
            isLogin: false,
        };
    }

    async componentDidMount() {
        let user = await getUserDetails();
        if (user !== undefined && user !== null && user !== '') {
            this.setState({user: user, isLogin: true});
        } else {
            this.setState({user: null, isLogin: false});
        }
    }

    addToFavorite = (item) => {
        if (this.state.isLogin) {
            this.setState({liked: !this.state.liked});
            favoriteProduct(item.id)
                .then(response => {
                }).catch(error => {
                console.log(error);
            });
        } else {
            this.props.isLogin(this.state.isLogin);
        }
    };

    setCart = (item, id, value, price) => {
        if (this.state.isLogin) {
            let cart = {
                count: value,
                id: id,
                item: item,
                subTotal: parseFloat(price) * value,
            };
            this.setState(
                {
                    cart: cart,
                },
                () => {
                    this.props.addToCart(this.state.cart);
                },
            );
        } else {
            this.props.isLogin(this.state.isLogin);
        }
    };

    onItemClicked = item => {
        this.props.navi;
    };

    render() {
        const {item, count} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.box1}>
                    <View style={styles.innerContainer}>
                        <TouchableOpacity activeOpacity={1} onPress={this.props.onPress}>
                            <Image
                                style={styles.productImage}
                                source={{uri: item.images[0].image}}
                            />
                            <Text numberOfLines={1} style={styles.title}>{item.name}</Text>
                            <View style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                                paddingLeft: 20,
                            }}>
                                <View style={styles.rating}>
                                    <Text style={{
                                        color: Color.white,
                                        fontSize: 12,
                                        fontWeight: '700',
                                    }}>
                                        {item.review.total_rating}{' '}
                                    </Text>
                                    <Icon
                                        name="star"
                                        size={12}
                                        color={Color.white}
                                        style={{alignSelf: 'center'}}
                                    />
                                </View>
                                <View style={{flex: 0.7, alignSelf: 'center'}}>
                                    <Text style={{fontSize: 14}}>{'  '}({item.review.no_rating})</Text>
                                </View>
                            </View>
                            <View style={styles.price_option}>
                                <Text style={styles.option}>
                                    {item.weight_value + ' ' + item.weight.weight + ' - ' + item.currency_type + item.price}
                                </Text>
                                {item.price < item.mrp
                                    ? (<Text style={styles.discount_price}>{item.mrp}</Text>)
                                    :
                                    null
                                }
                            </View>
                        </TouchableOpacity>
                    </View>
                    {count > 0
                        ?
                        (<View style={styles.quantity}>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.plusBtn}
                                onPress={() => {
                                    this.setState({count: this.state.count - 1});
                                    this.setCart(item, item.id, this.state.count - 1, item.price);
                                }}>
                                <Icon name="minus" size={20} color={Color.red}/>
                            </TouchableOpacity>
                            <Text style={styles.counter}>{count}</Text>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.plusBtn}
                                onPress={() => {
                                    this.setState({
                                        count: this.state.count + 1,
                                    });
                                    this.setCart(item, item.id, this.state.count + 1, item.price);
                                }}>
                                <Icon name="plus" size={18} color={Color.colorPrimary}/>
                            </TouchableOpacity>
                        </View>)
                        :
                        (<View style={styles.addToCart}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {
                                    this.setState({count: this.state.count + 1});
                                    this.setCart(item, item.id, this.state.count + 1, item.price);
                                }}>
                                <Text style={styles.addToCartText}>Add To Cart</Text>
                            </TouchableOpacity>
                        </View>)
                    }
                </View>
                <View style={styles.box2}>
                    <TouchableOpacity activeOpacity={1} style={styles.favoriteContainer}
                                      onPress={() => this.addToFavorite(item)}>
                        {this.state.liked
                            ?
                            (<Icon name="heart" size={20} color={Color.colorPrimary}/>)
                            :
                            (<Icon name="heart-o" size={20} color={Color.colorPrimary}/>)
                        }
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

ProductItem.propTypes = {
    addToCart: PropTypes.func,
    item: PropTypes.object,
    count: PropTypes.number,
    isLogin: PropTypes.func,
};

const styles = StyleSheet.create({
    container: {
        height: 220,
        width: 180,
        backgroundColor: Color.white,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderRadius: 10,
        elevation: 2,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
    },
    rating: {
        flexDirection: 'row',
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: Color.colorPrimary,
        display: 'flex',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box1: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    title: {
        fontFamily: Fonts.primaryRegular,
        fontSize: 14,
        color: Color.black,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        textAlign: 'center',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
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
        fontSize: 14,
        color: Color.red,
        textAlign: 'center',
        marginLeft: 10,
        marginRight: 1,
        marginTop: 3,
    },
    discount_price: {
        fontFamily: Fonts.primarySemiBold,
        fontSize: 12,
        color: Color.black,
        textAlign: 'center',
        marginLeft: 5,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
    },
    productImage: {
        height: 100,
        width: 100,
        marginLeft: 5,
        marginRight: 5,
    },
    addToCart: {
        backgroundColor: Color.colorPrimary,
        color: Color.white,
        textAlign: 'center',
        borderRadius: 5,
        marginBottom: 8,
    },
    quantity: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: Color.white,
        color: Color.white,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        paddingLeft: 10,
        paddingRight: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        marginBottom: 8,
    },
    addToCartText: {
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 15,
        paddingRight: 15,
        color: Color.white,
    },
    box2: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 30,
        height: 30,
    },
    plusBtn: {
        padding: 10,
    },
    price_option: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
});
export default ProductItem;

import React, {Component} from 'react';
import {getUserDetails} from '../../utils/LocalStorage';
import {favoriteProduct} from '../../axios/ServerRequest';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import PropTypes from 'prop-types';
import ProductItem from './ProductRow';
import {Color, Dimension, Fonts} from '../../theme';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import NotFound from '../../assets/images/notfound.png';
import IconPlus from 'react-native-vector-icons/AntDesign';

class ProductGrid extends Component {
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
            this.setState({user: user});
        } else {
            this.setState({user: null});
        }
    }

    addToFavorite = (item) => {
        this.setState({liked: !this.state.liked});
        favoriteProduct(item.id)
            .then(response => {

            }).catch(error => {
            console.log(error);
        });
    };

    setCart = (item, id, value, price) => {
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
    };

    render() {
        const {item, count} = this.props;
        return (
            <View center shadow style={styles.container}>
                <View row style={styles.cardContainer}>
                    <View center shadow style={styles.cardBodyStyle}>
                        <TouchableOpacity
                            style={styles.imageContainer}
                            activeOpacity={1}
                            onPress={this.props.onPress}>
                            {item.image !== undefined && item.image !== null
                                ?
                                <Image
                                    style={styles.productImage}
                                    source={{uri: item.image}}
                                />
                                :
                                <Image
                                    style={styles.productImage}
                                    source={NotFound}
                                />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={1} style={{justifyContent: 'center', alignItems: 'center', paddingTop: 10}}
                            onPress={() => this.props.onPress}>
                            <View style={{
                                paddingLeft: 5,
                                paddingRight: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                            }}>
                                <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
                            </View>
                            <View style={styles.price_option}>
                                <Text style={styles.option}>
                                    {'₹' + item.price}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.addCartContainer}>
                            {count > 0
                                ?
                                (<View style={styles.totalItem}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.plusBtn}
                                        onPress={() => {
                                            this.setState({count: this.state.count - 1});
                                            this.setCart(
                                                item,
                                                item.id,
                                                this.state.count - 1,
                                                item.price,
                                            );
                                        }}>
                                        <IconPlus name="minus" size={20} color={Color.white}
                                                  style={styles.iconAddStyle}/>
                                    </TouchableOpacity>
                                    <Text style={styles.counter}>{count}</Text>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.plusBtn}
                                        onPress={() => {
                                            this.setState({count: this.state.count + 1});
                                            this.setCart(
                                                item,
                                                item.id,
                                                this.state.count + 1,
                                                item.price,
                                            );
                                        }}>
                                        <IconPlus name="plus" size={20} color={Color.white}
                                                  style={styles.iconAddStyle}/>
                                    </TouchableOpacity>
                                </View>)
                                :
                                (<View style={styles.addToCartButton}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={{justifyContent: 'space-between', alignSelf: 'center'}}
                                        onPress={() => {
                                            this.setState({count: this.state.count + 1});
                                            this.setCart(
                                                item,
                                                item.id,
                                                this.state.count + 1,
                                                item.price,
                                            );
                                        }}>
                                        <Text style={styles.addToCartText}>ADD
                                            <View>
                                                <IconPlus
                                                    name={'plus'}
                                                    size={18}
                                                    color={Color.white}
                                                    style={styles.iconStyle}
                                                />
                                            </View>
                                        </Text>
                                    </TouchableOpacity>
                                </View>)
                            }
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

ProductItem.propTypes = {
    addToCart: PropTypes.func,
    item: PropTypes.object,
    count: PropTypes.number,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        height: 270,
    },
    cardContainer: {
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        paddingVertical: 15,
        flex: 1,
    },
    cardBodyStyle: {
        width: '100%',
        height: 200,
        backgroundColor: Color.searchBackGroundColor,
        flex: 1,
        borderRadius: 5,
        flexDirection: 'column',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    addCartContainer: {
        height: 40,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addToCartButton: {
        backgroundColor: Color.colorPrimary,
        borderRadius: 5,
        width: 80,
        marginTop: 5,
        marginLeft: 10,
        marginBottom: 10,
    },
    addToCartText: {
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 10,
        paddingRight: 10,
        color: Color.white,
        fontSize: 16,
        fontFamily: Fonts.primaryBold,
    },
    iconStyle: {
        borderRadius: 50,
        top: 3,
        left: 3,
        fontWeight: '800',
        fontFamily: Fonts.primaryBold,
    },
    iconAddStyle: {
        borderRadius: 50,
        fontWeight: '800',
        fontFamily: Fonts.primaryBold,
    },
    totalItem: {
        display: 'flex',
        flexDirection: 'row',
        paddingRight: 5,
        paddingLeft: 5,
        backgroundColor: Color.colorPrimary,
        color: Color.white,
        textAlign: 'center',
        borderRadius: 5,
        marginTop: 5,
        marginLeft: 10,
        marginBottom: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 30,
        width: 90,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    imageContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        maxWidth: 165,
    },
    productImage: {
        height: 140,
        width: '98%',
    },
    title: {
        fontFamily: Fonts.primaryBold,
        fontSize: 16,
        color: Color.gray,
        fontWeight: '900',
    },
    rating: {
        flexDirection: 'row',
        flex: 0.25,
        height: 20,
        width: 50,
        marginLeft: 10,
        borderRadius: 7,
        backgroundColor: Color.colorPrimary,
        display: 'flex',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 6,
        paddingRight: 6,
    },
    price_option: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },
    option: {
        fontFamily: Fonts.primarySemiBold,
        fontSize: 14,
        color: Color.red,
        textAlign: 'center',
        marginLeft: 10,
        marginRight: 1,
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
    counter: {
        fontFamily: Fonts.primarySemiBold,
        fontSize: 16,
        color: Color.white,
        textAlign: 'center',
        width: 30,
    },
});


export default ProductGrid;

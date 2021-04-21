import React, {Component} from 'react';
import {getUserDetails} from '../../utils/LocalStorage';
import {favoriteProduct} from '../../axios/ServerRequest';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Color, Fonts} from '../../theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import IconPlus from 'react-native-vector-icons/AntDesign';

class WishListProductRow extends Component {
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

    render() {
        const {item, count} = this.props;
        return (
            <View style={styles.mainContainer}>
                <View style={styles.container}>
                    <View style={styles.box2}>
                        <TouchableOpacity activeOpacity={1} onPress={this.props.onPress} style={styles.imageContainer}>
                            <Image style={styles.productImage} source={{uri: item.images[0].image}}/>
                        </TouchableOpacity>
                        <View style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                            <Text style={styles.title}>{item.name}</Text>
                            <Text style={styles.attribute}>
                                {item.weight_value + ' ' + item.weight.weight + ' - ' + item.currency.symbol + item.price}
                            </Text>
                            <View style={styles.quantityContainer}>
                                <View style={{flexDirection: 'row', flex: 1, alignSelf: 'flex-start', marginLeft: 10}}>
                                    <View style={styles.rating}>
                                        <Text style={{color: Color.white, fontSize: 12}}>
                                            {item.review.total_rating} {' '}
                                        </Text>
                                        <Icon
                                            name="star"
                                            size={12}
                                            color={Color.white}
                                            style={{alignSelf: 'center'}}
                                        />
                                    </View>
                                    <View style={{flex: 0.7, alignSelf: 'center'}}>
                                        <Text style={{fontSize: 14}}>{'     '}({item.review.no_rating})</Text>
                                    </View>
                                </View>
                                {count > 0
                                    ?
                                    (<View style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        backgroundColor: Color.colorPrimary,
                                        padding: 7,
                                        borderRadius: 5,
                                    }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.state.isLogin ? this.setState({count: this.state.count - 1}) : null;
                                                this.setCart(
                                                    item,
                                                    item.id,
                                                    this.state.count - 1,
                                                    item.price,
                                                );
                                            }}>
                                            <IconPlus
                                                name="minus"
                                                size={20}
                                                color={Color.white}
                                                style={styles.iconAddStyle}
                                            />
                                        </TouchableOpacity>
                                        <Text style={styles.quantityCount}>
                                            {count}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.state.isLogin ? this.setState({count: this.state.count + 1}) : null;
                                                this.setCart(
                                                    item,
                                                    item.id,
                                                    this.state.count + 1,
                                                    item.price,
                                                );
                                            }}>
                                            <IconPlus
                                                name="plus"
                                                size={20}
                                                color={Color.white}
                                                style={styles.iconAddStyle}
                                            />
                                        </TouchableOpacity>
                                    </View>)
                                    :
                                    (<View style={styles.addToCart}>
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            onPress={() => {
                                                this.setState({count: this.state.count + 1});
                                                this.setCart(
                                                    item,
                                                    item.id,
                                                    this.state.count + 1,
                                                    item.price,
                                                );
                                            }}>
                                            <Text style={styles.addToCartText}>Add
                                                <IconPlus
                                                    name="plus"
                                                    size={20}
                                                    color={Color.white}
                                                    style={styles.iconAddStyle}
                                                />
                                            </Text>
                                        </TouchableOpacity>
                                    </View>)
                                }
                            </View>
                        </View>
                    </View>
                    <View style={styles.deleteBtn}>
                        <TouchableOpacity activeOpacity={1} style={styles.favoriteContainer}
                                          onPress={() => {
                                              this.addToFavorite(item);
                                          }}>
                            {this.state.liked ? <Icon name="heart" size={20} color={Color.colorPrimary}/> :
                                <Icon name="heart-o" size={20} color={Color.colorPrimary}/>}

                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

WishListProductRow.propTypes = {
    addToCart: PropTypes.func,
    item: PropTypes.object,
    count: PropTypes.number,
    isLogin: PropTypes.func,
};

const styles = StyleSheet.create({
    mainContainer: {
        padding: 5,
    },
    container: {
        width: '100%',
        backgroundColor: Color.white,
        display: 'flex',
        flexDirection: 'column',
        borderBottomWidth: 0.3,
        borderColor: Color.borderColor,
    },
    imageContainer: {
        backgroundColor: Color.white,
        height: 100,
        width: 110,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconAddStyle: {
        fontWeight: '800',
        fontFamily: Fonts.primaryBold,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
    },
    innerContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rating: {
        flexDirection: 'row',
        flex: 0.25,
        width: 30,
        height: 20,
        marginLeft: 10,
        borderRadius: 5,
        bottom: 0,
        backgroundColor: Color.colorPrimary,
        display: 'flex',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: Fonts.primaryBold,
        fontSize: 16,
        color: Color.titleColor,
        textAlign: 'left',
        marginLeft: 20,
        marginRight: 10,
    },
    quantityCount: {
        fontFamily: Fonts.primarySemiBold,
        fontSize: 14,
        color: Color.white,
        marginLeft: 10,
        marginRight: 10,
    },
    attribute: {
        fontFamily: Fonts.primarySemiBold,
        fontSize: 14,
        color: Color.colorPrimary,
        textAlign: 'left',
        marginLeft: 20,
        marginRight: 10,
        marginBottom: 10,
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
        marginRight: 10,
        marginBottom: 10,
    },
    productImage: {
        height: 70,
        width: 70,
    },
    addToCart: {
        backgroundColor: Color.colorPrimary,
        color: Color.white,
        textAlign: 'center',
        borderRadius: 5,
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
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    quantityContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    addToCartText: {
        paddingBottom: 4,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 4,
        color: Color.white,
        fontSize: 18,
        fontFamily:Fonts.primarySemiBold
    },
    box2: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 10,
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusBtn: {
        padding: 10,
    },
    border: {
        borderBottomWidth: 1,
        borderColor: Color.graylight,
    },
    deleteBtn: {
        position: 'absolute',
        top: 3,
        right: 15,
    },
});

export default WishListProductRow;

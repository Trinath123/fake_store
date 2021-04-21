import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Color, Fonts} from '../../theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TouchableOpacity} from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import {getUserDetails} from '../../utils/LocalStorage';
import IconPlus from 'react-native-vector-icons/AntDesign';

class ProductItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.item,
            count: this.props.count ? this.props.count : 0,
            cart: null,
            totalPrice: 0,
            user: null,
            isLogin: false,
        };
    }

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
            <View style={styles.mainContainer}>
                <View style={styles.container}>
                    <View style={styles.box2}>
                        <TouchableOpacity activeOpacity={1} onPress={this.props.onPress} style={styles.imageContainer}>
                            <Image
                                style={styles.productImage}
                                source={{uri: item.image}}
                            />
                        </TouchableOpacity>
                        <View style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.attribute}>
                                {'₹ ' + item.price}
                            </Text>
                            <View style={styles.quantitContainer}>
                                <View style={{marginLeft: 20}}>
                                    <Text style={{color: Color.colorPrimary, fontFamily: Fonts.primarySemiBold}}>
                                        {'₹ ' + count * item.price}
                                    </Text>
                                </View>
                                <View style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    backgroundColor: Color.colorPrimary,
                                    padding: 7,
                                    borderRadius: 5,
                                }}>
                                    <TouchableOpacity
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
                                    <Text style={styles.quantityCount}>
                                        {count}
                                    </Text>
                                    <TouchableOpacity
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
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.deleteBtn}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({count: 0});
                                this.setCart(item, item.id, 0, item.price);
                            }}>
                            <Text
                                style={{color: Color.black, fontSize: 12, fontFamily: Fonts.primaryBold}}>REMOVE</Text>
                        </TouchableOpacity>
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
    mainContainer: {
        paddingLeft: 5,
        paddingRight: 5,
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
        height: 100,
        width: 110,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconAddStyle: {
        borderRadius: 50,
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
    title: {
        fontFamily: Fonts.primarySemiBold,
        fontSize: 14,
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
        fontFamily: Fonts.primaryRegular,
        fontSize: 14,
        color: Color.textColor,
        textAlign: 'left',
        marginLeft: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    counter: {
        fontFamily: Fonts.primarySemiBold,
        fontSize: 16,
        color: Color.colorPrimary,
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
        borderRadius: 20,
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
    quantitContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    addToCartText: {
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 20,
        paddingRight: 20,
        color: Color.white,
    },
    box2: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 15,
        paddingTop: 5,
        marginTop: 15,
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
        top: 5,
        right: 15,
    },
});


export default ProductItem;

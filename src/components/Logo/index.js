import React from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';
import Color from '../../theme/Color';
import {Fonts} from '../../theme';

function Logo(props) {
    return (
        <View style={[styles.logoContainer, props.style]}>
            <Image
                style={styles.logo}
                source={require('../../assets/images/original-logo.png')}
            />
            <Text style={styles.textNameStyle}>Sri Krishna Store</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        width: '100%',
    },
    logo: {
        width: 180,
        height: 110,
    },
    textNameStyle: {
        fontSize: 16,
        fontFamily: Fonts.primaryBold,
        color: Color.royalblue,
    },
});

export default Logo;

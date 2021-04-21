import React, {Component} from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';
import AppStatusBar from '../components/AppStatusBar';
import {getFirstTime, getUserDetails} from '../utils/LocalStorage';
import Color from '../theme/Color';
import {Fonts} from '../theme';

class SplashScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    performTimeConsumingTask = async () => {
        return new Promise((resolve) =>
            setTimeout(() => {
                resolve('result');
            }, 3000),
        );
    };

    async componentDidMount() {
        const data = await this.performTimeConsumingTask();
        if (data !== null) {
            this.props.navigation.replace('Category');
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <AppStatusBar
                    backgroundColor="rgba(0,0,0,0)"
                    barStyle="dark-content"
                    visibleStatusBar={false}
                    translucent
                />
                <Image style={styles.logo} source={require('../assets/images/Store.png')}/>
                <Text style={{marginTop: 10, color: Color.royalblue, fontFamily: Fonts.primaryBold, fontSize: 24}}>
                    FAKE STORE
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.white,
    },
    logo: {
        height: 150,
        width: 250,
    },

    bottomImage: {
        height: 150,
        width: 150,
        position: 'absolute',
        bottom: 15,
        right: 80,
    },
});

export default SplashScreen;

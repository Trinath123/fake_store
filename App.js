import React, {Component} from 'react';
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from './src/screen/SplashScreen';
import CategoryScreen from './src/screen/CategoryScreen';
import ProductsScreen from './src/screen/ProductsScreen';
import ProductView from './src/screen/ProductView';
import MyCartScreen from './src/screen/MyCartScreen';
import CustomSidebarMenu from './src/navigation/CustomSidebarMenu';
import {Provider} from 'react-redux';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './src/redux/reducers';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();
const ProductStack = createStackNavigator();
const OrderStack = createStackNavigator();
const Drawer = createDrawerNavigator();

global.currentScreenIndex = 0;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    createDrawer = () => (
        <Drawer.Navigator
            initialRouteName="Category"
            drawerContentOptions={{activeTintColor: 'red'}}
            drawerContent={(props) => <CustomSidebarMenu {...props} />}>
            <Drawer.Screen name="Category" component={CategoryScreen}/>
            <Drawer.Screen name="MyCart" component={MyCartScreen}/>
        </Drawer.Navigator>
    );

    MainStackScreen = () => (
        <MainStack.Navigator
            screenOptions={{headerShown: false, animationEnabled: false}}>
            <MainStack.Screen name="SplashScreen" component={SplashScreen}/>
        </MainStack.Navigator>
    );

    ProductStackScreen = () => (
        <ProductStack.Navigator
            initialRouteName="ProductView"
            screenOptions={{headerShown: false, animationEnabled: false}}>
            <ProductStack.Screen name="ProductView" component={ProductView}/>
            <ProductStack.Screen name="Products" component={ProductsScreen}/>
        </ProductStack.Navigator>
    );

    RootStackScreen = () => (
        <RootStack.Navigator
            screenOptions={{headerShown: false, animationEnabled: false}}>
            <RootStack.Screen name="Main" component={this.MainStackScreen}/>
            <RootStack.Screen name="ProductView" component={this.ProductStackScreen}/>
            <RootStack.Screen name="Category" children={this.createDrawer}/>
        </RootStack.Navigator>
    );

    componentDidMount = async () => {
        // this.createNotificationListeners();
    };

    async createNotificationListeners() {
        // return messaging().onMessage(async (remoteMessage) => {
        //   // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        // });
    }

    render() {
        return (
            <Provider store={store}>
                <NavigationContainer>{this.RootStackScreen()}</NavigationContainer>
            </Provider>
        );
    }
}

export default App;

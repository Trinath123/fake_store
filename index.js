/**
 * @format
 */

import {AppRegistry, LogBox, YellowBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

YellowBox.ignoreWarnings(['Animated: `useNativeDriver`']);
LogBox.ignoreAllLogs();

AppRegistry.registerComponent(appName, () => App);

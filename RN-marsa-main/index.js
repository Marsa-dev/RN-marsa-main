/**
 * @format
 */

import {AppRegistry} from 'react-native';
import i18n from './src/constants/languages/i18n';
import App from './App';
import {name as appName} from './app.json';
AppRegistry.registerComponent(appName, () => App);

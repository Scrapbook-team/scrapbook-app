import {
  createRouter,
} from '@exponent/ex-navigation';

import LoginScreen from '../screens/LoginScreen';
import RootNavigation from './RootNavigation';

export default createRouter(() => ({
  login: () => LoginScreen,
  rootNavigation: () => RootNavigation,
}));

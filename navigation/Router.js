import {
  createRouter,
} from '@exponent/ex-navigation';

import Login from '../screens/Login';
import GroupList from '../screens/GroupList';
import RootNavigation from './RootNavigation';

export default createRouter(() => ({
  login: () => Login,
  groupList: () => GroupList,
  rootNavigation: () => RootNavigation,
}));

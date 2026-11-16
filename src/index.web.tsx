import { AppRegistry } from 'react-native';
import App from '../App';

AppRegistry.registerComponent('MyProject', () => App);
AppRegistry.runApplication('MyProject', {
  initialProps: {},
  rootTag: (document.getElementById('root') || document.body) as any,
});

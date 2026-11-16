import { AppRegistry } from 'react-native';
import App from '../App';

AppRegistry.registerComponent('MyProject', () => App);

const mount = () => {
  const rootTag = document.getElementById('root');
  if (rootTag) {
    AppRegistry.runApplication('MyProject', {
      initialProps: {},
      rootTag: rootTag as any,
    });
  }
};

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
}

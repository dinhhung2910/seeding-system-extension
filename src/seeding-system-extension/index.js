// import store from '../common/store';

import {randomInt} from '../common/util';
import checkAction from './checkAction';

(() => {
  const main = async () => {
    await checkAction();
    setTimeout(() => {
      main();
    }, randomInt(1000, 2000));
  };

  main();
})();

import {SERVER_ENDPOINT} from './constants';
import sendRequest from './sendRequest';

/**
 * Check action from server side
 */
const checkAction = async () => {
  try {
    const res = await sendRequest({
      method: 'GET',
      headers: {},
      url: `${SERVER_ENDPOINT}/api/auth`,
    });
    console.log(res);
  } catch (e) {
    console.error(e);
  }
};

export default checkAction;

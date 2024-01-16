// import {sleep} from '../common/util';
import {
  SERVER_ENDPOINT,
  SITE_CONFIG_ELM_ID,
  SITE_STATE_ELM_ID,
  TIKTOK_COMMENT_BOX_SELECTOR,
  TIKTOK_COMMENT_SUBMIT_SELECTOR,
} from './constants';
import sendRequest from './sendRequest';

/**
 * Retrieve user information from website
 * @return {object} user information
 */
const parseUserInfo = () => {
  const elm = document.getElementById(SITE_CONFIG_ELM_ID);
  if (!elm) {
    return null;
  }

  let user = null;
  try {
    const r = JSON.parse(elm.innerText);
    user = {
      userId: r.appProps.$user.uid,
      userName: r.appProps.$user.uniqueId,
    };
  } catch (e) {
    user = null;
  }

  return user;
};

/**
 * Retrieve user information from website
 * @return {object} user information
 */
const parseUserInfoFromState = () => {
  const elm = document.getElementById(SITE_STATE_ELM_ID);
  if (!elm) {
    return null;
  }

  let user = null;
  try {
    const r = JSON.parse(elm.innerText);
    user = {
      userId: r.AppContext.appContext.user.uid,
      userName: r.AppContext.appContext.user.uniqueId,
    };
  } catch (e) {
    user = null;
  }

  return user;
};

/**
 * Fill in information for sessionStore
 * @param {object} sessionStore
 * @param {object} user
*/
const setupSessionStore = async (sessionStore, user) => {
  sessionStore.userId = user.userId;
  sessionStore.userName = user.userName;

  try {
    const res = await sendRequest({
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      data: JSON.stringify({
        userId: sessionStore.userId,
        userName: sessionStore.userName,
      }),
      url: `${SERVER_ENDPOINT}/api/auth/device`,
    });

    const body = await res.response;
    console.log(body);
    sessionStore.token = (JSON.parse(body)).jsonData.token;
  } catch (e) {
    console.error('Can\'t get device token');
    console.error(e);
  }
};

/**
 * Ask server what to do now
 * @param {*} sessionStore
 */
const getCommand = async (sessionStore) => {
  const url = window.location.href;

  try {
    const r = await sendRequest({
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        'x-auth-token': sessionStore.token,
        'x-auth-userid': sessionStore.userId,
      },
      data: JSON.stringify({
        url,
      }),
      url: `${SERVER_ENDPOINT}/api/device/checkin`,
    });

    const response = await r.response;
    const body = JSON.parse(response);
    if (body.isValid && body.jsonData) {
      return body.jsonData;
    } else {
      return {action: false};
    }
  } catch (e) {
    console.error('Can\'t get command');
    console.error(e);
    return {error: true};
  }
};

/**
 * Execute a command return from server
 * @param {object} command
 */
const executeCommand = async (command) => {
  if (!command.action) {
    console.log('No action...');
    return;
  }

  if (command.type == 'comment') {
    console.log(command);
    try {
      const input = document.querySelector(TIKTOK_COMMENT_BOX_SELECTOR);
      input.innerText = command.content;
      // await sleep(500);
      const button = document.querySelector(TIKTOK_COMMENT_SUBMIT_SELECTOR);
      button.click();
    } catch (e) {
      console.error(e);
    }
  }
};

/**
 * Check action
 * @return {function}
 */
function _checkAction() {
  const sessionStore = {};

  return async () => {
    try {
      // try retrieve user information from DOM tree
      let user = parseUserInfo();

      if (!user) {
        user = parseUserInfoFromState();
      }

      if (!user) {
        delete sessionStore.token;
        delete sessionStore.userId;
        delete sessionStore.userName;
        return;
      }

      // request token if it is not existed
      if (!sessionStore.token) {
        console.log(sessionStore);
        console.log('Setting session token...');
        await setupSessionStore(sessionStore, user);
      }

      // try get action
      const command = await getCommand(sessionStore);
      if (command.error) {
        await setupSessionStore(sessionStore, user);
        return;
      } else {
        await executeCommand(command);
      }
    } catch (e) {
      console.error(e);
    }
  };
}

const checkAction = _checkAction();

export default checkAction;

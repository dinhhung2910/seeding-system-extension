// import {sleep} from '../common/util';
import {sleep} from '../common/util';
import {
  ArticleEventResultCode,
  MAX_TRIALS,
  SERVER_ENDPOINT,
  SITE_CONFIG_ELM_ID,
  SITE_STATE_ELM_ID,
  TIKTOK_CHAT_BOX_SELECTOR,
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
 * Ask server what to do now
 */
const getCommand = async () => {
  const url = window.location.href;

  try {
    const r = await sendRequest({
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
      url: `${SERVER_ENDPOINT}/api/event`,
      data: '{}',
    });

    const response = await r.response;
    const body = JSON.parse(response);
    if (body.isValid && body.jsonData &&
      body.jsonData.event && body.jsonData.event.url == url) {
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
  console.log(command);
  if (!command.action || !command.event) {
    console.log('No action...');
    return;
  }

  const event = command.event;
  if (event.comment) {
    console.log(event.comment);
    try {
      let input = document.querySelector(TIKTOK_COMMENT_BOX_SELECTOR);
      if (!input) {
        input = document.querySelector(TIKTOK_CHAT_BOX_SELECTOR);
      }

      await sleep(500);
      input.focus();
      await sleep(500);

      // tell agent to type comment
      console.log('Tell agent to comment');
      const r = await sendRequest({
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        url: `${SERVER_ENDPOINT}/api/event/comment`,
        data: JSON.stringify({
          comment: event.comment,
        }),
      });
      await r.response;

      await sleep(1000);
      const button = document.querySelector(TIKTOK_COMMENT_SUBMIT_SELECTOR);
      button.click();
    } catch (e) {
      console.error(e);
    }
  }
};

/**
 * Report result back to server
 * @param {*} resultCode
 */
const sendResult = async (resultCode) => {
  try {
    const r = await sendRequest({
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      url: `${SERVER_ENDPOINT}/api/event/`,
      data: JSON.stringify({resultCode}),
    });

    const response = await r.response;
    const body = JSON.parse(response);
    if (body.isValid) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error('Can\'t update status');
    console.error(e);
    return true;
  }
};

/**
 * Check action
 * @return {function}
 */
function _checkAction() {
  let trial = 0;

  return async () => {
    try {
      // try retrieve user information from DOM tree
      let user = parseUserInfo();

      if (!user) {
        user = parseUserInfoFromState();
      }

      if (!user) {
        throw new Error('Unauthenticated user.');
      }

      console.log('User infor:', user);

      // try get action
      const command = await getCommand();
      if (!command.action) {
        console.log(command);
        throw new Error('No action.');
      } else {
        await sleep(2000);
        await executeCommand(command);
        await sendResult(ArticleEventResultCode.SUCCESS);
        await sleep(10000);
        window.close();
      }
    } catch (e) {
      console.error(e);
      trial++;

      if (trial >= MAX_TRIALS) {
        await sendResult(ArticleEventResultCode.UNAUTHENTICATED);
        window.close();
      }
    }
  };
}

const checkAction = _checkAction();

export default checkAction;

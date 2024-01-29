/**
 *
 * @param {*} src
 */
export function addExternalStyle(src) {
  const head = document.getElementsByTagName('head')[0];
  const style = document.createElement('link');

  if (!head) {
    return;
  }

  style.type = 'text/css';
  style.rel = 'stylesheet';
  style.href= src;
  head.appendChild(style);
}

/**
 * Observe an DOM object
 * @return {Function} Function to disconnect observation
 * @param {*} targetNode
 * @param {*} userConfig
 * @param {*} callback
 */
export const observeDOM = (targetNode,
  userConfig,
  callback ) => {
  const config = {
    attributes: false,
    childList: false,
    subtree: false, ...userConfig,
  };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
  return () => observer.disconnect();
};

/**
 * Find an DOM object by its innerText
 * @return {Object} A snapshot of first elements contain this text
 * @param {String} content Innertext of element to search
 */
export const getSnapshotElmByContent = (content) => {
  const availableTags = ['b', 'span'];

  let adTexts = null;

  for (let i = 0; i < availableTags.length; i++) {
    const tag = availableTags[i];
    if (adTexts && adTexts.snapshotLength) {
      break;
    }

    adTexts = document.evaluate(
      `//${tag}[contains(., \'${content}\')]`,
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null,
    );
  }

  if (adTexts && adTexts.snapshotLength) {
    return adTexts.snapshotItem(0);
  } else {
    return null;
  }
};

/**
 * Check if an DOM object contains this selector or not
 * @param {HTMLElement} elm
 * @param {String} selector
 * @return {Boolean} Contain or not
 */
const checkContainSingleSelector = (elm, selector) => {
  if (elm.querySelector(selector)) {
    return true;
  } else {
    return false;
  }
};

/**
 * Check if an DOM object contains this selector or not
 * @param {HTMLElement} elm
 * @param {Array} selectors
 * @return {Boolean} Contain or not
 */
export const checkContainSelectors = (elm, selectors) => {
  if (!elm) {
    return false;
  }

  let result = false;

  selectors.forEach((selector) => {
    if (checkContainSingleSelector(elm, selector)) {
      result = true;
    }
  });

  return result;
};


export const removeDOM = (elm) => {
  try {
    elm.parentElement.removeChild(elm);
  } catch (e) {
    console.error(e);
  }
};

export const hideDOM = (elm) => {
  try {
    elm.style.display = 'none';
    elm.classList.add('hided');
  } catch (e) {
    console.error(e);
  }
};

export const randomInt = (min, max) => {
  const range = max - min;
  return Math.trunc(Math.random() * range) + min;
};

/**
 *
 * @param {*} t time to sleep
 * @return {Promise}
 */
export function sleep(t) {
  return new Promise((resolve) => {
    setTimeout(resolve, t);
  });
};

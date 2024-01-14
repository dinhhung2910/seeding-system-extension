// eslint-disable-next-line camelcase
export const set = GM_setValue;
// eslint-disable-next-line camelcase
export const get = GM_getValue;
// eslint-disable-next-line camelcase
export const del = GM_deleteValue;
// eslint-disable-next-line camelcase
export const list = GM_listValues;

/**
 * Push elm to store key
 * Check if store key is array type, then push value
 * @param {*} key
 * @param {*} value
 */
export const push = (key, value) => {
  let currentVal = get(key);
  if (!Array.isArray(currentVal)) {
    currentVal = [];
  }
  if (!currentVal.includes(value)) {
    currentVal.push(value);
  }

  set(key, currentVal);
};

export const onChange = (name, func) => {
  GM_addValueChangeListener(name, (_name, old, val, remote) =>
    func(val, remote, old),
  );
};

export const update = (name, defValue, func) => {
  set(name, func(get(name, defValue)));
};

export const val = (name) => ({
  set: set.bind(null, name),
  get: get.bind(null, name),
  del: del.bind(null, name),
  update: update.bind(null, name),
  onChange: onChange.bind(null, name),
});

export default {
  get,
  set,
  del,
  list,
  onChange,
  update,
  val,
};

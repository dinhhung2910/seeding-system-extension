const sendRequest = ({url, headers, method}) => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method,
      url,
      headers,
      onload: function(response) {
        resolve(response);
      },
      onerror: function(response) {
        reject(response);
      },
    });
  });
};
;

export default sendRequest;

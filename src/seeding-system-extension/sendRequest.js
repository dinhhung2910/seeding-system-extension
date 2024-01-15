const sendRequest = ({url, headers, method, data}) => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method,
      url,
      data,
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

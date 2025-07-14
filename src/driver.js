// for local testings
// const PATH_TO_SSE = "http://localhost/api/v4/sse"; // for local testings
// const PATH_TO_SERVER = "http://localhost"; // for local testings

// for deployment
// const PATH_TO_SERVER = "/api/v3"; // for deployment
// const PATH_TO_SSE = "/v3/sse"; // for deployment
const PATH_TO_SERVER = "https://kantorfk.com"; // for deployment
const PATH_TO_API = "/api/v4"; // for deployment
const PATH_TO_SSE = "https://kantorfk.com/api/v4/sse"; // for deployment

/**
 * payload
 * @param {*} t token
 * @returns payload
 */
function pld(t) {
  if (t == undefined || t == "") {
    return { crntuser: "", term: "", role: "", user: "" }; // payload
  } else {
    return JSON.parse(window.atob(t.split(".")[1])); // payload
  }
}

/**
 *
 * @param {*} path
 * @param {*} token
 * @param {*} jdata
 * @returns
 */
const postFetch = async (path, token, jdata) => {
  const resp = fetch(
    `${PATH_TO_SERVER}${PATH_TO_API}${path}?api_token=${token}`,
    {
      method: "post",
      mode: "cors",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: "data=" + JSON.stringify(jdata),
      // body: `key=${MN_SID}&usr=${CRNTUSER.name}&query=${vquery}`,
    }
  );
  return resp;
};

/**
 *
 * @param {*} path
 * @param {*} token
 * @param {*} jdata
 * @param {*} callback for success
 * @param {*} error callback fo error
 */
const postData = async (path, token, jdata, callback, error) => {
  // console.log("postData started" + JSON.stringify(data));
  // return;
  fetch(`${PATH_TO_SERVER}${PATH_TO_API}${path}?api_token=${token}`, {
    method: "post",
    mode: "cors",
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: "data=" + JSON.stringify(jdata),
    // body: `key=${MN_SID}&usr=${CRNTUSER.name}&query=${vquery}`,
  })
    .then((resp) => resp.json())
    .then((jresp) => {
      // console.log(path + ": " + JSON.stringify(jresp));
      error(null);
      callback(jresp.rslt);
    })
    .catch((err) => {
      console.log("EE:" + path + "/ " + err + " data=" + JSON.stringify(jdata));
      error(err.message);
    });
};

const publishSocial = async (str, callback) => {
  // console.log("postData started" + JSON.stringify(data));
  // return;
  const tgBotApiToken = "111111111111111";
  const tgChatId = "-2222222222222"; // '-2222222222' - channel id
  const tgQuery = encodeURI(`chat_id=${tgChatId}&text=${str.msg}`);
  const tgUrl = `https://api.telegram.org/bot${tgBotApiToken}/sendMessage?${tgQuery}`;

  fetch(`https://api.telegram.org/bot${tgBotApiToken}/sendMessage?${tgQuery}`, {
    method: "post",
    mode: "cors",
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    // body: "data=" + JSON.stringify(jdata),
  })
    .then((resp) => resp.json())
    .then((jresp) => {
      // console.log(path + ": " + JSON.stringify(jresp));
      callback(null, jresp.rslt);
    })
    .catch((err) => {
      // console.log("EE:" + path + "/ " + err + " data=" + JSON.stringify(jdata));
      callback(err.message, null);
    });
};

/**
 *
 * @param {string} path
 * @param {string} jdata
 * @returns JSON
 */
const getFetch = async (path, jdata) => {
  if (jdata !== undefined && jdata !== "") {
    jdata = "?" + jdata;
  }
  const resp = fetch(`${PATH_TO_SERVER}${PATH_TO_API}${path}${jdata}`, {
    method: "get",
    mode: "cors",
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  });
  return resp;
};

/**
 *
 * @param {string} path
 * @param {string} query
 * @param {*} callback for success
 * @param {*} error callback fo error
 */
const getData = async (path, query, callback, error) => {
  if (query !== undefined && query !== "") {
    query = "?" + query;
  }
  fetch(`${PATH_TO_SERVER}${PATH_TO_API}${path}${query}`, {
    method: "get",
    mode: "cors",
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  })
    .then((resp) => resp.json())
    .then((jresp) => {
      callback(jresp.rslt);
      error(null);
    })
    .catch((err) => {
      error(err.message);
    });
};

/**
 *
 * @param {string} usr JSON base64 encoded
 * @returns JSON response
 */
function authFetch(usr) {
  // console.log("#83u driver.js " + `${PATH_TO_SERVER}${PATH_TO_API}/auth`);
  const resp = fetch(`${PATH_TO_SERVER}${PATH_TO_API}/auth`, {
    method: "post",
    mode: "cors",
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      // "Access-Control-Allow-Origin": "http://localhost:3000",
    },
    body: `data=${usr}`,
  });
  return resp;
}

/**
 *
 * @param {string} raw
 * @returns JSON | false
 */
function parse(raw) {
  try {
    return JSON.parse(raw);
  } catch (err) {
    return false;
  }
}

export {
  PATH_TO_SERVER,
  PATH_TO_API,
  PATH_TO_SSE,
  pld,
  postFetch,
  getFetch,
  postData,
  publishSocial,
  getData,
  authFetch,
  parse,
};

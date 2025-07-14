// const PATH_TO_SERVER = "http://localhost"; // for local testings

const PATH_TO_SERVER = process.env.REACT_APP_API_URL; // for deployment
const PATH_TO_API = process.env.REACT_APP_API_VER;
// const PATH_TO_SSE = `${PATH_TO_SERVER}/sse`; // for deployment

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
 * @param {string} path
 * @param {string} query
 * @param {*} callback for success
 * @param {*} error callback fo error
 */
const getData = async (path, query, callback) => {
  if (PATH_TO_SERVER === undefined || PATH_TO_API === undefined) {
    console.log("URL or API is not defined in environment variables.");
    callback("URL or API is not defined in environment variables.", null);
    return;
  }
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
      callback(null, jresp.rslt);
    })
    .catch((err) => {
      callback(err.message, null);
    });
};

/**
 *
 * @param {*} path
 * @param {*} token
 * @param {*} jdata
 * @param {*} callback for success
 * @param {*} error callback fo error
 */
const postData = async (path, token, jdata, callback) => {
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
      callback(null, jresp.rslt);
    })
    .catch((err) => {
      console.log("EE:" + path + "/ " + err + " data=" + JSON.stringify(jdata));
      callback(err.message, null);
    });
};

const publishSocial = async (str, callback) => {
  // console.log("postData started" + JSON.stringify(data));
  // return;
  const tgBotApiToken = process.env.REACT_APP_TG_BOT_API_TOKEN; // telegram bot API token
  const tgChatId = process.env.REACT_APP_TG_CHART_ID; // telegram chat ID

  // console.log("tgBotApiToken: " + tgBotApiToken);
  // console.log("tgChatId: " + tgChatId);
  if (tgBotApiToken === undefined || tgChatId === undefined) {
    console.log(
      "Telegram bot API token or chat ID is not defined in environment variables."
    );
    callback(
      "Telegram bot API token or chat ID is not defined in environment variables.",
      null
    );
    return;
  }
  const tgQuery = encodeURI(`chat_id=${tgChatId}&text=${str.msg}`);

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
  pld,
  // postFetch,
  // getFetch,
  authFetch,
  getData,
  postData,
  publishSocial,
  parse,
};

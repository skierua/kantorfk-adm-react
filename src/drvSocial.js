const TG_BOT = process.env.REACT_APP_TG_BOT_API_TOKEN; // for deployment
const TG_CHAT_ID = process.env.REACT_APP_TG_CHART_ID;
const DRV_SOCIAL_HEADER = "ГУРТ"; // default header for social media posts
const DRV_SOCIAL_FOOTER = "\n☎️ 096 001 36 00\n🌐 kantorfk.com"; // default footer for social media posts

const flag = (v) => {
  if (v === "USD") return "🇺🇸";
  if (v === "EUR") return "🇪🇺";
  if (v === "PLN") return "🇲🇨";
  if (v === "CZK") return "🇨🇿";
  if (v === "GBP") return "🇬🇧";
  return v; // for other currencies
};

const publish = async (
  jrates,
  callback,
  header = DRV_SOCIAL_HEADER,
  footer = DRV_SOCIAL_FOOTER
) => {
  if (TG_BOT === undefined || TG_CHAT_ID === undefined) {
    console.log(
      "Telegram bot API token or chat ID is not defined in environment variables."
    );
    callback(
      "Telegram bot API token or chat ID is not defined in environment variables.",
      null
    );
    return;
  }

  let str = header + "\n";
  str += jrates.reduce((acc, v) => {
    if (v.bid !== "" || v.ask !== "") {
      acc +=
        (v.bid === "" ? "--.--" : Number(v.bid).toPrecision(4)) +
        " " +
        (v.rqty === "1" ? "" : `${v.rqty} `) +
        flag(v.chid) +
        " " +
        (v.ask === "" ? "--.--" : Number(v.ask).toPrecision(4)) +
        " " +
        v.sname +
        "\n";
      return acc;
    }
  }, "");

  str += `${footer}\n`;
  // console.log("social driver \n" + str);
  // return;
  //   const tgBotApiToken = process.env.REACT_APP_TG_BOT_API_TOKEN; // telegram bot API token
  //   const tgChatId = process.env.REACT_APP_TG_CHART_ID; // telegram chat ID

  // console.log("TG_BOT: " + TG_BOT);
  // console.log("TG_CHAT_ID: " + TG_CHAT_ID);
  const tgQuery = encodeURI(`chat_id=${TG_CHAT_ID}&text=${str}`);

  fetch(`https://api.telegram.org/bot${TG_BOT}/sendMessage?${tgQuery}`, {
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
      callback(null, jresp);
    })
    .catch((err) => {
      // console.log("EE:" + path + "/ " + err + " data=" + JSON.stringify(jdata));
      callback(err.message, null);
    });
};

export { publish };
// [{"atclcode":"840","rqty":"1","bid":"41.44","ask":"41.55","bidtm":"2025-07-17T17:25:25.353Z","asktm":"2025-07-17T17:25:25.353Z","shop":"BULK","chid":"USD","name":"долар США","scode":"","sname":"синій","cqty":"1","sortorder":"10","prc":"","domestic":"2"},
//   {"atclcode":"840","rqty":"1","bid":"41.25","ask":"41.4","bidtm":"2025-06-05T08:47:49.610Z","asktm":"2025-06-05T08:47:49.610Z","shop":"BULK","chid":"USD","name":"долар США","scode":"20","sname":"білий","cqty":"1","sortorder":"10","prc":"","domestic":"2"},
//   {"atclcode":"840","rqty":"1","bid":"","ask":"41.35","bidtm":"2025-06-03T12:08:59.547Z","asktm":"2025-06-03T12:08:59.547Z","shop":"BULK","chid":"USD","name":"долар США","scode":"50","sname":"шмельц","cqty":"1","sortorder":"10","prc":"","domestic":"2"},
//   {"atclcode":"978","rqty":"1","bid":"47.30","ask":"47.45","bidtm":"2025-06-05T08:42:14.642Z","asktm":"2025-06-05T08:42:14.642Z","shop":"BULK","chid":"EUR","name":"ЄВРО","scode":"","sname":"","cqty":"1","sortorder":"15","prc":"","domestic":"2"},
//   {"atclcode":"985","rqty":"1","bid":"11.07","ask":"11.11","bidtm":"2025-06-05T08:42:05.318Z","asktm":"2025-06-05T08:42:05.318Z","shop":"BULK","chid":"PLN","name":"польський злотий","scode":"","sname":"","cqty":"1","sortorder":"20","prc":"","domestic":"2"},
//   {"atclcode":"203","rqty":"1","bid":"1.86","ask":"1.89","bidtm":"2025-06-05T04:23:52.986Z","asktm":"2025-06-05T04:23:52.986Z","shop":"BULK","chid":"CZK","name":"чеська  крона","scode":"","sname":"","cqty":"1","sortorder":"23","prc":"","domestic":"2"}
// ]

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
// import "./Main.css";
import React, { useEffect, useState } from "react";
import { Alert, Container, Stack, Typography } from "@mui/material";
// import { Avatar, Box, Button, CssBaseline } from "@mui/material";

import { Sign } from "./Sign.js";
import { authFetch, saveToken } from "./driver.js";
import { subscribe, unsubscribe } from "./events.js";
import { AdmMain } from "./components/adm/Main.jsx";
import { Main as KntMain } from "./components/knt/Main.jsx";

function App(props) {
  // const { CD_KANTOR, CD_CURRENCY } = props;
  // const [crntuser, setCrntuser] = useState({ name: "BULK", role: "owner" });
  const [token, setToken] = useState("");

  // ownermain
  // const [token, setToken] = useState(
  //   "eyAiYWxnIjogIkhTMjU2IiwgInR5cCI6ICJKV1QifQ==.eyJjcm50dXNlciI6IkJVTEsiLCJ0ZXJtIjoiQlVMSyIsInJvbGUiOiJvd25lciIsInVzZXIiOiJvd25lcm1haW4ifQ==.c639a4b1b576a291a031f85cc334a472253f5668acd0541ddc85ce680a57d134"
  // );
  // FEYA;
  // const [token, setToken] = useState(
  //   "eyAiYWxnIjogIkhTMjU2IiwgInR5cCI6ICJKV1QifQ==.eyJjcm50dXNlciI6IkZFWUEiLCJ0ZXJtIjoiRkVZQSIsInJvbGUiOiJrYW50IiwidXNlciI6IkZFWUEifQ==.822944d3bc2f99a1d961ca2dc3171c04cb746ad5ba479b2e15bc1020baad18f5"
  // );
  const [crntuser, setCrntuser] = useState({
    crntuser: "",
    term: "",
    role: "",
    user: "",
  });
  const [error, setError] = useState(null);
  useEffect(() => {
    subscribe(
      "signin",
      // () => setRequery((prevRequery) => ++prevRequery)
      () => {
        // setCrntuser({ name: "", role: "" });
        setCrntuser({ crntuser: "", term: "", role: "", user: "" });
      }
    );
    return () => {
      unsubscribe("signin", () => {});
    };
  });

  useEffect(() => {
    setError(null);
    // console.log(`#836f useEffect started`);
    subscribe(
      "userChanged",
      // () => setRequery((prevRequery) => ++prevRequery)
      (resp) => {
        // console.log(
        //   `#836f key=12344321&usr=${resp.detail.usr}&psw=${resp.detail.psw}`
        // );
        // console.log("==== " + JSON.stringify(resp.detail));

        authFetch(resp.detail)
          .then((res) => res.json())
          .then((jresp) => {
            // console.log(jresp.token);
            const [th, tp, ts] = jresp.token.split(".");
            const pl = JSON.parse(window.atob(tp));
            setToken(jresp.token);
            // console.log(pl);
            setCrntuser(pl);
            setError(pl.role === "" ? "Autentication failed." : null);
          })
          .catch(function (err) {
            setError(err.message);
            console.log(`#63tv dataFetch Request failed error=${error}`);
          });
      }
    );
    return () => {
      unsubscribe(
        "userChanged",
        () => {}
        // setRequery((prevRequery) => prevRequery)
      );
      // console.log(`#47hb vkrate useeffect req=${requery}`);
    };
  }, []);

  // console.log("[" + token + "]");

  // return <AdmMain TOKEN={token} />;
  // return <KntMain TOKEN={token} />;

  return (
    <Container maxWidth="xl">
      <Stack gap={1}>
        {(crntuser == null || crntuser.role === "") && <Sign />}
        {
          token !== "" &&
            JSON.parse(window.atob(token.split(".")[1])) !== "" &&
            crntuser.role === "owner" && <AdmMain TOKEN={token} />
          // <Alert severity="error">
          //   <Typography> works</Typography>
          // </Alert>
          // (crntuser.role === "owner" && <AdmMain TOKEN={token} />)(
          //   crntuser.role === "knt" && <KntMain TOKEN={token} />
          // )
        }
        {token !== "" &&
          JSON.parse(window.atob(token.split(".")[1])) !== "" &&
          crntuser.role === "kant" && <KntMain TOKEN={token} />}
        {error && (
          <Alert severity="error">
            <Typography> {error}</Typography>
          </Alert>
        )}
      </Stack>
    </Container>
  );
}

// export default App;
// const VkTest = () => {
//   return <h1>Blog Articles</h1>;
// };

export default App;

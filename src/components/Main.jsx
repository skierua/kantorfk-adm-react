// import * as React from "react";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import BarChartIcon from "@mui/icons-material/BarChart";
// import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";

import RefreshIcon from "@mui/icons-material/Refresh";

import { AcntScore } from "./AcntScore";
import { Balance } from "./Balance.jsx";
import { Rate } from "./Rate.jsx";
import { DashBoard } from "./DashBoard.jsx";
import { Offer } from "./Offer.jsx";
import { OfferEdit } from "./OfferEdit";
import { RateEdit } from "./RateEdit";
import { RepRate } from "./RepRate.jsx";
import { RepProfit } from "./RepProfit.jsx";
import { ChartProfit } from "./ChartProfit.jsx";

// import { subscribe, unsubscribe } from "../../events";
import {
  PATH_TO_SERVER,
  getData,
  postData,
  publishSocial,
  pld,
} from "../driver";

const drawerWidth = 180;
const interval = 15; // reload interval sec
const kntBulk = "BULK";
const kntDflt = "CITY";

/*class Listener {
  constructor() {
    this.sream = null;
  }
  addEvent() {}
  open(url) {
    this.sream = new EventSource(url);
  }
  close() {
    if (this.sream !== null) {
      this.sream.close();
    }
  }
} */

// ResponsiveDrawer
export const Main = (props) => {
  const { window, TOKEN } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const [route, setRoute] = React.useState("home");
  const [cur, setCur] = useState([]); // currencies
  const [cursub, setCursub] = useState([]); // currencies sub
  const [acntData, setAcntData] = useState([]);
  const [rateData, setRateData] = useState([]);
  const [offerData, setOfferData] = useState([]);
  // const [offerMode, setOfferMode] = useState("view");
  const [rateEditorData, setRateEditorData] = useState(null);
  const [offerEditorData, setOfferEditorData] = useState(null);
  const [repoData, setRepoData] = useState([]);
  const [error, setError] = useState(null);

  let tmrUpd;

  // console.log("route=" + route);
  const KANTOR = [
    { id: "BULK", name: "BULK", so: 10 },
    { id: "CITY", name: "CITY", so: 20 },
    { id: "FEYA", name: "FEYA", so: 30 },
  ];

  const MENU1 = [
    { route: "home", text: "Home" },
    { route: "rate", text: "Rates" },
    { route: "offer", text: "Offers" },
  ];

  const MENU2 =
    pld(TOKEN).role === "owner"
      ? [
          { route: "vwbalance", text: "Balance" },
          { route: "vwrate", text: "AvrgRates" },
          { route: "profit", text: "Profit" },
          { route: "chart", text: "Chart" },
          // { route: "sse", text: "SSE test" },
        ]
      : [
          { route: "acntcash", text: "Каса" },
          { route: "acnt3002", text: "ДепозКом" },
          { route: "acnt3003", text: "Інкасація" },
          { route: "acnttrade", text: "TRADE" },
          { route: "acntdepo", text: "Борги" },
          { route: "acntowner", text: "Капітал" },
          // { route: "acnt", text: "" },
        ];

  const MENU3 = [
    { route: "vwrate", text: "СерКурси" },
    { route: "profit", text: "Profit" },
    { route: "chart", text: "Chart" },
  ];

  const sortRates = (v) => {
    const kso = (k) => {
      let knt = KANTOR.find((i) => i.id === k);
      return knt !== undefined ? knt.so : "99";
    };
    return v.sort((a, b) => {
      return a.sortorder < b.sortorder ||
        (a.sortorder === b.sortorder && a.scode < b.scode) ||
        (a.sortorder === b.sortorder &&
          a.scode === b.scode &&
          kso(a.shop) < kso(b.shop))
        ? -1
        : 1;
    });
  };

  const sortAcnts = (v) => {
    return v.sort((a, b) => {
      return a.acntno < b.acntno ||
        (a.acntno === b.acntno && a.cuso < b.cuso) ||
        (a.acntno === b.acntno && a.cuso === b.cuso && a.shso < b.shso)
        ? -1
        : 1;
    });
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleOffer_edit = (v) => {
    // console.log(v.detail);
    if (v !== undefined && v !== null) {
      setOfferEditorData(v);
    } else {
      setOfferEditorData({
        // oid: "",
        curid: "840",
        chid: "USD",
        name: "Долар США",
        shop: pld(TOKEN).term,
        sortorder: "10",
      });
    }
  };

  const DrawerMenuIcon = (props) => {
    // console.log(props.icon);
    if (props.icon == "home") {
      return <HomeIcon />;
    } else if (props.icon == "profit") {
      return <ListAltIcon />;
    } else if (props.icon == "rate") {
      return <PriceChangeIcon />;
    } else if (props.icon == "vwbalance") {
      return <InboxIcon />;
    } else if (props.icon == "vwrate") {
      return <PriceChangeIcon />;
    } else if (props.icon == "chart") {
      return <BarChartIcon />;
    } else {
      return <InboxIcon />;
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Button
          startIcon={<RefreshIcon />}
          onClick={() => {
            load();
          }}
        >
          Refresh
        </Button>
      </Toolbar>
      <Divider />
      <List>
        {MENU1.map((v) => (
          <ListItem key={v.text} disablePadding>
            <ListItemButton
              onClick={() => {
                //   console.log("#2d8j onListItem_click route=" + v.route);
                setRoute(v.route);
              }}
            >
              <ListItemIcon>
                <DrawerMenuIcon icon={v.route} />
                {/* {i % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
              </ListItemIcon>
              <ListItemText primary={v.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {MENU2.map((v) => (
          <ListItem key={v.text} disablePadding>
            <ListItemButton
              onClick={() => {
                if (v.route != route) {
                  setRepoData([]);
                }
                setRoute(v.route);
              }}
            >
              <ListItemIcon>
                <DrawerMenuIcon icon={v.route} />
              </ListItemIcon>
              <ListItemText primary={v.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {pld(TOKEN).role === "kant" && (
        <>
          <Divider />
          <List>
            {MENU3.map((v) => (
              <ListItem key={v.text} disablePadding>
                <ListItemButton
                  onClick={() => {
                    if (v.route != route) {
                      setRepoData([]);
                    }
                    setRoute(v.route);
                  }}
                >
                  <ListItemIcon>
                    <DrawerMenuIcon icon={v.route} />
                  </ListItemIcon>
                  <ListItemText primary={v.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </div>
  );

  const foreignCurency = () => {
    if (cur === undefined) {
      return [];
    }
    return cur.filter((v) => Number(v.dmst > 1));
  };

  const handleRepo_submit = async (v) =>
    postData(
      "/reports",
      TOKEN,
      v,
      (d) => setRepoData(d),
      (b) => setError(b)
    );

  /* const loadCur = async () => {
    await getData(
      "/currencies",
      "reqid=sel",
      (d) => setCur(d),
      (b) => setError(b)
    );
    await getData(
      "/currencies",
      "reqid=selsub",
      (d) => setCursub(d),
      (b) => setError(b)
    );
  }; */

  const load = async () => {
    // console.log(`#74h MAIN data loaded`);
    await postData(
      "/accounts",
      TOKEN,
      { reqid: "sse" },
      (d) => setAcntData(sortAcnts(d)),
      (b) => setError(b)
    );
    await postData(
      "/rates",
      TOKEN,
      { reqid: "sse2" },
      (d) => setRateData(sortRates(d)),
      (b) => setError(b)
    );
    await getData(
      "/offers",
      "reqid=sse",
      (d) => setOfferData(d),
      (b) => setError(b)
    );
  };

  useEffect(() => {
    getData(
      "/currencies",
      "reqid=sel",
      (d) => setCur(d),
      (b) => setError(b)
    );
    getData(
      "/currencies",
      "reqid=selsub",
      (d) => setCursub(d),
      (b) => setError(b)
    );
    // loadCur();
    // const tmr = setInterval(load, 1000 * interval); //

    // SSE test
    /*const evtSource = new EventSource("http://localhost/api/va1/sse", {
      withCredentials: true,
    });
    if (typeof EventSource !== "undefined") {
      console.log("Yes! Server-sent events support!");
      // Some code.....
    } else {
      console.log("Sorry! No server-sent events support..");
    }
    const evtSource = new EventSource(`${PATH_TO_SERVER}/sse?api_token=${TOKEN}`);
    evtSource.onopen = () => {
      console.log("SSE connection to server opened.");
    };
    evtSource.onmessage = (event) => {
      console.log(`message: ${event.data}`);
    }; */

    /*const evtSource = new EventSource(`${PATH_TO_SSE}?api_token=${TOKEN}`);
    setTimeout(() => {
      evtSource.addEventListener("account_stream", (event) => {
        setAcntData(sortAcnts(JSON.parse(event.data).rslt));
        // console.log(`account_stream`);
      });
      evtSource.addEventListener("offer_stream", (event) => {
        setOfferData(JSON.parse(event.data).rslt);
        // console.log(`offer_stream:`);
      });
      evtSource.addEventListener("rate_stream", (event) => {
        setRateData(sortRates(JSON.parse(event.data).rslt));
        // console.log("rate_stream: ");
      });
    }, 5000); */
    return () => {
      // clearInterval(tmr);
      // evtSource.close();
    };
  }, []);

  useEffect(() => {
    // console.log(`#34hn useEffect RATES started`);
    tmrUpd = setTimeout(async function loadData() {
      // console.log(`#34hn render GETDATA`);
      load();
      tmrUpd = setTimeout(loadData, 1000 * interval); // (*)
    }, 0);
    return () => {
      clearTimeout(tmrUpd);
    };
  }, []);

  useEffect(() => {
    const onVisibility_changed = () => {
      if (document.visibilityState === "visible") {
        tmrUpd = setTimeout(async function loadData() {
          // console.log(`#904u visibility GETDATA`);
          load();
          tmrUpd = setTimeout(loadData, 1000 * interval); // (*)
        }, 0);
        // console.log(`#e8y useEffect turns visibile `);
      } else {
        clearTimeout(tmrUpd);
        // console.log(`#9wj useEffect turns HIDDEN `);
      }
    };

    document.addEventListener("visibilitychange", onVisibility_changed);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility_changed);
    };
  }, []);

  // Remove this const when copying and pasting into your project.
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          // bgcolor: "red",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            component="img"
            sx={{
              // height: 233,
              width: 200,
              // maxHeight: { xs: 233, md: 167 },
              maxWidth: { xs: 160, md: 240 },
            }}
            alt="Logo."
            src={`${PATH_TO_SERVER}/img/logo-kfk.png`}
          />
        </Toolbar>
      </Box>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              // bgcolor: "red",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {route == "home" && (
          <DashBoard
            acnts={acntData}
            rates={rateData}
            offers={offerData}
            kntBulk={kntBulk}
            pl={pld(TOKEN)}
          ></DashBoard>
        )}
        {route == "rate" && (
          <Stack gap={1}>
            {rateEditorData && (
              <RateEdit
                sqldata={rateData}
                role={pld(TOKEN).role}
                kantor={[
                  { id: "BULK", name: "BULK" },
                  { id: "CITY", name: "CITY" },
                  { id: "FEYA", name: "FEYA" },
                ]}
                currency={cur
                  .filter((v) => Number(v.dmst) > 1)
                  .map((v) => {
                    return {
                      id: v.id,
                      name: `${v.chid} ${v.qty == 1 ? "" : v.qty} - ${v.name}`,
                    };
                  })}
                cursub={cursub}
                kntBulk={kntBulk}
                crntknt={rateEditorData.knt} // current kantor
                fclose={() => setRateEditorData(null)}
                fsubmit={async (v) => {
                  // console.log(v);
                  await postData(
                    "/rates",
                    TOKEN,
                    v,
                    () => {
                      postData(
                        "/rates",
                        TOKEN,
                        { reqid: "ssedb" },
                        (d) => setRateData(sortRates(d)),
                        (b) => setError(b)
                      );
                    },
                    (b) => setError(b)
                  );
                }}
              />
            )}
            <Rate
              sqldata={rateData}
              kantor={KANTOR}
              cur={cur}
              delay="205"
              pl={pld(TOKEN)} //  payload
              kntBulk={kntBulk}
              kntDflt={kntDflt}
              fedit={(v) => setRateEditorData(v)}
              // fisedited={() => {
              //   return rateEditorData !== null;
              // }}
              frefresh={async (v) =>
                await postData(
                  "/rates",
                  TOKEN,
                  { reqid: "ssedb" },
                  (d) => setRateData(sortRates(d)),
                  (b) => setError(b)
                )
              }
              // fpublish={async (v) => {
              //   // console.log(v);
              //   await postData(
              //     "/pbl",
              //     TOKEN,
              //     v,
              //     () => {},
              //     (b) => setError(b)
              //   );
              // }}
              fpublish={async (v) => {
                // console.log(v);
                await publishSocial(v, (r, e) => {
                  if (e === null) {
                    // console.log(r);
                  } else {
                    setError(e);
                  }
                });
              }}
            />
          </Stack>
        )}
        {route == "offer" && (
          <>
            {!offerEditorData && (
              <Offer
                sqldata={offerData}
                delay="210"
                pl={pld(TOKEN)}
                fedit={handleOffer_edit}
              />
            )}
            {offerEditorData && (
              <OfferEdit
                offer={offerEditorData}
                kantor={[
                  { id: "BULK", name: "BULK" },
                  { id: "CITY", name: "CITY" },
                  { id: "FEYA", name: "FEYA" },
                ]}
                fsubmit={(v) =>
                  postData(
                    "/offers",
                    TOKEN,
                    v,
                    () => {
                      getData(
                        "/offers",
                        "reqid=ssedb",
                        (d) => setOfferData(d),
                        (b) => setError(b)
                      );
                      setOfferEditorData(null);
                    },
                    (b) => setError(b)
                  )
                }
                fclose={() => setOfferEditorData(null)}
                fcurrency={foreignCurency}
                maxWidth={360}
              />
            )}
          </>
        )}
        {route == "vwbalance" && <Balance data={acntData} />}
        {route == "vwrate" && (
          <RepRate sqldata={repoData} fsubmit={handleRepo_submit} />
        )}
        {route == "profit" && (
          <RepProfit
            sqldata={repoData}
            pl={pld(TOKEN)}
            fsubmit={handleRepo_submit}
          />
        )}
        {route == "chart" && (
          <ChartProfit sqldata={repoData} fsubmit={handleRepo_submit} />
        )}
        {route == "acntcash" && (
          <Box sx={{ maxWidth: { md: 360 } }}>
            <AcntScore
              title={"Каса"}
              data={acntData.filter((v) => v.shop === pld(TOKEN).term)}
              balacnt="3000"
            />
          </Box>
        )}
        {route == "acnt3002" && (
          <Box sx={{ maxWidth: { md: 360 } }}>
            <AcntScore
              title={"Депозитна комірка"}
              data={acntData.filter((v) => v.shop === pld(TOKEN).term)}
              balacnt="3002"
              onlyShift={false}
            />
          </Box>
        )}
        {route == "acnt3003" && (
          <Box sx={{ maxWidth: { md: 360 } }}>
            <AcntScore
              title={"Внутрішня інкасція"}
              data={acntData}
              balacnt="3003"
              onlyShift={false}
            />
          </Box>
        )}
        {route == "acnttrade" && (
          <Box sx={{ maxWidth: { md: 360 } }}>
            <AcntScore
              title={"TRADE"}
              data={acntData}
              balacnt="35"
              onlyShift={false}
            />
          </Box>
        )}
        {route == "acntdepo" && (
          <Box sx={{ maxWidth: { md: 360 } }}>
            <AcntScore
              title={"Борги"}
              data={acntData.filter((v) => v.shop === pld(TOKEN).term)}
              balacnt="36"
              onlyShift={false}
            />
          </Box>
        )}
        {route == "acntowner" && (
          <Box sx={{ maxWidth: { md: 360 } }}>
            <AcntScore
              title={"Капітал"}
              data={acntData.filter((v) => v.shop === pld(TOKEN).term)}
              balacnt="42"
              onlyShift={false}
            />
          </Box>
        )}
        {/* {route == "sse" && (
          <Box>
            SSE test
            {async (v) =>
              await postData(
                "/sse",
                TOKEN,
                "",
                () => {},
                (b) => setError(b)
              )
            }
          </Box>
        )} */}
      </Box>
    </Box>
  );
};

// ResponsiveDrawer.propTypes = {
//   /**
//    * Injected by the documentation to work in an iframe.
//    * Remove this when copying and pasting into your project.
//    */
//   window: PropTypes.func,
// };

// export default Main;

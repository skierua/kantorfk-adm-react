// import * as React from "react";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
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
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import RefreshIcon from "@mui/icons-material/Refresh";

import { AcntScore } from "../AcntScore";
import { DashBoard } from "./DashBoard.jsx";
import { Offer } from "./Offer.jsx";
import { OfferEdit } from "../OfferEdit";
import { Rate } from "../Rate.jsx";
import { RateEdit } from "../RateEdit";
// import { RepAcnt } from "./RepAcnt.jsx";
import { RepRate } from "../RepRate.jsx";
import { RepProfit } from "../RepProfit.jsx";
import { ChartProfit } from "../ChartProfit.jsx";
// import { DashRate } from "../DashRate";

// import { subscribe, unsubscribe } from "../../events";
import { PATH_TO_SSE, getData, postData, pld } from "../../driver";
// import { CD_KANTOR } from "../../constData";

const drawerWidth = 180;
const interval = 16; // reload interval sec

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

  // console.log("route=" + route);
  // console.log("TOKEN=" + JSON.stringify(pld(TOKEN)));

  const KANTOR = [
    { id: "BULK", name: "BULK", so: 10 },
    { id: "CITY", name: "CITY", so: 20 },
    { id: "FEYA", name: "FEYA", so: 30 },
  ];

  const sortRates = (v) => {
    const kso = (k) => {
      let knt = KANTOR.find((i) => i.id === k);
      return knt !== undefined ? knt.so : "99";
    };
    return v.sort((a, b) => {
      return a.sortorder < b.sortorder ||
        (a.sortorder === b.sortorder && kso(a.shop) < kso(b.shop))
        ? -1
        : 1;
    });
  };

  const sortAcnts = (v) => {
    const kso = (k) => {
      let knt = KANTOR.find((i) => i.id === k);
      return knt !== undefined ? knt.so : "99";
    };
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
    } else if (props.icon.substring(0, 4) == "acnt") {
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
          ПОНОВИТИ
        </Button>
      </Toolbar>
      <Divider />
      <List>
        {[
          { route: "home", text: "Home" },
          { route: "rate", text: "Rates" },
          { route: "offer", text: "Offers" },
        ].map((v) => (
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
        {[
          { route: "acntcash", text: "Каса" },
          { route: "acnt3002", text: "ДепозКом" },
          { route: "acnt3003", text: "Інкасація" },
          { route: "acnttrade", text: "TRADE" },
          { route: "acntdepo", text: "Борги" },
          { route: "acntowner", text: "Капітал" },
          // { route: "acnt", text: "" },
        ].map((v) => (
          <ListItem key={v.text} disablePadding>
            <ListItemButton
              onClick={() => {
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
      <Divider />
      <List>
        {[
          { route: "vwrate", text: "СерКурси" },
          { route: "profit", text: "Profit" },
          { route: "chart", text: "Chart" },
        ].map((v) => (
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
    </div>
  );

  const foreignCurency = () => {
    if (cur === undefined) {
      return [];
    }
    return cur.filter((v) => v.id !== "" && v.dmst !== "1");
  };

  const handleRepo_submit = async (v) => {
    // console.log(JSON.stringify(v));
    postData(
      "/reports",
      TOKEN,
      v,
      (d) => setRepoData(d),
      (b) => setError(b)
    );
  };

  // eRepoData_refresh
  /*useEffect(() => {
    subscribe("eRepoData_refresh", (v) => {
      // console.log(JSON.stringify(v.detail));
      postData("/reports", v.detail, (sqldata) => setRepoData(sqldata));
    });
    return () => unsubscribe("eRepoData_refresh", () => {});
  }); */

  const loadCur = async () => {
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
  };

  const load = async () => {
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
      { reqid: "sse" },
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
    loadCur();
    load();
    const tmr = setInterval(load, 1000 * interval); //

    return () => {
      clearInterval(tmr);
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
          // backgroundColor: "red",
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
            src="./img/logo-kfk.png"
          />
        </Toolbar>
      </Box>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
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
            crntknt={pld(TOKEN).term}
          ></DashBoard>
        )}
        {route == "rate" && (
          <Stack gap={1}>
            {rateEditorData && (
              <RateEdit
                sqldata={rateData}
                role={pld(TOKEN).role}
                kantor={[
                  { id: "CITY", name: "CITY" },
                  { id: "FEYA", name: "FEYA" },
                ]}
                currency={cur
                  .filter((v) => v.id !== "" && v.dmst !== "1")
                  .map((v) => {
                    return {
                      id: v.id,
                      name: `${v.chid} ${v.qty == 1 ? "" : v.qty} - ${v.name}`,
                    };
                  })}
                crntknt={rateEditorData.knt} // current kantor
                // TOKEN={TOKEN}
                // shop="CITY" //{pld(TOKEN).term}
                fclose={() => setRateEditorData(null)}
                fsubmit={async (v) => {
                  await postData(
                    "/rates",
                    TOKEN,
                    v,
                    () => {
                      postData(
                        "/rates",
                        TOKEN,
                        { reqid: "sse" },
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
              delay="205"
              shop={pld(TOKEN).term}
              fedit={(v) => setRateEditorData(v)}
              // fedit={() => setRateEditorData({ knt: pld(TOKEN).term })}
              // fisedited={() => {
              //   return rateEditorData !== null;
              // }}
              frefresh={async (v) =>
                await postData(
                  "/rates",
                  TOKEN,
                  { reqid: "sse" },
                  (d) => setRateData(sortRates(d)),
                  (b) => setError(b)
                )
              }
            />
          </Stack>
        )}
        {route == "offer" && (
          <>
            {!offerEditorData && (
              <Offer
                sqldata={offerData}
                delay="210"
                shop={pld(TOKEN).term}
                fedit={handleOffer_edit}
              />
            )}
            {offerEditorData && (
              <OfferEdit
                offer={offerEditorData}
                kantor={[{ id: pld(TOKEN).term, name: pld(TOKEN).term }]}
                fsubmit={(v) =>
                  postData(
                    "/offers",
                    TOKEN,
                    v,
                    () => {
                      getData(
                        "/offers",
                        "reqid=sse",
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
        {route == "acntcash" && (
          <Box sx={{ maxWidth: { md: 360 } }}>
            <AreaHeader title="Каса" />
            <AcntScore
              data={acntData.filter((v) => v.shop === pld(TOKEN).term)}
              balacnt="3000"
            />
          </Box>
        )}
        {route == "acnt3002" && (
          <Box sx={{ maxWidth: { md: 360 } }}>
            <AreaHeader title="Депозитна комірка" />
            <AcntScore
              data={acntData.filter((v) => v.shop === pld(TOKEN).term)}
              balacnt="3002"
              onlyShift={false}
            />
          </Box>
        )}
        {route == "acnt3003" && (
          <Box sx={{ maxWidth: { md: 360 } }}>
            <AreaHeader title="Внутрішня інкасція" />
            <AcntScore data={acntData} balacnt="3003" onlyShift={false} />
          </Box>
        )}
        {route == "acnttrade" && (
          <Box sx={{ maxWidth: { md: 360 } }}>
            <AreaHeader title="TRADE" />
            <AcntScore data={acntData} balacnt="35" onlyShift={false} />
          </Box>
        )}
        {route == "acntdepo" && (
          <Box sx={{ maxWidth: { md: 360 } }}>
            <AreaHeader title="Борги" />
            <AcntScore
              data={acntData.filter((v) => v.shop === pld(TOKEN).term)}
              balacnt="36"
              onlyShift={false}
            />
          </Box>
        )}
        {route == "acntowner" && (
          <Box sx={{ maxWidth: { md: 360 } }}>
            <AreaHeader title="Капітал" />
            <AcntScore
              data={acntData.filter((v) => v.shop === pld(TOKEN).term)}
              balacnt="42"
              onlyShift={false}
            />
          </Box>
        )}
        {route == "vwrate" && (
          <RepRate sqldata={repoData} fsubmit={handleRepo_submit} />
        )}
        {route == "profit" && (
          <RepProfit
            sqldata={repoData}
            knt={pld(TOKEN).term}
            fsubmit={handleRepo_submit}
          />
        )}
        {route == "chart" && (
          <ChartProfit sqldata={repoData} fsubmit={handleRepo_submit} />
        )}
      </Box>
    </Box>
  );
};

const AreaHeader = (props) => {
  const { title, ...other } = props;
  return (
    <Box
      width="100%"
      // bgcolor={"lightgrey"}
      bgcolor={"info.dark"}
      color={"info.contrastText"}
      padding={"5px 10px"}
      sx={{ mb: "0.5rem" }}
      {...other}
    >
      <Typography>{title}</Typography>
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

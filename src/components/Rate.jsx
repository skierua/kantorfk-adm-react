import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
import { Box, Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import { grey } from "@mui/material/colors";

import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShareIcon from "@mui/icons-material/Share";

import { VkToggle } from "./VkToggle";

const USDCODE = "840";
const USDCHAR = "USD";
const USDSUB = "20"; // for old $

/**
 *
 * @returns
 */
export const Rate = (props) => {
  const {
    sqldata,
    kantor,
    cur,
    pl,
    kntBulk,
    kntDflt = "CITY", // default kantor
    fedit,
    fisedited,
    frefresh,
    fpublish, // publish rates
    ...other
  } = props;
  const [knt, setKnt] = useState(pl.term);

  // console.log(
  //   sqldata.filter((v) => (knt === "" || knt === v.shop) && v.prc === "bulk")
  // );
  // console.log(
  //   sqldata.filter((v) => (knt === "" || knt === v.shop) && v.prc !== "bulk")
  // );

  const crossRate = (sub = "") => {
    let ret = [];
    let c1 = "",
      c2 = "";
    let v1, v2;
    // for (let i =0;  i < sqldata.filter((v) => v.domestic === "6").length; ++i){
    //   console.log()
    // }
    cur
      .filter((v) => v.dmst === "6")
      .forEach((vv) => {
        v1 = sqldata.find(
          (c) =>
            c.atclcode === vv.id.slice(0, 3) &&
            c.domestic === "2" &&
            (vv.id.slice(0, 3) === USDCODE ? c.scode === sub : true)
        );
        v2 = sqldata.find(
          (c) =>
            c.atclcode === vv.id.slice(-3) &&
            c.domestic === "2" &&
            (vv.id.slice(-3) === USDCODE ? c.scode === sub : true)
        );
        // console.log(v1, v2);
        if (v1 !== undefined && v2 !== undefined) {
          ret.push({
            id: vv.id,
            chid: vv.chid,
            bidask: Number(v1.bid) / Number(v2.ask),
            bidbid: Number(v1.bid) / Number(v2.bid),
            askbid: Number(v1.ask) / Number(v2.bid),
            askask: Number(v1.ask) / Number(v2.ask),
          });
        }
        // console.log(ret);
      });
    // setCross(ret);
    return ret;
  };

  const onPbl_clicked = () => {
    console.log("knt=" + knt);

    const rate = (v) => {
      return v === "" ? "--.--" : Number(v).toPrecision(4); //Number(v).toFixed(2);
    };

    const qty = (q) => {
      return q === "1" ? "" : `${q} `;
    };

    const cursub = (v, cur, shop) => {
      if (cur !== USDCHAR || shop !== kntBulk) return "";
      if (v === "20") return "білий";
      else if (v === "50") return "шмельц";
      return "синій";
    };

    const flag = (v) => {
      if (v === "USD") return "🇺🇸";
      if (v === "EUR") return "🇪🇺";
      if (v === "PLN") return "🇲🇨";
      if (v === "CZK") return "🇨🇿";
      if (v === "GBP") return "🇬🇧";
      return v; // for other currencies
    };
    let res = "";
    const vrate = sqldata
      .filter((v) => v.shop === knt && v.domestic === "2")
      .map((v) => {
        return {
          shop: v.shop,
          chid: v.chid,
          bid: v.bid,
          ask: v.ask,
          rqty: v.rqty,
          scode: v.scode,
        };
      });

    if (vrate.length !== 0) {
      res = (knt === kntBulk ? "ГУРТ" : "РОЗДРІБ") + "\n";
      res += vrate.reduce((acc, v) => {
        acc +=
          rate(v.bid) +
          " " +
          qty(v.rqty) +
          flag(v.chid) +
          " " +
          rate(v.ask, v.chid) +
          " " +
          cursub(v.scode, v.chid, v.shop) +
          "\n";
        return acc;
      }, "");
    }

    const vcros = sqldata
      .filter((v) => v.shop === knt && v.domestic === "6")
      .map((v) => {
        return {
          shop: v.shop,
          chid: v.chid,
          bid: v.bid,
          ask: v.ask,
          rqty: v.rqty,
          scode: v.scode,
        };
      });

    if (vcros.length !== 0) {
      res += res === "" ? "" : "\n";
      res += "КОНВЕРТАЦІЯ" + "\n";
      res += vcros.reduce((acc, v) => {
        acc +=
          rate(v.bid) +
          " " +
          // qty(v.rqty) +
          flag(v.chid) +
          " " +
          rate(v.ask, v.chid) +
          // " " +
          // cursub(v.scode, v.chid) +
          "\n";
        return acc;
      }, "");
    }

    // if (knt === kntBulk && res !== "") {
    res += "\n☎️ 096 001 36 00\n";
    res += "🌐 kantorfk.com\n";
    // }

    // console.log(res);

    // if (res !== "") fpublish({ msg: res });
  };

  const TblRate = (props) => {
    const { data, dmst, share, title } = props;

    const titles = () => {
      let h = knt === kntBulk ? "ГУРТ" : "РОЗДРІБ";
      let f = "";
      if (dmst === "2") {
        // h += "";
        f = "\n☎️ 096 001 36 00\n🌐 kantorfk.com";
      } else if (dmst === "4") {
        h += " ІНШІ ВАЛЮТИ";
        f = "\n☎️ 096 001 36 00\n🌐 kantorfk.com";
      } else if (dmst === "6") {
        h += " КОНВЕРТАЦІЯ";
        f = "\nКРОСКУРСИ ДЛЯ БІЛОГО ДОЛАРА\n🌐 kantorfk.com";
      }
      return { header: h, footer: f };
    };
    return (
      data.filter((v) => v.domestic === dmst).length !== 0 && (
        <TableContainer component={Paper} variant={"outlined"}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>
                  {share && (
                    <Tooltip title="Поширити" variant="soft">
                      <IconButton
                        size="small"
                        color="primary"
                        // disabled={!share}
                        onClick={() =>
                          fpublish(
                            data.filter((v) => v.domestic === dmst),
                            titles()
                          )
                        }
                      >
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {/* <Typography color={grey[500]}>name</Typography> */}
                </TableCell>
                <TableCell align="center">
                  <Typography color={grey[500]}>bid</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography color={grey[500]}>ask</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .filter((v) => v.domestic === dmst)
                .map((v) => {
                  return (
                    <TableRow
                      id={`id-${v.chid}-${v.shop}-${v.scode}-${v.prc}`}
                      key={`key-${v.chid}-${v.shop}-${v.scode}-${v.prc}`}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <Typography>{v.chid}</Typography>
                          {knt === "" && (
                            <Typography variant="caption">{v.shop}</Typography>
                          )}
                          <Typography color={grey[800]} variant="caption">
                            {v.sname}
                          </Typography>
                          {Number(v.rqty) !== 1 && (
                            <Typography variant="caption">{v.rqty}</Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color={grey[800]}>
                          {!isNaN(v.bid)
                            ? Number(v.bid) !== 0
                              ? Number(v.bid).toPrecision(4)
                              : ""
                            : v.bid}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color={grey[800]}>
                          {!isNaN(v.ask)
                            ? Number(v.ask) !== 0
                              ? Number(v.ask).toPrecision(4)
                              : ""
                            : v.ask}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )
    );
  };

  // useEffect(() => {
  //   setCross(crossRate());
  //   return () => {};
  // }, [sqldata]);
  // crossRate();

  return (
    <Box sx={{ maxWidth: { md: 360 } }} {...other}>
      <Box></Box>
      <Stack gap={2} width="100%">
        <Stack
          direction={"row"}
          gap={1}
          width="100%"
          sx={{ justifyContent: "space-between" }}
        >
          <Tooltip title="Поновити">
            <IconButton size="small" color="primary" onClick={() => frefresh()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <VkToggle data={kantor} dflt={knt} fcb={(v) => setKnt(v)} />
          <Tooltip title="Редагувати" variant="soft">
            <IconButton
              size="small"
              color="primary"
              disabled={
                knt === "" ||
                (pl.role === "owner"
                  ? false
                  : knt !== pl.term && knt != kntBulk)
              }
              onClick={() => fedit({ knt: knt })}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Поширити" variant="soft">
            <IconButton
              size="small"
              color="primary"
              disabled={knt === "" || pl.role !== "owner"}
              onClick={() => onPbl_clicked()}
            >
              <ShareIcon />
            </IconButton>
          </Tooltip> */}
          {/* <Button
            variant="contained"
            size="small"
            disabled={knt === "" || pl.role !== "owner"}
            onClick={
              () => onPbl_clicked()
              // onPbl_clicked({ reqid: "rates", shop: kntBulk, class: "2" })
            } // publish rates
          >
            Publish
          </Button> */}
        </Stack>
        {sqldata.filter(
          (v) => (knt === "" || knt === v.shop) && v.prc === "bulk"
        ).length != 0 && (
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead sx={{ backgroundColor: "#57ba98" }}>
                <TableRow>
                  <TableCell>
                    <Typography color={grey[600]}>ГУРТ</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography color={grey[600]}>купівля</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography color={grey[600]}>продаж</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ backgroundColor: "#57ba98" }}>
                {sqldata
                  .filter(
                    (v) => (knt === "" || knt === v.shop) && v.prc === "bulk"
                  )
                  .map((v) => {
                    return (
                      // (Number(v.f6) !== 0 || Number(v.f8) !== 0) && (
                      <TableRow
                        id={`id-${v.chid}-${v.shop}-${v.scode}-${v.prc}`}
                        key={`key-${v.chid}-${v.shop}-${v.scode}-${v.prc}`}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <Typography>{v.chid}</Typography>
                            {knt === "" && (
                              <Typography variant="caption">
                                {v.shop}
                              </Typography>
                            )}
                            <Typography color={grey[800]} variant="caption">
                              {v.sname}
                            </Typography>
                            {Number(v.rqty) !== 1 && (
                              <Typography variant="caption">
                                {v.rqty}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography>
                            {Number(v.bid) !== 0
                              ? Number(v.bid).toPrecision(4)
                              : ""}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1">
                            {Number(v.ask) !== 0
                              ? Number(v.ask).toPrecision(4)
                              : ""}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      // )
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TblRate
          data={sqldata.filter(
            (v) => (knt === "" || knt === v.shop) && v.prc !== "bulk"
          )}
          dmst={"2"}
          share={knt !== "" && pl.role === "owner"}
          title={"TITLE"}
        />
        <TblRate
          data={sqldata.filter(
            (v) => (knt === "" || knt === v.shop) && v.prc !== "bulk"
          )}
          dmst={"4"}
          share={false}
          title={"TITLE"}
        />
        <TblRate
          data={sqldata.filter(
            (v) => (knt === "" || knt === v.shop) && v.prc !== "bulk"
          )}
          dmst={"6"}
          share={knt !== "" && pl.role === "owner"}
          title={"TITLE"}
        />
        <TblCross data={crossRate(USDSUB)} title={"($100 білий)"} />
        <TblCross data={crossRate()} title={"($100 синій)"} />
      </Stack>
    </Box>
  );
};

// Table for cross rates
const TblCross = (props) => {
  const { data, title } = props;
  return (
    <TableContainer>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow bgcolor={"#f2f2f2"}>
            <TableCell colSpan={3}>
              <Typography>КросКурси по ГУРТ {title}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <Typography color={grey[500]}>NAME</Typography>
            </TableCell>
            <TableCell align="center">
              <Box>
                <Typography color={grey[500]}>bid/bid</Typography>
                <Typography color={grey[500]}>bid/ask</Typography>
              </Box>
            </TableCell>
            <TableCell align="center">
              <Box>
                <Typography color={grey[500]}>ask/bid</Typography>
                <Typography color={grey[500]}>ask/ask</Typography>
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((v) => {
            return (
              <TableRow
                id={`id-${v.id}`}
                key={`key-${v.id}`}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell align="left"> {v.chid}</TableCell>
                <TableCell align="center">
                  <Box>
                    <Typography>{v.bidbid.toPrecision(5)}</Typography>
                    <Typography>{v.bidask.toPrecision(5)}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box>
                    <Typography>{v.askbid.toPrecision(5)}</Typography>
                    <Typography>{v.askask.toPrecision(5)}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// last time change
const lt = (data, knt) => {
  return data
    .filter((v) => v.shop === knt && v.prc !== "bulk")
    .reduce(
      (t, v) =>
        (t =
          t < v.bidtm.substring(0, 10)
            ? v.bidtm.substring(0, 10)
            : t < v.asktm.substring(0, 10)
            ? v.asktm.substring(0, 10)
            : t),
      ""
    );
};

//  humanDate
function hd(vdate) {
  if (vdate === undefined || vdate === "") {
    return "";
  }
  let vnd = new Date();
  let vcd = new Date(vdate);
  // !!! FOR TESTING
  // return vcd.toLocaleTimeString("en-GB").substring(0, 5);
  if (vnd.toISOString().substring(0, 10) === vdate.substring(0, 10)) {
    return vcd.toLocaleTimeString("en-GB").substring(0, 5);
  }
  return vcd.toISOString().substring(0, 10);
}

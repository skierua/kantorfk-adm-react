import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { grey, red } from "@mui/material/colors";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandMore";

import { VkToggle } from "./VkToggle";

/**
 *
 * @param {*} props
 * @param {*} data    data array
 * @param {*} balacnt balance account for filter
 * @param {*} onlyShift true show only last shift
 * @param {*} showTurn show/hide turnovers
 * @returns
 */
export const AcntScore = (props) => {
  const { data, balacnt, onlyShift, showTurn, ...other } = props;
  const [knt, setKnt] = useState("");
  const [acnt, setAcnt] = useState("");

  // last  change
  const lch = (d) => {
    return d.reduce(
      (t, v) => (t = t < v.tm.substring(0, 10) ? v.tm.substring(0, 10) : t),
      ""
    );
  };

  const balmode = () => {
    if (balacnt.substring(0, 2) === "30") {
      return true;
    }
    return false;
  };

  const dataset = () => {
    return data.filter(
      (d) =>
        d.acntno.substring(0, balacnt.length) === balacnt &&
        (knt === "" || d.shop === knt) &&
        (acnt === "" || d.acntno.substring(0, 4) === acnt)
    );
  };

  const agregate = () => {
    let lst = [];
    // const nd = data.filter(
    //   (d) =>
    //     d.acntno.substring(0, balacnt.length) === balacnt &&
    //     (knt === "" || d.shop === knt)
    // );
    const nd = dataset();
    const shft = lch(nd);
    const osh = onlyShift ?? true; // onlyShift
    let cshft = ""; // currency shift
    // console.log(shft);
    nd.forEach((v) => {
      cshft = nd
        .filter((f) => f.chid === v.chid)
        .reduce((t, v) => (t = t < v.tm ? v.tm : t), "");
      //   lch(nd.filter((f) => f.chid === v.chid));
      if (!lst.some((l) => l.chid === v.chid)) {
        if (!osh || (osh && cshft.substring(0, 10) === shft)) {
          lst.push({
            id: v.id,
            chid: v.chid,
            shop: "",
            amnt: "",
            income: "",
            outcome: "",
            tm: cshft,
            acntno: balacnt,
          });
        }
      }
    });
    lst.forEach((v) => {
      v.amnt = nd
        .filter((f) => f.chid === v.chid)
        .reduce((t, d) => (t += Number(d.amnt)), 0)
        .toFixed(2);
      // console.log(JSON.stringify(v));
      if (v.tm.substring(0, 10) === shft) {
        v.income = nd
          .filter((f) => f.chid === v.chid && f.tm.substring(0, 10) === shft)
          .reduce((t, d) => (t += Number(d.turndbt)), 0)
          .toFixed(2);
        v.outcome = nd
          .filter((f) => f.chid === v.chid && f.tm.substring(0, 10) === shft)
          .reduce((t, d) => (t += Number(d.turncdt)), 0)
          .toFixed(2);
      }
    });
    // console.log(
    //   JSON.stringify(
    //     nd.filter((f) => f.chid === "USD" && f.tm.substring(0, 10) === shft)
    //   )
    // );
    return lst;
  };

  const kntlist = () => {
    let lst = [];
    data
      .filter((d) => d.acntno.substring(0, balacnt.length) === balacnt)
      .forEach((f) => {
        if (!lst.some((l) => l.id === f.shop)) {
          lst.push({ id: f.shop, name: f.shop, so: f.shso });
        }
      });
    return lst.sort((a, b) => {
      return Number(a.so) - Number(b.so);
    });
  };

  const acntlist = () => {
    let lst = [];
    data
      .filter((d) => d.acntno.substring(0, balacnt.length) === balacnt)
      .forEach((f) => {
        if (!lst.some((l) => l.id === f.acntno.substring(0, 4))) {
          lst.push({
            id: f.acntno.substring(0, 4),
            name: f.acntno.substring(2, 4),
          });
        }
      });
    return lst.sort((a, b) => {
      return Number(a.id) - Number(b.id);
    });
  };

  useEffect(() => {
    // console.log(`#257 AdmOffer/useEffect started`);
    return () => {};
  }, []);
  return (
    <Box sx={{ justifyItems: "center" }} {...other}>
      {/* <Stack direction={"row"} gap={1}> */}
      {/* <Box> */}
      <Stack
        direction={"row"}
        gap={1}
        // width="100%"
        sx={{ justifyContent: "space-between" }}
      >
        {kntlist().length > 1 && (
          <VkToggle
            data={kntlist()}
            dflt={knt}
            label="Кантор"
            limit={3}
            fcb={(v) => setKnt(v)}
          />
        )}
        {acntlist().length > 1 && (
          <VkToggle
            data={acntlist()}
            dflt={acnt}
            label="Кантор"
            limit={3}
            fcb={(v) => setAcnt(v)}
          />
        )}
      </Stack>
      <Tbl
        tdata={agregate()}
        shift={lch(agregate())}
        dataset={dataset()}
        balmode={balmode()}
        showTurn={showTurn ?? true}
      />
      {/* </Box> */}
      {/* </Stack> */}
    </Box>
  );
};

//  humanDate
const hd = (vdate) => {
  if (vdate === undefined || vdate === "") {
    return "";
  }
  // return vdate;
  let vnd = new Date();
  let vcd = new Date(vdate);
  //   return "" + Math.floor((vnd - vcd) / (24 * 60 * 60 * 1000)) + "дн";
  if (1 < (vnd - vcd) / (365 * 24 * 60 * 60 * 1000)) {
    return "" + Math.floor((vnd - vcd) / (365 * 24 * 60 * 60 * 1000)) + "рік";
  } else if (1 < (vnd - vcd) / (30 * 24 * 60 * 60 * 1000)) {
    return "" + Math.floor((vnd - vcd) / (30 * 24 * 60 * 60 * 1000)) + "міс";
  } else if (1 < (vnd - vcd) / (7 * 24 * 60 * 60 * 1000)) {
    return "" + Math.floor((vnd - vcd) / (7 * 24 * 60 * 60 * 1000)) + "тиж";
  } else if (2 <= (vnd - vcd) / (24 * 60 * 60 * 1000)) {
    return "" + Math.floor((vnd - vcd) / (24 * 60 * 60 * 1000)) + "дн";
  } else if (1 < (vnd - vcd) / (24 * 60 * 60 * 1000)) {
    return "Вч " + vdate.substr(-5);
  }
  //  else {
  //     vdate = vdate.substr(11, 5);
  //   }

  return vdate.substring(11, 17);
};

/**
 *
 * @param {string} amnt
 * @param {string} d date
 * @param {string} l lastChange date
 * @returns
 */
const hue = (d, l, amnt = "1") => {
  // console.log(`tm=${d.substring(0, 10)} shift=${l}`);
  if (d.substring(0, 10) === l) {
    return Number(amnt) < 0 ? red[900] : grey[900];
  } else {
    return Number(amnt) < 0 ? red[300] : grey[500];
  }
};

const SubRow = (props) => {
  const { rdata, shift, balmode, showTurn, ...other } = props;
  return (
    <TableRow
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
      }}
      {...other}
    >
      {/* <TableCell /> */}
      <TableCell>
        <Typography fontSize={"90%"} color={hue(rdata.tm, shift)}>
          {rdata.shop}
        </Typography>
      </TableCell>
      {balmode && (
        <TableCell align="right">
          <Typography fontSize={"90%"} color={hue(rdata.tm, shift, rdata.amnt)}>
            {Math.abs(rdata.amnt).toLocaleString("uk-UA", {
              maximumFractionDigits: 0,
            })}
          </Typography>
        </TableCell>
      )}
      {!balmode && (
        <TableCell align="right">
          <Typography
            fontSize={"90%"}
            color={hue(rdata.tm, shift, 0 - Number(rdata.amnt))}
          >
            {Math.abs(rdata.amnt).toLocaleString("uk-UA", {
              maximumFractionDigits: 0,
            })}
          </Typography>
        </TableCell>
      )}
      {showTurn && (
        <TableCell align="right">
          <div>
            <Typography fontSize={"80%"} color={hue(rdata.tm, shift)}>
              {Math.abs(balmode ? rdata.turndbt : rdata.turncdt).toLocaleString(
                "uk-UA",
                {
                  maximumFractionDigits: 0,
                }
              )}
            </Typography>
            <Typography fontSize={"80%"} color={hue(rdata.tm, shift)}>
              {Math.abs(balmode ? rdata.turncdt : rdata.turndbt).toLocaleString(
                "uk-UA",
                {
                  maximumFractionDigits: 0,
                }
              )}
            </Typography>
          </div>
        </TableCell>
      )}
      <TableCell align="right">
        <div>
          <Typography fontSize={"80%"} color={hue(rdata.tm, shift)}>
            {hd(rdata.tm)}
          </Typography>
          <Typography fontSize={"80%"} color={hue(rdata.tm, shift)}>
            {rdata.acntno}
          </Typography>
        </div>
      </TableCell>
    </TableRow>
  );
};

const SubTbl = (props) => {
  const { tdata, balmode, shift, showTurn } = props;
  //   console.log(tdata);
  return (
    <Table size="small" aria-label="shop's amount">
      <TableBody>
        {/* <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
            <TableCell padding="none">qqqqqqqq</TableCell>
          </TableRow> */}
        {tdata.map((v) => {
          return (
            <SubRow
              key={`${v.chid}-${v.shop}-${v.acntno}`}
              rdata={v}
              balmode={balmode}
              shift={shift}
              showTurn={showTurn}
            />
          );
        })}
      </TableBody>
    </Table>
  );
};

const Row = (props) => {
  const { row, tsub, balmode, shift, showTurn } = props;
  const [open, setOpen] = React.useState(false);
  // console.log(row);
  return (
    <React.Fragment>
      <TableRow
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
          "& > *": { borderBottom: "unset" },
        }}
      >
        <TableCell padding="none">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </TableCell>
        <TableCell padding="none">
          <Typography fontSize={"125%"} color={hue(row.tm, shift)}>
            {row.chid}
          </Typography>
        </TableCell>
        {balmode && (
          <TableCell align="right">
            <Typography fontSize={"125%"} color={hue(row.tm, shift, row.amnt)}>
              {Math.abs(row.amnt).toLocaleString("uk-UA", {
                maximumFractionDigits: 0,
              })}
            </Typography>
          </TableCell>
        )}
        {!balmode && (
          <TableCell align="right">
            <Typography
              fontSize={"125%"}
              color={hue(row.tm, shift, 0 - Number(row.amnt))}
            >
              {Math.abs(0 - Number(row.amnt)).toLocaleString("uk-UA", {
                maximumFractionDigits: 0,
              })}
            </Typography>
          </TableCell>
        )}
        {showTurn && (
          <TableCell align="right">
            <div>
              <Typography fontSize={"90%"} color={hue(row.tm, shift)}>
                {Math.abs(balmode ? row.income : row.outcome).toLocaleString(
                  "uk-UA",
                  {
                    maximumFractionDigits: 0,
                  }
                )}
              </Typography>
              <Typography fontSize={"90%"} color={hue(row.tm, shift)}>
                {Math.abs(balmode ? row.outcome : row.income).toLocaleString(
                  "uk-UA",
                  {
                    maximumFractionDigits: 0,
                  }
                )}
              </Typography>
            </div>
          </TableCell>
        )}
        <TableCell align="right">
          <Typography fontSize={"90%"} color={hue(row.tm, shift)}>
            {hd(row.tm)}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell padding="none" colSpan={6}>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            sx={{ marginLeft: "10px" }}
          >
            <SubTbl
              tdata={tsub}
              balmode={balmode}
              shift={shift}
              showTurn={showTurn}
            />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const Tbl = (props) => {
  const { tdata, shift, dataset, balmode, showTurn } = props;
  return (
    <TableContainer>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography color={grey[500]}></Typography>
            </TableCell>
            <TableCell align="center">
              <Typography color={grey[500]}></Typography>
            </TableCell>
            <TableCell align="right">
              <Typography color={grey[500]}></Typography>
            </TableCell>
            <TableCell align="right">
              <Typography color={grey[500]}></Typography>
            </TableCell>
            <TableCell align="right">
              <Typography color={grey[500]}></Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tdata.map((v) => {
            return (
              <Row
                key={`key-${v.acntno}-${v.chid}`}
                row={v}
                tsub={dataset.filter((d) => d.chid === v.chid)}
                balmode={balmode}
                shift={shift}
                showTurn={showTurn}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

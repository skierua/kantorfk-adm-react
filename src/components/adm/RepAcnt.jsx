import React, { useEffect, useState, useRef } from "react";
import { Box, Stack, Typography } from "@mui/material";
// import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { grey, red } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandMore";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { publish } from "../../events";
// import { postFetch } from "../../driver";

export const RepAcnt = (props) => {
  const { sqldata, delay, fsubmit, ...other } = props;
  const [acnt, setAcnt] = useState("35");

  // main menu
  const vmenu = [
    { name: "Trade", acnt: "35", base: true },
    { name: "Каса", acnt: "3000", base: true },
    { name: "ДК", acnt: "3002", base: true },
    { name: "Борг", acnt: "36", base: true },
  ];

  // other menu
  const omenu = [
    { name: "", acnt: "30" },
    { name: "Каса", acnt: "3000" },
    { name: "ДК", acnt: "3002" },
    { name: "", acnt: "3003" },
    { name: "Trade", acnt: "35" },
    { name: "", acnt: "3500" },
    { name: "", acnt: "3501" },
    { name: "Борг", acnt: "36" },
    { name: "", acnt: "3600" },
    { name: "", acnt: "3602" },
    { name: "", acnt: "3605" },
    { name: "", acnt: "3607" },
    { name: "Кап", acnt: "42" },
  ];

  // last  change
  const lch = () => {
    return sqldata.reduce(
      (t, v) => (t = t < v.tm.substring(0, 10) ? v.tm.substring(0, 10) : t),
      ""
    );
  };

  // view data
  const dd = () => {
    let tdata = [];
    let r = 0;
    if (sqldata.length != 0) {
      sqldata.map((v) => {
        if (r === 0 || tdata[r - 1].code !== v.chid) {
          tdata.push({
            id: v.id,
            code: v.chid,
            total: 0,
            income: 0,
            outcome: 0,
            tm: "",
            expanded: false,
            chld: [],
          });
          ++r;
        }
        tdata[r - 1].chld.push(v);
        tdata[r - 1].total += Number(v.total);
        if (v.tm.substring(0, 10) === lch()) {
          tdata[r - 1].income += Number(v.income);
          tdata[r - 1].outcome += Number(v.outcome);
        }
        if (tdata[r - 1].tm < v.tm) {
          tdata[r - 1].tm = v.tm;
        }
      });
    }
    return tdata;
  };

  useEffect(() => {
    // console.log("#22223 useEffect fired");
    fsubmit({ reqid: "acnt", code: acnt });
    const tmr = setInterval(
      () => fsubmit({ reqid: "acnt", code: acnt }),
      1000 * delay
    ); //
    return () => clearInterval(tmr);
  }, [acnt, delay]);

  return (
    // <Stack gap={1} width="100%" sx={{ maxWidth: { md: 360 } }}>
    <Box sx={{ maxWidth: { md: 360 } }} {...other}>
      <Stack
        direction={"row"}
        gap={1}
        width="100%"
        mb={1}
        sx={{ justifyContent: "space-between" }}
      >
        <ToggleButtonGroup
          id="acntbase"
          value={acnt}
          onChange={(e) => setAcnt(e.target.value)}
          aria-label="kantor selector"
          size="small"
          exclusive
          // sx={{ justifyContent: "center" }}
        >
          {omenu.map((v) => {
            if (v.name !== "") {
              return (
                <ToggleButton
                  id={`acntList_${v.acnt}`}
                  key={`acntList_${v.acnt}`}
                  value={v.acnt}
                  aria-label={v.acnt}
                >
                  {v.name}
                </ToggleButton>
              );
            }
          })}
        </ToggleButtonGroup>
        {omenu.length != 0 && (
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <InputLabel id="acntmore-label">More</InputLabel>
            <Select
              labelId="acntmore-label"
              id="acntmore"
              value={acnt}
              // defaultValue=""
              label="More"
              onChange={(e) => setAcnt(e.target.value)}
              autoWidth
            >
              {omenu.map((v) => {
                return (
                  <MenuItem
                    id={`acntItem_${v.acnt}`}
                    key={`acntItem__${v.acnt}`}
                    value={v.acnt}
                    aria-label={v.acnt}
                  >
                    {v.name || v.acnt}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
      </Stack>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table" width="100%">
          <TableBody>
            {dd().map((row) => (
              <Row key={`${row.code}/${row.acntno}`} shift={lch()} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const Row = (props) => {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  // const cred = props.shift == row.tm.substring(0, 10) ? red[900] : red[500];
  // const cgrey = props.shift == row.tm.substring(0, 10) ? grey[900] : grey[500];
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell padding="none">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </TableCell>
        {/* <TableCell component="th" scope="row"> */}
        <TableCell padding="none">
          <Typography fontSize={"125%"} color={hue(1, row.tm, props.shift)}>
            {row.code}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography
            fontSize={"125%"}
            color={hue(row.total, row.tm, props.shift)}
          >
            {Math.abs(row.total).toLocaleString("uk-UA", {
              maximumFractionDigits: 0,
            })}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <div>
            <Typography fontSize={"90%"} color={hue(1, row.tm, props.shift)}>
              {Math.abs(row.income).toLocaleString("uk-UA", {
                maximumFractionDigits: 0,
              })}
            </Typography>
            <Typography fontSize={"90%"} color={hue(1, row.tm, props.shift)}>
              {Math.abs(row.outcome).toLocaleString("uk-UA", {
                maximumFractionDigits: 0,
              })}
            </Typography>
          </div>
        </TableCell>
        <TableCell align="right">
          <Typography fontSize={"90%"} color={hue(1, row.tm, props.shift)}>
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
            {/* <Box sx={{ margin: 1 }}> */}
            <Table size="small" aria-label="shop's amount">
              <TableBody>
                {row.chld.map((itm) => (
                  <TableRow
                    key={`${itm.chid}/${itm.shop}/${itm.acntno}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell />
                    <TableCell>
                      <Typography
                        fontSize={"90%"}
                        color={hue(1, itm.tm, props.shift)}
                      >
                        {itm.shop}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        fontSize={"90%"}
                        color={hue(itm.total, itm.tm, props.shift)}
                      >
                        {Math.abs(itm.total).toLocaleString("uk-UA", {
                          maximumFractionDigits: 0,
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <div>
                        <Typography
                          fontSize={"80%"}
                          color={hue(1, itm.tm, props.shift)}
                        >
                          {Math.abs(itm.income).toLocaleString("uk-UA", {
                            maximumFractionDigits: 0,
                          })}
                        </Typography>
                        <Typography
                          fontSize={"80%"}
                          color={hue(1, itm.tm, props.shift)}
                        >
                          {Math.abs(itm.outcome).toLocaleString("uk-UA", {
                            maximumFractionDigits: 0,
                          })}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      <div>
                        <Typography
                          fontSize={"80%"}
                          color={hue(1, itm.tm, props.shift)}
                        >
                          {hd(itm.tm)}
                        </Typography>
                        <Typography
                          fontSize={"80%"}
                          color={hue(1, itm.tm, props.shift)}
                        >
                          {itm.acntno}
                        </Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* </Box> */}
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const hue = (t, d, l) => {
  // console.log(`tm=${d.substring(0, 10)} shift=${l}`);
  if (d.substring(0, 10) === l) {
    return t < 0 ? red[900] : grey[900];
  } else {
    return t < 0 ? red[300] : grey[500];
  }
};

function hd(vdate, vshift = false) {
  if (vdate === undefined || vdate === "") {
    return "";
  }
  // if (vshift) {
  //   return vdate.substr(-5);
  // }
  let vnd = new Date();
  let vcd = new Date(vdate);
  //     return ''+Math.floor((vnd-vcd)/(24*60*60*1000))+'дн';
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
  } else {
    vdate = vdate.substr(11, 5);
  }

  return vdate;
}

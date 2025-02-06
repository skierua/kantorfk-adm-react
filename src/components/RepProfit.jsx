import React, { useEffect, useState, useRef } from "react";
import { Alert, Box, Stack, Typography } from "@mui/material";
// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import { IconButton } from "@mui/material";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  // ListSubheader,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
// import ToggleButton from "@mui/material/ToggleButton";
// import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import dayjs from "dayjs";
// import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { grey, red } from "@mui/material/colors";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export const RepProfit = (props) => {
  const { sqldata, knt, fsubmit } = props;
  const [period, setPeriod] = useState(new Date());
  const [repo, setRepo] = useState("kntprofit");

  // becouse UTC date is returned (previous day)
  // const onChange_period = (v) => {
  //   // console.log(`#83jm RepProfit/onChange_period newDate=${v}`);
  //   prd.current = v; //new Date(v);
  //   load();
  // };

  // date difference
  const ddif = (d1, d2) => {
    return (
      new Date(d1).getMonth() -
      new Date(d2).getMonth() +
      12 * (new Date(d1).getFullYear() - new Date(d2).getFullYear())
    );
  };

  // view data
  const vd = () => {
    let ret = { column: [], total: [], dataset: [] };
    let tdata = [],
      tcolumn = [],
      ttotal = [0, 0, 0];
    let c0 = 0,
      c1 = 0,
      c2 = 0;
    sqldata.map((v) => {
      //   col = ddif(period, v.period);
      if (c0 === 0 || tdata[c0 - 1].code !== v.gr0) {
        // console.log(`#862g d=${v.period} diff=${ddif(period, v.period)}`);
        tdata.push({
          id: v.so + "/" + v.gr0,
          code: v.gr0,
          amnt: [0, 0, 0],
          chld: [],
        });
        ++c0;
        c1 = 0;
        c2 = 0;
      }
      if (c1 === 0 || tdata[c0 - 1].chld[c1 - 1].code !== v.gr1) {
        tdata[c0 - 1].chld.push({
          id: v.so + "/" + v.gr1,
          code: v.gr1,
          amnt: [0, 0, 0],
          chld: [],
        });
        ++c1;
        c2 = 0;
      }
      if (
        c2 === 0 ||
        tdata[c0 - 1].chld[c1 - 1].chld.length === 0 ||
        tdata[c0 - 1].chld[c1 - 1].chld[c2 - 1].code !== v.code
      ) {
        tdata[c0 - 1].chld[c1 - 1].chld.push({
          id: v.so + "/" + v.code,
          code: v.code,
          amnt: [0, 0, 0],
        });
        ++c2;
      }
      tcolumn[ddif(period, v.period)] = v.period;
      ttotal[ddif(period, v.period)] += Number(v.amnt);
      tdata[c0 - 1].amnt[ddif(period, v.period)] += Number(v.amnt);
      tdata[c0 - 1].chld[c1 - 1].amnt[ddif(period, v.period)] += Number(v.amnt);
      tdata[c0 - 1].chld[c1 - 1].chld[c2 - 1].amnt[ddif(period, v.period)] +=
        Number(v.amnt);
    });
    // console.log("#73t");
    return { column: tcolumn, total: ttotal, dataset: tdata };
  };

  useEffect(() => {
    // console.log("#22223 useEffect fired");
    let pto = new Date(period);
    pto.setMinutes(pto.getMinutes() - pto.getTimezoneOffset());
    let pfrom = new Date(period);
    pfrom.setMinutes(pto.getMinutes() - pfrom.getTimezoneOffset());
    pfrom.setMonth(pfrom.getMonth() - 3);
    fsubmit({
      reqid: repo,
      shop: knt ?? "",
      from: pfrom.toISOString().substring(0, 7),
      to: pto.toISOString().substring(0, 7),
    });
    return () => {};
  }, [repo, period]);

  return (
    <Stack gap={1} width="100%" sx={{ maxWidth: { md: 360 } }}>
      <Stack
        direction={"row"}
        gap={1}
        width="100%"
        alignItems={"center"}
        sx={{ justifyContent: "space-between" }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs} padding="none">
          {/* <DemoContainer components={["DatePicker"]}> */}
          <DatePicker
            label="Початок"
            views={["month", "year"]}
            slotProps={{ textField: { size: "small" } }}
            // defaultValue={dayjs(new Date())}
            value={dayjs(period)}
            onChange={(v) => {
              setPeriod(new Date(v));
            }}
            format="MM-YYYY"
            closeOnSelect={true}
            disableFuture={true}
          />
          {/* </DemoContainer> */}
        </LocalizationProvider>
        {/* <Box sx={{ paddingTop: "8px" }}> */}
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <InputLabel id="repcode-label">Звіт</InputLabel>
          <Select
            labelId="repcode-label"
            id="repcode"
            value={repo}
            label="Звіт"
            // onChange={handleSelectChange}
            onChange={(e) => setRepo(e.target.value)}
            autoWidth
          >
            {[
              { name: "КНТ дохід", val: "kntprofit" },
              // { name: "КНТ скуп вал", val: "kntbuyQty" },
              // { name: "КНТ скуп ₴", val: "kntbuy" },
              // { name: "КНТ операції", val: "kntbuyEvent" },
              // { name: "КНТ дохід/грн", val: "kntprofitToBuy" },
              { name: "ВАЛ дохід", val: "curprofit" },
              // { name: "ВАЛ скуп вал", val: "curbuyQty" },
              // { name: "ВАЛ скуп ₴", val: "curbuy" },
              // { name: "ВАЛ операції", val: "curbuyEvent" },
              // { name: "ВАЛ дохід/грн", val: "curprofitToBuy" },
              { name: "Касир дохід", val: "cshprofit" },
            ].map((v, i) => {
              return (
                <MenuItem
                  id={`repItem_${v.val}`}
                  key={`repItem__${v.val}`}
                  value={v.val}
                  aria-label={v.val}
                >
                  {v.name === "" ? v.val : v.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        {/* </Box> */}
      </Stack>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table" width="100%">
          <TableHead>
            <TableRow>
              {/* <TableCell padding="none" /> */}
              <TableCell padding="none" align="center" colSpan={2}>
                <Typography color={grey[500]}>назва</Typography>
              </TableCell>
              <TableCell padding="none" align="center">
                <Typography color={grey[500]}>{vd().column[0]}</Typography>
              </TableCell>
              <TableCell padding="none" align="center">
                <Typography color={grey[500]}>{vd().column[1]}</Typography>
              </TableCell>
              <TableCell padding="none" align="center">
                <Typography color={grey[500]}>{vd().column[2]}</Typography>
              </TableCell>
            </TableRow>
            <TableRow
              id="total"
              sx={{
                "& > *": { borderBottom: "unset" },
                backgroundColor: grey[800],
                color: grey[200],
              }}
            >
              <TableCell padding="none" align="center" colSpan={2}>
                <Typography fontSize={"125%"} color={grey[200]}>
                  Всього
                </Typography>
              </TableCell>
              <TableCell align="right">
                {show(repo)[0] && vd().total[0] !== 0 && (
                  <Typography
                    fontSize={"125%"}
                    color={vd().total[0] < 0 ? red[100] : grey[200]}
                  >
                    {Math.abs(vd().total[0]).toLocaleString("uk-UA", {
                      maximumFractionDigits: 0,
                    })}
                  </Typography>
                )}
              </TableCell>
              <TableCell align="right">
                {show(repo)[0] && vd().total[1] !== 0 && (
                  <Typography
                    fontSize={"125%"}
                    color={vd().total[1] < 0 ? red[100] : grey[200]}
                  >
                    {Math.abs(vd().total[1]).toLocaleString("uk-UA", {
                      maximumFractionDigits: 0,
                    })}
                  </Typography>
                )}
              </TableCell>
              <TableCell align="right">
                {show(repo)[0] && vd().total[2] !== 0 && (
                  <Typography
                    fontSize={"125%"}
                    color={vd().total[2] < 0 ? red[100] : grey[200]}
                  >
                    {Math.abs(vd().total[2]).toLocaleString("uk-UA", {
                      maximumFractionDigits: 0,
                    })}
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vd().dataset.map((row) => (
              <Row key={"k_" + row.id} row={row} repo={repo} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

function Row(props) {
  const { row } = props;
  const [l0open, setL0open] = React.useState(false);
  // const [l1open, setL1open] = React.useState(false);
  // const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow
        id={row.id}
        key={"k_" + row.id}
        sx={{
          "& > *": { borderBottom: "unset" },
          backgroundColor: "whitesmoke",
        }}
      >
        <TableCell padding="none">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setL0open(!l0open)}
          >
            {l0open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell padding="none">
          <Typography fontSize={"125%"}>{row.code}</Typography>
        </TableCell>
        <TableCell align="right">
          {show(props.repo)[0] && row.amnt[0] !== 0 && (
            <Typography
              fontSize={"125%"}
              color={row.amnt[0] < 0 ? "red" : "black"}
            >
              {Math.abs(row.amnt[0]).toLocaleString("uk-UA", {
                maximumFractionDigits: 0,
              })}
            </Typography>
          )}
        </TableCell>
        <TableCell align="right">
          {show(props.repo)[0] && row.amnt[1] !== 0 && (
            <Typography
              fontSize={"125%"}
              color={row.amnt[1] < 0 ? "red" : "black"}
            >
              {Math.abs(row.amnt[1]).toLocaleString("uk-UA", {
                maximumFractionDigits: 0,
              })}
            </Typography>
          )}
        </TableCell>
        <TableCell align="right">
          {show(props.repo)[0] && row.amnt[2] !== 0 && (
            <Typography
              fontSize={"125%"}
              color={row.amnt[2] < 0 ? "red" : "black"}
            >
              {Math.abs(row.amnt[2]).toLocaleString("uk-UA", {
                maximumFractionDigits: 0,
              })}
            </Typography>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell padding="none" colSpan={5}>
          <Collapse
            in={l0open}
            timeout="auto"
            unmountOnExit
            sx={{ marginLeft: "10px" }}
          >
            <Table size="small" aria-label="shop's amount">
              <TableBody>
                {row.chld.map((row) => (
                  <Subrow key={row.id} row={row} repo={props.repo} />
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function Subrow(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  // const cred = props.shift == row.tm.substring(0, 10) ? red[900] : red[500];
  // const cgrey = props.shift == row.tm.substring(0, 10) ? grey[900] : grey[500];
  return (
    <React.Fragment>
      <TableRow
        id={row.id}
        key={"k_" + row.id}
        sx={{ "& > *": { borderBottom: "unset" } }}
      >
        <TableCell padding="none">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell padding="none">
          <Typography>{row.code}</Typography>
        </TableCell>
        <TableCell align="right">
          {show(props.repo)[1] && row.amnt[0] !== 0 && (
            <Typography color={row.amnt[0] < 0 ? "red" : "black"}>
              {Math.abs(row.amnt[0]).toLocaleString("uk-UA", {
                maximumFractionDigits: 0,
              })}
            </Typography>
          )}
        </TableCell>
        <TableCell align="right">
          {show(props.repo)[1] && row.amnt[1] !== 0 && (
            <Typography color={row.amnt[1] < 0 ? "red" : "black"}>
              {Math.abs(row.amnt[1]).toLocaleString("uk-UA", {
                maximumFractionDigits: 0,
              })}
            </Typography>
          )}
        </TableCell>
        <TableCell align="right">
          {show(props.repo)[1] && row.amnt[2] !== 0 && (
            <Typography color={row.amnt[2] < 0 ? "red" : "black"}>
              {Math.abs(row.amnt[2]).toLocaleString("uk-UA", {
                maximumFractionDigits: 0,
              })}
            </Typography>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell padding="none" colSpan={5}>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            sx={{ marginLeft: "10px" }}
          >
            <Table size="small" aria-label="shop's amount">
              <TableBody>
                {row.chld.map((l1) => (
                  <TableRow
                    id={l1.id}
                    key={"k_" + l1.id}
                    // sx={{ "& > *": { borderBottom: "unset" } }}
                  >
                    {/* <TableCell align="right"></TableCell> */}
                    <TableCell padding="none"></TableCell>
                    <TableCell>
                      <Typography fontSize={"95%"}>{l1.code}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      {l1.amnt[0] !== 0 && (
                        <Typography
                          color={l1.amnt[0] < 0 ? "red" : "black"}
                          fontSize={"95%"}
                        >
                          {Math.abs(l1.amnt[0]).toLocaleString("uk-UA", {
                            maximumFractionDigits: 0,
                          })}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {l1.amnt[1] !== 0 && (
                        <Typography
                          color={l1.amnt[1] < 0 ? "red" : "black"}
                          fontSize={"95%"}
                        >
                          {Math.abs(l1.amnt[1]).toLocaleString("uk-UA", {
                            maximumFractionDigits: 0,
                          })}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {l1.amnt[2] !== 0 && (
                        <Typography
                          color={l1.amnt[2] < 0 ? "red" : "black"}
                          fontSize={"95%"}
                        >
                          {Math.abs(l1.amnt[2]).toLocaleString("uk-UA", {
                            maximumFractionDigits: 0,
                          })}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

/**
 *
 * @param {*} rep
 * return [showTotal, showSubtotal]
 */
function show(rep) {
  if (
    rep === "kntprofit" ||
    rep === "kntbuy" ||
    rep === "kntbuyEvent" ||
    rep === "curprofit" ||
    rep === "curbuyEvent" ||
    rep === "curbuy" ||
    rep === "cshprofit"
  ) {
    return [true, true];
  } else if (
    rep === "kntbuyQty" ||
    rep === "kntprofitToBuy" ||
    rep === "curprofitToBuy"
  ) {
    return [false, false];
  } else if (rep === "curbuyQty") {
    return [false, true];
  }
  return [false, false];
}

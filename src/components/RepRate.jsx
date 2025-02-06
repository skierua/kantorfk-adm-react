import React, { useEffect, useState, useRef } from "react";
import { Alert, Stack, Typography, IconButton } from "@mui/material";
// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";

import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { grey, red } from "@mui/material/colors";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// import { publish } from "../../events";

export const RepRate = (props) => {
  const { sqldata, fsubmit } = props;
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState(new Date());
  // const [error, setError] = useState(null);

  // becouse UTC date is returned (previous day)
  // const onChange_period = (v) => {
  //   // console.log(`#83jm RepRate/onChange_period newDate=${v}`);
  //   prd.current = v; //new Date(v);
  //   load();
  // };

  useEffect(() => {
    if (sqldata.length == 0) {
      setData([]);
      return () => {};
    }
    let tdata = [];
    let r = 0;
    sqldata.map((v) => {
      if (r === 0 || tdata[r - 1].code !== v.chid) {
        tdata.push({
          id: v.id,
          code: v.chid,
          buyamnt: 0,
          buyeq: 0,
          sellamnt: 0,
          selleq: 0,
          chld: [],
        });
        ++r;
      }
      tdata[r - 1].chld.push(v);
      tdata[r - 1].buyamnt += Number(v.buyamnt);
      tdata[r - 1].buyeq += Number(v.buyeq);
      tdata[r - 1].sellamnt += Number(v.sellamnt);
      tdata[r - 1].selleq += Number(v.selleq);
    });
    setData(tdata);
    return () => {};
  }, [sqldata]);

  useEffect(() => {
    // console.log("#22223 useEffect fired");
    let d = new Date(period);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    fsubmit({
      reqid: "reprate",
      code: d.toISOString().substring(0, 10),
    });
    return () => {};
  }, [period]);

  return (
    <Stack gap={1} width="100%" sx={{ minWidth: 360, maxWidth: { md: 420 } }}>
      <Stack
        direction={"row"}
        gap={1}
        width="100%"
        alignItems={"center"}
        sx={{ justifyContent: "space-between" }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* <DemoContainer components={["DatePicker"]}> */}
          <DatePicker
            // ref={prd}
            label="Період"
            slotProps={{ textField: { size: "small" } }}
            // defaultValue={dayjs(new Date())}
            value={dayjs(period)}
            onChange={(v) => {
              // console.log(new Date(v).toISOString());
              setPeriod(new Date(v));
            }}
            format="DD-MM-YYYY"
            closeOnSelect={true}
            disableFuture={true}
          />
          {/* </DemoContainer> */}
        </LocalizationProvider>
      </Stack>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table" width="100%">
          <TableHead>
            <TableRow>
              <TableCell padding="none" />
              <TableCell padding="none" align="center">
                <Typography color={grey[500]}>назва</Typography>
              </TableCell>
              <TableCell padding="none" align="center">
                <Typography color={grey[500]}>купівля</Typography>
              </TableCell>
              <TableCell padding="none" align="center">
                <Typography color={grey[500]}>продаж</Typography>
              </TableCell>
              <TableCell padding="none" align="center">
                <Typography color={grey[500]}>маржа</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <Row key={`${row.code}/${row.acnt}`} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
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
          <Typography fontSize={"125%"}>{row.code}</Typography>
        </TableCell>
        <TableCell align="right">
          {row.buyamnt !== 0 && (
            <>
              <Typography fontSize={"125%"}>
                {(row.buyeq / row.buyamnt).toFixed(2)}
              </Typography>
              {props.showAmnt &&
                row.buyamnt.toLocaleString("uk-UA", {
                  maximumFractionDigits: 0,
                })}
            </>
          )}
        </TableCell>
        <TableCell align="right">
          {row.sellamnt !== 0 && (
            <>
              <Typography fontSize={"125%"}>
                {(row.selleq / row.sellamnt).toFixed(2)}
              </Typography>
              {props.showAmnt &&
                row.sellamnt.toLocaleString("uk-UA", {
                  maximumFractionDigits: 0,
                })}
            </>
          )}
        </TableCell>
        <TableCell align="right">
          {row.buyamnt !== 0 && row.sellamnt !== 0 && (
            <>
              <Typography
                fontSize={"125%"}
                color={
                  row.selleq / row.sellamnt - row.buyeq / row.buyamnt < 0
                    ? red[900]
                    : grey[900]
                }
              >
                {Math.abs(
                  row.selleq / row.sellamnt - row.buyeq / row.buyamnt
                ).toFixed(2)}
              </Typography>
              {props.showAmnt && (
                <Typography
                  fontSize={"125%"}
                  color={
                    row.selleq / row.sellamnt - row.buyeq / row.buyamnt < 0
                      ? red[900]
                      : grey[900]
                  }
                >
                  {(
                    (100 *
                      (row.selleq / row.sellamnt - row.buyeq / row.buyamnt)) /
                    (row.buyeq / row.buyamnt)
                  ).toFixed(2) + "%"}
                </Typography>
              )}
            </>
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
            {/* <Box sx={{ margin: 1 }}> */}
            <Table size="small" aria-label="shop's amount">
              <TableBody>
                {row.chld.map((itm) => (
                  <TableRow
                    key={`${itm.chid}/${itm.shop}/${itm.acnt}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell />
                    <TableCell padding="none">
                      <Typography fontSize={"90%"}>{itm.shop}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      {itm.buyamnt !== 0 && (
                        <>
                          <Typography fontSize={"90%"}>
                            {(itm.buyeq / itm.buyamnt).toFixed(2)}
                          </Typography>
                          {props.showAmnt && (
                            <Typography fontSize={"80%"}>
                              {Number(itm.buyamnt).toLocaleString("uk-UA", {
                                maximumFractionDigits: 0,
                              })}{" "}
                            </Typography>
                          )}
                        </>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {itm.sellamnt !== 0 && (
                        <>
                          <Typography fontSize={"90%"}>
                            {(itm.selleq / itm.sellamnt).toFixed(2)}
                          </Typography>
                          {props.showAmnt && (
                            <Typography fontSize={"80%"}>
                              {Number(itm.sellamnt).toLocaleString("uk-UA", {
                                maximumFractionDigits: 0,
                              })}
                            </Typography>
                          )}
                        </>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {itm.buyamnt !== 0 && itm.sellamnt !== 0 && (
                        <>
                          <Typography
                            fontSize={"90%"}
                            color={
                              itm.selleq / itm.sellamnt -
                                itm.buyeq / itm.buyamnt <
                              0
                                ? red[900]
                                : grey[900]
                            }
                          >
                            {Math.abs(
                              itm.selleq / itm.sellamnt -
                                itm.buyeq / itm.buyamnt
                            ).toFixed(2)}
                          </Typography>
                          <Typography
                            fontSize={"80%"}
                            color={
                              itm.selleq / itm.sellamnt -
                                itm.buyeq / itm.buyamnt <
                              0
                                ? red[900]
                                : grey[900]
                            }
                          >
                            {props.showAmnt &&
                              (
                                (100 *
                                  (itm.selleq / itm.sellamnt -
                                    itm.buyeq / itm.buyamnt)) /
                                (itm.buyeq / itm.buyamnt)
                              ).toFixed(2) + "%"}
                          </Typography>
                        </>
                      )}
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
}

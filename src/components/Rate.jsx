import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
import { Box, Stack, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { grey } from "@mui/material/colors";

import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";

import { VkToggle } from "./VkToggle";

/**
 *
 * @returns
 */
export const Rate = (props) => {
  const { sqldata, kantor, shop, fedit, fisedited, frefresh, ...other } = props;
  const [knt, setKnt] = useState(shop);

  // last time change
  const lt = () => {
    return sqldata
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

  return (
    <Box sx={{ maxWidth: { md: 360 } }} {...other}>
      <Stack gap={1} width="100%">
        <Stack
          direction={"row"}
          gap={1}
          width="100%"
          sx={{ justifyContent: "space-between" }}
        >
          <IconButton size="small" color="primary" onClick={() => frefresh()}>
            <RefreshIcon />
          </IconButton>
          <VkToggle data={kantor} dflt={knt} fcb={(v) => setKnt(v)} />
          <IconButton
            size="small"
            color="primary"
            disabled={knt === ""}
            onClick={() => fedit({ knt: knt })}
          >
            <EditIcon />
          </IconButton>
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
                          {" "}
                          <Typography>
                            {Number(v.bid) !== 0
                              ? Number(v.bid).toPrecision(4)
                              : ""}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {" "}
                          {/*padding={"checkbox"}*/}
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
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography color={grey[500]}>роздріб</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography color={grey[500]}>купівля</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography color={grey[500]}>продаж</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sqldata
                .filter(
                  (v) => (knt === "" || knt === v.shop) && v.prc !== "bulk"
                )
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
        <Box width="100%">
          <Typography>від {hd(lt())}</Typography>
        </Box>
        {/* {error && (
        <Alert severity="error">
          <Typography> {`${error}`}</Typography>
        </Alert>
      )} */}
      </Stack>
    </Box>
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

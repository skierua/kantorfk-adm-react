import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";

import { VkToggle } from "./VkToggle";

export const DashRate = (props) => {
  const { rates, curList, ...other } = props;
  const [knt, setKnt] = useState("");
  const [bulk, setBulk] = useState(false);

  const dataset = () => {
    if (curList === undefined || curList.length == 0) {
      return rates.filter((d) => d.prc === (bulk ? "bulk" : ""));
    } else {
      return rates.filter(
        (d) => curList.indexOf(d.chid) != -1 && d.prc === (bulk ? "bulk" : "")
      );
    }
  };
  // last time change
  const lch = () => {
    return rates
      .filter(
        (v) => v.prc === (bulk ? "bulk" : "") && (knt === "" || v.shop === knt)
      )
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

  const kntList = () => {
    let lst = [];
    rates
      .filter((d) => d.prc === (bulk ? "bulk" : ""))
      .forEach((f) => {
        if (!lst.some((l) => l.id === f.shop)) {
          lst.push({ id: f.shop, name: f.shop, so: f.shso });
        }
      });
    return lst.sort((a, b) => {
      return Number(a.so) - Number(b.so);
    });
  };

  //   console.log(dataset());

  return (
    <Box {...other}>
      <Stack
        direction={"row"}
        gap={1}
        width="100%"
        sx={{ justifyContent: "space-between" }}
      >
        <VkToggle
          data={kntList()}
          dflt={knt}
          label="Кантор"
          limit={3}
          fcb={(v) => setKnt(v)}
        />
        <FormControlLabel
          control={<Switch />}
          size="small"
          label="ГУРТ"
          value={bulk}
          onChange={(e) => setBulk(e.target.checked)}
        />
      </Stack>
      <Tbl data={dataset()} knt={knt} />
    </Box>
  );
};

const Tbl = (props) => {
  const { data, knt } = props;
  return (
    <TableContainer>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography color={grey[500]}></Typography>
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
          {data.map((v) => {
            return (
              (knt === "" || knt === v.shop) && (
                <TableRow
                  id={`id-${v.chid}-${v.shop}-${v.scode}-${v.prc}`}
                  key={`key-${v.chid}-${v.shop}-${v.scode}-${v.prc}`}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell align="left">
                    <Stack
                      direction={"row"}
                      gap={"0.25rem"}
                      alignItems={"flex-end"}
                    >
                      {v.chid}
                      {knt === "" && (
                        <Typography variant="caption">{v.shop}</Typography>
                      )}
                      {v.scode !== "" && (
                        <Typography variant="caption">{v.sname}</Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    {Number(v.bid) !== 0 ? Number(v.bid).toPrecision(4) : ""}
                  </TableCell>
                  <TableCell align="center">
                    {Number(v.ask) !== 0 ? Number(v.ask).toPrecision(4) : ""}
                  </TableCell>
                </TableRow>
              )
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

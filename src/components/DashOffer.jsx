import React from "react";
import { Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";

export const DashOffer = (props) => {
  const { title, offers, ...other } = props;

  const dataset = (ba) => {
    return offers.filter((v) => v.bidask === ba);
  };

  return (
    <Box
      sx={{
        border: "1px solid lightgrey",
        width: { xs: "100%", sm: "20rem" },
        justifyItems: "center",
      }}
      {...other}
    >
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
      <Stack direction={"row"} gap={1}>
        <Box sx={{ justifyItems: "center" }}>
          <Typography color={grey[500]}>куплю</Typography>
          <Tbl data={dataset("bid")} />
        </Box>
        <Box sx={{ justifyItems: "center" }}>
          <Typography color={grey[500]}>продам</Typography>
          <Tbl data={dataset("ask")} />
        </Box>
      </Stack>
    </Box>
  );
};

const Tbl = (props) => {
  const { data, ...other } = props;
  return (
    <TableContainer {...other}>
      <Table size="small" aria-label="a dense table">
        <TableBody>
          {data.map((v) => {
            return (
              <TableRow
                id={`id-${v.oid}`}
                key={`key-${v.oid}`}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell align="left">
                  <Stack direction={"row"} gap={0.5}>
                    <Typography>{v.chid}</Typography>
                    <Typography>{Number(v.price).toPrecision(4)}</Typography>
                    <Typography fontSize={"80%"}>{v.shop}</Typography>
                    <Typography fontSize={"80%"}>{hd(v.tm)}</Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

//  humanDate
const hd = (vdate) => {
  if (vdate === undefined || vdate === "") {
    return "";
  }
  let vnd = new Date();
  let vcd = new Date(vdate);
  // !!! FOR TESTING
  return vcd.toLocaleTimeString("en-GB").substring(0, 5);
  if (vnd.toISOString().substring(0, 10) === vdate.substring(0, 10)) {
    return vcd.toLocaleTimeString("en-GB").substring(0, 5);
  }
  return vcd.toISOString().substring(0, 10);
};

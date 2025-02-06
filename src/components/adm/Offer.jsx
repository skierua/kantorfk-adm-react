import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, Stack } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import AddCardIcon from "@mui/icons-material/AddCard";
import CallIcon from "@mui/icons-material/Call";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import CircleIcon from "@mui/icons-material/Circle";
import EditIcon from "@mui/icons-material/Edit";

import { VkToggle } from "../VkToggle";

/**
 * @returns
 */
export const Offer = (props) => {
  const { sqldata, fedit, shop, ...other } = props;

  // const { register } = useForm();

  const [fltba, setFltba] = useState(""); // bid|ask filter
  const [fltcur, setFltcur] = useState(""); // currency filter
  const [fltknt, setFltknt] = useState(""); // kantor filter
  // const [myonly, setMyonly] = useState(false); // myOnly filter

  // offers currency
  const ofcurs = () => {
    if (sqldata.length == 0) {
      return [];
    }
    let lst = [];
    // let k = 0;
    // console.log("#5et offer data=" + JSON.stringify(data));
    sqldata.forEach((v) => {
      // for (k = 0; k < lst.length && lst[k].chid !== v.chid; ++k) {}
      if (!lst.some((l) => l.id === v.chid)) {
        // if (k === lst.length) {
        lst.push({
          id: v.chid,
          sname: v.chid,
          name: v.name,
          so: Number(v.sortorder),
        });
        // }
      }
    });
    return lst.sort((a, b) => {
      return a.so - b.so;
    });
  };

  // offers knt
  const ofknts = () => {
    if (sqldata.length == 0) {
      return [];
    }
    let lst = [];
    // let k = 0;
    // console.log("#5et offer data=" + JSON.stringify(data));
    sqldata.forEach((v) => {
      // for (k = 0; k < lst.length && lst[k].chid !== v.chid; ++k) {}
      if (!lst.some((l) => l.id === v.shop)) {
        // if (k === lst.length) {
        lst.push({
          id: v.shop,
          sname: v.shop,
          // name: v.name,
          // so: Number(v.sortorder),
        });
        // }
      }
    });
    // console.log(lst);
    return lst.sort((a, b) => {
      return a.id < b.id ? -1 : 1;
    });
  };

  return (
    <Box
      gap={1}
      width="100%"
      // sx={{ maxWidth: { md: 360 }, minWidth: { sm: 300 } }}
      {...other}
    >
      <Stack
        direction={"row"}
        gap={1}
        // justifyContent={"center"}
        useFlexGap
        flexWrap="wrap"
        sx={{ marginBottom: "1rem" }}
      >
        <VkToggle
          data={[
            { id: "bid", name: "куп" },
            { id: "ask", name: "прод" },
          ]}
          dflt={fltba}
          fcb={(v) => setFltba(v)}
        />
        <VkToggle
          data={ofcurs()}
          dflt={fltcur}
          limit={3}
          label="Валюта"
          fcb={(v) => setFltcur(v)}
        />
        <VkToggle
          data={ofknts()}
          dflt={fltknt}
          limit={3}
          label="Кантор"
          fcb={(v) => setFltknt(v)}
        />

        {/* <FormControlLabel
          control={<Switch />}
          size="small"
          label="Мої"
          defaultValue={myonly}
          onChange={(e) => setMyonly(e.target.checked)}
        /> */}
        <FormControl size="small">
          <Button
            variant="outlined"
            // size="small"
            startIcon={<AddCardIcon />}
            onClick={() => fedit()}
          >
            Додати
          </Button>
        </FormControl>
      </Stack>
      <Stack
        direction="row"
        useFlexGap
        // sx={{ flexWrap: "wrap" }}
        flexWrap="wrap"
        gap={1}
        // sx={{ maxWidth: { md: 360 }, minWidth: { sm: 300 } }}
      >
        {sqldata.map((v, i) => {
          return (
            (fltba === "" || fltba === v.bidask) &&
            (fltcur === "" || fltcur === v.chid) &&
            (fltknt === "" || fltknt === v.shop) && (
              <Paper
                id={"ppid_" + v.oid}
                key={"ppkey_" + v.oid}
                elevation={3}
                sx={{
                  padding: 1,
                  maxWidth: { md: 360 },
                  minWidth: { xs: "100%", md: 300 },
                }}
              >
                <>
                  {/* {edited !== v.oid && ( */}
                  <>
                    <Stack
                      // width={"100%"}
                      direction={"row"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      {v.bidask === "bid" ? (
                        <CircleIcon fontSize="small" color="success" />
                      ) : (
                        <CircleIcon fontSize="small" color="info" />
                      )}
                      <Typography>
                        {v.bidask === "bid" ? "куплю" : "продам"}
                      </Typography>
                      <Avatar
                        alt={v.chid}
                        src={`./flag/${v.curid}.svg`}
                        sx={{
                          width: 24,
                          height: 24,
                          border: "solid lightgrey 1px",
                        }}
                      />
                      <Typography>{v.chid}</Typography>
                      <Typography variant="button" fontSize={"125%"}>
                        {Number(v.price).toPrecision(4)}
                      </Typography>
                      <Typography variant="caption">{hd(v.tm)}</Typography>
                    </Stack>
                    <Stack
                      width={"100%"}
                      direction={"row"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Typography>{v.name}</Typography>
                      <Stack direction={"row"} gap={0.5}>
                        <CallIcon fontSize="small" />
                        {v.tel}
                      </Stack>
                    </Stack>
                    <Stack
                      direction={"row"}
                      gap={0.5}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Typography>{`від ${
                        Math.abs(v.amnt) < 1500 ? "500" : "1 000"
                      } до ${Math.abs(v.amnt).toLocaleString(
                        "uk-UA"
                      )}`}</Typography>
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => fedit(v)}
                      >
                        {v.shop}
                      </Button>
                    </Stack>
                    {v.onote !== undefined && v.onote !== "" && (
                      <Box
                        bgcolor={"whitesmoke"}
                        color={"whitesmoke.contrastText"}
                        p={"2px"}
                      >
                        <Typography>{v.onote}</Typography>
                      </Box>
                    )}
                  </>
                  {/* )} */}
                  {/* {edited === v.oid && <EditOffer offer={v} />} */}
                </>
              </Paper>
            )
          );
        })}
      </Stack>
    </Box>
    // )
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

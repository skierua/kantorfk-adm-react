import React, { useEffect, useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import MenuItem from "@mui/material/MenuItem";

import { VkToggle } from "./VkToggle";

export const RateEdit = (props) => {
  const {
    sqldata,
    role,
    kantor,
    currency,
    cursub,
    kntBulk = "BULK", // bulk kantor
    crntknt,
    fclose,
    fsubmit,
    ...other
  } = props;
  // console.log(sqldata);
  // edited data
  const [base, setBase] = useState(crntknt); // base knt for rate
  const [edknt, setEdknt] = useState(() => [crntknt]);
  // const [edbulk, setEdbulk] = useState(false);
  const [edcur, setEdcur] = useState("840");
  const [edcursub, setEdcursub] = useState("");
  const [edqty, setEdqty] = useState("1");
  const [edbid, setEdbid] = useState("");
  const [edask, setEdask] = useState("");

  //   const foreignCurency = () => {
  //     if (currency === undefined) {
  //       return [];
  //     }
  //     return currency.filter((v) => v.id !== "" && v.dmst !== "1");
  //   };

  const editList = () => {
    if (role === "kant")
      return [
        { id: kntBulk, name: "ГУРТ" },
        { id: crntknt, name: crntknt },
      ];
    return kantor;
  };

  useEffect(() => {
    // const shop = edbulk ? kntBulk : base;
    let rate = sqldata.find(
      (v) =>
        v.shop === base &&
        v.atclcode === edcur &&
        v.scode === edcursub &&
        v.prc === ""
      // && v.prc === (edbulk ? "bulk" : "")
    );
    // console.log(sqldata);
    if (rate !== undefined) {
      setEdqty(rate.cqty);
      setEdbid(rate.bid);
      setEdask(rate.ask);
    } else {
      setEdqty("1");
      setEdbid("");
      setEdask("");
    }
    return () => {};
  }, [base, edcur, edcursub]);

  const onSubmit = async (e) => {
    // console.log("onSubmit");
    e.preventDefault();
    let arate = edknt.map((v) => {
      return {
        shop: v,
        atclcode: edcur,
        scode: edcursub,
        pricecode: "", //edbulk ? "bulk" : "",
        qty: edqty,
        bid: edbid.replace("+", "%2B"),
        ask: edask.replace("+", "%2B"),
        tm: new Date().toISOString(),
      };
    });
    // console.log(arate);
    // return;
    fsubmit({
      reqid: "upd",
      rates: arate,
    });
  };

  const onEdknt_change = (e, v) => {
    if (!v.length) return "";
    // console.log("etv=" + e.target.value + " v=" + v);
    if (e.target.value === kntBulk) {
      if (v.indexOf(kntBulk) !== -1) {
        setEdknt([kntBulk]);
      } else {
        setEdknt(v);
      }
    } else {
      if (v.indexOf(kntBulk) !== -1) {
        setEdknt([e.target.value]);
      } else {
        setEdknt(v);
      }
    }
    // return v;
    // return v.length ? setEdknt(v) : "";
  };

  return (
    <Box sx={{ maxWidth: { md: 360 } }} {...other}>
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      <form onSubmit={onSubmit}>
        <Stack gap={1}>
          <Stack direction={"row"} gap={1} flexWrap="nowrap">
            <VkToggle
              data={kantor}
              dflt={base}
              label="База"
              limit={0}
              allowAll={false}
              fcb={(v) => setBase(v)}
            />
            {/* {!edbulk && ( */}
            <FormControl sx={{ minWidth: 130 }} size="small">
              <ToggleButtonGroup
                id="fld-shop-tgl"
                label="Для"
                value={edknt}
                // onChange={(e, v) => (v.length ? setEdknt(v) : "")}
                onChange={onEdknt_change}
                aria-label="knt toggle"
                size="small"
              >
                {editList().map((v) => {
                  return (
                    <ToggleButton
                      id={`tglknt_${v.id}`}
                      key={`tglknt_${v.id}`}
                      value={v.id}
                      aria-label={v.id}
                    >
                      {v.name}
                    </ToggleButton>
                  );
                })}
              </ToggleButtonGroup>
            </FormControl>
            {/* )}  */}
            {/* <FormControlLabel
              control={<Switch />}
              size="small"
              label="ГУРТ"
              value={edbulk}
              onChange={(e) => setEdbulk(e.target.checked)}
            /> */}
          </Stack>

          <Stack direction={"row"} gap={1} justifyContent={"space-between"}>
            <VkToggle
              data={currency}
              dflt={edcur}
              allowAll={false}
              label="Валюта"
              fcb={(v) => {
                setEdcursub("");
                setEdcur(v);
              }}
            />
            {cursub.filter((v) => v.atclcode === edcur).length > 0 && (
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel id="labelSelScode">{"тип"}</InputLabel>
                <Select
                  labelId="labelSelScode"
                  id="selScode"
                  value={edcursub}
                  label={"тип"}
                  onChange={(e) => setEdcursub(e.target.value)}
                >
                  {cursub
                    .filter((v) => v.atclcode === edcur)
                    .map((v) => {
                      return (
                        <MenuItem key={v.id} value={v.id}>
                          {v.sname}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            )}
          </Stack>

          <Stack direction={"row"} gap={1}>
            <TextField
              label="Купівля"
              id="fld-bid"
              size="small"
              value={edbid}
              onChange={(e) => setEdbid(e.target.value.replace(",", "."))}
              InputLabelProps={{ shrink: true }}
              // inputProps={{
              //   type: "number",
              //   step: 0.001,
              //   // step: Number(getValues("fld-bid")) < 10 ? 0.001 : 0.01,
              //   // inputMode: "decimal",
              // }}
            />
            <TextField
              label="Продаж"
              id="fld-ask"
              size="small"
              value={edask}
              onChange={(e) => setEdask(e.target.value.replace(",", "."))}
              InputLabelProps={{ shrink: true }}
              // inputProps={{
              //   type: "number",
              //   step: 0.001,
              //   // step: Number(getValues("fld-ask")) < 10 ? 0.001 : 0.01,
              //   // inputMode: "decimal",
              // }}
            />
          </Stack>
          <Stack direction={"row"} gap={1} justifyContent={"flex-end"}>
            <Button
              // type="reject"
              variant="outlined"
              startIcon={<CloseIcon />}
              // color={grey[200]}
              onClick={() => fclose()}
            >
              Close
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={!(edknt.length && edcur !== "")}
              startIcon={<CheckIcon />}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};

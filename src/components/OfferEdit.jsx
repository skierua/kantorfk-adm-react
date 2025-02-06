import React, { useEffect, useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { VkToggle } from "./VkToggle";

export const OfferEdit = (props) => {
  const { offer, kantor, fsubmit, fclose, fcurrency, ...other } = props;
  //   const { register, handleSubmit } = useForm();
  const [oid, setOid] = useState(offer.oid ?? ""); // offer Id
  const [knt, setKnt] = useState(offer.shop ?? "CITY");
  const [cur, setCur] = useState(offer.chid ?? "USD");
  const [ba, setBa] = useState(offer.bidask ?? "bid");
  const [amnt, setAmnt] = useState(offer.amnt ?? "");
  const [rate, setRate] = useState(offer.price ?? "");
  const [tel, setTel] = useState(offer.tel ?? "(096)001-3600");
  const [note, setNote] = useState(offer.onote ?? "");

  // const [data, setData] = useState({});

  const onSubmit = async (e) => {
    // console.log(data);
    e.preventDefault();
    const b = {
      reqid: "upd",
      ofid: oid,
      shop: knt,
      cur: cur,
      ba: ba,
      amnt: amnt,
      price: rate,
      tel: tel,
      note: note,
      tm: new Date().toISOString(),
    };
    // console.log(fsubmit);
    fsubmit(b);
  };

  const curList = () => {
    return fcurrency().map((v) => {
      return {
        id: v.chid,
        name: `${v.chid} ${v.qty == 1 ? "" : v.qty} - ${v.name}`,
      };
    });
  };

  // useEffect(() => {
  //   // console.log(offer);
  //   setData(offer);
  // }, [offer]);

  return (
    <Box {...other}>
      <form onSubmit={onSubmit}>
        <TextField
          //   {...register("edoid")}
          id="edoid"
          margin="normal"
          size="small"
          label="oid"
          // type="number"
          value={oid}
          sx={{ display: "none" }}
        />
        <Stack
          direction={"row"}
          gap={1}
          justifyContent={"space-between"}
          sx={{ padding: "8px 0px" }}
        >
          <VkToggle
            data={kantor}
            dflt={knt}
            // limit={0}
            allowAll={false}
            fcb={(v) => setKnt(v)}
          />
          <VkToggle // tel
            data={[
              { id: "(096)001-3600", name: "(096)001-3600" }, // main
              { id: "(067)499-5988", name: "(067)499-5988" }, // Vas
              { id: "(097)516-9138", name: "(097)516-9138" }, // Dec
              { id: "(096)001-3666", name: "(096)001-3666" }, // drzd
              { id: "(068)864-8748", name: "(068)864-8748" }, // Kuz
              { id: "(098)127-4894", name: "(098)127-4894" }, // Pro
            ]}
            dflt={tel}
            label={"Телефон"}
            limit={0}
            allowAll={false}
            fcb={(v) => setTel(v)}
          />
        </Stack>
        <Stack
          direction={"row"}
          gap={1}
          justifyContent={"space-between"}
          sx={{ padding: "8px 0px" }}
        >
          <VkToggle
            data={[
              { id: "bid", name: "Купляю" },
              { id: "ask", name: "Продаю" },
            ]}
            dflt={ba}
            // limit={0}
            allowAll={false}
            fcb={(v) => setBa(v)}
          />
          <VkToggle
            data={curList()}
            dflt={cur}
            allowAll={false}
            label="Валюта"
            fcb={(v) => setCur(v)}
          />
        </Stack>
        <Stack direction={"row"} gap={1}>
          <TextField
            // {...register("edamnt")}
            id="edamnt"
            margin="normal"
            size="small"
            // required
            // fullWidth
            label="Sum"
            type="number"
            value={amnt}
            onChange={(e) => setAmnt(e.target.value)}
          />
          <TextField
            // {...register("edrate")}
            id="edrate"
            margin="normal"
            size="small"
            // required
            // fullWidth
            // name="edrate"
            label="Rate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            inputProps={{
              type: "number",
              step: offer.price < 10 ? 0.001 : 0.01,
              // inputMode: "decimal",
            }}
          />
        </Stack>
        <TextField
          //   {...register("ednote")}
          id="ednote"
          margin="normal"
          size="small"
          fullWidth
          label="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          // autoComplete="current-password"
        />
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
            startIcon={<CheckIcon />}
          >
            Save
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

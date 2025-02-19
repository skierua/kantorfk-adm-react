import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { AcntScore } from "./AcntScore";
import { DashRate } from "./DashRate";
import { DashOffer } from "./DashOffer";
// import { VkToggle } from "../VkToggle";

/**
 *
 * @pl {*} payload
 * @param {*} props
 * @returns
 */

export const DashBoard = (props) => {
  const { acnts, rates, offers, kntBulk, pl, ...other } = props;
  // console.log(rates);
  /*useEffect(() => {
    // console.log(`#257 AdmOffer/useEffect started`);
    return () => {};
  }, []);
  */

  return (
    // <Box sx={{ display: "flex", flexWrap: "wrap" }} {...other}>
    <Stack direction={"row"} gap={1} useFlexGap flexWrap="wrap" {...other}>
      <AcntScore title="TRADE" data={acnts} balacnt="35" />
      {pl.role === "owner" && (
        <AcntScore title="Каса" data={acnts} balacnt="30" />
      )}

      {pl.role !== "owner" && (
        <>
          <AcntScore
            title="Каса"
            data={acnts.filter((v) => v.shop === pl.term)}
            balacnt="3000"
          />
          <AcntScore title="Внутрішня інкасація" data={acnts} balacnt="3003" />
        </>
      )}
      <DashRate
        title="Курси"
        rates={rates.filter((v) => v.domestic === "2" || v.shop === kntBulk)}
        curList={["USD", "EUR", "PLN"]}
        kntBulk={kntBulk}
      />
      {offers.length !== 0 && <DashOffer title="Offers" offers={offers} />}
    </Stack>
  );
};

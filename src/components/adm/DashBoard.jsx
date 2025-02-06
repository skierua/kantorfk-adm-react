import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { AcntScore } from "../AcntScore";
import { DashRate } from "../DashRate";
import { DashOffer } from "../DashOffer";
// import { VkToggle } from "../VkToggle";

export const DashBoard = (props) => {
  const { acnts, rates, offers, ...other } = props;
  // console.log(rates);
  const AreaHeader = (props) => {
    const { title, ...other } = props;
    return (
      <Box
        width="100%"
        // bgcolor={"lightgrey"}
        bgcolor={"info.dark"}
        color={"info.contrastText"}
        padding={"0px 10px"}
        sx={{ mb: "0.5rem" }}
        {...other}
      >
        <Typography>{title}</Typography>
      </Box>
    );
  };
  /*useEffect(() => {
    // console.log(`#257 AdmOffer/useEffect started`);
    return () => {};
  }, []);
  */

  return (
    // <Box sx={{ display: "flex", flexWrap: "wrap" }} {...other}>
    <Stack direction={"row"} gap={1} useFlexGap flexWrap="wrap" {...other}>
      <Box
        sx={{
          border: "1px solid lightgrey",
          width: { xs: "100%", sm: "20rem" },
        }}
      >
        <AreaHeader title="TRADE" />
        <AcntScore data={acnts} balacnt="35" />
      </Box>
      <Box
        sx={{
          border: "1px solid lightgrey",
          width: { xs: "100%", sm: "22rem" },
        }}
      >
        <AreaHeader title="Каса" />
        <AcntScore data={acnts} balacnt="30" />
      </Box>

      <Box
        sx={{
          border: "1px solid lightgrey",
          width: { xs: "100%", sm: "20rem" },
        }}
      >
        <AreaHeader title="Курси" />
        <DashRate rates={rates} curList={["USD", "EUR", "PLN"]} />
      </Box>
      {offers.length !== 0 && (
        <Box
          sx={{
            border: "1px solid lightgrey",
            width: { xs: "100%", sm: "22rem" },
          }}
        >
          <AreaHeader title="Offers" />
          <DashOffer offers={offers} />
        </Box>
      )}
    </Stack>
  );
};

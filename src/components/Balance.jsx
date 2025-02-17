import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";

import { VkToggle } from "./VkToggle";
import { AcntScore } from "./AcntScore";

export const Balance = (props) => {
  const { data, ...other } = props;
  const [balacnt, setBalacnt] = useState("30");

  const acntlist = [
    { name: "Каса", id: "30" },
    { name: "Trade", id: "35" },
    { name: "Борг", id: "36" },
    { name: "Кап", id: "42" },
  ];

  return (
    <Box sx={{ maxWidth: { md: 360 } }} {...other}>
      <Box sx={{ mb: 1, justifyItems: "center" }}>
        <VkToggle
          data={acntlist}
          dflt={balacnt}
          label="Account"
          limit={5}
          allowAll={false}
          fcb={(v) => {
            setBalacnt(v);
          }}
        />
      </Box>
      <AcntScore
        title="Balance"
        data={data}
        balacnt={balacnt}
        onlyShift={false}
      />
    </Box>
  );
};

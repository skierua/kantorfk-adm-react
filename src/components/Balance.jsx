import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { grey, red } from "@mui/material/colors";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandMore";

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
      <AcntScore data={data} balacnt={balacnt} onlyShift={false} />
    </Box>
  );
};

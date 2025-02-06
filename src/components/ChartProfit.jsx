// import * as React from "react";
import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
// import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import Paper from "@mui/material/Paper";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";

import dayjs from "dayjs";
// import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// import { publish } from "../../events";

export const ChartProfit = (props) => {
  const { sqldata, fsubmit, ...other } = props;
  const [period, setPeriod] = useState(new Date());
  const [profit, setProfit] = useState({ dataset: [], series: [] });
  const [wage, setWage] = useState({ dataset: [], series: [] });
  const [effic, setEffic] = useState({ dataset: [], series: [] });
  const [ptotal, setPtotal] = useState({ dataset: [], series: [] });
  const [pusd, setPusd] = useState({ dataset: [], series: [] });
  const [peur, setPeur] = useState({ dataset: [], series: [] });
  const [ppln, setPpln] = useState({ dataset: [], series: [] });
  // const [error, setError] = useState(null);
  // const [mode, setMode] = useState(0);

  // timeInterval
  const ti = () => {
    let d = new Date(period);
    // d.setMonth(d.getMonth() + 1);
    let pto = d.toISOString().substring(0, 7);
    d.setMonth(d.getMonth() - 5);
    let pfrom =
      d.toISOString().substring(0, 7) < "2024-02"
        ? "2024-02"
        : d.toISOString().substring(0, 7);
    return { pfrom: pfrom, pto: pto };
  };

  const cshrDataset = (d, rows, cols, filt = "", suffix = "") => {
    const dset = [];
    const ser = [];
    let i = 0;
    cols.map((v) => {
      ser.push({ dataKey: v + suffix, label: v });
    });
    let tmprow = {};
    rows.map((v) => {
      tmprow = {};
      tmprow["pr"] = v;
      tmprow["month"] = new Date(v).toLocaleDateString("uk-UA", {
        month: "short",
      });
      for (i = 0; i < cols.length; ++i) {
        tmprow[cols[i]] = 0;
        tmprow[cols[i] + "_wage"] = 0;
        tmprow[cols[i] + "_effic"] = 0;
      }
      dset.push(tmprow);
    });
    d.map((v) => {
      if (filt === undefined || filt === "" || filt === v.chid) {
        for (i = 0; i < dset.length && dset[i].pr != v.period; ++i) {}
        if (i < dset.length) {
          dset[i][v.cashier] += Math.round(Number(v.amnt));
          dset[i][v.cashier + "_wage"] = Math.round(Number(v.wage));
        }
      }
    });
    dset.map((v) => {
      for (i = 0; i < cols.length; ++i) {
        if (v[cols[i]] !== undefined && v[cols[i]] !== 0) {
          v[cols[i] + "_effic"] = v[cols[i]] / v[cols[i] + "_wage"] - 1;
        } else {
          v[cols[i] + "_effic"] = 0;
        }
      }
    });
    return { dataset: dset, series: ser };
  };

  const barRows = () => {
    let a = [];
    sqldata.map((v) => {
      if (!~a.indexOf(v.period)) {
        a.push(v.period);
      }
      // v.amnt = v.total;
    });
    return a;
  };

  const barColsCshr = () => {
    let a = [];
    sqldata.map((v) => {
      if (!~a.indexOf(v.cashier)) {
        a.push(v.cashier);
      }
      // v.amnt = v.total;
    });
    return a;
  };

  const Bar = (props) => {
    const { title, ...others } = props;
    return (
      <>
        <>{title}</>
        <BarChart {...others} />
      </>
    );
  };

  const prf = cshrDataset(sqldata, barRows(), barColsCshr(), "");

  useEffect(() => {
    if (sqldata.length == 0) {
      setProfit({ dataset: [], series: [] });
      setWage({ dataset: [], series: [] });
      setEffic({ dataset: [], series: [] });
      setPtotal({ dataset: [], series: [] });
      setPusd({ dataset: [], series: [] });
      setPeur({ dataset: [], series: [] });
      setPpln({ dataset: [], series: [] });
      return () => {};
    }
    const barRows = [];
    const barColsCshr = [];
    const barColsCur = ["USD", "EUR", "PLN", "other"];
    sqldata.map((v, i, arr) => {
      if (!~barRows.indexOf(v.period)) {
        barRows.push(v.period);
      }
      if (!~barColsCshr.indexOf(v.cashier)) {
        barColsCshr.push(v.cashier);
      }
      v.amnt = v.total;
    });
    // console.log("#8u2 cols rows");
    // console.log(barRows);
    // console.log(barColsCshr);
    setProfit(cshrDataset(sqldata, barRows, barColsCshr, ""));
    setWage(cshrDataset(sqldata, barRows, barColsCshr, "", "_wage"));
    setEffic(cshrDataset(sqldata, barRows, barColsCshr, "", "_effic"));
    setPtotal(curDataset(sqldata, barRows, ti().pfrom, ti().pto));
    setPusd(cshrDataset(sqldata, barRows, barColsCshr, "USD"));
    setPeur(cshrDataset(sqldata, barRows, barColsCshr, "EUR"));
    setPpln(cshrDataset(sqldata, barRows, barColsCshr, "PLN"));
    return () => {};
  }, [sqldata]);

  useEffect(() => {
    // console.log("#948j ChartProfit useEffect STARTED");
    fsubmit({
      reqid: "chartprofit",
      from: ti().pfrom,
      to: ti().pto,
    });
    return () => {};
  }, [period]);

  return (
    <Stack gap={1} width="100%" sx={{ maxWidth: { md: 360 } }}>
      <LocalizationProvider dateAdapter={AdapterDayjs} padding="none">
        {/* <DemoContainer components={["DatePicker"]}> */}
        <DatePicker
          label="Початок"
          views={["month", "year"]}
          slotProps={{ textField: { size: "small" } }}
          // defaultValue={dayjs(new Date())}
          value={dayjs(period)}
          onChange={(v) => {
            setPeriod(new Date(v));
          }}
          format="MM-YYYY"
          closeOnSelect={true}
          disableFuture={true}
        />
        {/* </DemoContainer> */}
      </LocalizationProvider>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Працівники
        </AccordionSummary>
        <AccordionDetails>
          <Bar
            dataset={
              cshrDataset(sqldata, barRows(), barColsCshr(), "", "_effic")
                .dataset
            }
            xAxis={[{ scaleType: "band", dataKey: "month" }]}
            series={
              cshrDataset(sqldata, barRows(), barColsCshr(), "", "_effic")
                .series
            }
            title="Ефективність(дохід/ЗП)"
            width={360}
            height={240}
            skipAnimation
          />
          <Bar
            dataset={profit.dataset}
            xAxis={[{ scaleType: "band", dataKey: "month" }]}
            series={profit.series}
            title="Дохід"
            width={360}
            height={240}
          />
          <Bar
            dataset={wage.dataset}
            xAxis={[{ scaleType: "band", dataKey: "month" }]}
            series={wage.series}
            title="Зарплата"
            width={360}
            height={240}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          Валюти(дохід)
        </AccordionSummary>
        <AccordionDetails>
          <Bar
            dataset={ptotal.dataset}
            xAxis={[{ scaleType: "band", dataKey: "month" }]}
            series={ptotal.series}
            title="Разом"
            width={360}
            height={240}
          />
          <Bar
            dataset={pusd.dataset}
            xAxis={[{ scaleType: "band", dataKey: "month" }]}
            series={pusd.series}
            title="USD"
            width={360}
            height={240}
          />
          <Bar
            dataset={peur.dataset}
            xAxis={[{ scaleType: "band", dataKey: "month" }]}
            series={peur.series}
            title="EUR"
            width={360}
            height={240}
          />
          <Bar
            dataset={ppln.dataset}
            xAxis={[{ scaleType: "band", dataKey: "month" }]}
            series={ppln.series}
            title="PLN"
            width={360}
            height={240}
          />
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};

/*function Bar(props) {
  const { title, ...others } = props;
  return (
    <>
      <>{title}</>
      <BarChart {...others} />
    </>
  );
}*/

function curDataset(d, rows, start, stop) {
  const dset = [];
  const ser = [];
  const cols = ["USD", "EUR", "PLN", "other"];
  let i = 0;
  cols.map((v) => {
    ser.push({ dataKey: v, label: v === "other" ? "інші" : v });
  });
  // console.log(cols);
  let tmprow = {};
  rows.map((v) => {
    tmprow = {};
    tmprow["pr"] = v;
    tmprow["month"] = new Date(v).toLocaleDateString("uk-UA", {
      month: "short",
    });
    for (i = 0; i < cols.length; ++i) {
      tmprow[cols[i]] = 0;
    }
    dset.push(tmprow);
  });
  d.map((v) => {
    for (i = 0; i < dset.length && dset[i].pr != v.period; ++i) {}
    if (i < dset.length) {
      if (v.chid === "USD" || v.chid === "EUR" || v.chid === "PLN") {
        dset[i][v.chid] += Math.round(Number(v.total));
      } else {
        dset[i]["other"] += Math.round(Number(v.total));
      }
    }
  });
  return { dataset: dset, series: ser };
}

function Pie(props) {
  const { data, title, ...others } = props;
  return (
    <>
      <>{title}</>
      <PieChart
        series={[
          {
            data,
            paddingAngle: 3,
            cornerRadius: 10,
          },
        ]}
        {...others}
      />
    </>
  );
}

function pickUp(d, filt = "") {
  var rslt = [];
  let vid = 0;
  let vamnt = 0;
  let vwage = 0;
  let vlabel = "";
  d.map((v, i, arr) => {
    if (v.cashier !== "" && (filt === "" || filt === v.chid)) {
      if (v.cashier !== vlabel) {
        if (vlabel != "") {
          rslt.push({ id: vid, value: vamnt, label: vlabel, wage: vwage });
        }
        ++vid;
        vamnt = 0;
        vwage = 0;
        vlabel = v.cashier;
      }
      vamnt += Number(v.total);
      vwage = v.wage;
    }
    if (i === arr.length - 1) {
      rslt.push({ id: vid, value: vamnt, label: vlabel, wage: vwage });
    }
  });
  // console.log(rslt);
  return rslt;
}

import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";
import GaugeChart from "react-gauge-chart";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

const StatBox = ({
  title,
  subtitle,
  icon,
  progress,
  increase,
  property,
  value,
  statsArray,
  increasing = true,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const avg = (series, property) => {
    return Math.round(
      series.reduce((a, b) => a + b[property], 0) / series.length || 0
    );
  };

  const asc = (series, property) =>
    series.sort((a, b) => a[property] - b[property]);

  const quantile = (series, property, q) => {
    const sorted = asc(series, property);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
      return (
        sorted[base][property] +
        rest * (sorted[base + 1][property] - sorted[base][property])
      );
    } else {
      return sorted[base][property];
    }
  };

  const q25 = (series, property) => quantile(series, property, 0.25);

  const q50 = (series, property) => quantile(series, property, 0.5);

  const q75 = (series, property) => quantile(series, property, 0.75);

  const iq = (series, property) =>
    q75(series, property) - q25(series, property);

  const lowest = (series, property) =>
    Number(avg(series, property) - iq(series, property) / 2).toFixed(2);

  const highest = (series, property) =>
    Number(avg(series, property) + iq(series, property) / 2).toFixed(2);

  const median = (series, property) => q50(series, property);

  const gaugeColors = increasing
    ? ["#C63D2F", "#A8DF8E"]
    : ["#A8DF8E", "#C63D2F"];

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
          {subtitle}
        </Typography>
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          {increase}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Box>{icon}</Box>
        {property && statsArray.length > 0 && (
          <Box display="flex" justifyContent="center">
            <GaugeChart
              id="gauge-chart3"
              nrOfLevels={30}
              colors={gaugeColors}
              arcWidth={0.3}
              percent={
                value / Math.max(...statsArray.map((stat) => stat[property]))
              }
              formatTextValue={(_) => title}
              style={{ width: 200 }}
            />
          </Box>
        )}
        {progress && (
          <Box>
            <ProgressCircle progress={progress} />
          </Box>
        )}
      </Box>
      <Box display="flex" justifyContent="center">
        {property && statsArray.length > 0 && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <Item>{q25(statsArray, property)}</Item>
            <Item>{median(statsArray, property)}</Item>
            <Item>{q75(statsArray, property)}</Item>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default StatBox;

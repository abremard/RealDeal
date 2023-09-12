import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";

const StatBox = ({
  title,
  subtitle,
  icon,
  progress,
  increase,
  property,
  statsArray,
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
    avg(series, property) - iq(series, property) / 2;

  const highest = (series, property) =>
    avg(series, property) + iq(series, property) / 2;

  const median = (series, property) => q50(series, property);

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {title}
          </Typography>
        </Box>
        {property && statsArray && (
          <Box>
            <Typography>
              {avg(statsArray, property) +
                "|" +
                lowest(statsArray, property) +
                "|" +
                highest(statsArray, property) +
                "|" +
                q25(statsArray, property) +
                "|" +
                median(statsArray, property) +
                "|" +
                q75(statsArray, property)}
            </Typography>
          </Box>
        )}
        {progress && (
          <Box>
            <ProgressCircle progress={progress} />
          </Box>
        )}
      </Box>
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
    </Box>
  );
};

export default StatBox;

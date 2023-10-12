/* eslint-disable jsx-a11y/alt-text */
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Header from "../../components/Header";
import React, { useEffect, useState } from "react";

const AI = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [predictionParams, setPredictionParams] = useState([
    {
      Condo_area: "Bang Kapi",
      Year_built: 2011,
      Area_m2: 6476.0,
      "#_Tower": 2,
      "#_Floor": 8.0,
      Rental_Yield: 4.86,
      Latitude: 13.766348,
      Longtitude: 100.649395,
      MinDist_Station: 8256,
      Kind: "low rise",
      Road: "\u0e16\u0e19\u0e19\u0e40\u0e2a\u0e23\u0e35\u0e44\u0e17\u0e22",
    },
  ]);
  const [sqmPrice, setSqmPrice] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/prediction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(predictionParams),
    })
      .then((response) => response.json())
      .then((data) => {
        setSqmPrice(data["sqm_price"]);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [predictionParams]);

  let predictionInputHandler = (e, prop) => {
    setPredictionParams([
      {
        ...predictionParams[0],
        [prop]: e.target.value,
      },
    ]);
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="AI tools" subtitle="AI sqm price prediction" />
        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Box p="15px">
            <TextField
              sx={{ m: 2 }}
              id="condo-area-input"
              label="Condo area"
              variant="standard"
              defaultValue={predictionParams[0].Condo_area}
              onChange={(e) => predictionInputHandler(e, "Condo_area")}
            />
            <TextField
              sx={{ m: 2 }}
              id="year-built-input"
              label="Year built"
              variant="standard"
              defaultValue={predictionParams[0].Year_built}
              onChange={(e) => predictionInputHandler(e, "Year_built")}
            />
            <TextField
              sx={{ m: 2 }}
              id="area-m2-input"
              label="Area (m2)"
              variant="standard"
              defaultValue={predictionParams[0].Area_m2}
              onChange={(e) => predictionInputHandler(e, "Area_m2")}
            />
            <TextField
              sx={{ m: 2 }}
              id="tower-input"
              label="Number of towers"
              variant="standard"
              defaultValue={predictionParams[0]["#_Tower"]}
              onChange={(e) => predictionInputHandler(e, "#_Tower")}
            />
            <TextField
              sx={{ m: 2 }}
              id="floor-input"
              label="Number of floors"
              variant="standard"
              defaultValue={predictionParams[0]["#_Floor"]}
              onChange={(e) => predictionInputHandler(e, "#_Floor")}
            />
            <TextField
              sx={{ m: 2 }}
              id="yield-input"
              label="Rental yield"
              variant="standard"
              defaultValue={predictionParams[0].Rental_Yield}
              onChange={(e) => predictionInputHandler(e, "Rental_Yield")}
            />
            <TextField
              sx={{ m: 2 }}
              id="lat-input"
              label="Latitude"
              variant="standard"
              defaultValue={predictionParams[0].Latitude}
              onChange={(e) => predictionInputHandler(e, "Latitude")}
            />
            <TextField
              sx={{ m: 2 }}
              id="lon-input"
              label="Longitude"
              variant="standard"
              defaultValue={predictionParams[0].Longtitude}
              onChange={(e) => predictionInputHandler(e, "Longtitude")}
            />
            <TextField
              sx={{ m: 2 }}
              id="distance-input"
              label="Minimum distance to station"
              variant="standard"
              defaultValue={predictionParams[0].MinDist_Station}
              onChange={(e) => predictionInputHandler(e, "MinDist_Station")}
            />
            <FormControl sx={{ m: 2, minWidth: 80 }}>
              <InputLabel id="kind-input-label">Kind</InputLabel>
              <Select
                labelId="kind-input-select-label"
                id="kind-input-select"
                defaultValue={predictionParams[0].Kind}
                label="Age"
                onChange={(e) => predictionInputHandler(e, "Kind")}
              >
                <MenuItem value={"low rise"}>Low rise</MenuItem>
                <MenuItem value={"high rise"}>High rise</MenuItem>
              </Select>
            </FormControl>
            <TextField
              sx={{ m: 2 }}
              id="road-input"
              label="Road"
              variant="standard"
              defaultValue={predictionParams[0].Road}
              onChange={(e) => predictionInputHandler(e, "Road")}
            />
          </Box>
          <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
            Predicted sqm price : {sqmPrice}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AI;

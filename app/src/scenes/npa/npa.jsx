/* eslint-disable jsx-a11y/alt-text */
import {
  Autocomplete,
  Box,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import React, { useEffect, useState } from "react";

const NPA = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [npaProperties, setNpaProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState();

  let inputHandler = (e) => {
    const selectedProperty = e.target.innerText;
    // const selectedCondoId = npaProperties.filter(
    //   (property) => property.label === selectedCondo
    // )[0].id;
    setSelectedProperty(
      npaProperties.filter(
        (property) => property["calSumAreaCollGrpId"] === selectedProperty
      )[0]
    );
  };

  useEffect(() => {
    fetch("http://localhost:5000/npa/all", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setNpaProperties(
          data.sort((a, b) =>
            a.sumAreaNum < b.sumAreaNum
              ? 1
              : b.sumAreaNum < a.sumAreaNum
              ? -1
              : 0
          )
        );
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="NPA watch" subtitle="Don't miss an NPA opportunity" />
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
          sx={{ width: "40%" }}
        >
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={npaProperties}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} label="399/52 ปรีดีพนมยงค์ 14 แยก 3" />
            )}
            getOptionLabel={(option) => option.calSumAreaCollGrpId}
            onChange={inputHandler}
          />
        </Box>
      </Box>
      {npaProperties.length > 0 && selectedProperty && (
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="20px"
        >
          <Box
            gridColumn="span 7"
            gridRow="span 6"
            backgroundColor={colors.primary[400]}
            p="30px"
          >
            <Box display="flex" flexDirection="column" alignItems="left">
              <Typography variant="h1">
                Price : {selectedProperty["price"]}
              </Typography>
              <Typography variant="h3">
                Area : {selectedProperty["sumAreaNum"] + " m²"}
              </Typography>
              <Typography variant="h3">
                View count : {selectedProperty["productCountView"]}
              </Typography>
              <Typography variant="h5">
                District : {selectedProperty["shrAmphurName"]}
              </Typography>
              <Typography variant="h5">
                Registry : {selectedProperty["shrTambonName"]}
              </Typography>
              <Typography variant="h5">
                Address :{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={selectedProperty["shareURL"]}
                  style={{ color: "#a87932" }}
                >
                  {selectedProperty["addr"]}
                </a>
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt="25px"
            >
              <img
                width="500"
                height="350"
                src={
                  "https://npa.krungthai.com/image/product/" +
                  selectedProperty["fileName"]
                }
              />
            </Box>
          </Box>
          <Box
            gridColumn="span 5"
            gridRow="span 6"
            backgroundColor={colors.primary[400]}
            p="30px"
          >
            <Box display="flex" flexDirection="column" alignItems="left">
              <Typography variant="h5">
                Price evolution :
                <pre>
                  {JSON.stringify(
                    JSON.parse(selectedProperty["shrPriceVos"]),
                    null,
                    2
                  )}
                </pre>
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default NPA;

/* eslint-disable jsx-a11y/alt-text */
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DirectionsTransitIcon from "@mui/icons-material/DirectionsTransit";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React, { useState, useEffect } from "react";

const Condominium = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const image_array = [
    "https://www.sansiri.com/uploads/gallery/2023/04/03/250_xt-phayathai-gallery-03.jpg",
    "https://www.sansiri.com/uploads/project/2022/04/26/450_the-line-vibe-project-thumbnail-800x501.webp",
    "https://www.thaiembassy.com/wp-content/uploads/2022/07/Buying-a-Condominium-in-Bangkok.jpg",
    "https://www.sansiri.com/uploads/project/2022/12/07/450_project-thumbnail-800x501.jpg",
    "https://www.escapeartist.com/realestate/wp-content/uploads/2017/02/Thailand-condo.jpg",
    "https://www.christiesrealestate.com/localimagereader.ashx?imageurl=http%3A%2F%2FRealEstateAdminImages.gabriels.net%2F170%2F82542%2F170-_DSC067020190316025155508-688.jpg&imagecache=true",
    "https://a0.muscache.com/im/pictures/48b53574-a08d-45d6-a6c3-447f2cc60b1f.jpg?im_w=720",
    "https://www.rentbangkokcondos.com/wp-content/uploads/2015/01/The-Lofts-Condo-Ekkamai.jpg",
    "https://www.elitehomes.co.th/wp-content/uploads/2021/04/banner-2-1.jpg",
    "https://media.timeout.com/images/105458169/750/562/image.jpg",
  ];

  const [property, setProperty] = useState(false);
  const [edaProperties, setEdaProperties] = useState([]);

  const [inputText, setInputText] = useState("Bang Kapi");
  let inputHandler = (e) => {
    if (e.target.value.length > 2) {
      setInputText(e.target.value);
    }
  };

  const [granularity, setGranularity] = React.useState("Condo_area");
  const handleChange = (e) => {
    setGranularity(e.target.value);
  };

  useEffect(() => {
    fetch("http://localhost:5000/properties?search=" + encodeURI(inputText))
      .then((response) => response.json())
      .then((data) => {
        setProperty(data[0]);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [inputText]);
  useEffect(() => {
    const searchToken =
      granularity === "City"
        ? ""
        : "?search=" + encodeURI(property[granularity]);
    fetch("http://localhost:5000/properties" + searchToken)
      .then((response) => response.json())
      .then((data) => {
        setEdaProperties(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [property, granularity]);

  const randomNumberInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const mockTrafficData = [];
  for (let i = 0; i < 100; i++) {
    mockTrafficData.push({ traffic: randomNumberInRange(1, 100000) });
  }

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="CONDOMINIUMS"
          subtitle="Search condominiums in Bangkok"
        />
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
          sx={{ width: "40%" }}
        >
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            placeholder="Search"
            onChange={inputHandler}
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
        <Box>
          <FormControl fullWidth>
            <InputLabel id="granularity-input">Granularity</InputLabel>
            <Select
              labelId="granularity-select-label"
              id="granularity-select"
              value={granularity}
              label="Granularity"
              onChange={handleChange}
            >
              <MenuItem value={"Condo_area"}>Condo_area</MenuItem>
              <MenuItem value={"City"}>City</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
          gridColumn="span 7"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            {property && property.Condo_NAME_EN}
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <img
              width="500"
              height="350"
              src={image_array[randomNumberInRange(0, 9)]}
            />
          </Box>
        </Box>
        <Box
          gridColumn="span 5"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Details
          </Typography>
          {property && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="left"
              mt="50px"
            >
              <Typography variant="h5">
                Address : {property["Address_TH"]}
              </Typography>
              <Typography variant="h5">
                Area : {property["Area_m2"] + " m²"}
              </Typography>
              <Typography variant="h5">
                District : {property["Condo_area"]}
              </Typography>
              <Typography variant="h5">
                Year built : {property["Year_built"]}
              </Typography>
              <Typography variant="h5">
                #_Floor : {property["#_Floor"]}
              </Typography>
              <Typography variant="h5">
                #_Tower : {property["#_Tower"]}
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          gridColumn="span 5"
          gridRow="span 1"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Contacts
          </Typography>
          {property && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="left"
              mt="25px"
            >
              <Typography>
                HipFlat :{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={property["Condo_link"]}
                  style={{ color: "#a87932" }}
                >
                  {property["Condo_link"]}
                </a>
              </Typography>
            </Box>
          )}
        </Box>
        {/* ROW 2 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {property && edaProperties.length > 0 && (
            <StatBox
              title={property["Sale_Price_Sqm"].toLocaleString() + " ฿"}
              subtitle="Price (m²)"
              increase={"+" + property["Sale_Price_Inc[Year]"] + "%"}
              icon={
                <AttachMoneyIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
              property="Sale_Price_Sqm"
              statsArray={edaProperties}
            />
          )}
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {property && (
            <StatBox
              title={property["MinDist_Station"].toLocaleString() + " m"}
              subtitle="Distance to transport"
              icon={
                <DirectionsTransitIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
              property="MinDist_Station"
              statsArray={edaProperties}
            />
          )}
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {property && (
            <StatBox
              title={property["Rental_Yield"] + "%"}
              subtitle="Rental yield"
              progress={property["Rental_Yield"] * 0.01}
              increase={property["Rental_Yield_Inc[Year]"] + "%"}
              icon={
                <AddCircleIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
              property="Rental_Yield"
              statsArray={edaProperties}
            />
          )}
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {property && (
            <StatBox
              title={randomNumberInRange(1, 100000).toLocaleString()}
              subtitle="Search/month"
              increase={"+" + randomNumberInRange(1, 20) + "%"}
              icon={
                <QueryStatsIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
              property="traffic"
              statsArray={mockTrafficData}
            />
          )}
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                $59,342.32
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Condominium;

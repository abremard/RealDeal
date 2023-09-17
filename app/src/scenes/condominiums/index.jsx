/* eslint-disable jsx-a11y/alt-text */
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DirectionsTransitIcon from "@mui/icons-material/DirectionsTransit";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import StatBox from "../../components/StatBox";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
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

  // Add autocomplete to search and only allow sending valid search params to backend
  // https://mui.com/material-ui/react-autocomplete/#search-input
  // This should prevent blank page errors

  const [propertyNames, setPropertyNames] = useState([]);
  const [property, setProperty] = useState();
  const [edaProperties, setEdaProperties] = useState([]);
  const [bkkDemography, setBkkDemography] = useState([]);
  const [demography, setDemography] = useState([]);
  const [condoId, setCondoId] = useState(1);
  const [mortageParams, setMortgageParams] = useState({
    price: 5000000.0,
    rent: 35000.0,
    monthly_expenses: 17500.0,
    down_payment: 1000000.0,
    appreciation: 0.04,
    interest_rate: 0.05,
    mortgage_duration: 30,
    ROI_duration: 12,
  });
  const [mortageProps, setMortgageProps] = useState(undefined);

  let inputHandler = (e) => {
    const selectedCondo = e.target.innerText;
    const selectedCondoId = propertyNames.filter(
      (property) => property.label === selectedCondo
    )[0].id;
    setCondoId(selectedCondoId);
  };

  let mortgageInputHandler = (e, prop) => {
    setMortgageParams({
      ...mortageParams,
      [prop]: parseFloat(e.target.value.replace(/[^0-9-.]/g, "")),
    });
  };

  const [granularity, setGranularity] = React.useState("Condo_area");
  const handleChange = (e) => {
    setGranularity(e.target.value);
  };

  useEffect(() => {
    fetch("http://localhost:5000/properties/all")
      .then((response) => response.json())
      .then((data) => {
        setPropertyNames(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  useEffect(() => {
    fetch("http://localhost:5000/properties/" + condoId)
      .then((response) => response.json())
      .then((data) => {
        setProperty(data[0]);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [condoId]);
  useEffect(() => {
    if (property) {
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
    }
  }, [property, granularity]);
  useEffect(() => {
    if (property) {
      const searchToken = "?district=" + encodeURI(property["Condo_area"]);
      fetch("http://localhost:5000/demography" + searchToken)
        .then((response) => response.json())
        .then((data) => {
          setDemography(data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [property]);
  useEffect(() => {
    fetch("http://localhost:5000/demography/all")
      .then((response) => response.json())
      .then((data) => {
        setBkkDemography(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  useEffect(() => {
    fetch(
      "http://localhost:5000/mortgage?price=" +
        mortageParams.price +
        "&rent=" +
        mortageParams.rent +
        "&monthly_expenses=" +
        mortageParams.monthly_expenses +
        "&down_payment=" +
        mortageParams.down_payment +
        "&appreciation=" +
        mortageParams.appreciation +
        "&interest_rate=" +
        mortageParams.interest_rate +
        "&mortgage_duration=" +
        mortageParams.mortgage_duration +
        "&ROI_duration=" +
        mortageParams.ROI_duration
    )
      .then((response) => response.json())
      .then((data) => {
        setMortgageProps(data[0]);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [mortageParams]);

  const computeDiff = (data, sliceStart = 0, sliceEnd = 100) => {
    if (data.length > 0) {
      return data.slice(sliceStart, sliceEnd).map((el) => {
        return {
          ...el,
          y: ((el.y - data[sliceStart].y) * sliceEnd) / data[sliceStart].y,
        };
      });
    }
    return data;
  };

  const graph_data = property
    ? [
        {
          id: "Bangkok",
          color: tokens("dark").blueAccent[300],
          data: computeDiff(bkkDemography, 40, 100),
        },
        {
          id: property["Condo_area"],
          color: tokens("dark").greenAccent[500],
          data: computeDiff(demography, 40, 100),
        },
      ]
    : [];

  const randomNumberInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const mockTrafficData = [];
  for (let i = 0; i < 100; i++) {
    mockTrafficData.push({ traffic: randomNumberInRange(1, 100000) });
  }

  const traffic = randomNumberInRange(1, 100000);
  const trafficProgress = randomNumberInRange(1, 20);

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
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={propertyNames}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} label="Lumpini Ville Sukhumvit 77" />
            )}
            onChange={inputHandler}
          />
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
              <MenuItem value={"Condo_area"}>District</MenuItem>
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
          gridRow="span 2"
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
              progress={property["Sale_Price_Inc[Year]"] * 0.01}
              icon={
                <AttachMoneyIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
              property="Sale_Price_Sqm"
              value={property["Sale_Price_Sqm"]}
              statsArray={edaProperties}
              increasing={false}
            />
          )}
        </Box>
        <Box
          gridColumn="span 3"
          gridRow="span 2"
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
              value={property["MinDist_Station"]}
              increase={"0%"}
              progress={"0"}
              statsArray={edaProperties}
              increasing={false}
            />
          )}
        </Box>
        <Box
          gridColumn="span 3"
          gridRow="span 2"
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
              value={property["Rental_Yield"]}
              statsArray={edaProperties}
            />
          )}
        </Box>
        <Box
          gridColumn="span 3"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {property && (
            <StatBox
              title={traffic.toLocaleString()}
              subtitle="Search/month"
              increase={"+" + trafficProgress + "%"}
              progress={trafficProgress * 0.01}
              icon={
                <QueryStatsIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
              property="traffic"
              value={traffic}
              statsArray={mockTrafficData}
            />
          )}
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
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
                Population evolution (%)
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
          <Box height="400px" m="-20px 0 0 0">
            <LineChart data={graph_data} isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 3"
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
              Mortgage calculator
            </Typography>
            <IconButton>
              <DownloadOutlinedIcon
                sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
              />
            </IconButton>
          </Box>
          <Box p="15px">
            <TextField
              id="price-input"
              label="Unit price"
              variant="standard"
              defaultValue={mortageParams.price.toLocaleString()}
              onChange={(e) => mortgageInputHandler(e, "price")}
            />
            <TextField
              id="rent-input"
              label="Monthly rent"
              variant="standard"
              defaultValue={mortageParams.rent.toLocaleString()}
              onChange={(e) => mortgageInputHandler(e, "rent")}
            />
            <TextField
              id="monthly-expense-input"
              label="Monthly expense"
              variant="standard"
              defaultValue={mortageParams.monthly_expenses.toLocaleString()}
              onChange={(e) => mortgageInputHandler(e, "monthly_expenses")}
            />
            <TextField
              id="down-payment-input"
              label="Down payment"
              variant="standard"
              defaultValue={mortageParams.down_payment.toLocaleString()}
              onChange={(e) => mortgageInputHandler(e, "down_payment")}
            />
            <TextField
              id="appreciation-input"
              label="Appreciation"
              variant="standard"
              defaultValue={mortageParams.appreciation}
              onChange={(e) => mortgageInputHandler(e, "appreciation")}
            />
            <TextField
              id="interest-rate-input"
              label="Interest rate"
              variant="standard"
              defaultValue={mortageParams.interest_rate}
              onChange={(e) => mortgageInputHandler(e, "interest_rate")}
            />
            <TextField
              id="mortgage-duration-input"
              label="Mortgage duration"
              variant="standard"
              defaultValue={mortageParams.mortgage_duration}
              onChange={(e) => mortgageInputHandler(e, "mortgage_duration")}
            />
            <TextField
              id="roi-duration-input"
              label="ROI duration"
              variant="standard"
              defaultValue={mortageParams.ROI_duration}
              onChange={(e) => mortgageInputHandler(e, "ROI_duration")}
            />
          </Box>
          {mortageProps && (
            <Box p="15px">
              <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                  <TableBody>
                    <TableRow
                      key={"Starting Debt"}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>Starting Debt</TableCell>
                      <TableCell align="right">
                        {mortageProps["starting_debt"].toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      key={"Monthly Payment"}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>Monthly Payment</TableCell>
                      <TableCell align="right">
                        {mortageProps["monthly_payment"].toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      key={"Avg Monthly Principal"}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>Avg Monthly Principal</TableCell>
                      <TableCell align="right">
                        {mortageProps["avg_monthly_principal"].toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      key={"Avg Monthly Interest"}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>Avg Monthly Interest</TableCell>
                      <TableCell align="right">
                        {mortageProps["avg_monthly_interest"].toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      key={"Gross Yield"}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>Gross Yield</TableCell>
                      <TableCell align="right">
                        {mortageProps["gross_yield"].toLocaleString(undefined, {
                          style: "percent",
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      key={"Monthly Cash Flow"}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>Monthly Cash Flow</TableCell>
                      <TableCell align="right">
                        {mortageProps["monthly_cash_flow"].toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      key={"Cash On Cash Return"}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>Cash On Cash Return</TableCell>
                      <TableCell align="right">
                        {mortageProps["cash_on_cash_return"].toLocaleString(
                          undefined,
                          { style: "percent", minimumFractionDigits: 2 }
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      key={"Equity"}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>Equity</TableCell>
                      <TableCell align="right">
                        {mortageProps["equity"].toLocaleString(undefined, {
                          style: "percent",
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      key={"ROI On Duration"}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>ROI On Duration</TableCell>
                      <TableCell align="right">
                        {mortageProps["ROI_on_duration"].toLocaleString(
                          undefined,
                          { style: "percent", minimumFractionDigits: 2 }
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Condominium;

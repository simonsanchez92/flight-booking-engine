const Amadeus = require("amadeus");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
require("dotenv").config({ path: "./config/.env" });

const PORT = 4000;

const amadeus = new Amadeus({
  clientId: process.env.API_KEY,
  clientSecret: process.env.API_SECRET,
});

app.get("/api/autocomplete", async (req, res, next) => {
  try {
    const { query } = req;
    const { data } = await amadeus.referenceData.locations.get({
      keyword: query.keyword,
      subType: Amadeus.location.city,
    });
    console.log(data);
    res.json(data);
  } catch (err) {
    console.error(err.response);
    res.json([]);
  }
});

app.get("/api/search", async (req, res, next) => {
  try {
    // const { query } = req;
    // const { data } = await amadeus.shopping.flightOffersSearch.get({
    //   originLocationCode: query.origin,
    //   destinationLocationCode: query.destination,
    //   departureDate: query.departureDate,
    //   adults: query.adults,
    //   children: query.children,
    //   infants: query.infants,
    //   travelClass: query.travelClass,
    //   ...(query.returnDate ? { returnDate: query.returnDate } : {}),
    // });

    amadeus.shopping.flightOffersSearch
      .get({
        originLocationCode: "BOS",
        destinationLocationCode: "LON",
        departureDate: "2022-08-08",
        adults: "2",
      })
      .then(function (data) {
        res.json(data);
      })
      .catch(function (responseError) {
        console.log(JSON.stringify(responseError));
      });
  } catch (err) {
    console.error(err.response);
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
  //   console.log(process.env.API_KEY);
  //   console.log(process.env.API_SECRET);
  //   console.log(amadeus);
});

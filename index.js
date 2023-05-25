const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();
const Airtable = require("airtable-node");
const cors = require("cors");

app.use(
  cors({
    origin: [
      "https://harmonious-parfait-9117fd.netlify.app",
      "http://localhost:5173",
      "https://pesapal.com",
      "http://localhost:3000",
    ],
    methods: "GET",
  })
);

app.get("/", (req, res) => {
  const airtable = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN })
    .base(process.env.AIRTABLE_BASE)
    .table("movieimages");
  try {
    airtable
      .list({
        maxRecords: 200,
        pageSize: 100,
        cellFormat: "json",
      })
      .then((resp) => {
        const movies = resp.records.map((movie) => {
          const { id } = movie;
          const { name, buttonText } = movie.fields;
          const { url } = movie.fields.images[0];
          return {
            id,
            name,
            buttonText,
            url,
          };
        });

        res.send(movies);
      });
  } catch (error) {
    res.send("There was an error during the API call");
  }
});

app.get("/series", (req, res) => {
  const airtable = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN })
    .base(process.env.AIRTABLE_BASE)
    .table("seriesimages");
  try {
    airtable
      .list({
        maxRecords: 200,
        pageSize: 100,
        cellFormat: "json",
      })
      .then((resp) => {
        const series = resp.records.map((movie) => {
          const { id } = movie;
          const { name, buttonText } = movie.fields;
          const { url } = movie.fields.images[0];
          return {
            id,
            name,
            buttonText,
            url,
          };
        });

        res.send(series);
      });
  } catch (error) {
    res.send("There was an error during the API call");
  }
});

app.get("/kids", (req, res) => {
  const airtable = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN })
    .base(process.env.AIRTABLE_BASE)
    .table("kidsimages");
  try {
    airtable
      .list({
        maxRecords: 200,
        pageSize: 100,
        cellFormat: "json",
      })
      .then((resp) => {
        const kids = resp.records.map((kid) => {
          const { id } = kid;
          const { name, buttonText } = kid.fields;
          const { url } = kid.fields.images[0];
          return {
            id,
            name,
            buttonText,
            url,
          };
        });

        res.send(kids);
      });
  } catch (error) {
    res.send("There was an error during the API call");
  }
});

app.get("/products", (req, res) => {
  const airtable = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN })
    .base(process.env.AIRTABLE_BASE)
    .table("products");
  try {
    airtable
      .list({
        maxRecords: 200,
        pageSize: 100,
        cellFormat: "json",
      })
      .then((resp) => {
        const products = resp.records.map((product) => {
          const { id } = product;
          const { name } = product.fields;
          const { url } = product.fields.url[0];
          const { subText } = product.fields;
          const { buttonText } = product.fields;
          return {
            id,
            name,
            subText,
            buttonText,
            url,
          };
        });
        res.send(products);
      });
  } catch (error) {
    res.send("There was an error during the API call");
  }
});

app.get("/products/:id", (req, res) => {
  const id = req.params.id;
  const airtable = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN })
    .base(process.env.AIRTABLE_BASE)
    .table("products");
  try {
    airtable
      .list({
        maxRecords: 200,
        pageSize: 100,
        cellFormat: "json",
      })
      .then((resp) => {
        const response = resp.records;
        const filteredProduct = response.filter((product) => {
          return product.id === id;
        });

        const { name } = filteredProduct[0].fields;
        const { url } = filteredProduct[0].fields.url[0];
        const { subText } = filteredProduct[0].fields;
        const { buttonText } = filteredProduct[0].fields;

        const modifiedFilteredProducts = {
          name,
          url,
          subText,
          buttonText,
        };
        res.send(modifiedFilteredProducts);
      });
  } catch (error) {
    res.send("There was an error during the API call");
  }
});

app.listen(port, () => {
  console.log("i am listening on port 3000");
});

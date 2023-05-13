const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();
const Airtable = require("airtable-node");
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:3000/",
      "https://harmonious-parfait-9117fd.netlify.app/",
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

app.listen(port, () => {
  console.log("i am listening on port 3000");
});

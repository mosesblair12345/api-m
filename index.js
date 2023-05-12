const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();
const Airtable = require("airtable-node");

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
        const movie = resp.records;
        res.send(movie);
      });
  } catch (error) {
    res.send("There was an error during the API call");
  }
});

app.listen(port, () => {
  console.log("i am listening on port 3000");
});

const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();
const Airtable = require("airtable-node");

app.get("/", (req, res) => {
  const airtable = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN })
    .base(process.env.AIRTABLE_BASE)
    .table(process.env.AIRTABLE_TABLE);
  try {
    airtable.list({ maxRecords: 200 }).then((resp) => {
      const movies = resp.records.map((movie) => {
        const { id, fields } = movie;
        const { buttonText, images, name } = fields;
        const { url } = images[0];
        return {
          id,
          buttonText,
          name,
          url,
        };
      });
      res.send(movies);
    });
  } catch (error) {
    res.send("There was an error with the API fetch request");
  }
});

app.listen(port, () => {
  console.log("i am listening on port 3000");
});

const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();
let Airtable = require("airtable");

app.get("/", (req, res) => {
  let base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(
    process.env.AIRTABLE_BASE
  );

  try {
    base(process.env.AIRTABLE_TABLE)
      .select({
        view: "Grid view",
      })
      .firstPage(function (err, records) {
        if (err) {
          console.error(err);
          return;
        } else {
          res.send(records);
        }
      });
  } catch (error) {
    res.send("There was an error with the API fetch request");
  }
});

app.listen(port, () => {
  console.log("i am listening on port 3000");
});

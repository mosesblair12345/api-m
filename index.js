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
          const { name, buttonText, genres } = movie.fields;
          const { url } = movie.fields.images[0];
          return {
            id,
            name,
            buttonText,
            url,
            genres,
          };
        });

        res.send(series);
      });
  } catch (error) {
    res.send("There was an error during the API call");
  }
});

app.get("/videos", (req, res) => {
  const airtable = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN })
    .base(process.env.AIRTABLE_BASE)
    .table("moviesVideos");
  try {
    airtable
      .list({
        maxRecords: 200,
        pageSize: 100,
        cellFormat: "json",
      })
      .then((resp) => {
        const videos = resp.records.map((video) => {
          const { id } = video;
          const fields = video.fields;
          const { name } = fields;
          const url = fields.imgSrc[0].url;
          const urls = fields.videoSrc[0].url;
          return {
            id,
            name,
            url,
            urls,
          };
        });
        res.send(videos);
      });
  } catch (error) {
    res.send("There was an error during the API call");
  }
});

app.listen(port, () => {
  console.log("i am listening on port 3000");
});

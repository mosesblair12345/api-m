const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();
const Airtable = require("airtable-node");
const cors = require("cors");
const axios = require("axios");
const uniqid = require("uniqid");
const session = require("express-session");

app.use(
  cors({
    origin: [
      "https://harmonious-parfait-9117fd.netlify.app",
      "http://localhost:5173",
      "https://pesapal.com",
      "http://localhost:3000",
    ],
    methods: "GET",
    credentials: true,
  })
);

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.set("view engine", "ejs");

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
        if (filteredProduct.length === 0) {
          res.sendStatus(404).send("Not found");
        } else {
          const { name } = filteredProduct[0].fields;
          const { url } = filteredProduct[0].fields.url[0];
          const { subText } = filteredProduct[0].fields;
          const { buttonText } = filteredProduct[0].fields;
          const { ammount } = filteredProduct[0].fields;
          const modifiedFilteredProducts = {
            name,
            url,
            subText,
            buttonText,
            ammount,
          };
          res.send(modifiedFilteredProducts);
        }
      });
  } catch (error) {
    res.send("There was an error during the API call");
  }
});

app.post("/pesapalInitial", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const phone = req.body.phone;
  const email = req.body.email;
  const ammount = req.body.ammount;

  let data = JSON.stringify({
    consumer_key: "qkio1BGGYAXTu2JOfm7XSXNruoZsrqEW",
    consumer_secret: "osGQ364R49cXKeOYSpaOnT++rHs=",
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      const token = response.data.token;
      let ipnId = "03d49ee2-4961-4fcd-b676-de9748c7c677";
      let data = JSON.stringify({
        id: uniqid(),
        currency: "KES",
        amount: 1,
        description: "Payment for movies or series",
        callback_url: "http://localhost:5173/feedback",
        redirect_mode: "",
        notification_id: ipnId,
        branch: "Onfon Media",
        billing_address: {
          email_address: email,
          phone_number: phone,
          country_code: "KE",
          first_name: firstName,
          middle_name: "",
          last_name: lastName,
          line_1: "Pesapal Limited",
          line_2: "",
          city: "",
          state: "",
          postal_code: "",
          zip_code: "",
        },
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: data,
      };
      axios
        .request(config)
        .then((response) => {
          const order_tracking_id = response.data.order_tracking_id;
          const redirect_url = response.data.redirect_url;
          res.send({
            redirect_url: redirect_url,
            order_tracking_id: order_tracking_id,
            Authorization: token,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/receiveNotifications", (req, res) => {
  res.send(req.body);
});

app.listen(port, () => {
  console.log("i am listening on port 3000");
});

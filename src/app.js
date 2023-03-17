const express = require("express");
require("dotenv").config();
const setter = require("./setter/setter");
require("./config/db");

const app = express();


// set up
app.use(express.json());

// set up routes
setter(app);

// start the server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  console.log(`http://localhost:${process.env.PORT}`);
});

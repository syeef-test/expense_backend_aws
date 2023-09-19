const express = require("express");

const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const userRoute = require("./routes/userRoute");
const expenseRoute = require("./routes/expenseRoute");
const purchaseRoute = require("./routes/purchaseRoute");
const premiuemRoute = require("./routes/premiuemRoute");
const passwordRoute = require("./routes/passwordRoute");

const app = express();

//app.use(helmet());    //disabled as axios js not loading
//app.use(helmet.hidePoweredBy());
// app.use(                                      //axios and bootstrap is loading in localhost
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'", 'data:', 'blob:'],
//       fontSrc: ["'self'", 'https:', 'data:'],
//       scriptSrc: ["'self'", 'unsafe-inline'],
//       scriptSrc: ["'self'", 'https://*.cdn.jsdelivr.net'],
//       scriptSrcElem: ["'self'",'https:', 'https://*.cdn.jsdelivr.net'],
//       styleSrc: ["'self'", 'https:', 'unsafe-inline'],
//       connectSrc: ["'self'", 'data', 'https://*.cdn.jsdelivr.net']
//     },
//   })
// );

//const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});
//app.use(morgan('combined',{stream:accessLogStream}));

const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/user", userRoute);
app.use("/expense", expenseRoute);
app.use("/purchase", purchaseRoute);
app.use("/premiuem", premiuemRoute);
app.use("/password", passwordRoute);

app.use((req, res) => {
  //console.log('url',req.url);
  res.sendFile(path.join(__dirname, `./public/${req.url}`));
  //res.sendFile(`public/${req.url}`, { root: __dirname });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    //console.log(result);
    console.log("mongodb connected");
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });

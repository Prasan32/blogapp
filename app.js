const express = require("express");
const app = express();
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const exphbs = require("express-handlebars");
const bodyparser = require("body-parser");
const userRoute = require("./routes/userRoute");
const fileupload = require("express-fileupload");
const session = require("express-session");
const flash = require("connect-flash");

app.set("view engine", "handlebars");
app.engine(
  "handlebars",
  exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: "mainlayout",
  })
);

app.use(bodyparser.urlencoded({ extended: true }));
//setup session and flash
app.use(
  session({
    secret: "hjhgf",
    saveUninitialized: false,
    resave: false,
    maxAge: 60000000,
    cookie: { maxAge: 60000000 },
  })
);
app.use(flash());
app.use(fileupload());

app.use(express.static("public"));

app.use((req, res, next) => {
  res.locals.error_message = req.flash("error_message");
  res.locals.success_message = req.flash("success_message");
  res.locals.userid = req.session.userid;
  res.locals.email = req.session.email;
  next();
});

require("./database/connection");

app.use(userRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error, result) => {
  if (error) throw error;
  console.log("Server is listening at " + PORT);
});

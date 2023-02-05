const express = require("express");
const routes = require("./routes/routes");
require("./middlewares/auth");
const db = require("./db/db");
app = express();
db();

app.use(express.json());
app.use(routes);

app.listen(3000, () => console.log("connected on port 3000"));

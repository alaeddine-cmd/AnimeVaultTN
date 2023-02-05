const mongoose = require("mongoose");
const { collection } = require("../model/model");

const dbConnexion = () => {
  mongoose
    .connect(
      "mongodb+srv://admin:F7KGmiJAP8B07VTV@animecluster.vmcwivs.mongodb.net/Authentification",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err));
};

module.exports = dbConnexion;

// F7KGmiJAP8B07VTV

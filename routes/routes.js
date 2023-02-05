const { Router } = require("express");
const passport = require("passport");
const { inscription, connexion } = require("../controllers/ctrl");

const router = Router();

router.post("/inscription", inscription);
router.post("/connexion", connexion);

router.use(passport.authenticate("jwt", { session: false }));
router.get("/", (req, res) => {
  res.send("Route Protégé");
});

module.exports = router;

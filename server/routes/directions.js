const express = require("express");
const router = express.Router();
const config = require("../config");
const directions_ucc = require("../ucc/directions_ucc");

router.post("/", (req, res, next) => {
  directions_ucc
    .find_directions(req.body.coordinates)
    .then(geoJsonIcr => {
      res.json(geoJsonIcr);
    })
    .catch(error => {
      console.log(error);
      if (error.message === config.error._412) {
        res.status(412).send(error);
      } else {
        res.status(500).send(error);
      }
    });
});

module.exports = router;

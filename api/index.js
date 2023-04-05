require("dotenv").config();
const express = require("express");
const cors = require("cors");

const pool = require("./connection");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/check", (req, res) => {
  res.status(200).send({ message: "JA3Sentry API V1" });
});

/**
 * Endpoint to receive a block of JA3 Hashes, which will return an array of the
 * received blocks that are deemed threats based on database matches
 */
const VERIFY_ENDPOINT = "/api/verify";
app.get(VERIFY_ENDPOINT, (req, res) => {
  console.log(`${VERIFY_ENDPOINT} received request from ${req.ip}`);
  try {
    pool.query("SELECT * FROM threats", (error, result) => {
      if (error) {
        return res.status(500).send(error);
      }

      res.send(result);
    });
  } catch (error) {
    return res.status(500).send(error);
  }
});

const API_PORT = process.env.APPLICATION_PORT || 4000;
app.listen(API_PORT, () => {
  console.log(`API listening on port ${API_PORT}`);
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./connection");

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
app.post(VERIFY_ENDPOINT, (request, response) => {
  console.log(`${VERIFY_ENDPOINT} received request from ${request.ip}`);
  try {
    const ja3Block = request.body.ja3Block;
    if (!(ja3Block && ja3Block.length)) {
      return response.send([]);
    }

    const arrayToQueryCollection = (arr) => {
      arr.push("null");
      return arr
        .filter((i) => !!i)
        .map((i) => `'${i}'`)
        .join(",");
    };

    const md5s = ja3Block.map((block) => block.ja3_md5);
    const sha1s = ja3Block.map((block) => block.ja3_sha1);
    const userAgents = ja3Block.map((block) => block.user_agent);

    const queryString = `SELECT * FROM threats WHERE ja3_md5 IN (${arrayToQueryCollection(
      md5s
    )}) OR ja3_sha1 IN (${arrayToQueryCollection(
      sha1s
    )}) OR user_agent IN (${arrayToQueryCollection(userAgents)});`;

    console.log(queryString);

    db.query(queryString, (error, result) => {
      if (error) {
        return response.status(500).send(error);
      }

      return response.send(result.rows || []);
    });
  } catch (error) {
    return response.status(500).send(error);
  }
});

const API_PORT = process.env.APPLICATION_PORT || 4000;
app.listen(API_PORT, () => {
  console.log(`API listening on port ${API_PORT}`);
});

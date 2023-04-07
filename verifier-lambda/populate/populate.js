const fs = require("fs");
const path = require("path");

// Dayjs for date parsing
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

// DB Connection
const db = require("../connection");

/**
 * Given a CSV, convert the CSV into an INSERT SQL statement
 * @param {*} filename path to CSV file
 * @returns
 */
const getQueryStringFromCsvFile = (filename) => {
  const dataset = fs.readFileSync(
    path.resolve(__dirname, "ja3_dataset.csv"),
    "utf8"
  );
  const rows = dataset.split("\n");

  let insertQueryString = `INSERT INTO\nthreats (ja3, ja3_md5, ja3_sha1, first_seen, last_seen, reason, source)\nVALUES`;
  for (let i = 0; i < rows.length; i++) {
    const [
      ja3,
      ja3md5,
      ja3sha1,
      firstSeen,
      lastSeen,
      reason,
      source,
      useragent,
    ] = rows[i].split(",");

    const isoFirstSeen = firstSeen
      ? dayjs(firstSeen, "M/D/YYYY HH:mm").toISOString()
      : "";

    const isoLastSeen = lastSeen
      ? dayjs(lastSeen, "M/D/YYYY HH:mm").toISOString()
      : "";

    const itemToValue = (item) => {
      return item ? `'${item}'` : "null";
    };

    const insertItems = [
      ja3,
      ja3md5,
      ja3sha1,
      isoFirstSeen,
      isoLastSeen,
      reason,
      source,
    ].map((i) => itemToValue(i));

    const insertRowString = `\n\t(${insertItems.join(",")}),`;
    insertQueryString += insertRowString;
  }

  insertQueryString = insertQueryString.slice(0, -1);

  insertQueryString += ";";

  return insertQueryString;
};

const query = getQueryStringFromCsvFile("ja3_dataset.csv");

/*
db.query(query, (error, result) => {
  if (error) {
    throw error;
  }

  console.log(result.rowCount);
});
*/

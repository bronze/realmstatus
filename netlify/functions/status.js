const fetch = require("node-fetch");
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const API_ENDPOINT = "https://us.api.blizzard.com/data/wow/search/connected-realm?namespace=dynamic-us&realms.name.en_US=azralon&access_token=" + process.env.BLIZZARD_ACCESS_TOKEN;

exports.handler = async (event, context) => {
  return fetch(API_ENDPOINT, { headers: { Accept: "application/json" } })
    .then((response) => response.json())
    .then((data) => ({
      statusCode: 200,
      body: JSON.stringify(data.results[0].data.status.type),
    }))
    .catch((error) => ({ statusCode: 422, body: String(error) }));
};
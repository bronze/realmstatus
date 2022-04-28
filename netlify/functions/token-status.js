const fetch = require("node-fetch");
const btoa = require('btoa');

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
// https://github.com/viglucci/vanilla-node-blizzard-oauth-example/blob/master/server.js
const API_ENDPOINT = "https://us.api.blizzard.com/data/wow/search/connected-realm?namespace=dynamic-us&realms.name.en_US=azralon&access_token="
const TOKEN_ENDPOINT = 'https://us.battle.net/oauth/token'
const CLIENT_ID = process.env.BLIZZARD_CLIENT_ID
const CLIENT_SECRET = process.env.BLIZZARD_CLIENT_SECRET

// build headers
const basicAuth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
const headers = {
  authorization: `Basic ${basicAuth}`,
  'Content-Type': 'application/x-www-form-urlencoded'
};

// build request body
const params = new URLSearchParams();
params.append('grant_type', 'client_credentials');

// execute request
const requestOptions = {
  method: 'POST',
  body: params,
  headers
};

exports.handler = async (event, context) => {
  return fetch(TOKEN_ENDPOINT, requestOptions)
    .then((response) => response.json())
    .then((data) => (
      fetch(API_ENDPOINT + data.access_token, { headers: { Accept: "application/json" } })
        .then((response) => response.json())
        .then((data) => ({
          statusCode: 200,
          body: data.results[0].data.status.type,
        }))
        .catch((error) => ({ statusCode: 422, body: String(error) }))
    ))
    .catch((error) => ({ statusCode: 422, body: String(error) }));
};
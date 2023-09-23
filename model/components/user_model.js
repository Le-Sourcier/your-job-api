// const { app } = require("./../../.env/server");

const express = require("express");
const app = express();

// Define a POST request handler for the "/v1/login" route
app.get("/v1/user_data", (request, response) => {
  // Extract email and password from the query parameters
  const { email, password } = request.query;

  // Log the email to the console
  console.log("Email: " + email);

  // Create a JSON response with a message containing the email
  const res = response.json(`Your Email is: ${email}`);

  // Send the JSON response
  return res;
});

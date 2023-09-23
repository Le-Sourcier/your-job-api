const express = require("express");
const connection = require("./../../database/db");
const app = express();

const route = express.Router();

// Define a DELETE request handler for the "/v1/delete/:token" route
route.delete(`/v1/delete/:token`, async (request, response) => {
  // Extract userId & token from the request parameters
  const { userId } = request.body;
  const { token } = request.params;

  try {
    if (!userId || !token) {
      const errorMessage = {
        error: true,
        status: 401,
        message: "UNAUTHORIZED_REQUEST;",
        data: [],
      };
      console.log(errorMessage);
      response.status(401).json(errorMessage);
      return;
    } else {
      connection.query(
        "DELETE FROM users WHERE userId = ? AND token = ?",
        [userId, token],
        (error, results) => {
          if (error) {
            const errorMessage = {
              error: true,
              status: 500,
              message: "INTERNAL_SERVER_ERROR;",
              data: [],
            };
            console.error("Error executing query:", error);
            response.status(500).json(errorMessage);
            return;
          }

          // Check if a user with the specified ID and token was found and deleted
          if (results.affectedRows === 0) {
            const error = {
              error: true,
              status: 401,
              message: "UNAUTHORIZED_REQUEST;",
              data: [],
            };
            console.log("You are not authorized to perform this action.");
            response.status(401).json(error);
            return;
          }
          const success = {
            error: false,
            status: 200,
            message: "SUCCESSFULLY_DELETED;",
            data: [],
          };

          console.log(success);
          response.status(200).json(success);
          return;
        }
      );
    }
  } catch (error) {
    const errorMessage = {
      error: true,
      status: 500,
      message: "DELETION_FAILED;",
      data: [],
    };
    response.status(500).json(errorMessage);
    console.error(errorMessage, error);
    return;
  }
});

module.exports = route;

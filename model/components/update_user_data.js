const express = require("express");
const bodyParser = require("body-parser");
// const DB = require("./your-db-module"); // Replace with your database module
const connection = require("../../database/db");

const app = express();
app.use(bodyParser.json());

const route = express.Router();

route.post("/v1/users/update", async (request, response) => {
  const data = request.body;
  const userId = data.userId;
  //   const authorizationHeader = request.headers["authorization"];

  // Extract the token from the header (assuming it's a Bearer token)
  //   const token = authorizationHeader.replace("Bearer ", "");

  // Check if the token is valid
  //   const authorized = await myFunction.isAuthorized(token, userId); // Replace with your authorization function

  //   if (authorized) {
  // Check if the provider request is a blank value
  //   const isBlank = MyFunction.containsBlankValues(data);

  // Check if any modifications have been made
  if (!data) {
    const error = {
      error: true,
      status: 400,
      message: "NOT_UPDATE",
    };
    return response.status(400).json(error);
  }

  // Query the database to find the user by userId

  const user = await connection.query("SELECT * FROM users WHERE userId = ?", [
    userId,
  ]);

  // Check if no modifications have been made
  if (!user) {
    const error = {
      error: true,
      status: 400,
      message: "EMAIL_NOT_FOUND",
    };
    return response.status(400).json(error);
  }

  // Build the update query
  let sql = "UPDATE users SET ";
  const updateParams = {};

  for (const [key, value] of Object.entries(data)) {
    // Exclude specific fields from the update
    if (
      key !== "userId" &&
      key !== "email" &&
      key !== "password" &&
      key !== "secretPhrase"
    ) {
      sql += `${key} = ?, `;
      updateParams[key] = value;
    }
  }

  // Check if no modifications have been made
  if (Object.keys(updateParams).length === 0) {
    const error = {
      error: true,
      status: 400,
      message: "NOT_UPDATE",
    };
    return response.status(400).json(error);
  }

  // Remove the trailing comma from the update query
  sql = sql.slice(0, -2);

  // Add the WHERE clause to update the specific user
  sql += " WHERE userId = ?";
  updateParams.userId = userId;

  try {
    const stmt = conn.prepare(sql);

    // Bind the update parameters
    const values = Object.values(updateParams);
    await stmt.run(...values);

    // Check if the update was successful
    if (stmt.changes > 0) {
      const message = {
        error: false,
        status: 200,
        message: "Update successful",
      };
      return response.status(200).json(message);
    } else {
      const error = {
        error: true,
        status: 400,
        message: "NOT_UPDATE",
      };
      return response.status(400).json(error);
    }
  } catch (error) {
    const errorMessage = {
      error: true,
      status: 500,
      message: "ERROR_SERVER",
    };
    return response.status(500).json(errorMessage);
  }
  //   } else {
  //     // User is not authorized, return an error response
  //     const error = {
  //       error: true,
  //       status: 401,
  //       message: "UNAUTHORIZED_ACCESS",
  //     };
  //     return response.status(401).json(error);
  //   }
});

// const express = require("express");
// const connection = require("./../../database/db");
// const app = express();

// const route = express.Router();

// // Define a UPDATE request handler for the "/v1/token/:token" route
// route.delete(`/v1/update/:token`, async (request, response) => {
//   // Extract userId & token from the request parameters
//   const { userId } = request.body;
//   const { token } = request.params;

//   try {
//     if (!userId || !token) {
//       const errorMessage = {
//         error: true,
//         status: 401,
//         message: "UNAUTHORIZED_REQUEST;",
//         data: [],
//       };
//       console.log(errorMessage);
//       response.status(401).json(errorMessage);
//       return;
//     } else {
//       connection.query(
//         "UPDATE FROM users WHERE userId = ? AND token = ?",
//         // "UPDATE users SET columnName = ? WHERE userId = ? AND token = ?",
//         [userId, token],
//         (error, results) => {
//           if (error) {
//             const errorMessage = {
//               error: true,
//               status: 500,
//               message: "INTERNAL_SERVER_ERROR;",
//               data: [],
//             };
//             console.error("Error executing query:", error);
//             response.status(500).json(errorMessage);
//             return;
//           }

//           // Check if a user with the specified ID and token was found and deleted
//           if (results.affectedRows === 0) {
//             const error = {
//               error: true,
//               status: 401,
//               message: "UNAUTHORIZED_REQUEST;",
//               data: [],
//             };
//             console.log("You are not authorized to perform this action.");
//             response.status(401).json(error);
//             return;
//           }
//           const success = {
//             error: false,
//             status: 200,
//             message: "SUCCESSFULLY_UPDATED;",
//             data: [],
//           };

//           console.log(success);
//           response.status(200).json(success);
//           return;
//         }
//       );
//     }
//   } catch (error) {
//     const errorMessage = {
//       error: true,
//       status: 500,
//       message: "DATA_UPDATE_FAILED;",
//       data: [],
//     };
//     response.status(500).json(errorMessage);
//     console.error(errorMessage, error);
//     return;
//   }
// });

module.exports = route;

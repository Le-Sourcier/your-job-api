const bcrypt = require("bcrypt");

const connection = require("./../database/db");

///Function to generate TOKEN
async function generateToken(length = 150) {
  const date = Date.now();
  const characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZ${date}abcdefghijklmnopqrstuvwxyz0123456789`;
  let token = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
}
//Function to generate UID
async function generateUID(length = 15) {
  const date = Date.now();
  const characters = `${date}0123456789`;
  let uid = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uid += characters.charAt(randomIndex);
  }

  return `${uid}`;
}

async function password_hash(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Store the hashed password in your database or return it
    return hashedPassword;
  } catch (err) {
    console.error("Error hashing password:", err);
    // Handle the error or return null in case of an error
    return null;
  }
}

///Verify hashed password
async function password_verify(password, hash) {
  try {
    const isCorrect = await bcrypt.compare(password, hash);
    // 'isCorrect' will be true if the password matches, false otherwise

    return isCorrect;
  } catch (err) {
    console.error("Error comparing passwords:", err);
    // Handle the error or return false in case of an error
    return false;
  }
}

//Get user data by email
async function getUserByEmail(email, response) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE email = ?";
    const values = [email];

    connection.query(query, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        if (results.length > 0) {
          // User with the provided email found, return the user data
          resolve(results[0]);
        } else {
          // User not found with the provided email
          const error = {
            error: true,
            status: 400,
            message: "EMAIL_NOT_FOUND",
            data: [],
          };
          response.emit("message", error);
          reject(error);
          return;
        }
      }
    });
  });
}

// //Check if user {data} already exist
async function isDataExists(tableName = "users", columnName, value) {
  return new Promise((resolve, reject) => {
    const checkQuery = `SELECT ${columnName} FROM ${tableName} WHERE ${columnName} = ?`;

    connection.query(checkQuery, [value], (err, result) => {
      if (err) {
        reject(err);
      } else {
        // Si le résultat contient au moins une ligne, les données existent
        const dataExists = result.length > 0;
        resolve(dataExists);
      }
    });
  });
}

//Get Log history data by user ID
async function getLogHystoryById(userId) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM log_history WHERE userId = ?";
    const values = [userId];

    connection.query(query, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        if (results.length > 0) {
          // User with the provided email found, return the user data
          resolve(results[0]);
        } else {
          const error = "Error getting log history data";
          reject(error);

          console.log(error);
        }
        // else {
        //   // User not found with the provided email
        //   const error = {
        //     error: true,
        //     status: 400,
        //     message: "EMAIL_NOT_FOUND;",
        //     data: [],
        //   };
        //   socket.emit("message", error);
        //   reject(error);
        //   return;
        // }
      }
    });
  });
}

// Update user token
async function updateUserToken(email, newToken) {
  return new Promise((resolve, reject) => {
    const updateQuery = "UPDATE users SET token = ? WHERE email = ?";
    const updateValues = [newToken, email];

    connection.query(updateQuery, updateValues, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

// async function isEmailExists
async function insertToLogHistory(userId, token, location) {
  return new Promise((resolve, reject) => {
    const insertQuery =
      "INSERT INTO log_history (userId, token,location) VALUES (?, ?, ?)";
    const values = [userId, token, location];

    connection.query(insertQuery, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}
// Update user log history token
async function updateLogHistoryToken(userId, newToken, auth_attempt = 0) {
  return new Promise((resolve, reject) => {
    const updateQuery =
      "UPDATE log_history SET token = ?, auth_attempt = ? WHERE userId = ?";
    const updateValues = [newToken, auth_attempt, userId];

    connection.query(updateQuery, updateValues, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = {
  generateToken,
  generateUID,
  password_hash,
  password_verify,
  getUserByEmail,
  getLogHystoryById,
  isDataExists,
  updateLogHistoryToken,
  updateUserToken,
  insertToLogHistory,
};

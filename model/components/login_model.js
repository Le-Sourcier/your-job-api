const {
  getUserByEmail,
  getLogHystoryById,
  password_verify,
  generateToken,
  updateUserToken,
  updateLogHistoryToken,
} = require("./../../function/function");

const express = require("express");

const route = express.Router();

route.post("/v1/login", async (request, response) => {
  const { email, password } = request.body;
  console.log("/v1/login");
  try {
    // Validate email if not empty
    if (!email) {
      const error = {
        error: true,
        status: 406,
        message: "MISSING_EMAIL",
        data: [],
      };
      console.log(error);

      return response.status(406).json(error);
    }

    // Validate email
    if (!/^.+@.+\..+$/.test(email)) {
      const error = {
        error: true,
        status: 400,
        message: "INVALID_EMAIL",
        data: [],
      };
      console.log(error);

      return response.status(400).json(error);
    }
    // Validate password
    if (!password) {
      const error = {
        error: true,
        status: 406,
        message: "MISSING_PASSWORD",
        data: [],
      };
      console.log(error);

      return response.status(406).json(error);
    }

    //Validate password by including special
    //Characters, Uperletter and som other thisngs
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password) ||
      !/[!@#$%^&*(),;~/.?":{}|<>+=]/.test(password)
    ) {
      const error = {
        error: true,
        status: 400,
        message: "INVALID_PASSWORD",
        data: [],
      };
      console.log(error);

      return response.status(400).json(error);
    }
    // Get user data by Email
    const user = await getUserByEmail(email, response);

    // Get user log history data by ID
    const logHistory = await getLogHystoryById(user.userId, response);

    // connection.query(checkQuery, values, async (err, result) => {
    //Check if the provided password is macted whit the data one,
    const isValidPassword = await password_verify(password, user.password);
    if (user.email !== email) {
      // User not found with the provided email
      const error = {
        error: true,
        status: 400,
        message: "EMAIL_NOT_FOUND;",
        data: [],
      };
      console.log(error);

      return response.status(400).json(error);
    } else if (user.status == "pending") {
      const error = {
        error: true,
        status: 401,
        message: "UNVERIFED_ACCOUNT",
        data: [],
      };
      console.log(error);

      return response.status(401).json(error);
    } else if (user.status == "blocked") {
      const error = {
        error: true,
        status: 401,
        message: "USER_DISABLED",
        data: [],
      };
      console.log(error);

      return response.status(401).json(error);
    } else if (!isValidPassword) {
      const error = {
        error: true,
        status: 401,
        message: "AUTH_FAILED",
        data: [],
      };
      console.log(error);

      return response.status(401).json(error);
    } else if (logHistory && logHistory.auth_attempt >= 3) {
      const error = {
        error: true,
        status: 401,
        message: "TOO_MANY_ATTEMPTS_TRY_LATER",
        data: [],
      };
      console.log(error);

      return response.status(401).json(error);
    } else {
      // Generate a new token for the user
      const newToken = await generateToken();

      //Updata user token
      await updateUserToken(email, newToken);
      const attemp = 0;
      //Updata user log history token
      await updateLogHistoryToken(user.userId, newToken);

      const userData = await getUserByEmail(user.email, response);

      //Remove some data befor retrieves it for the user
      delete user.id;
      delete user.password;

      const success = {
        error: false,
        status: 200,
        message: "USER_SIGNED_SUCCESS",
        data: userData,
      };
      console.log(success);

      return response.status(200).json(success);
    }
  } catch (err) {
    console.error("Error inserting user data:", err);
    const error = {
      error: true,
      status: 500,
      message: "INTERNAL_SERVER_ERROR",
      //ERROR_SERVER
      data: [],
    };
    console.log(error);

    return response.status(500).json(error);
  }
});

module.exports = route;

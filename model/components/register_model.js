const {
  password_hash,
  generateToken,
  generateUID,
  isDataExists,
  insertToLogHistory,
  getUserByEmail,
} = require("./../../function/function");

const express = require("express");

const route = express.Router();

const connection = require("./../../database/db");

// Define a POST request handler for the "/v1/login" route
route.post("/v1/register", async (request, response) => {
  //Generate user ID
  const userId = await generateUID();
  //Generate user TOKEN
  const token = await generateToken();
  //Set default user status as "pending".
  const user_status = "pending";
  try {
    const {
      name,
      email,
      contact,
      secretPhrase,
      role,
      image,
      bgImage,
      password,
    } = request.body;
    //Check if user email already exist
    const isExistEmail = await isDataExists("users", "email", email);
    //Check if user email already exist
    const isContactEmail = await isDataExists("users", "contact", contact);

    // Empty email
    if (!email) {
      const error = {
        error: true,
        status: 406,
        message: "MISSING_EMAIL",
        data: [],
      };
      response.status(406).json(error);
      // reject(error);
      return;
    }
    // Validate email
    if (!email || !/^.+@.+\..+$/.test(email)) {
      const error = {
        error: true,
        status: 406,
        message: "INVALID_EMAIL",
        data: [],
      };
      response.status(406).json(error);
      // reject(error);
      return;
    }

    // Validate password
    if (!password) {
      const error = {
        error: true,
        status: 406,
        message: "MISSING_PASSWORD",
        data: [],
      };
      response.status(406).json(error);
      // reject(error);
      return;
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
        message: "WEAK_PASSWORD",
        data: [],
      };
      response.status(400).json(error);
      // reject(error);
      return;
    }

    // Validate name
    if (!name) {
      const error = {
        error: true,
        status: 406,
        message: "MISSING_NAME",
        data: [],
      };
      response.status(406).json(error);
      // reject(error);
      return;
    }

    // Validate image
    if (!image) {
      const error = {
        error: true,
        status: 406,
        message: "MISSING_PROFILE_IMAGE",
        data: [],
      };
      response.status(406).json(error);
      // reject(error);
      return;
    }

    // Validate contact (phone number)
    if (!contact) {
      const error = {
        error: true,
        status: 406,
        message: "MISSING_PHONE_NUMBER",
        data: [],
      };
      response.status(406).json(error);
      // reject(error);
      return;
    }

    // Validate contact (phone number) fprmat
    if (!/^[0-9]+$/.test(contact)) {
      const error = {
        error: true,
        status: 406,
        message: "INVALID_PHONE_NUMBER_FORMAT",
        data: [],
      };
      response.status(406).json(error);
      // reject(error);
      return;
    }

    // Validate secret phrase
    if (!secretPhrase) {
      const error = {
        error: true,
        status: 406,
        message: "MISSING_SECRET_PHRASE",
        data: [],
      };
      response.status(406).json(error);
      // reject(error);
      return;
    }

    // Validate role (skills)
    if (!role) {
      const error = {
        error: true,
        status: 406,
        message: "MISSING_SKILLS",
        data: [],
      };
      response.status(406).json(error);
      // reject(error);
      return;
    }
    if (isExistEmail) {
      const error = {
        error: true,
        status: 409,
        message: "EMAIL_EXISTS",
        data: [],
      };
      response.status(409).json(error);
      // reject(error);
      return;
    }
    if (isContactEmail) {
      const error = {
        error: true,
        status: 409,
        message: "PHONE_NUMBER_EXISTS",
        data: [],
      };
      response.status(409).json(error);
      return;
    }
    //Get user Location
    const location = "";
    const HashedPassword = await password_hash(password);
    const about = "Hey, I'm using your job for free.";
    const lastActivity = Date.now();

    // You can now proceed to insert the user data into your MySQL database
    const insertQuery =
      "INSERT INTO users (userId, token, name, email, password, about, contact, location, secretPhrase, role, image, bgImage, lastActivity, online, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)";
    const values = [
      userId,
      token,
      name,
      email,
      HashedPassword,
      about,
      contact,
      location,
      secretPhrase,
      role,
      image,
      bgImage,
      lastActivity,
      user_status,
    ];

    connection.query(insertQuery, values, async (err, result) => {
      //Retrieves user data
      //const user = await getUserByEmail(email, response);
      //Display an error when a problem was detected during account creation.
      if (err) {
        console.error("Error inserting user data:", err.code);
        const error = {
          error: true,
          status: 500,
          message: "INTERNAL_SERVER_ERROR",
          //ERROR_SERVER
          data: [],
        };
        response.status(500).json(error);
        return;
      }

      const user = await getUserByEmail(email, response);
      delete user.id;
      delete user.password;
      console.log("User registered successfully");
      const success = {
        error: false,
        status: 200,
        message: "USER_REGISTERED_SUCCESS",
        data: user,
      };
      console.log(user);
      response.status(200).json(success);

      await insertToLogHistory(userId, token, location);
      return;
    });
  } catch (err) {
    console.error("Error inserting user data:", err.code);
    const error = {
      error: true,
      status: 500,
      message: "INTERNAL_SERVER_ERROR",
      //ERROR_SERVER
      data: [],
    };
    response.status(500).json(error);
    return;
  }
});

module.exports = route;

const mysql = require("mysql");

class DB {
  constructor() {
    // this.host = "localhost";
    // this.user = "root";
    // this.pass = "";
    // this.dbname = "your_job";
    // this.tablesCreated = false; // Flag to track if tables were created
    this.host = "mysql-your-job.alwaysdata.net";
    this.user = "your-job";
    this.pass = "Lesourcier@91680967";
    this.dbname = "your-job_0";
    this.tablesCreated = false; // Flag to track if tables were created
  }

  connect() {
    const conn = mysql.createConnection({
      host: this.host,
      user: this.user,
      password: this.pass,
    });

    conn.connect((err) => {
      if (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
      }

      //console.log("Connected to MySQL server");

      // Create the database if it does not exist
      // this.createDatabaseIfNotExists(conn);

      // Switch to the database
      conn.changeUser({ database: this.dbname }, (err) => {
        if (err) {
          console.error("Failed to switch to the database:", err.message);
          process.exit(1);
        }

        //console.log("Connected to MySQL database");

        // Create the tables if they do not exist
        this.createTablesIfNotExists(conn);
      });
    });

    return conn;
  }

  createDatabaseIfNotExists(conn) {
    const sql = `CREATE DATABASE IF NOT EXISTS ${this.dbname}`;
    conn.query(sql, (err) => {
      if (err) {
        console.error("Error creating the database:", err.message);
        process.exit(1);
      }
      // console.log(`Database "${this.dbname}" created or already exists`);
    });
  }

  createTablesIfNotExists(conn) {
    if (this.tablesCreated) {
      // console.log("Tables already exist, no need to create them again.");
      return;
    }

    this.createUsersTableIfNotExists(conn);
    this.createLogHistoryTableIfNotExists(conn);
    this.createAuthSessionTableIfNotExists(conn);
    this.createJobTableIfNotExists(conn);

    this.tablesCreated = true; // Set the flag to true after creating the tables
  }

  createUsersTableIfNotExists(conn) {
    const sql = `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId VARCHAR(255) NOT NULL,
      token VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      contact VARCHAR(255) NOT NULL UNIQUE,
      about VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      image LONGTEXT,
      bgImage LONGTEXT,
      lastActivity BIGINT NOT NULL,
      secretPhrase VARCHAR(255) NOT NULL,
      online BOOLEAN NOT NULL,
      status ENUM('approved', 'pending', 'blocked') NOT NULL DEFAULT 'pending',
      date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;
    conn.query(sql, (err) => {
      if (err) {
        console.error("Error creating users table:", err.message);
        process.exit(1);
      }
      //   console.log("Users table created or already exists");
    });
  }

  createLogHistoryTableIfNotExists(conn) {
    const sql = `CREATE TABLE IF NOT EXISTS log_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      auth_attempt INT NOT NULL DEFAULT 0,
      pin_code INT NOT NULL DEFAULT 0,
      token VARCHAR(255) NOT NULL,
      date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;
    conn.query(sql, (err) => {
      if (err) {
        console.error("Error creating log_history table:", err.message);
        process.exit(1);
      }
      // console.log("Log history table created or already exists");
    });
  }

  createAuthSessionTableIfNotExists(conn) {
    const sql = `CREATE TABLE IF NOT EXISTS auth_session (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id VARCHAR(255) NOT NULL,
      userId VARCHAR(255) NOT NULL,
      session_token VARCHAR(255) NOT NULL DEFAULT '',
      token VARCHAR(255) NOT NULL,
      device_info TEXT NOT NULL DEFAULT '',
      date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;
    conn.query(sql, (err) => {
      if (err) {
        console.error("Error creating auth_session table:", err.message);
        process.exit(1);
      }
      //console.log("Auth session table created or already exists");
    });
  }

  createJobTableIfNotExists(conn) {
    const sql = `CREATE TABLE IF NOT EXISTS job (
      id INT AUTO_INCREMENT PRIMARY KEY,
      jobId VARCHAR(255) NOT NULL,
      posterId VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      posterName VARCHAR(255) NOT NULL,
      logoUrl LONGTEXT,
      token VARCHAR(255) NOT NULL,
      eName VARCHAR(255) NOT NULL,
      designation VARCHAR(255) NOT NULL,
      price INT NOT NULL,
      requirement TEXT NOT NULL,
      postedDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;
    conn.query(sql, (err) => {
      if (err) {
        console.error("Error creating job table:", err.message);
        process.exit(1);
      }
      // console.log("Job table created or already exists");
    });
  }
}

//Initialize DB class
const db = new DB();

//Connect to the data base
const connection = db.connect();

//Export the connection
module.exports = connection;

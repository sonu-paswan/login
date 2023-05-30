const mysql = require('mysql2');
const { Router } = require("express");
const router = Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Sonu28062000",
    database: "bank",
  });

router.get("/signup", (req, res) => {
  res.render("signup");
});
router.post("/signup", (req, res) => {
  const { email, password, fName, lName, address } = req.body;
  console.log(email, password, fName, lName, address);

  // Check if the username already exists
  connection.query(
    "SELECT * FROM customer WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      if (results.length > 0) {
        res.status(400).json({ error: "Username already exists" });
        return;
      }

      // Hash the password
      bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error("Error hashing password:", hashErr);
          res.status(500).json({ error: "Internal server error" });
          return;
        }

        // Insert the new user into the database
        connection.query(
          "INSERT INTO customer (email, password, first_name, last_name, address) VALUES (?,?,?,?,?)",
          [email, hashedPassword, fName, lName, address],
          (insertErr) => {
            if (insertErr) {
              console.error("Error executing query:", insertErr);
              res.status(500).json({ error: "Internal server error" });
              return;
            }

            res
              .status(200)
              // .json({ success: true, message: "User registered successfully" });
              res.redirect("/login");
          }
        );
      });
    }
  );
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if the username exists
  connection.query(
    "SELECT * FROM customer WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      if (results.length === 0) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const user = results[0];

      // Compare the password with the hashed password in the database
      bcrypt.compare(password, user.password, (compareErr, isMatch) => {
        if (compareErr) {
          console.error("Error comparing passwords:", compareErr);
          res.status(500).json({ error: "Internal server error" });
          return;
        }

        if (!isMatch) {
          res.status(401).json({ error: "Invalid credentials" });
          return;
        }

        // Generate a JWT
        const token = jwt.sign(
          { userId: user.customer_id },
          "aniket hoon main",
          { expiresIn: "1h" }
        );

        // Set the JWT as a cookie
        res.cookie("jwt", token, { httpOnly: true });
        res
          .status(200)
          // .json({ success: true, message: "Logged in successfully" });
          .redirect("/customer")
      });
    }
  );
});
router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.status(200)
  // .json({ success: true, message: "Logged out successfully" });
  .redirect("/");
});

module.exports = router;

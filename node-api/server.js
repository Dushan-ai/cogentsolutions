const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cogentsolutions"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL connected!");
});

// POST route to handle form submission
app.post("/register", (req, res) => {
  const {
    first_name,
    last_name,
    job_title,
    company,
    phone,
    email,
    company_website_URL,
    privacy_policy
  } = req.body;

  const agreed_to_policy = privacy_policy === "on" ? 1 : 0;

  const query = `
    INSERT INTO registrations 
    (first_name, last_name, job_title, company, phone, email, company_website_URL, agreed_to_policy)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [first_name, last_name, job_title, company, phone, email, company_website_URL, agreed_to_policy],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.status(200).json({ success: true, message: "Registration successful" });
    }
  );
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

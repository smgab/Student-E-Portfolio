/* =======================
   SERVER SETUP
======================= */
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path"); 

const app = express();

/* =======================
   MIDDLEWARE
======================= */
app.use(cors());
app.use(express.json());
app.get("/portfolio/:username", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.use(express.static("public"));

/* =======================
   MYSQL CONNECTION
======================= */
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "portfolio"
});

/* =======================
   MULTER CONFIG
======================= */

// 🔹 Profile picture upload
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


// 🔹 Certificate upload
const certStorage = multer.diskStorage({
  destination: "public/uploads/certificates/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const certUpload = multer({ storage: certStorage });


/* =======================
   REGISTER ROUTE
======================= */
app.post("/register", async (req, res) => {
  const username        = req.body.username?.trim() || "";
  const fullname        = req.body.fullname?.trim() || "";
  const email           = req.body.email?.trim() || "";
  const password        = req.body.password || "";
  const confirmPassword = req.body.confirmPassword || "";

  if (!username || !fullname || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (username, fullname, email, password_hash) VALUES (?, ?, ?, ?)",
      [username, fullname, email, hashedPassword],
      (err) => {
        if (err) {
          console.error("Register DB error:", err);
          if (err.code === "ER_DUP_ENTRY") {
            const field = err.message.includes("email") ? "email" : "username";
            return res.status(409).json({ message: `That ${field} is already taken` });
          }
          return res.status(500).json({ message: "Database error" });
        }
        res.json({ message: "Registered successfully" });
      }
    );
  } catch (err) {
    console.error("Register server error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =======================
   LOGIN ROUTE
======================= */
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", email);

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }

      const user = results[0];
      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          profile_pic: user.profile_pic,
          introduction: user.introduction
        }
      });
    }
  );
});

/* =======================
   PHOTO
======================= */
app.post("/upload-profile-pic", upload.single("profilePic"), (req, res) => {
  const userId = req.body.userId;
  const imagePath = `/uploads/${req.file.filename}`;

  db.query(
    `INSERT INTO user_profile_pics (user_id, profile_pic)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE profile_pic = VALUES(profile_pic)`,
    [userId, imagePath],
    (err, result) => {
      if (err) {
        console.error("DB error updating profile pic:", err);
        return res.status(500).json({ message: "DB error" });
      }
      res.json({ message: "Profile picture saved", imagePath });
    }
  );
});

/* =======================
   DELETE PROFILE PIC
======================= */
app.post("/delete-profile-pic", (req, res) => {
  const { userId } = req.body;
  db.query(
    "UPDATE user_profile_pics SET profile_pic = NULL WHERE user_id = ?",
    [userId],
    err => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ message: "Profile picture deleted" });
    }
  );
});

/* =======================
   INTRODUCTION
======================= */
app.post("/save-intro", (req, res) => {
  const { userId, introduction } = req.body;
  db.query(
    `INSERT INTO user_introduction (user_id, introduction)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE introduction = VALUES(introduction)`,
    [userId, introduction],
    err => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ message: "Introduction saved" });
    }
  );
});

/* =======================
   SKILLS
======================= */
app.post("/add-skill", (req, res) => {
  const { userId, skill } = req.body;
  db.query(
    "INSERT INTO skills (user_id, skill_name) VALUES (?, ?)",
    [userId, skill],
    err => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ message: "Skill saved" });
    }
  );
});

app.post("/delete-skill", (req, res) => {
  const { userId, skill } = req.body;
  db.query(
    "DELETE FROM skills WHERE user_id = ? AND skill_name = ? LIMIT 1",
    [userId, skill],
    err => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ message: "Skill deleted" });
    }
  );
});

app.get("/skills/:userId", (req, res) => {
  db.query(
    "SELECT skill_name FROM skills WHERE user_id = ?",
    [req.params.userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json(results);
    }
  );
});

/* =======================
   CERTIFICATE
======================= */
app.post("/add-certificate", certUpload.single("certificate"), (req, res) => {
  const { userId, title } = req.body;
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const filePath = `/uploads/certificates/${req.file.filename}`;
  db.query(
    "INSERT INTO certificates (user_id, title, file_path) VALUES (?, ?, ?)",
    [userId, title, filePath],
    err => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }
      res.json({ message: "Certificate saved successfully" });
    }
  );
});

/* =======================
  SOCIALS
======================= */
app.post("/add-social", (req, res) => {
  const { userId, platform, url } = req.body;
  if (!userId || !platform || !url) return res.status(400).json({ message: "Missing fields" });

  db.query(
    "INSERT INTO socials (user_id, platform, url) VALUES (?, ?, ?)",
    [userId, platform, url],
    err => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }
      res.json({ message: "Social link saved" });
    }
  );
});

app.get("/socials/:userId", (req, res) => {
  db.query(
    "SELECT id, platform, url FROM socials WHERE user_id = ?",
    [req.params.userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json(results);
    }
  );
});

app.post("/delete-social", (req, res) => {
  const { userId, socialId } = req.body;
  db.query(
    "DELETE FROM socials WHERE id = ? AND user_id = ?",
    [socialId, userId],
    err => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }
      res.json({ message: "Social link deleted" });
    }
  );
});

/* =======================
   CERTIFICATES (GET)
======================== */
app.get("/certificates/:userId", (req, res) => {
  db.query(
    "SELECT id, title, file_path FROM certificates WHERE user_id = ?",
    [req.params.userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json(results);
    }
  );
});

app.post("/delete-certificate", (req, res) => {
  const { userId, certId } = req.body;
  db.query(
    "DELETE FROM certificates WHERE id = ? AND user_id = ?",
    [certId, userId],
    err => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }
      res.json({ message: "Certificate deleted" });
    }
  );
});

/* =======================
   SERVE CERTIFICATE FILES
======================== */
app.get('/uploads/certificates/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'public/uploads/certificates', req.params.filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("File not found:", filePath);
      res.status(404).send("File not found");
    }
  });
});

/* =======================
   GET USER
======================== */
app.get("/user/:id", (req, res) => {
  db.query(
    `SELECT u.id, u.username, u.fullname,
            ui.introduction,
            upp.profile_pic
     FROM users u
     LEFT JOIN user_introduction ui ON u.id = ui.user_id
     LEFT JOIN user_profile_pics upp ON u.id = upp.user_id
     WHERE u.id = ?`,
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json(results[0]);
    }
  );
});

/* =======================
   PUBLIC PORTFOLIO ROUTE
======================== */
app.get("/api/portfolio/:username", (req, res) => {
  const { username } = req.params;

  db.query(
    `SELECT u.id, u.username, u.fullname,
            ui.introduction,
            upp.profile_pic
     FROM users u
     LEFT JOIN user_introduction ui ON u.id = ui.user_id
     LEFT JOIN user_profile_pics upp ON u.id = upp.user_id
     WHERE u.username = ?`,
    [username],
    (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });
      if (!results[0]) return res.status(404).json({ message: "User not found" });

      const user = results[0];
      const userId = user.id;

      Promise.all([
        new Promise((resolve, reject) =>
          db.query("SELECT skill_name FROM skills WHERE user_id = ?", [userId], (e, r) => e ? reject(e) : resolve(r))
        ),
        new Promise((resolve, reject) =>
          db.query("SELECT id, title, file_path FROM certificates WHERE user_id = ?", [userId], (e, r) => e ? reject(e) : resolve(r))
        ),
        new Promise((resolve, reject) =>
          db.query("SELECT id, platform, url FROM socials WHERE user_id = ?", [userId], (e, r) => e ? reject(e) : resolve(r))
        ),
      ]).then(([skills, certificates, socials]) => {
        res.json({ ...user, skills, certificates, socials });
      }).catch(() => res.status(500).json({ message: "DB error" }));
    }
  );
});

/* =======================
   START SERVER
   ✅ "0.0.0.0" allows access from other devices on the same WiFi
======================== */
const PORT = 3000;

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }

  console.log("MySQL Connected");

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Access from phone: http://192.168.1.3:${PORT}`);
    const PORT = process.env.PORT || 3000;

  });
});
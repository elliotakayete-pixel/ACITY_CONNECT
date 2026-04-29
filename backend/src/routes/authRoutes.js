import express from "express";
import bcrypt from "bcryptjs";
import { query } from "../config/db.js";
import { signToken } from "../middleware/auth.js";
import { requireFields, validateAcademicEmail } from "../middleware/validate.js";

const router = express.Router();

const publicUser = (user) => ({
  id: user.id,
  fullName: user.full_name,
  email: user.email,
  role: user.role
});

const adminEmails = () =>
  String(process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

router.post("/register", requireFields(["fullName", "email", "password"]), async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      password,
      phoneNumber = "",
      skillsOffered = "",
      skillsNeeded = ""
    } = req.body;
    const normalizedEmail = String(email).trim().toLowerCase();

    if (!validateAcademicEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Use a valid Academic City email ending in @acity.edu.gh." });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const existing = await query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);
    if (existing.rows[0]) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const role = adminEmails().includes(normalizedEmail) ? "admin" : "user";

    const { rows } = await query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, email, role`,
      [String(fullName).trim(), normalizedEmail, passwordHash, role]
    );

    await query(
      `INSERT INTO profiles (user_id, phone_number, skills_offered, skills_needed)
       VALUES ($1, $2, $3, $4)`,
      [rows[0].id, phoneNumber, skillsOffered, skillsNeeded]
    );

    res.status(201).json({
      token: signToken(rows[0]),
      user: publicUser(rows[0])
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", requireFields(["email", "password"]), async (req, res, next) => {
  try {
    const normalizedEmail = String(req.body.email).trim().toLowerCase();
    const { rows } = await query(
      "SELECT id, full_name, email, password_hash, role FROM users WHERE email = $1",
      [normalizedEmail]
    );

    const user = rows[0];
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const matches = await bcrypt.compare(req.body.password, user.password_hash);
    if (!matches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.json({
      token: signToken(user),
      user: publicUser(user)
    });
  } catch (error) {
    next(error);
  }
});

export default router;

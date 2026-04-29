import express from "express";
import { query } from "../config/db.js";
import { authenticate } from "../middleware/auth.js";
import { requireFields } from "../middleware/validate.js";

const router = express.Router();

router.get("/", authenticate, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT
         u.id,
         u.full_name AS "fullName",
         u.email,
         u.role,
         p.phone_number AS "phoneNumber",
         p.skills_offered AS "skillsOffered",
         p.skills_needed AS "skillsNeeded",
         u.created_at AS "createdAt"
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [req.user.id]
    );

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

router.put("/", authenticate, requireFields(["fullName"]), async (req, res, next) => {
  try {
    const {
      fullName,
      phoneNumber = "",
      skillsOffered = "",
      skillsNeeded = ""
    } = req.body;

    await query("UPDATE users SET full_name = $1 WHERE id = $2", [
      String(fullName).trim(),
      req.user.id
    ]);

    await query(
      `INSERT INTO profiles (user_id, phone_number, skills_offered, skills_needed)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id)
       DO UPDATE SET
         phone_number = EXCLUDED.phone_number,
         skills_offered = EXCLUDED.skills_offered,
         skills_needed = EXCLUDED.skills_needed`,
      [req.user.id, phoneNumber, skillsOffered, skillsNeeded]
    );

    const { rows } = await query(
      `SELECT
         u.id,
         u.full_name AS "fullName",
         u.email,
         u.role,
         p.phone_number AS "phoneNumber",
         p.skills_offered AS "skillsOffered",
         p.skills_needed AS "skillsNeeded"
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [req.user.id]
    );

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;

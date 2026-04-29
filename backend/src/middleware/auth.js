import jwt from "jsonwebtoken";
import { query } from "../config/db.js";

const jwtSecret = process.env.JWT_SECRET || "dev-only-secret-change-me";

export const signToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, jwtSecret);
    const { rows } = await query(
      "SELECT id, full_name, email, role FROM users WHERE id = $1",
      [payload.id]
    );

    if (!rows[0]) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
  }

  next();
};

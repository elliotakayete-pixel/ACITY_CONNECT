import express from "express";
import { query } from "../config/db.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT
         id,
         type,
         message,
         is_read AS "isRead",
         related_listing_id AS "relatedListingId",
         related_interaction_id AS "relatedInteractionId",
         created_at AS "createdAt"
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/read", authenticate, async (req, res, next) => {
  try {
    const { rows } = await query(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE id = $1 AND user_id = $2
       RETURNING id, is_read AS "isRead"`,
      [req.params.id, req.user.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

router.patch("/read-all", authenticate, async (req, res, next) => {
  try {
    await query("UPDATE notifications SET is_read = TRUE WHERE user_id = $1", [
      req.user.id
    ]);

    res.json({ message: "All notifications marked as read." });
  } catch (error) {
    next(error);
  }
});

export default router;

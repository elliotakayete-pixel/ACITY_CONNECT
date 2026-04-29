import express from "express";
import { query } from "../config/db.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { validateListingPayload } from "../middleware/validate.js";

const router = express.Router();

router.use(authenticate, requireAdmin);

router.get("/stats", async (req, res, next) => {
  try {
    const [users, listings, interactions, byStatus] = await Promise.all([
      query("SELECT COUNT(*)::int AS total FROM users"),
      query("SELECT COUNT(*)::int AS total FROM listings"),
      query("SELECT COUNT(*)::int AS total FROM interactions"),
      query(
        `SELECT status, COUNT(*)::int AS total
         FROM listings
         GROUP BY status
         ORDER BY status`
      )
    ]);

    res.json({
      totalUsers: users.rows[0].total,
      totalListings: listings.rows[0].total,
      totalInteractions: interactions.rows[0].total,
      listingsByStatus: byStatus.rows
    });
  } catch (error) {
    next(error);
  }
});

router.get("/users", async (req, res, next) => {
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
       ORDER BY u.created_at DESC`
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get("/listings", async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT
         l.id,
         l.title,
         l.description,
         l.category,
         l.listing_type AS "listingType",
         l.status,
         l.approved,
         l.flagged,
         l.flag_reason AS "flagReason",
         l.created_at AS "createdAt",
         u.full_name AS "creatorName",
         u.email AS "creatorEmail"
       FROM listings l
       JOIN users u ON u.id = l.created_by
       ORDER BY l.created_at DESC`
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.patch("/listings/:id/approve", async (req, res, next) => {
  try {
    const { rows } = await query(
      `UPDATE listings
       SET approved = TRUE, flagged = FALSE, flag_reason = NULL
       WHERE id = $1
       RETURNING id, approved, flagged`,
      [req.params.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: "Listing not found." });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

router.put("/listings/:id", async (req, res, next) => {
  try {
    const listing = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      listingType: req.body.listingType,
      status: req.body.status
    };
    const errors = validateListingPayload(listing);

    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(" ") });
    }

    const { rows } = await query(
      `UPDATE listings
       SET title = $1,
           description = $2,
           category = $3,
           listing_type = $4,
           status = $5,
           approved = $6,
           flagged = $7,
           flag_reason = $8
       WHERE id = $9
       RETURNING *`,
      [
        String(req.body.title).trim(),
        String(req.body.description).trim(),
        req.body.category,
        req.body.listingType,
        req.body.status,
        Boolean(req.body.approved),
        Boolean(req.body.flagged),
        req.body.flagReason || null,
        req.params.id
      ]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: "Listing not found." });
    }

    res.json({
      ...rows[0],
      listingType: rows[0].listing_type,
      flagReason: rows[0].flag_reason
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/listings/:id", async (req, res, next) => {
  try {
    const { rowCount } = await query("DELETE FROM listings WHERE id = $1", [
      req.params.id
    ]);

    if (rowCount === 0) {
      return res.status(404).json({ message: "Listing not found." });
    }

    res.json({ message: "Listing deleted." });
  } catch (error) {
    next(error);
  }
});

router.patch("/listings/:id/flag", async (req, res, next) => {
  try {
    const { rows } = await query(
      `UPDATE listings
       SET flagged = TRUE, approved = FALSE, flag_reason = $1
       WHERE id = $2
       RETURNING id, flagged, approved, flag_reason AS "flagReason"`,
      [req.body.reason || "Flagged by admin", req.params.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: "Listing not found." });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;

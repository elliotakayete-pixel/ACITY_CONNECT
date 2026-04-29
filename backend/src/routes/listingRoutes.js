import express from "express";
import { query } from "../config/db.js";
import { authenticate } from "../middleware/auth.js";
import { requireFields, validateListingPayload } from "../middleware/validate.js";

const router = express.Router();

const listingSelect = `
  SELECT
    l.id,
    l.title,
    l.description,
    l.category,
    l.listing_type AS "listingType",
    l.status,
    l.approved,
    l.flagged,
    l.flag_reason AS "flagReason",
    l.created_by AS "createdBy",
    l.created_at AS "createdAt",
    l.updated_at AS "updatedAt",
    u.full_name AS "creatorName",
    u.email AS "creatorEmail"
  FROM listings l
  JOIN users u ON u.id = l.created_by
`;

const normalizeListingInput = (body) => ({
  title: String(body.title || "").trim(),
  description: String(body.description || "").trim(),
  category: body.category,
  listingType: body.listingType,
  status: body.status || "Available"
});

router.get("/", async (req, res, next) => {
  try {
    const { title, category, status } = req.query;
    const params = [];
    const conditions = ["l.approved = TRUE", "l.flagged = FALSE"];

    if (title) {
      params.push(`%${title}%`);
      conditions.push(`l.title ILIKE $${params.length}`);
    }

    if (category) {
      params.push(category);
      conditions.push(`l.category = $${params.length}`);
    }

    if (status) {
      params.push(status);
      conditions.push(`l.status = $${params.length}`);
    }

    const { rows } = await query(
      `${listingSelect}
       WHERE ${conditions.join(" AND ")}
       ORDER BY l.created_at DESC`,
      params
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get("/mine", authenticate, async (req, res, next) => {
  try {
    const { rows } = await query(
      `${listingSelect}
       WHERE l.created_by = $1
       ORDER BY l.created_at DESC`,
      [req.user.id]
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await query(
      `${listingSelect}
       WHERE l.id = $1 AND l.approved = TRUE AND l.flagged = FALSE`,
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

router.post(
  "/",
  authenticate,
  requireFields(["title", "description", "category", "listingType"]),
  async (req, res, next) => {
    try {
      const listing = normalizeListingInput(req.body);
      const errors = validateListingPayload(listing);

      if (errors.length > 0) {
        return res.status(400).json({ message: errors.join(" ") });
      }

      const { rows } = await query(
        `INSERT INTO listings (title, description, category, listing_type, status, created_by)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          listing.title,
          listing.description,
          listing.category,
          listing.listingType,
          listing.status,
          req.user.id
        ]
      );

      res.status(201).json({
        ...rows[0],
        listingType: rows[0].listing_type,
        createdBy: rows[0].created_by,
        createdAt: rows[0].created_at,
        updatedAt: rows[0].updated_at
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put("/:id", authenticate, async (req, res, next) => {
  try {
    const { rows: existingRows } = await query("SELECT * FROM listings WHERE id = $1", [
      req.params.id
    ]);
    const existing = existingRows[0];

    if (!existing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    if (existing.created_by !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only edit your own listings." });
    }

    const listing = {
      title: req.body.title ?? existing.title,
      description: req.body.description ?? existing.description,
      category: req.body.category ?? existing.category,
      listingType: req.body.listingType ?? existing.listing_type,
      status: req.body.status ?? existing.status
    };
    const errors = validateListingPayload(listing);

    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(" ") });
    }

    const approved =
      req.user.role === "admin" && req.body.approved !== undefined
        ? Boolean(req.body.approved)
        : existing.approved;
    const flagged =
      req.user.role === "admin" && req.body.flagged !== undefined
        ? Boolean(req.body.flagged)
        : existing.flagged;
    const flagReason =
      req.user.role === "admin" && req.body.flagReason !== undefined
        ? req.body.flagReason
        : existing.flag_reason;

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
        String(listing.title).trim(),
        String(listing.description).trim(),
        listing.category,
        listing.listingType,
        listing.status,
        approved,
        flagged,
        flagReason,
        req.params.id
      ]
    );

    res.json({
      ...rows[0],
      listingType: rows[0].listing_type,
      createdBy: rows[0].created_by,
      flagReason: rows[0].flag_reason
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    const { rows } = await query("SELECT created_by FROM listings WHERE id = $1", [
      req.params.id
    ]);
    const listing = rows[0];

    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    if (listing.created_by !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only delete your own listings." });
    }

    await query("DELETE FROM listings WHERE id = $1", [req.params.id]);
    res.json({ message: "Listing deleted." });
  } catch (error) {
    next(error);
  }
});

export default router;

import express from "express";
import { query } from "../config/db.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/listings/:listingId", authenticate, async (req, res, next) => {
  try {
    const { rows: listingRows } = await query(
      `SELECT l.*, u.full_name AS owner_name
       FROM listings l
       JOIN users u ON u.id = l.created_by
       WHERE l.id = $1`,
      [req.params.listingId]
    );
    const listing = listingRows[0];

    if (!listing || !listing.approved || listing.flagged) {
      return res.status(404).json({ message: "Listing not found or not available." });
    }

    if (listing.created_by === req.user.id) {
      return res.status(400).json({ message: "You cannot express interest in your own listing." });
    }

    if (listing.status !== "Available") {
      return res.status(400).json({ message: "This listing is not available." });
    }

    const { rows } = await query(
      `INSERT INTO interactions (listing_id, user_id)
       VALUES ($1, $2)
       RETURNING *`,
      [listing.id, req.user.id]
    );
    const interaction = rows[0];

    await query(
      `INSERT INTO notifications (user_id, message, related_listing_id, related_interaction_id)
       VALUES ($1, $2, $3, $4)`,
      [
        listing.created_by,
        `${req.user.full_name} is interested in your listing "${listing.title}".`,
        listing.id,
        interaction.id
      ]
    );

    res.status(201).json({
      id: interaction.id,
      listingId: interaction.listing_id,
      userId: interaction.user_id,
      status: interaction.status,
      createdAt: interaction.created_at
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "You already expressed interest in this listing." });
    }

    next(error);
  }
});

router.get("/my", authenticate, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT
         i.id,
         i.status,
         i.created_at AS "createdAt",
         l.id AS "listingId",
         l.title,
         l.category,
         l.listing_type AS "listingType",
         l.status AS "listingStatus",
         owner.full_name AS "ownerName",
         owner.email AS "ownerEmail"
       FROM interactions i
       JOIN listings l ON l.id = i.listing_id
       JOIN users owner ON owner.id = l.created_by
       WHERE i.user_id = $1
       ORDER BY i.created_at DESC`,
      [req.user.id]
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get("/received", authenticate, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT
         i.id,
         i.status,
         i.created_at AS "createdAt",
         l.id AS "listingId",
         l.title,
         l.category,
         l.listing_type AS "listingType",
         interested.id AS "interestedUserId",
         interested.full_name AS "interestedName",
         interested.email AS "interestedEmail",
         p.phone_number AS "interestedPhone"
       FROM interactions i
       JOIN listings l ON l.id = i.listing_id
       JOIN users interested ON interested.id = i.user_id
       LEFT JOIN profiles p ON p.user_id = interested.id
       WHERE l.created_by = $1
       ORDER BY i.created_at DESC`,
      [req.user.id]
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

export default router;

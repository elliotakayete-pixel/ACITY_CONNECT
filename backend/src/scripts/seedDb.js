import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { pool } from "../config/db.js";

dotenv.config();

const adminEmail = (process.env.SEED_ADMIN_EMAIL || "admin@acity.edu.gh").trim().toLowerCase();
const adminPassword = process.env.SEED_ADMIN_PASSWORD;
const studentPassword = process.env.SEED_STUDENT_PASSWORD || "Student123$";

if (!adminPassword) {
  console.error("SEED_ADMIN_PASSWORD is required. Add it to backend/.env and rerun npm run db:seed.");
  process.exit(1);
}

const users = [
  {
    fullName: "Elliot Akayete",
    email: adminEmail,
    password: adminPassword,
    role: "admin",
    phoneNumber: "024 000 1000",
    skillsOffered: "Platform moderation, campus coordination, student support",
    skillsNeeded: "Feedback from ACITY CONNECT users"
  },
  {
    fullName: "Ama Mensah",
    email: "ama.mensah@acity.edu.gh",
    password: studentPassword,
    role: "user",
    phoneNumber: "024 111 2001",
    skillsOffered: "Calculus tutoring, note organization",
    skillsNeeded: "Laptop repair, public speaking"
  },
  {
    fullName: "Kwame Owusu",
    email: "kwame.owusu@acity.edu.gh",
    password: studentPassword,
    role: "user",
    phoneNumber: "024 111 2002",
    skillsOffered: "Electronics repair, Arduino basics",
    skillsNeeded: "Academic writing review"
  },
  {
    fullName: "Akua Asante",
    email: "akua.asante@acity.edu.gh",
    password: studentPassword,
    role: "user",
    phoneNumber: "024 111 2003",
    skillsOffered: "Graphic design, poster layouts",
    skillsNeeded: "Python debugging"
  },
  {
    fullName: "Yaw Boateng",
    email: "yaw.boateng@acity.edu.gh",
    password: studentPassword,
    role: "user",
    phoneNumber: "024 111 2004",
    skillsOffered: "Python tutoring, data analysis",
    skillsNeeded: "Video editing"
  },
  {
    fullName: "Sena Tetteh",
    email: "sena.tetteh@acity.edu.gh",
    password: studentPassword,
    role: "user",
    phoneNumber: "024 111 2005",
    skillsOffered: "Video editing, event photography",
    skillsNeeded: "Statistics study partner"
  },
  {
    fullName: "Maya Nartey",
    email: "maya.nartey@acity.edu.gh",
    password: studentPassword,
    role: "user",
    phoneNumber: "024 111 2006",
    skillsOffered: "Public speaking coaching, presentation slides",
    skillsNeeded: "Circuit analysis"
  },
  {
    fullName: "Kofi Addo",
    email: "kofi.addo@acity.edu.gh",
    password: studentPassword,
    role: "user",
    phoneNumber: "024 111 2007",
    skillsOffered: "Peer mentoring, study planning",
    skillsNeeded: "Graphic design support"
  }
];

const listings = [
  {
    owner: "ama.mensah@acity.edu.gh",
    title: "Calculus II Textbook",
    description: "Clean second-hand textbook with highlighted examples and no missing pages.",
    category: "Item",
    listingType: "Item for sale",
    status: "Available",
    approved: true,
    flagged: false
  },
  {
    owner: "kwame.owusu@acity.edu.gh",
    title: "Used Scientific Calculator",
    description: "Casio scientific calculator in working condition with a new battery.",
    category: "Item",
    listingType: "Item for sale",
    status: "Sold",
    approved: true,
    flagged: false
  },
  {
    owner: "kofi.addo@acity.edu.gh",
    title: "Laptop Stand and Keyboard",
    description: "Foldable laptop stand bundled with a compact USB keyboard for study setups.",
    category: "Item",
    listingType: "Item for sale",
    status: "Available",
    approved: true,
    flagged: false
  },
  {
    owner: "akua.asante@acity.edu.gh",
    title: "Arduino Starter Kit",
    description: "Starter kit with breadboard, sensors, jumper wires, and beginner project notes.",
    category: "Item",
    listingType: "Item for sale",
    status: "Swapped",
    approved: true,
    flagged: false
  },
  {
    owner: "sena.tetteh@acity.edu.gh",
    title: "Dorm Mini Fridge",
    description: "Small fridge suitable for a dorm room. Needs admin review before posting.",
    category: "Item",
    listingType: "Item for sale",
    status: "Available",
    approved: false,
    flagged: false
  },
  {
    owner: "yaw.boateng@acity.edu.gh",
    title: "Python Tutoring Sessions",
    description: "One-on-one help with Python fundamentals, loops, functions, and debugging.",
    category: "Skill",
    listingType: "Skill offered",
    status: "Available",
    approved: true,
    flagged: false
  },
  {
    owner: "akua.asante@acity.edu.gh",
    title: "Graphic Design Help",
    description: "Poster, flyer, and presentation design help for student clubs and classes.",
    category: "Skill",
    listingType: "Skill offered",
    status: "Swapped",
    approved: true,
    flagged: false
  },
  {
    owner: "sena.tetteh@acity.edu.gh",
    title: "Video Editing for Club Events",
    description: "Short event recap edits, captions, and clean exports for social media.",
    category: "Skill",
    listingType: "Skill offered",
    status: "Available",
    approved: true,
    flagged: false
  },
  {
    owner: "maya.nartey@acity.edu.gh",
    title: "Looking for Public Speaking Coach",
    description: "Need help preparing a confident class presentation and handling questions.",
    category: "Skill",
    listingType: "Skill requested",
    status: "Available",
    approved: true,
    flagged: false
  },
  {
    owner: "kwame.owusu@acity.edu.gh",
    title: "Need Help with Circuit Analysis",
    description: "Looking for a student who can explain circuit analysis problem sets.",
    category: "Skill",
    listingType: "Skill requested",
    status: "Available",
    approved: false,
    flagged: false
  },
  {
    owner: "kofi.addo@acity.edu.gh",
    title: "Statistics Study Group Request",
    description: "Requesting a small study group for probability, regression, and exam practice.",
    category: "Skill",
    listingType: "Skill requested",
    status: "Swapped",
    approved: true,
    flagged: false
  },
  {
    owner: "ama.mensah@acity.edu.gh",
    title: "Exam Solution Pack",
    description: "Flagged sample listing for admin moderation demonstrations.",
    category: "Item",
    listingType: "Item for sale",
    status: "Available",
    approved: false,
    flagged: true,
    flagReason: "Inappropriate academic integrity content"
  }
];

const interactions = [
  {
    listingTitle: "Calculus II Textbook",
    interestedEmail: "kofi.addo@acity.edu.gh",
    status: "Pending"
  },
  {
    listingTitle: "Calculus II Textbook",
    interestedEmail: "maya.nartey@acity.edu.gh",
    status: "Accepted"
  },
  {
    listingTitle: "Python Tutoring Sessions",
    interestedEmail: "ama.mensah@acity.edu.gh",
    status: "Pending"
  },
  {
    listingTitle: "Python Tutoring Sessions",
    interestedEmail: "kwame.owusu@acity.edu.gh",
    status: "Accepted"
  },
  {
    listingTitle: "Looking for Public Speaking Coach",
    interestedEmail: "sena.tetteh@acity.edu.gh",
    status: "Pending"
  },
  {
    listingTitle: "Laptop Stand and Keyboard",
    interestedEmail: "akua.asante@acity.edu.gh",
    status: "Declined"
  },
  {
    listingTitle: "Video Editing for Club Events",
    interestedEmail: "yaw.boateng@acity.edu.gh",
    status: "Pending"
  }
];

const seededListingTitles = listings.map((listing) => listing.title);

async function upsertUser(client, user, passwordHash) {
  const { rows } = await client.query(
    `INSERT INTO users (full_name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email)
     DO UPDATE SET
       full_name = EXCLUDED.full_name,
       password_hash = EXCLUDED.password_hash,
       role = EXCLUDED.role
     RETURNING id, full_name, email, role`,
    [user.fullName, user.email, passwordHash, user.role]
  );

  const savedUser = rows[0];

  await client.query(
    `INSERT INTO profiles (user_id, phone_number, skills_offered, skills_needed)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id)
     DO UPDATE SET
       phone_number = EXCLUDED.phone_number,
       skills_offered = EXCLUDED.skills_offered,
       skills_needed = EXCLUDED.skills_needed`,
    [savedUser.id, user.phoneNumber, user.skillsOffered, user.skillsNeeded]
  );

  return savedUser;
}

async function main() {
  const client = await pool.connect();
  const userByEmail = new Map();
  const listingByTitle = new Map();

  try {
    await client.query("BEGIN");

    const uniquePasswords = [...new Set(users.map((user) => user.password))];
    const passwordHashes = new Map();

    for (const password of uniquePasswords) {
      passwordHashes.set(password, await bcrypt.hash(password, 12));
    }

    for (const user of users) {
      user.email = user.email.toLowerCase();
      const savedUser = await upsertUser(client, user, passwordHashes.get(user.password));
      userByEmail.set(savedUser.email, savedUser);
    }

    await client.query("DELETE FROM listings WHERE title = ANY($1::text[])", [
      seededListingTitles
    ]);

    for (const listing of listings) {
      const owner = userByEmail.get(listing.owner);
      const { rows } = await client.query(
        `INSERT INTO listings
           (title, description, category, listing_type, status, approved, flagged, flag_reason, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, title, created_by`,
        [
          listing.title,
          listing.description,
          listing.category,
          listing.listingType,
          listing.status,
          listing.approved,
          listing.flagged,
          listing.flagReason || null,
          owner.id
        ]
      );

      listingByTitle.set(rows[0].title, rows[0]);
    }

    for (const interaction of interactions) {
      const listing = listingByTitle.get(interaction.listingTitle);
      const interestedUser = userByEmail.get(interaction.interestedEmail);

      const { rows } = await client.query(
        `INSERT INTO interactions (listing_id, user_id, status)
         VALUES ($1, $2, $3)
         ON CONFLICT (listing_id, user_id)
         DO UPDATE SET status = EXCLUDED.status
         RETURNING id, listing_id, user_id, status`,
        [listing.id, interestedUser.id, interaction.status]
      );
      const savedInteraction = rows[0];
      const owner = users.find((seedUser) => {
        const savedOwner = userByEmail.get(seedUser.email.toLowerCase());
        return savedOwner?.id === listing.created_by;
      });

      await client.query(
        `INSERT INTO notifications
           (user_id, type, message, is_read, related_listing_id, related_interaction_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          listing.created_by,
          "trade_request",
          `${interestedUser.full_name} is interested in your listing "${listing.title}".`,
          interaction.status !== "Pending",
          listing.id,
          savedInteraction.id
        ]
      );

      if (!owner) {
        throw new Error(`Could not find owner for listing ${listing.title}`);
      }
    }

    const admin = userByEmail.get(adminEmail);
    const pendingListings = listings.filter((listing) => !listing.approved && !listing.flagged);
    const flaggedListings = listings.filter((listing) => listing.flagged);

    for (const listing of pendingListings) {
      const savedListing = listingByTitle.get(listing.title);

      await client.query(
        `INSERT INTO notifications (user_id, type, message, is_read, related_listing_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          admin.id,
          "admin_review",
          `New listing awaiting approval: "${listing.title}".`,
          false,
          savedListing.id
        ]
      );
    }

    for (const listing of flaggedListings) {
      const savedListing = listingByTitle.get(listing.title);

      await client.query(
        `INSERT INTO notifications (user_id, type, message, is_read, related_listing_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          admin.id,
          "admin_review",
          `Flagged listing needs review: "${listing.title}".`,
          false,
          savedListing.id
        ]
      );
    }

    await client.query("COMMIT");

    console.log("Seed data created successfully.");
    console.table([
      { table: "users", count: users.length },
      { table: "profiles", count: users.length },
      { table: "listings", count: listings.length },
      { table: "interactions", count: interactions.length },
      {
        table: "notifications",
        count: interactions.length + pendingListings.length + flaggedListings.length
      }
    ]);
    console.log(`Admin login email: ${process.env.SEED_ADMIN_EMAIL}`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to seed database.");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();

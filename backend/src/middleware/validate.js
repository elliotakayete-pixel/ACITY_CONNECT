export const requireFields = (fields) => (req, res, next) => {
  const missing = fields.filter((field) => {
    const value = req.body[field];
    return value === undefined || value === null || String(value).trim() === "";
  });

  if (missing.length > 0) {
    return res.status(400).json({
      message: `Missing required field${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}.`
    });
  }

  next();
};

export const validateAcademicEmail = (email) =>
  /^[^\s@]+@acity\.edu\.gh$/i.test(String(email || "").trim());

export const validateListingPayload = ({ title, description, category, listingType, status }) => {
  const errors = [];
  const categories = ["Item", "Skill"];
  const listingTypes = ["Item for sale", "Skill offered", "Skill requested"];
  const statuses = ["Available", "Swapped", "Sold"];

  if (!title || String(title).trim().length < 3) {
    errors.push("Title must be at least 3 characters.");
  }

  if (!description || String(description).trim().length < 10) {
    errors.push("Description must be at least 10 characters.");
  }

  if (!categories.includes(category)) {
    errors.push("Category must be Item or Skill.");
  }

  if (!listingTypes.includes(listingType)) {
    errors.push("Listing type must be Item for sale, Skill offered, or Skill requested.");
  }

  if (listingType === "Item for sale" && category !== "Item") {
    errors.push("Item for sale listings must use the Item category.");
  }

  if (listingType !== "Item for sale" && category !== "Skill") {
    errors.push("Skill listings must use the Skill category.");
  }

  if (status && !statuses.includes(status)) {
    errors.push("Status must be Available, Swapped, or Sold.");
  }

  return errors;
};

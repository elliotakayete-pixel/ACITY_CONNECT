import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "../api.js";

const initialForm = {
  title: "",
  description: "",
  listingType: "Item for sale",
  category: "Item",
  status: "Available"
};

const categoryForType = (listingType) =>
  listingType === "Item for sale" ? "Item" : "Skill";

export default function CreateListing() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "listingType" ? { category: categoryForType(value) } : {})
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await apiRequest("/listings", {
        method: "POST",
        body: form
      });
      setMessage("Listing submitted for admin approval.");
      setForm(initialForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">Create</p>
        <h1>Post an item or skill</h1>
        <p>Listings appear in the public feed after admin approval.</p>
      </div>

      <form className="form-panel wide" onSubmit={handleSubmit}>
        {message && <p className="alert success">{message}</p>}
        {error && <p className="alert error">{error}</p>}

        <label>
          Title
          <input name="title" value={form.title} onChange={updateField} required />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={updateField}
            minLength={10}
            required
          />
        </label>

        <div className="form-grid">
          <label>
            Listing type
            <select name="listingType" value={form.listingType} onChange={updateField}>
              <option>Item for sale</option>
              <option>Skill offered</option>
              <option>Skill requested</option>
            </select>
          </label>

          <label>
            Category
            <select name="category" value={form.category} onChange={updateField}>
              <option>Item</option>
              <option>Skill</option>
            </select>
          </label>

          <label>
            Status
            <select name="status" value={form.status} onChange={updateField}>
              <option>Available</option>
              <option>Swapped</option>
              <option>Sold</option>
            </select>
          </label>
        </div>

        <button className="button primary" type="submit" disabled={loading}>
          <PlusCircle size={18} /> {loading ? "Submitting..." : "Create listing"}
        </button>
      </form>
    </section>
  );
}

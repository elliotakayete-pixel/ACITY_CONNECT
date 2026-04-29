import { CheckCircle, Edit3, Flag, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { apiRequest } from "../api.js";

const categoryForType = (listingType) =>
  listingType === "Item for sale" ? "Item" : "Skill";

export default function AdminListingsManagement() {
  const [listings, setListings] = useState([]);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadListings = async () => {
    try {
      const data = await apiRequest("/admin/listings");
      setListings(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const approveListing = async (id) => {
    setError("");
    setMessage("");

    try {
      await apiRequest(`/admin/listings/${id}/approve`, { method: "PATCH" });
      setMessage("Listing approved.");
      loadListings();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteListing = async (id) => {
    if (!window.confirm("Delete this listing?")) return;

    setError("");
    setMessage("");

    try {
      await apiRequest(`/admin/listings/${id}`, { method: "DELETE" });
      setMessage("Listing deleted.");
      loadListings();
    } catch (err) {
      setError(err.message);
    }
  };

  const flagListing = async (id) => {
    const reason = window.prompt("Reason for flagging this listing?", "Inappropriate content");
    if (!reason) return;

    setError("");
    setMessage("");

    try {
      await apiRequest(`/admin/listings/${id}/flag`, {
        method: "PATCH",
        body: { reason }
      });
      setMessage("Listing flagged and removed from the public feed.");
      loadListings();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (listing) => {
    setEditing({
      ...listing,
      flagReason: listing.flagReason || ""
    });
  };

  const updateEditing = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === "checkbox" ? checked : value;

    setEditing((current) => ({
      ...current,
      [name]: nextValue,
      ...(name === "listingType" ? { category: categoryForType(value) } : {})
    }));
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await apiRequest(`/admin/listings/${editing.id}`, {
        method: "PUT",
        body: editing
      });
      setMessage("Listing updated.");
      setEditing(null);
      loadListings();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">Admin listings</p>
        <h1>Approve, edit, flag, or delete listings</h1>
      </div>

      {message && <p className="alert success">{message}</p>}
      {error && <p className="alert error">{error}</p>}

      {editing && (
        <form className="form-panel wide edit-panel" onSubmit={saveEdit}>
          <div className="row-heading">
            <h2>Edit listing</h2>
            <button className="icon-button" type="button" onClick={() => setEditing(null)} title="Close editor">
              <X size={18} />
            </button>
          </div>

          <label>
            Title
            <input name="title" value={editing.title} onChange={updateEditing} required />
          </label>

          <label>
            Description
            <textarea name="description" value={editing.description} onChange={updateEditing} required />
          </label>

          <div className="form-grid">
            <label>
              Listing type
              <select name="listingType" value={editing.listingType} onChange={updateEditing}>
                <option>Item for sale</option>
                <option>Skill offered</option>
                <option>Skill requested</option>
              </select>
            </label>

            <label>
              Category
              <select name="category" value={editing.category} onChange={updateEditing}>
                <option>Item</option>
                <option>Skill</option>
              </select>
            </label>

            <label>
              Status
              <select name="status" value={editing.status} onChange={updateEditing}>
                <option>Available</option>
                <option>Swapped</option>
                <option>Sold</option>
              </select>
            </label>
          </div>

          <div className="check-row">
            <label>
              <input
                name="approved"
                type="checkbox"
                checked={Boolean(editing.approved)}
                onChange={updateEditing}
              />
              Approved
            </label>
            <label>
              <input
                name="flagged"
                type="checkbox"
                checked={Boolean(editing.flagged)}
                onChange={updateEditing}
              />
              Flagged
            </label>
          </div>

          <label>
            Flag reason
            <input name="flagReason" value={editing.flagReason} onChange={updateEditing} />
          </label>

          <button className="button primary" type="submit">
            <Save size={18} /> Save changes
          </button>
        </form>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Review</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id}>
                <td>
                  <strong>{listing.title}</strong>
                  <p>{listing.description}</p>
                </td>
                <td>{listing.listingType}</td>
                <td>{listing.status}</td>
                <td>
                  {listing.creatorName}
                  <p>{listing.creatorEmail}</p>
                </td>
                <td>
                  <div className="status-strip">
                    <span className={`pill ${listing.approved ? "good" : "muted"}`}>
                      {listing.approved ? "Approved" : "Pending"}
                    </span>
                    {listing.flagged && <span className="pill danger">Flagged</span>}
                  </div>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="icon-button" onClick={() => approveListing(listing.id)} title="Approve listing">
                      <CheckCircle size={18} />
                    </button>
                    <button className="icon-button" onClick={() => startEdit(listing)} title="Edit listing">
                      <Edit3 size={18} />
                    </button>
                    <button className="icon-button" onClick={() => flagListing(listing.id)} title="Flag listing">
                      <Flag size={18} />
                    </button>
                    <button className="icon-button danger" onClick={() => deleteListing(listing.id)} title="Delete listing">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {listings.length === 0 && <p className="empty-state">No listings to manage.</p>}
    </section>
  );
}

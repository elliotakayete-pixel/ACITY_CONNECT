import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api.js";
import ListingCard from "../components/ListingCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ListingsFeed() {
  const [filters, setFilters] = useState({ title: "", category: "", status: "" });
  const [listings, setListings] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const loadListings = async () => {
    setError("");
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    try {
      const data = await apiRequest(`/listings?${params.toString()}`, { token: "" });
      setListings(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const updateFilter = (event) => {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    loadListings();
  };

  const handleInterested = async (listing) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setBusyId(listing.id);
    setMessage("");
    setError("");

    try {
      await apiRequest(`/interactions/listings/${listing.id}`, { method: "POST" });
      setMessage(`Interest sent for "${listing.title}".`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">Marketplace</p>
        <h1>Find items and skill exchanges</h1>
        <p>Search approved ACITY CONNECT listings from Academic City students.</p>
      </div>

      <form className="filter-bar" onSubmit={handleSearch}>
        <label>
          Search title
          <input name="title" value={filters.title} onChange={updateFilter} />
        </label>

        <label>
          Category
          <select name="category" value={filters.category} onChange={updateFilter}>
            <option value="">All</option>
            <option>Item</option>
            <option>Skill</option>
          </select>
        </label>

        <label>
          Status
          <select name="status" value={filters.status} onChange={updateFilter}>
            <option value="">All</option>
            <option>Available</option>
            <option>Swapped</option>
            <option>Sold</option>
          </select>
        </label>

        <button className="button primary" type="submit">
          <Search size={18} /> Search
        </button>
      </form>

      {message && <p className="alert success">{message}</p>}
      {error && <p className="alert error">{error}</p>}

      <div className="listing-grid">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            onInterested={handleInterested}
            busy={busyId === listing.id}
          />
        ))}
      </div>

      {listings.length === 0 && <p className="empty-state">No approved listings found.</p>}
    </section>
  );
}

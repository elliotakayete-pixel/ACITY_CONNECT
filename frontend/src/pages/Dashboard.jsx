import { Bell, ClipboardList, PackagePlus, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api.js";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [profileData, listingData, notificationData] = await Promise.all([
          apiRequest("/profile"),
          apiRequest("/listings/mine"),
          apiRequest("/notifications")
        ]);

        setProfile(profileData);
        setListings(listingData);
        setNotifications(notificationData);
      } catch (err) {
        setError(err.message);
      }
    };

    loadDashboard();
  }, []);

  const pendingListings = listings.filter((listing) => !listing.approved).length;
  const unreadNotifications = notifications.filter((notification) => !notification.isRead).length;

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">Dashboard</p>
        <h1>{profile ? `Hello, ${profile.fullName}` : "Hello"}</h1>
        <p>Manage your campus listings, trade requests, and profile details.</p>
      </div>

      {error && <p className="alert error">{error}</p>}

      <div className="stat-grid">
        <div className="stat-card">
          <PackagePlus size={22} />
          <span>{listings.length}</span>
          <p>My listings</p>
        </div>
        <div className="stat-card">
          <ClipboardList size={22} />
          <span>{pendingListings}</span>
          <p>Pending approval</p>
        </div>
        <div className="stat-card">
          <Bell size={22} />
          <span>{unreadNotifications}</span>
          <p>Unread alerts</p>
        </div>
      </div>

      <div className="action-row">
        <Link className="button primary" to="/create-listing">
          <PlusCircle size={18} /> Create listing
        </Link>
        <Link className="button secondary" to="/listings">
          Browse feed
        </Link>
      </div>

      <section className="content-section">
        <h2>Recent listings</h2>
        <div className="simple-list">
          {listings.slice(0, 5).map((listing) => (
            <div className="list-row" key={listing.id}>
              <div>
                <strong>{listing.title}</strong>
                <p>
                  {listing.listingType} - {listing.status}
                </p>
              </div>
              <span className={`pill ${listing.approved ? "good" : "muted"}`}>
                {listing.approved ? "Approved" : "Pending"}
              </span>
            </div>
          ))}
          {listings.length === 0 && <p className="empty-state">No listings yet.</p>}
        </div>
      </section>
    </section>
  );
}

import { ClipboardList, ShieldCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api.js";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const [statsData, usersData] = await Promise.all([
          apiRequest("/admin/stats"),
          apiRequest("/admin/users")
        ]);

        setStats(statsData);
        setUsers(usersData);
      } catch (err) {
        setError(err.message);
      }
    };

    loadAdmin();
  }, []);

  return (
    <section>
      <div className="page-heading row-heading">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Platform overview</h1>
          <p>Review users, listings, approvals, and activity.</p>
        </div>
        <Link className="button primary" to="/admin/listings">
          <ShieldCheck size={18} /> Manage listings
        </Link>
      </div>

      {error && <p className="alert error">{error}</p>}

      <div className="stat-grid">
        <div className="stat-card">
          <Users size={22} />
          <span>{stats?.totalUsers ?? 0}</span>
          <p>Total users</p>
        </div>
        <div className="stat-card">
          <ClipboardList size={22} />
          <span>{stats?.totalListings ?? 0}</span>
          <p>Total listings</p>
        </div>
        <div className="stat-card">
          <ShieldCheck size={22} />
          <span>{stats?.totalInteractions ?? 0}</span>
          <p>Total interactions</p>
        </div>
      </div>

      <section className="content-section">
        <h2>Listings by status</h2>
        <div className="status-strip">
          {(stats?.listingsByStatus || []).map((item) => (
            <span className="pill" key={item.status}>
              {item.status}: {item.total}
            </span>
          ))}
          {!stats?.listingsByStatus?.length && <span className="pill muted">No listings yet</span>}
        </div>
      </section>

      <section className="content-section">
        <h2>All users</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.phoneNumber || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

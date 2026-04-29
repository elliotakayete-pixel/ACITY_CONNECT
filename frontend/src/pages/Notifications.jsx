import { Bell, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { apiRequest } from "../api.js";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      const data = await apiRequest("/notifications");
      setNotifications(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markRead = async (id) => {
    try {
      await apiRequest(`/notifications/${id}/read`, { method: "PATCH" });
      loadNotifications();
    } catch (err) {
      setError(err.message);
    }
  };

  const markAllRead = async () => {
    try {
      await apiRequest("/notifications/read-all", { method: "PATCH" });
      loadNotifications();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <div className="page-heading row-heading">
        <div>
          <p className="eyebrow">Notifications</p>
          <h1>Trade request alerts</h1>
        </div>
        <button className="button secondary" onClick={markAllRead} type="button">
          <CheckCheck size={18} /> Mark all read
        </button>
      </div>

      {error && <p className="alert error">{error}</p>}

      <div className="simple-list">
        {notifications.map((notification) => (
          <div className={`list-row ${notification.isRead ? "" : "unread"}`} key={notification.id}>
            <div>
              <strong>
                <Bell size={17} /> {notification.type.replace("_", " ")}
              </strong>
              <p>{notification.message}</p>
            </div>
            {!notification.isRead && (
              <button className="button secondary small" onClick={() => markRead(notification.id)}>
                <CheckCheck size={16} /> Read
              </button>
            )}
          </div>
        ))}
        {notifications.length === 0 && <p className="empty-state">No notifications yet.</p>}
      </div>
    </section>
  );
}

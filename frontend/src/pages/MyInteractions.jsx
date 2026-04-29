import { ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { apiRequest } from "../api.js";

export default function MyInteractions() {
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInteractions = async () => {
      try {
        const [sentData, receivedData] = await Promise.all([
          apiRequest("/interactions/my"),
          apiRequest("/interactions/received")
        ]);

        setSent(sentData);
        setReceived(receivedData);
      } catch (err) {
        setError(err.message);
      }
    };

    loadInteractions();
  }, []);

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">Interactions</p>
        <h1>Trade requests</h1>
        <p>Track listings you liked and students interested in your posts.</p>
      </div>

      {error && <p className="alert error">{error}</p>}

      <div className="two-column">
        <section className="content-section">
          <h2>
            <ClipboardList size={20} /> Listings I am interested in
          </h2>
          <div className="simple-list">
            {sent.map((item) => (
              <div className="list-row" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <p>
                    Owner: {item.ownerName} - {item.ownerEmail}
                  </p>
                </div>
                <span className="pill muted">{item.status}</span>
              </div>
            ))}
            {sent.length === 0 && <p className="empty-state">No sent requests yet.</p>}
          </div>
        </section>

        <section className="content-section">
          <h2>
            <ClipboardList size={20} /> Interested students
          </h2>
          <div className="simple-list">
            {received.map((item) => (
              <div className="list-row" key={item.id}>
                <div>
                  <strong>{item.interestedName}</strong>
                  <p>
                    Wants: {item.title} - {item.interestedEmail}
                    {item.interestedPhone ? ` - ${item.interestedPhone}` : ""}
                  </p>
                </div>
                <span className="pill muted">{item.status}</span>
              </div>
            ))}
            {received.length === 0 && <p className="empty-state">No one has expressed interest yet.</p>}
          </div>
        </section>
      </div>
    </section>
  );
}

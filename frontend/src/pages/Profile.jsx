import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { apiRequest } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    skillsOffered: "",
    skillsNeeded: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await apiRequest("/profile");
        setForm({
          fullName: profile.fullName || "",
          email: profile.email || "",
          phoneNumber: profile.phoneNumber || "",
          skillsOffered: profile.skillsOffered || "",
          skillsNeeded: profile.skillsNeeded || ""
        });
      } catch (err) {
        setError(err.message);
      }
    };

    loadProfile();
  }, []);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const updated = await apiRequest("/profile", {
        method: "PUT",
        body: form
      });
      updateUser({ fullName: updated.fullName });
      setMessage("Profile updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">Profile</p>
        <h1>Your student profile</h1>
        <p>Keep your contact details and skill exchange preferences current.</p>
      </div>

      <form className="form-panel wide" onSubmit={handleSubmit}>
        {error && <p className="alert error">{error}</p>}
        {message && <p className="alert success">{message}</p>}

        <label>
          Full name
          <input name="fullName" value={form.fullName} onChange={updateField} required />
        </label>

        <label>
          Email
          <input name="email" value={form.email} disabled />
        </label>

        <label>
          Phone number
          <input name="phoneNumber" value={form.phoneNumber} onChange={updateField} />
        </label>

        <label>
          Skills offered
          <textarea name="skillsOffered" value={form.skillsOffered} onChange={updateField} />
        </label>

        <label>
          Skills needed
          <textarea name="skillsNeeded" value={form.skillsNeeded} onChange={updateField} />
        </label>

        <button className="button primary" type="submit" disabled={loading}>
          <Save size={18} /> {loading ? "Saving..." : "Save profile"}
        </button>
      </form>
    </section>
  );
}

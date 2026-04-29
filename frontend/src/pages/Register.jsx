import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  phoneNumber: "",
  skillsOffered: "",
  skillsNeeded: ""
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="page-heading">
        <p className="eyebrow">Student access</p>
        <h1>Create your ACITY CONNECT account</h1>
        <p>Use your Academic City email to join the campus marketplace.</p>
      </div>

      <form className="form-panel" onSubmit={handleSubmit}>
        {error && <p className="alert error">{error}</p>}

        <label>
          Full name
          <input name="fullName" value={form.fullName} onChange={updateField} required />
        </label>

        <label>
          Academic City email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            placeholder="name@acity.edu.gh"
            required
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            minLength={8}
            required
          />
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
          <UserPlus size={18} /> {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="form-note">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </form>
    </section>
  );
}

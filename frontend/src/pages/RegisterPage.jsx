import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      const detail = err?.response?.data;
      setError(
        detail
          ? Object.values(detail).flat().join(" ")
          : "Something went wrong creating your account."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6F8] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">Sprintline</h1>
          <p className="text-sm text-ink/50 mt-1">Create your workspace account</p>
        </div>
        <form onSubmit={submit} className="card p-6 space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">{error}</p>}
          <div>
            <label className="text-xs font-medium text-ink/60">Username</label>
            <input
              className="input mt-1"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink/60">Email</label>
            <input
              type="email"
              className="input mt-1"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink/60">Password</label>
            <input
              type="password"
              className="input mt-1"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button className="btn-primary w-full" disabled={busy}>
            {busy ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="text-center text-sm text-ink/50 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-signal font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

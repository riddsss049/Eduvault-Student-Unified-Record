import { useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function AdminAuthForm({ isSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function handleAuth(e) {
    e.preventDefault();
    setErr("");
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.replace("/admin/dashboard"); // Redirect to admin dashboard after successful login/signup
    } catch (error) {
      setErr(error.message || "Authentication failed");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: 40 }}>
      <h2>{isSignup ? "Admin Sign Up" : "Admin Login"}</h2>
      <form onSubmit={handleAuth}>
        <div>
          <label>Email</label><br />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required style={{ width: "100%", padding: 8 }} />
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Password</label><br />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required style={{ width: "100%", padding: 8 }} />
        </div>
        {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
        <button type="submit" style={{ marginTop: 12, padding: 8, width: "100%" }}>{isSignup ? "Sign Up" : "Login"}</button>
      </form>
    </div>
  );
}
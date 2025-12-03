import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { auth } from "../../lib/firebase"; // Adjusted import path
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function handleRegister(e) {
    e.preventDefault();
    setErr("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (error) {
      setErr(error.message || "Registration failed");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: 40 }}>
      <h2>Create account</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email</label><br />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required style={{ width: "100%", padding: 8 }} />
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Password</label><br />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required style={{ width: "100%", padding: 8 }} />
        </div>
        {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
        <button type="submit" style={{ marginTop: 12, padding: 8, width: "100%" }}>Register</button>
      </form>
      <p style={{ marginTop: 12 }}>
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </div>
  );
}
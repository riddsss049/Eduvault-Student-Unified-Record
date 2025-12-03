import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { auth } from "../../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import AuthForm from "../../../components/AuthForm";

export default function FacultyLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setErr("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/faculty/dashboard"); // Redirect to faculty dashboard after login
    } catch (error) {
      setErr(error.message || "Login failed");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: 40 }}>
      <h2>Faculty Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label><br />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required style={{ width: "100%", padding: 8 }} />
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Password</label><br />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required style={{ width: "100%", padding: 8 }} />
        </div>
        {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
        <button type="submit" style={{ marginTop: 12, padding: 8, width: "100%" }}>Login</button>
      </form>
      <p style={{ marginTop: 12 }}>
        Don't have an account? <Link href="/faculty/register">Sign up</Link>
      </p>
    </div>
  );
}
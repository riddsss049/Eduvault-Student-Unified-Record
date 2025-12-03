import { useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import AdminAuthForm from "../../../components/AdminAuthForm";

export default function AdminSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function handleSignup(e) {
    e.preventDefault();
    setErr("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/admin/login");
    } catch (error) {
      setErr(error.message || "Signup failed");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: 40 }}>
      <h2>Admin Signup</h2>
      <AdminAuthForm 
        email={email} 
        setEmail={setEmail} 
        password={password} 
        setPassword={setPassword} 
        handleSubmit={handleSignup} 
        error={err} 
      />
    </div>
  );
}
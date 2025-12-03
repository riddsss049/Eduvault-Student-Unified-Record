import React, { useState } from "react";
import { auth } from "../src/firebase";
import styles from "../styles/admin.module.css";

export default function AddUserModal({ open, onClose, onSent }) {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  if (!open) return null;

  async function handleSend(e) {
    e?.preventDefault();
    setMsg(null);
    if (!email) { setMsg({ type: "error", text: "Email required" }); return; }
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Not signed in");
      const idToken = await currentUser.getIdToken(true);

      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        // sendInvite: false prevents generating/sending the invite link
        body: JSON.stringify({ email: email.trim(), role, rollNo: rollNo.trim(), sendInvite: false }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || data?.message || "Failed");
      setMsg({ type: "ok", text: data.message || "User added" });
      setEmail("");
      setRollNo("");
      onSent?.();
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Invite failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.addUserModal} role="dialog" aria-modal="true">
        <header className={styles.addUserHeader}>
          <h3>Invite new user</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </header>

        <form className={styles.addUserForm} onSubmit={handleSend}>
          <label>Role</label>
          <div className={styles.roleRow}>
            <button type="button" className={role==="student"?styles.roleActive:styles.roleBtn} onClick={()=>setRole("student")}>Student</button>
            <button type="button" className={role==="faculty"?styles.roleActive:styles.roleBtn} onClick={()=>setRole("faculty")}>Faculty</button>
          </div>

          <label>Email</label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />

          <label>Roll No (optional)</label>
          <input value={rollNo} onChange={(e)=>setRollNo(e.target.value)} type="text" />

          {msg && (
            <div className={msg.type==="error"?styles.formError:styles.formOk}>
              {msg.text}
            </div>
          )}

          <div className={styles.addUserActions}>
            <button type="button" className={styles.btnAlt} onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>{loading ? "Sending..." : "Send invite"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
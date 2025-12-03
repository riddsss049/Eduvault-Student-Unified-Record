import React, { useState } from "react";
import styles from "../styles/faculty.module.css";

export default function FacultyProfileModal({ open, onClose }) {
  const [name, setName] = useState("Rohit Kumar");
  const [email] = useState("rohit@example.com");
  const [dept, setDept] = useState("Computer Science");
  const [notify, setNotify] = useState(true);

  if (!open) return null;
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.addUserModal}>
        <header className={styles.addUserHeader}>
          <h3>Profile</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </header>
        <div className={styles.addUserForm}>
          <label>Name</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} />
          <label>Email</label>
          <input value={email} disabled />
          <label>Department</label>
          <input value={dept} onChange={(e)=>setDept(e.target.value)} />
          <label>Notifications</label>
          <div style={{display:"flex", gap:8}}>
            <label className={styles.switch}>
              <input type="checkbox" checked={notify} onChange={(e)=>setNotify(e.target.checked)} />
              <span className={styles.switchSlider} />
            </label>
            <div style={{color:"#6b7280"}}>Alert me on new submissions</div>
          </div>

          <div className={styles.addUserActions}>
            <button className={styles.btnAlt} onClick={onClose}>Close</button>
            <button className={styles.btnPrimary} onClick={() => { alert("Saved (wire API)"); onClose(); }}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
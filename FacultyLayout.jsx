import React, { useState } from "react";
import Link from "next/link";
import ProfileModal from "./FacultyProfileModal";
import styles from "../styles/faculty.module.css";

export default function FacultyLayout({ children }) {
  const [showProfile, setShowProfile] = useState(false);
  const nav = [
    { label: "Dashboard", path: "/faculty/dashboard" },
    { label: "Submissions", path: "/faculty/submissions" },
    { label: "Bulk Verification", path: "/faculty/bulk" },
    { label: "Profile", path: "#", action: () => setShowProfile(true) },
  ];

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <img src="/logo.png" alt="logo" className={styles.logo} />
          <div className={styles.title}>
            <strong>EduVault</strong>
            <span className={styles.subtitle}>Faculty Hub</span>
          </div>
        </div>

        <nav className={styles.centerNav}>
          {nav.map((n) =>
            n.path ? (
              <Link key={n.label} href={n.path}>
                <a className={styles.navBtn}>{n.label}</a>
              </Link>
            ) : (
              <button key={n.label} className={styles.navBtn} onClick={n.action}>
                {n.label}
              </button>
            )
          )}
        </nav>

        <div className={styles.rightArea}>
          <button className={styles.iconBtn} title="Notifications">
            🔔 <span className={styles.badge}>7</span>
          </button>

          <div className={styles.profileWrap}>
            <button className={styles.profileBtn} onClick={() => setShowProfile(true)}>
              <span className={styles.avatar}>RK</span>
              <span className={styles.profileName}>Rohit Kumar</span>
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <ProfileModal open={showProfile} onClose={() => setShowProfile(false)} />
    </div>
  );
}
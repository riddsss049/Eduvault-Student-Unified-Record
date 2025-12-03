import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/admin.module.css";
import { auth } from "../src/firebase";
import ProfileModal from "./ProfileModal";
import AdminChatWidget from "./AdminChatWidget";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", cls: "btnDashboard" },
    { label: "Users", path: "/admin/users", cls: "btnUsers" },
    { label: "Analytics", path: "/admin/analytics", cls: "btnAnalytics" },
    { label: "Submissions", path: "/admin/submissions", cls: "btnSubmissions" },
    { label: "Settings", path: "/admin/settings", cls: "btnSettings" },
  ];

  const displayName = user?.displayName || user?.email || "Admin";

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <img src="/logo.png" alt="logo" className={styles.logoImg} />
          <div className={styles.brand}>
            <strong>EduVault</strong>
          </div>
        </div>

        <nav className={styles.nav}>
          <button className={styles.navItem} onClick={() => router.push("/admin/dashboard")}>Dashboard</button>
          <button className={styles.navItem} onClick={() => router.push("/admin/users")}>Users</button>
          <button className={styles.navItem} onClick={() => router.push("/admin/analytics")}>Analytics</button>
          <button className={styles.navItem} onClick={() => router.push("/admin/submissions")}>Submissions</button>
          <button className={styles.navItem} onClick={() => router.push("/admin/settings")}>Settings</button>
        </nav>

        <div className={styles.sidebarFooter}>
          <button
            className={styles.logout}
            onClick={() => {
              // optional: call auth.signOut() if desired
              router.push("/login");
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          {/* centered button-style nav */}
          <nav className={styles.topnav}>
            <div className={styles.topnavInner}>
              {navItems.map((n) => (
                <button
                  key={n.path}
                  className={`${styles.topnavBtn} ${styles[n.cls]} ${router.pathname === n.path ? styles.active : ""}`}
                  onClick={() => router.push(n.path)}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </nav>

          <div className={styles.topbarRight}>
            <div className={styles.topActions}>
              <div className={styles.profile} onClick={() => setShowProfile(true)} style={{ cursor: "pointer" }}>
                <div className={styles.avatar}>{/* avatar/initials handled by CSS/JS above */}</div>
                <div className={styles.profileName}>{displayName}</div>
              </div>
            </div>
          </div>
        </header>

        <main className={styles.content}>{children}</main>
      </div>

      <ProfileModal open={showProfile} onClose={() => setShowProfile(false)} />
      <AdminChatWidget />
    </div>
  );
}
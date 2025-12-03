import React, { useEffect, useState } from "react";
import styles from "../styles/profile.module.css";
import { auth, db, storage } from "../src/firebase";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";

export default function ProfileModal({ open, onClose }) {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!open) return;
    if (user) {
      setDisplayName(user.displayName || "");
      setPreview(user.photoURL || "");
      // load extra fields from Firestore if present (optional)
      (async () => {
        try {
          const snap = await doc(db, "users", user.uid).get?.(); // noop safe
        } catch {}
      })();
    }
  }, [open, user]);

  useEffect(() => {
    if (!file) return setPreview(user?.photoURL || "");
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  }, [file, user]);

  async function handleSave(e) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      // Optimistically update displayName first (fast)
      if (displayName && displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }

      let photoURL = user.photoURL || "";

      if (file) {
        const storageRef = ref(storage, `profiles/${user.uid}/${Date.now()}-${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // track progress and await completion
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setUploadProgress(pct);
            },
            (err) => reject(err),
            async () => {
              photoURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });

        // update auth profile with photoURL
        await updateProfile(user, { photoURL });
      }

      // Write merged user profile doc
      await setDoc(doc(db, "users", user.uid), {
        displayName: displayName || null,
        phone: phone || null,
        bio: bio || null,
        photoURL: photoURL || null,
        updatedAt: new Date(),
      }, { merge: true });

      onClose?.();
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  }

  if (!open) return null;
  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <header className={styles.header}>
          <h3>Profile</h3>
          <button className={styles.close} onClick={() => onClose?.()}>✕</button>
        </header>

        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.avatarRow}>
            <div className={styles.avatarWrap}>
              {preview ? <img src={preview} alt="preview" /> : <div className={styles.avatarPlaceholder}>A</div>}
            </div>
            <div>
              <label className={styles.fileLabel}>
                Change photo
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0]||null)} />
              </label>
              <div className={styles.small}>Allowed: jpg/png — suggested max 2MB</div>
            </div>
          </div>

          <label>Full name</label>
          <input value={displayName} onChange={(e)=>setDisplayName(e.target.value)} />

          <label>Phone</label>
          <input value={phone} onChange={(e)=>setPhone(e.target.value)} />

          <label>Bio</label>
          <textarea value={bio} onChange={(e)=>setBio(e.target.value)} rows={3} />

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button type="button" className={styles.btnAlt} onClick={() => onClose?.()}>Cancel</button>
            <button type="submit" className={styles.btnPrimary} disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
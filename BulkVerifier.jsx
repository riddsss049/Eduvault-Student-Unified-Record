import React from "react";
import styles from "../styles/faculty.module.css";

export default function BulkVerifier({ selected = [], setSelected }) {
  function approveAll() {
    if (!selected.length) return alert("No submissions selected");
    // call API to approve all selected
    alert("Approving: " + selected.join(", "));
    setSelected([]);
  }
  function rejectAll() {
    if (!selected.length) return alert("No submissions selected");
    alert("Rejecting: " + selected.join(", "));
    setSelected([]);
  }

  return (
    <div className={styles.card}>
      <h4>Bulk Verification</h4>
      <div className={styles.bulkInfo}>
        <div><strong>{selected.length}</strong> selected</div>
        <div className={styles.bulkBtns}>
          <button className={styles.btnPrimary} onClick={approveAll}>Approve All</button>
          <button className={styles.btnDanger} onClick={rejectAll}>Reject All</button>
        </div>
      </div>

      <div style={{marginTop:12}}>
        <h5>Quick previews</h5>
        <div className={styles.thumbRow}>
          {/* thumbnails — wire real evidence */}
          <img src="/sample1.jpg" alt="" className={styles.thumb} />
          <img src="/sample2.jpg" alt="" className={styles.thumb} />
          <img src="/sample3.jpg" alt="" className={styles.thumb} />
        </div>
      </div>
    </div>
  );
}
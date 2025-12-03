import React, { useState, useMemo } from "react";
import styles from "../styles/faculty.module.css";

export default function SubmissionsTable({ data = [], selected = [], setSelected }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [preview, setPreview] = useState(null);

  const filtered = useMemo(() => {
    return data.filter(d => {
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (query && !(`${d.name} ${d.title}`.toLowerCase().includes(query.toLowerCase()))) return false;
      return true;
    });
  }, [data, query, statusFilter]);

  function toggle(id) {
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  }

  function approve(id) {
    alert("Approved " + id + " (hook to API)");
  }
  function reject(id) {
    alert("Rejected " + id + " (hook to API)");
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeaderRow}>
        <h3>Submissions</h3>
        <div className={styles.filters}>
          <input placeholder="Search student or title" value={query} onChange={(e)=>setQuery(e.target.value)} className={styles.input} />
          <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className={styles.select}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th><input type="checkbox" onChange={(e)=> setSelected(e.target.checked ? data.map(x=>x.id) : []) } checked={selected.length === data.length && data.length>0} /></th>
            <th>Student</th>
            <th>Title</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(row => (
            <tr key={row.id}>
              <td><input type="checkbox" checked={selected.includes(row.id)} onChange={()=>toggle(row.id)} /></td>
              <td>{row.name}</td>
              <td>{row.title}</td>
              <td>{row.date}</td>
              <td><span className={`${styles.status} ${styles["s_"+row.status]}`}>{row.status}</span></td>
              <td className={styles.actions}>
                <button className={styles.btnAlt} onClick={() => setPreview(row)}>Preview</button>
                <button className={styles.small} onClick={() => approve(row.id)}>Approve</button>
                <button className={styles.smallDanger} onClick={() => reject(row.id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {preview && (
        <div className={styles.modalBackdrop}>
          <div className={styles.previewModal}>
            <header className={styles.previewHeader}>
              <strong>Preview: {preview.title}</strong>
              <button onClick={() => setPreview(null)} className={styles.closeBtn}>✕</button>
            </header>
            <div className={styles.previewBody}>
              {/* show image/pdf/embed without download */}
              <img src={preview.evidence} alt="evidence" style={{maxWidth:"100%", borderRadius:8}} />
            </div>
            <div className={styles.previewActions}>
              <button className={styles.small} onClick={() => { alert("Approve " + preview.id); setPreview(null); }}>Approve</button>
              <button className={styles.smallDanger} onClick={() => { alert("Reject " + preview.id); setPreview(null); }}>Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
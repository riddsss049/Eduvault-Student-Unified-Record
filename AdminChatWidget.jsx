import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/admin.module.css";
import { auth } from "../src/firebase";

export default function AdminChatWidget() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState("Admin");
  const bodyRef = useRef(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (u) {
        const name = u.displayName || (u.email ? u.email.split("@")[0] : "Admin");
        setUserName(name);
        setMessages([
          { id: 1, from: "bot", text: `Hi ${name} — need help? Ask me about users, submissions or settings.` },
        ]);
      } else {
        setUserName("Admin");
        setMessages([{ id: 1, from: "bot", text: "Hi Admin — need help? Ask me about users, submissions or settings." }]);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, open]);

  function send() {
    if (!value.trim()) return;
    const userMsg = { id: Date.now(), from: "me", text: value.trim() };
    setMessages((m) => [...m, userMsg]);
    setValue("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, from: "bot", text: `Got it — I can help with "${userMsg.text}". Try "list pending" or "invite user".` },
      ]);
    }, 700);
  }

  return (
    <>
      <div className={styles.adminChatWidget}>
        <button
          className={styles.chatButton}
          aria-label="Open admin help"
          onClick={() => setOpen((s) => !s)}
        >
          {/* small question icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 2C6.48 2 2 6.48 2 12c0 3.64 2.02 6.8 5 8.48V22l3.02-1.27" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 17v.01" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.5 9.5a2.5 2.5 0 115 0c0 2-2.5 2.5-2.5 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {open && (
          <div className={styles.chatWindow} role="dialog" aria-label="Admin help chat">
            <div className={styles.chatHeader}>
              <strong>Admin Assistant</strong>
              <button className={styles.chatClose} onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className={styles.chatBody} ref={bodyRef}>
              {messages.map((m) => (
                <div key={m.id} className={m.from === "me" ? styles.msgMe : styles.msgBot}>
                  <div className={styles.msgText}>{m.text}</div>
                </div>
              ))}
            </div>

            <div className={styles.chatInputRow}>
              <input
                className={styles.chatInput}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ask about submissions, users or settings..."
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <button className={styles.chatSend} onClick={send} aria-label="Send">Send</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
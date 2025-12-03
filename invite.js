import admin from "firebase-admin";
import nodemailer from "nodemailer";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

// initialize firebase-admin more robustly and preserve helpful errors
if (!admin.apps.length) {
  try {
    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
      });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Application Default Credentials (service account file path)
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
      });
    } else {
      // leave uninitialized so we can return a clear error later
      console.warn("firebase-admin not initialized: set FIREBASE_SERVICE_ACCOUNT_KEY or GOOGLE_APPLICATION_CREDENTIALS");
    }
  } catch (e) {
    console.error("firebase-admin initialization error:", e);
  }
}

async function sendEmail(to, subject, html) {
  if (!process.env.SMTP_HOST) return false;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
  return true;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // fail early with a clear message when admin SDK isn't ready
  if (!admin.apps.length || !admin.app().options || !admin.app().options.projectId) {
    return res.status(500).json({
      error:
        "Firebase Admin not initialized. Provide credentials: set FIREBASE_SERVICE_ACCOUNT_KEY (JSON) or set GOOGLE_APPLICATION_CREDENTIALS to your serviceAccount.json path. See https://firebase.google.com/docs/admin/setup",
    });
  }

  const { email, role = "student", rollNo, sendInvite = false } = req.body || {};
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) return res.status(403).json({ error: "Missing auth token" });
    const idToken = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    if (!decoded || !decoded.admin) return res.status(403).json({ error: "Not authorized" });

    // ensure user exists (or create)
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
    } catch (err) {
      // create minimal user with no password (admin-created)
      userRecord = await admin.auth().createUser({ email, emailVerified: false });
    }

    // set custom claims (role)
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    // store Firestore metadata in users collection
    const db = admin.firestore();
    await db.collection("users").doc(userRecord.uid).set({
      email,
      role,
      rollNo: rollNo || null,
      invitedBy: decoded.uid || null,
      invitedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    // If caller requested no invite, return here (no password-reset link / email)
    if (sendInvite === false) {
      return res.status(200).json({ message: "User created/updated (no invite sent)" });
    }

    // generate password reset link so user can set a password
    const actionCodeSettings = {
      url: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/login` : "https://your-app-url.example/login",
      handleCodeInApp: false,
    };
    const link = await admin.auth().generatePasswordResetLink(email, actionCodeSettings);

    // optionally send via SMTP
    if (process.env.SMTP_HOST) {
      const html = `
        <p>Hello,</p>
        <p>You have been invited to join EduVault as <strong>${role}</strong>.</p>
        <p><a href="${link}">Click here to set your password and sign in</a></p>
        <p>If you did not expect this, ignore this email.</p>
      `;
      await sendEmail(email, "You're invited to EduVault", html);
      return res.status(200).json({ message: "Invite email sent" });
    }

    // otherwise return link so caller/admin can copy it
    return res.status(200).json({ message: "Invite link generated", link });
  } catch (err) {
    console.error("invite error", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}
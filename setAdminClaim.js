const admin = require("firebase-admin");
// provide service account via env or file
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

async function setAdmin(uid) {
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  console.log("Set admin claim for", uid);
  process.exit(0);
}

// usage: node scripts/setAdminClaim.js <uid>
const uid = process.argv[2];
if (!uid) {
  console.error("Usage: node scripts/setAdminClaim.js <uid>");
  process.exit(1);
}
setAdmin(uid).catch(console.error);
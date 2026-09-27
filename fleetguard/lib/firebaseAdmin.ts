import {
  initializeApp,
  cert,
  getApps,
  type App,
} from "firebase-admin/app";

import { getAuth, type Auth } from "firebase-admin/auth";

function initializeFirebaseAdmin(): App {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin environment variables"
    );
  }

  return getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      });
}

const app = initializeFirebaseAdmin();

export const firebaseAdminAuth: Auth = getAuth(app);
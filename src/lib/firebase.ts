import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, setLogLevel } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Silence warnings of offline connections or unreachable backend to prevent console spam
try {
  setLogLevel("error");
} catch (err) {
  // Safe fallback
}

export let db: any = null;
export let auth: any = null;
export let isFirebaseAvailable = false;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  const isOffline = errMsg.includes("client is offline") || 
                    errMsg.includes("Could not reach Cloud Firestore backend") || 
                    errMsg.includes("offline") ||
                    errMsg.includes("Failed to get document") ||
                    (error && typeof error === "object" && "code" in error && (error as any).code === "unavailable");

  if (isOffline) {
    console.warn(`[Offline Fallback] Firestore operation '${operationType}' on path '${path}' completed in offline fallback mode.`);
    return; // Do not log with console.error('Firestore Error: ') or throw hard exceptions for expected offline behavior
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Attempt deep initialization at module load if config is ready
try {
  if (firebaseConfig && firebaseConfig.apiKey) {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    }, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(app);
    isFirebaseAvailable = true;
    console.log("🔥 Firebase initialized statically with long polling!");
  }
} catch (e) {
  console.warn("Could not statically load Firebase config variables on module boot.", e);
}

export async function getFirebaseServices() {
  // If already initialized above, return eagerly
  if (isFirebaseAvailable) {
    return { db, auth, isFirebaseAvailable };
  }

  // Double check initialization
  try {
    if (firebaseConfig && firebaseConfig.apiKey) {
      const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      db = initializeFirestore(app, {
        experimentalForceLongPolling: true,
      }, firebaseConfig.firestoreDatabaseId);
      auth = getAuth(app);
      isFirebaseAvailable = true;
      console.log("🔥 Firebase late initialized successfully with long polling!");
    } else {
      console.log("ℹ️ Operating in high-performance local storage mode.");
    }
  } catch (err) {
    console.warn("⚠️ Fallback quietly so the UI runs perfectly offline. Operating in Local-First Mode.");
  }

  return { db, auth, isFirebaseAvailable };
}

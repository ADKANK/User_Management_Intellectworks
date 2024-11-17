import * as firebaseAdmin from 'firebase-admin';
import * as path from 'path';
import firebaseConfig from './firebaseConfig';

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(
        firebaseConfig as firebaseAdmin.ServiceAccount
    ),
});

const auth = firebaseAdmin.auth();
const db = firebaseAdmin.firestore();
const admin = firebaseAdmin;

export { auth, db, admin };

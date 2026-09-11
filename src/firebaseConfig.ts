// Public, client-safe Firebase project identifiers — NOT secrets.
// Firestore access is controlled entirely by security rules (see
// firestore.rules), not by hiding this config. Safe to commit.
//
// Fill these in from Firebase Console → Project settings → Your apps → Web app.
// Leave blank to disable sync (the app works fine locally either way).
export const firebaseConfig = {
  projectId: '',
  apiKey: '',
};

export const EMAIL_DIGESTS_COLLECTION = 'emailDigests';

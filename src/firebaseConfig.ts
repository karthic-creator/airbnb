// Public, client-safe Firebase project identifiers — NOT secrets.
// Firestore access is controlled entirely by security rules (see
// firestore.rules), not by hiding this config. Safe to commit.
//
// Fill these in from Firebase Console → Project settings → Your apps → Web app.
// Leave blank to disable sync (the app works fine locally either way).
export const firebaseConfig = {
  projectId: 'compass-sync-eb9d5',
  apiKey: 'AIzaSyDHIQ_29gDlGTUZlTf5qA2NSXJ7Q0Tz3HY',
};

export const EMAIL_DIGESTS_COLLECTION = 'emailDigests';
export const FIREFLIES_NOTES_COLLECTION = 'firefliesNotes';

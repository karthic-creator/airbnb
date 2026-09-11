import type { Item } from './types';
import { firebaseConfig, EMAIL_DIGESTS_COLLECTION } from './firebaseConfig';
import { todayISO } from './time';

interface FirestoreField {
  stringValue?: string;
  integerValue?: string;
  timestampValue?: string;
}

interface FirestoreDocument {
  name: string;
  fields?: Record<string, FirestoreField>;
}

function fieldToString(field?: FirestoreField): string {
  return field?.stringValue ?? '';
}

function fieldToInt(field?: FirestoreField): number {
  return field?.integerValue ? parseInt(field.integerValue, 10) : 0;
}

/**
 * Fetches email digests written by the recurring inbox-cleanup routine and
 * turns them into read-only Today items. Best-effort: any failure (no
 * config set, offline, project not reachable) just yields no synced items —
 * Compass is fully usable without this.
 */
export async function fetchEmailDigests(): Promise<Item[]> {
  if (!firebaseConfig.projectId || !firebaseConfig.apiKey) return [];

  const url =
    `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}` +
    `/databases/(default)/documents/${EMAIL_DIGESTS_COLLECTION}` +
    `?key=${firebaseConfig.apiKey}&pageSize=20&orderBy=createdAt%20desc`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const documents: FirestoreDocument[] = data.documents ?? [];

    return documents.map((doc): Item => {
      const docId = doc.name.split('/').pop() ?? doc.name;
      const fields = doc.fields ?? {};
      const summary = fieldToString(fields.summary) || 'Email digest';
      const createdAt = fields.createdAt?.timestampValue ? new Date(fields.createdAt.timestampValue) : new Date();
      const emailCount = fieldToInt(fields.emailCount);
      const archivedCount = fieldToInt(fields.archivedCount);

      return {
        id: `digest-${docId}`,
        title: summary,
        category: 'business',
        icon: '📧',
        date: todayISO(createdAt),
        time: `${String(createdAt.getHours()).padStart(2, '0')}:${String(createdAt.getMinutes()).padStart(2, '0')}`,
        durationMinutes: 5,
        recurrence: 'none',
        completedDates: [],
        source: 'email_digest',
        notes: `${emailCount} new emails, ${archivedCount} archived automatically.`,
      };
    });
  } catch {
    return [];
  }
}

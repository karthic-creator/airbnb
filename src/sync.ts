import type { Item } from './types';
import { firebaseConfig, EMAIL_DIGESTS_COLLECTION, FIREFLIES_NOTES_COLLECTION } from './firebaseConfig';
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

/**
 * Fetches documents from a Firestore collection over plain REST (no SDK
 * dependency). Best-effort: any failure (no config set, offline, project
 * not reachable) just yields no documents — Compass is fully usable
 * without sync either way.
 */
async function fetchCollection(collection: string, orderByField: string): Promise<FirestoreDocument[]> {
  if (!firebaseConfig.projectId || !firebaseConfig.apiKey) return [];

  const url =
    `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}` +
    `/databases/(default)/documents/${collection}` +
    `?key=${firebaseConfig.apiKey}&pageSize=20&orderBy=${encodeURIComponent(orderByField)}%20desc`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.documents ?? [];
  } catch {
    return [];
  }
}

function docId(doc: FirestoreDocument): string {
  return doc.name.split('/').pop() ?? doc.name;
}

/** Email digests written by the recurring inbox-cleanup routine. */
export async function fetchEmailDigests(): Promise<Item[]> {
  const documents = await fetchCollection(EMAIL_DIGESTS_COLLECTION, 'createdAt');

  return documents.map((doc): Item => {
    const fields = doc.fields ?? {};
    const summary = fieldToString(fields.summary) || 'Email digest';
    const createdAt = fields.createdAt?.timestampValue ? new Date(fields.createdAt.timestampValue) : new Date();

    return {
      id: `digest-${docId(doc)}`,
      title: 'Inbox digest',
      category: 'business',
      icon: '📧',
      date: todayISO(createdAt),
      time: `${String(createdAt.getHours()).padStart(2, '0')}:${String(createdAt.getMinutes()).padStart(2, '0')}`,
      durationMinutes: 5,
      recurrence: 'none',
      completedDates: [],
      source: 'email_digest',
      notes: summary,
    };
  });
}

/** Meeting notes written by the recurring Fireflies check. */
export async function fetchMeetingNotes(): Promise<Item[]> {
  const documents = await fetchCollection(FIREFLIES_NOTES_COLLECTION, 'meetingDate');

  return documents.map((doc): Item => {
    const fields = doc.fields ?? {};
    const title = fieldToString(fields.title) || 'Meeting notes';
    const summary = fieldToString(fields.summary);
    const actionItems = fieldToString(fields.actionItems);
    const meetingDate = fields.meetingDate?.timestampValue ? new Date(fields.meetingDate.timestampValue) : new Date();
    const notes = actionItems ? `${summary}\n\nAction items:\n${actionItems}` : summary;

    return {
      id: `fireflies-${docId(doc)}`,
      title: `Notes: ${title}`,
      category: 'business',
      icon: '🎙️',
      date: todayISO(meetingDate),
      time: `${String(meetingDate.getHours()).padStart(2, '0')}:${String(meetingDate.getMinutes()).padStart(2, '0')}`,
      durationMinutes: 5,
      recurrence: 'none',
      completedDates: [],
      source: 'meeting_notes',
      notes,
    };
  });
}

import { ProjectData } from '../types';

const DB_NAME = 'SLR_Workbench_DB';
const DB_VERSION = 1;
const STORE_NAME = 'project_store';
const RECORD_KEY = 'current_project';
const LOCAL_STORAGE_KEY = 'slr_project_state';

/**
 * Open or initialize the IndexedDB database instance
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB is not supported in this environment'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

/**
 * Save systematic review project data to IndexedDB
 */
export async function saveProjectToIndexedDB(project: ProjectData): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(project, RECORD_KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  } catch (error) {
    console.warn('Failed to save to IndexedDB:', error);
  }
}

/**
 * Load systematic review project data from IndexedDB
 */
export async function loadProjectFromIndexedDB(): Promise<ProjectData | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(RECORD_KEY);

      request.onsuccess = () => {
        resolve((request.result as ProjectData) || null);
      };
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  } catch (error) {
    console.warn('Failed to load from IndexedDB:', error);
    return null;
  }
}

/**
 * Master Save: Persists to IndexedDB (unlimited quota) + safe localStorage fallback.
 * Guarantees that QuotaExceededError never bubbles up or crashes the UI.
 */
export async function saveProjectState(project: ProjectData): Promise<void> {
  // 1. Asynchronously persist full dataset to IndexedDB
  await saveProjectToIndexedDB(project);

  // 2. Safe localStorage update with try/catch
  try {
    const serialized = JSON.stringify(project);
    localStorage.setItem(LOCAL_STORAGE_KEY, serialized);
  } catch (err: any) {
    // If QuotaExceededError occurs in localStorage, gracefully handle and log
    console.warn('localStorage quota exceeded. Full project state preserved safely in IndexedDB.', err?.message);
    try {
      // Clear out the stale/bloated localStorage item so future small updates don't block
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // Ignore cleanup error
    }
  }
}

/**
 * Master Load: Synchronously checks localStorage if available, or returns null to trigger async IndexedDB hydration.
 */
export function loadProjectStateSync(): ProjectData | null {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to parse state from localStorage:', e);
  }
  return null;
}

/**
 * Clear all persistent storage (both IndexedDB and localStorage)
 */
export async function clearProjectStorage(): Promise<void> {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear localStorage:', e);
  }

  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(RECORD_KEY);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  } catch (error) {
    console.warn('Failed to clear IndexedDB:', error);
  }
}

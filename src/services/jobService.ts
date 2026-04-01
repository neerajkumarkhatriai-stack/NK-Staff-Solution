import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  deleteDoc,
  updateDoc,
  Timestamp,
  Unsubscribe
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { JobListing, JobApplication, JobAlert } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const jobService = {
  async getJobs(): Promise<JobListing[] | undefined> {
    const path = 'jobs';
    try {
      const q = query(collection(db, path), orderBy('postedAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobListing));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  subscribeToJobs(callback: (jobs: JobListing[]) => void): Unsubscribe {
    const path = 'jobs';
    const q = query(collection(db, path), orderBy('postedAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobListing));
      callback(jobs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  async getJobById(id: string): Promise<JobListing | null | undefined> {
    const path = `jobs/${id}`;
    try {
      const docRef = doc(db, 'jobs', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as JobListing;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  async addJob(job: Omit<JobListing, 'id'>): Promise<string | undefined> {
    const path = 'jobs';
    try {
      const docRef = await addDoc(collection(db, path), job);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async updateJob(id: string, job: Partial<JobListing>): Promise<void> {
    const path = `jobs/${id}`;
    try {
      const docRef = doc(db, 'jobs', id);
      await updateDoc(docRef, job);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteJob(id: string): Promise<void> {
    const path = `jobs/${id}`;
    try {
      await deleteDoc(doc(db, 'jobs', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async submitApplication(application: Omit<JobApplication, 'id'>): Promise<string | undefined> {
    const path = 'applications';
    try {
      const docRef = await addDoc(collection(db, path), application);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  subscribeToApplications(callback: (apps: JobApplication[]) => void): Unsubscribe {
    const path = 'applications';
    const q = query(collection(db, path), orderBy('appliedAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobApplication));
      callback(apps);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  async updateApplicationStatus(id: string, status: string, rejectionStage?: string): Promise<void> {
    const path = `applications/${id}`;
    try {
      const docRef = doc(db, 'applications', id);
      const updateData: any = { status };
      if (rejectionStage) {
        updateData.rejectionStage = rejectionStage;
      }
      await updateDoc(docRef, updateData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }
};

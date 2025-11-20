'use client';
import {
  Query,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

interface UseCollectionOptions<T> {
  idField?: string;
  transform?: (data: any) => T;
}

export function useCollection<T>(
  query: Query | null,
  options?: UseCollectionOptions<T>
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore || !query) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const transformedData = snapshot.docs.map((doc) => {
          const docData = doc.data();
          const transformed = options?.transform ? options.transform(docData) : docData;
          if (options?.idField) {
            return {
              ...transformed,
              [options.idField]: doc.id,
            };
          }
          return transformed;
        }) as T[];
        setData(transformedData);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        const permissionError = new FirestorePermissionError({
          path: (query as any)._query.path.segments.join('/'),
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
      }
    );

    return () => unsubscribe();
  }, [firestore, query, options?.idField, options?.transform]);

  return { data, loading };
}

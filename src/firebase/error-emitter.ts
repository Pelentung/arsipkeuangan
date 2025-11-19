import { EventEmitter } from 'events';

// This is a global event emitter for Firestore permission errors.
// It is used to surface rich, contextual errors to the Next.js development overlay.
export const errorEmitter = new EventEmitter();

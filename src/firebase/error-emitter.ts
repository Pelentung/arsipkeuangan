import { EventEmitter } from 'events';
import type { FirestorePermissionError } from './errors';

type Events = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// This is a simple event emitter that can be used to broadcast errors
// from anywhere in the application. This is particularly useful for
// handling Firestore permission errors in a centralized way.
class ErrorEmitter extends EventEmitter {
  emit<T extends keyof Events>(event: T, ...args: Parameters<Events[T]>) {
    return super.emit(event, ...args);
  }

  on<T extends keyof Events>(event: T, listener: Events[T]) {
    return super.on(event, listener);
  }

  off<T extends keyof Events>(event: T, listener: Events[T]) {
    return super.off(event, listener);
  }
}

export const errorEmitter = new ErrorEmitter();

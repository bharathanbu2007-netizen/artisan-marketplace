// Thin wrapper so the rest of the app has one place to swap storage backends.
// Install @react-native-async-storage/async-storage and re-export it here:
//
//   import AsyncStorage from '@react-native-async-storage/async-storage';
//   export default AsyncStorage;
//
// A minimal in-memory fallback is provided so the project type-checks and
// runs immediately after `npm install`, before you've added the native module.
const memoryStore: Record<string, string> = {};

const AsyncStorageShim = {
  async getItem(key: string) {
    return memoryStore[key] ?? null;
  },
  async setItem(key: string, value: string) {
    memoryStore[key] = value;
  },
  async removeItem(key: string) {
    delete memoryStore[key];
  },
};

export default AsyncStorageShim;

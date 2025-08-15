// src/lib/pocketbase.js
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
pb.authStore.load();              // if a session was saved in localStorage
pb.authStore.onChange(() => {
  pb.authStore.save();            // keep session in localStorage
});

export default pb;

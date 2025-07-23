// src/lib/pocketbase.js
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090'); 
pb.authStore.load();              // if a session was saved in localStorage
pb.authStore.onChange(() => {
  pb.authStore.save();            // keep session in localStorage
});

export default pb;

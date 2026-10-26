// Live sync between the phone app and the Intrakore site, through Firebase Firestore.
// Exposes the small store interface the app already uses: collection(name).onSnapshot/get, doc('col/id').set/delete.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

let api = null;
const cfg = window.FIREBASE_CONFIG;
if (cfg && cfg.apiKey) {
  const db = getFirestore(initializeApp(cfg));
  const wrap = s => ({ docs: s.docs.map(d => ({ id: d.id, exists: true, data: () => d.data() })) });
  api = {
    collection: name => ({
      onSnapshot: (next, err) => onSnapshot(collection(db, name), s => next(wrap(s)), e => err && err(e)),
      get: async () => wrap(await getDocs(collection(db, name)))
    }),
    doc: path => {
      const [c, id] = path.split('/');
      return { set: data => setDoc(doc(db, c, id), data), delete: () => deleteDoc(doc(db, c, id)) };
    }
  };
}
window.__dbResolve(api);

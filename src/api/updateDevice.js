import { auth, firestore } from '../firebase';
import firebase from 'firebase';

export async function updateDevice({ deviceId, updatedObj, auditDescription }) {
  addAudit(updatedObj);
  await firestore.doc(`devices/${deviceId}`).update(updatedObj);
  if(auditDescription) {
    const uid = auth.currentUser && auth.currentUser.uid;
    const entry = {
      dateCreated: new Date(),
      userId: uid,
      description: auditDescription
    }
    await firestore.doc(`devices/${deviceId}`).update({  auditHistory: firebase.firestore.FieldValue.arrayUnion(entry) });
  }
}

function addAudit(obj) {
  const uid = auth.currentUser && auth.currentUser.uid;
  obj.updatedBy = uid;
  obj.dateUpdated = new Date();
}

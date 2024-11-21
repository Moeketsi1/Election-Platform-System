import { db, auth } from './firebase-config.js';
import { 
    doc, 
    setDoc, 
    updateDoc, 
    getDoc, 
    collection, 
    query, 
    onSnapshot,
    runTransaction,
    serverTimestamp,
    increment
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export class FirestoreService {
    static async castVote(candidateId, province) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('User not authenticated');

            const uid = user.uid;
            
            await runTransaction(db, async (transaction) => {
                // READS FIRST
                const userRef = doc(db, 'users', uid);
                const userSnapshot = await transaction.get(userRef);
                
                const statsRef = doc(db, 'statistics', 'vote_counts');
                const statsDoc = await transaction.get(statsRef);
                
                // Validate user hasn't voted
                if (userSnapshot.exists() && userSnapshot.data().voted) {
                    throw new Error('User has already voted');
                }

                // WRITES SECOND
                const voteRef = doc(db, 'votes', uid);
                transaction.set(voteRef, {
                    userId: uid,
                    candidateId: candidateId,
                    province: province,
                    timestamp: serverTimestamp()
                });

                transaction.update(userRef, {
                    voted: true,
                    votedCandidate: candidateId,
                    votedAt: serverTimestamp()
                });

                if (statsDoc.exists()) {
                    transaction.update(statsRef, {
                        total_votes: increment(1),
                        [`candidate_${candidateId}_votes`]: increment(1),
                        [`province_${province}`]: increment(1)
                    });
                } else {
                    transaction.set(statsRef, {
                        total_votes: 1,
                        candidate_1_votes: candidateId === 1 ? 1 : 0,
                        candidate_2_votes: candidateId === 2 ? 1 : 0,
                        [`province_${province}`]: 1
                    });
                }
            });

            return true;
        } catch (err) {
            console.error('Error in castVote:', err);
            throw err;
        }
    }

    static listenToVoteCounts(callback) {
        const statsRef = doc(db, 'statistics', 'vote_counts');
        return onSnapshot(statsRef, (doc) => {
            if (doc.exists()) {
                callback(doc.data());
            }
        });
    }
}
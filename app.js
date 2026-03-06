import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        
        if (snap.exists()) {
            const data = snap.data();
            
            // নাম ও ব্যালেন্স আপডেট
            if(document.getElementById('userCoins')) document.getElementById('userCoins').innerText = data.coins || 0;
            if(document.getElementById('topUserName')) {
                document.getElementById('topUserName').innerText = data.name || user.email.split('@')[0];
            }
        }
    } else {
        window.location.href = "login.html";
    }
});

// Daily Check-in
document.getElementById('checkInBtn')?.addEventListener('click', async () => {
    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    const lastCheck = snap.data().lastCheckIn || 0;

    if (Date.now() - lastCheck < 86400000) return alert("আগামীকাল আবার চেষ্টা করুন!");

    await updateDoc(userRef, { coins: increment(10), lastCheckIn: Date.now() });
    alert("১০ কয়েন যোগ হয়েছে!");
    location.reload();
});

// Watch Ad
document.getElementById('watchAdBtn')?.addEventListener('click', async () => {
    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    const lastAd = snap.data().lastAdClick || 0;

    if (Date.now() - lastAd < 30000) return alert("৩০ সেকেন্ড অপেক্ষা করুন!");

    window.open("https://middayopened.com/rmm8pbwe?key=a42d11bce0966c10bc9b3f909ae44009", "_blank");
    await updateDoc(userRef, { coins: increment(5), lastAdClick: Date.now() });
    alert("৫ কয়েন যোগ হয়েছে!");
    location.reload();
});

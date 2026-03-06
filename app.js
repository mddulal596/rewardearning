import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { doc, getDoc, updateDoc, increment, setDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// ইউজার লগইন চেক
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("Logged in user:", user.email);
        const userRef = doc(db, "users", user.uid);
        
        try {
            const snap = await getDoc(userRef);
            if (snap.exists()) {
                document.getElementById('userCoins').innerText = snap.data().coins || 0;
            } else {
                // যদি ইউজারের ডেটাবেস না থাকে তবে নতুন করে তৈরি করবে
                await setDoc(userRef, { coins: 0, lastCheckIn: 0, lastAdClick: 0 });
                document.getElementById('userCoins').innerText = 0;
            }
        } catch (error) {
            console.error("Database error:", error);
        }
    } else {
        console.log("No user logged in.");
        // লগইন না থাকলে index.html এ আর্নিং কাজ করবে না
    }
});

// Daily Check-in Logic
async function handleCheckIn() {
    const user = auth.currentUser;
    if (!user) {
        alert("আগে লগইন করুন!");
        window.location.href = 'login.html';
        return;
    }

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    const lastCheck = snap.data().lastCheckIn || 0;
    const now = Date.now();

    // ২৪ ঘণ্টার চেক (৮৬৪০০০০০ মিলিসেকেন্ড)
    if (now - lastCheck < 86400000) {
        alert("২৪ ঘণ্টার আগে বোনাস নিতে পারবেন না!");
        return;
    }

    await updateDoc(userRef, {
        coins: increment(10),
        lastCheckIn: now
    });
    alert("১০ কয়েন যোগ হয়েছে!");
    location.reload();
}

// Watch Ad Logic
async function handleWatchAd() {
    const user = auth.currentUser;
    if (!user) {
        alert("আগে লগইন করুন!");
        window.location.href = 'login.html';
        return;
    }

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    const lastAd = snap.data().lastAdClick || 0;
    const now = Date.now();

    if (now - lastAd < 30000) {
        alert("দয়া করে ৩০ সেকেন্ড অপেক্ষা করুন!");
        return;
    }

    // অ্যাড ডাইরেক্ট লিঙ্ক
    window.open("https://middayopened.com/rmm8pbwe?key=a42d11bce0966c10bc9b3f909ae44009", "_blank");

    await updateDoc(userRef, {
        coins: increment(5),
        lastAdClick: now
    });
    alert("৫ কয়েন যোগ হয়েছে!");
    location.reload();
}

// বাটনগুলোর সাথে ফাংশন কানেক্ট করা
document.getElementById('checkInBtn')?.addEventListener('click', handleCheckIn);
document.getElementById('watchAdBtn')?.addEventListener('click', handleWatchAd);

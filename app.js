import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// ইউজারের কয়েন রিয়েল-টাইমে দেখানোর জন্য
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists() && document.getElementById('userCoins')) {
            document.getElementById('userCoins').innerText = snap.data().coins;
        }
    } else {
        if (!window.location.pathname.includes("login.html") && !window.location.pathname.includes("signup.html")) {
            window.location.href = "login.html";
        }
    }
});

// ১. Watch Ad & Earn (+5) লজিক
document.getElementById('watchAdBtn')?.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please Login!");

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    const lastClick = snap.data().lastAdClick || 0;

    // ৩০ সেকেন্ডের সিকিউরিটি চেক
    if (Date.now() - lastClick < 30000) {
        alert("দয়া করে ৩০ সেকেন্ড অপেক্ষা করুন!");
        return;
    }

    // Adsterra Direct Link ওপেন হবে
    window.open("https://middayopened.com/rmm8pbwe?key=a42d11bce0966c10bc9b3f909ae44009", "_blank");

    // কয়েন যোগ করা এবং সময় সেভ করা
    await updateDoc(userRef, {
        coins: increment(5),
        lastAdClick: Date.now()
    });
    
    alert("অভিনন্দন! ৫ কয়েন যোগ হয়েছে।");
    location.reload();
});

// ২. Daily Check-in (+10) লজিক
document.getElementById('checkInBtn')?.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please Login!");

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    const lastCheckIn = snap.data().lastCheckIn || 0;

    // ২৪ ঘণ্টার সিকিউরিটি চেক (২৪ ঘণ্টা = ৮৬,৪০০,০০০ মিলিসেকেন্ড)
    const oneDay = 24 * 60 * 60 * 1000;
    if (Date.now() - lastCheckIn < oneDay) {
        alert("আপনি আজকের বোনাস নিয়ে নিয়েছেন! আগামীকাল আবার চেষ্টা করুন।");
        return;
    }

    // ১০ কয়েন যোগ করা
    await updateDoc(userRef, {
        coins: increment(10),
        lastCheckIn: Date.now()
    });

    alert("আজকের ডেইলি বোনাস ১০ কয়েন যোগ হয়েছে!");
    location.reload();
});

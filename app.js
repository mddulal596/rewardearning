import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { doc, getDoc, updateDoc, increment, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// ইউজারের ব্যালেন্স ও ডাটা লোড করা
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
            const data = snap.data();
            document.getElementById('topUserName').innerText = data.name || "User";
            document.getElementById('userCoins').innerText = data.coins || 0;

            // প্রোফাইল ছবি দেখানো
            if (data.photoURL) {
                const pic = document.getElementById('topUserProfilePic');
                const icon = document.getElementById('topUserIcon');
                if(pic && icon) {
                    pic.src = data.photoURL;
                    pic.style.display = 'block';
                    icon.style.display = 'none';
                }
            }

            // বাটনগুলোর লিমিট চেক করা
            checkLimit(data.lastCheckIn, 'checkInBtn', 24 * 60 * 60 * 1000, "Daily Check-in (+10)"); // ২৪ ঘণ্টা
            checkLimit(data.lastAdWatch, 'watchAdBtn', 1 * 60 * 60 * 1000, "Watch Ad & Earn (+5)"); // ১ ঘণ্টা
        }
    } else {
        window.location.href = "login.html";
    }
});

// সময় চেক করার ফাংশন
function checkLimit(lastTime, btnId, limitMs, originalText) {
    const btn = document.getElementById(btnId);
    if (!lastTime) return;

    const lastDate = lastTime.toDate().getTime();
    const now = new Date().getTime();
    const diff = now - lastDate;

    if (diff < limitMs) {
        btn.disabled = true;
        const remaining = limitMs - diff;
        
        // টাইমার আপডেট করা
        const timer = setInterval(() => {
            const currentNow = new Date().getTime();
            const currentDiff = limitMs - (currentNow - lastDate);
            
            if (currentDiff <= 0) {
                clearInterval(timer);
                btn.disabled = false;
                btn.innerText = originalText;
            } else {
                const hours = Math.floor(currentDiff / (1000 * 60 * 60));
                const mins = Math.floor((currentDiff % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((currentDiff % (1000 * 60)) / 1000);
                btn.innerText = `Wait: ${hours}h ${mins}m ${secs}s`;
            }
        }, 1000);
    }
}

// ডেইলি চেক-ইন বাটন লজিক
document.getElementById('checkInBtn').onclick = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const btn = document.getElementById('checkInBtn');
    btn.disabled = true;

    try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { 
            coins: increment(10),
            lastCheckIn: serverTimestamp() 
        });
        alert("Success! 10 Coins Added.");
        location.reload();
    } catch (e) { 
        alert(e.message); 
        btn.disabled = false;
    }
};

// অ্যাড দেখে কয়েন নেওয়ার বাটন লজিক
document.getElementById('watchAdBtn').onclick = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const btn = document.getElementById('watchAdBtn');

    // আপনার অ্যাড লিঙ্কটি এখানে দিন
    const adLink = "আপনার_অ্যাড_লিঙ্ক"; 
    window.open(adLink, '_blank');

    try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { 
            coins: increment(5),
            lastAdWatch: serverTimestamp() 
        });
        alert("Success! 5 Coins Added.");
        location.reload();
    } catch (e) { 
        alert(e.message); 
    }
};

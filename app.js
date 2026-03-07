import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { doc, getDoc, updateDoc, increment, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const AD_LINK = "https://middayopened.com/uuh65fp1c?key=0d0044249c1cef410a86dcfa8f7e3460";

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
            const data = snap.data();
            document.getElementById('topUserName').innerText = data.name || "User";
            document.getElementById('userCoins').innerText = data.coins || 0;
            
            // বাটন লিমিট চেক
            checkLimit(data.lastCheckIn, 'checkInBtn', 24*60*60*1000, "Daily Check-in (+10)");
            checkLimit(data.lastAdWatch, 'watchAdBtn', 1*60*60*1000, "Watch Ad & Earn (+5)");
        }
    } else {
        window.location.href = "login.html";
    }
});

// স্পিন বাটন লজিক
document.getElementById('spinBtn').onclick = () => {
    const wheel = document.getElementById('wheel-container');
    const btn = document.getElementById('spinBtn');
    btn.disabled = true;
    
    const randomDeg = Math.floor(Math.random() * 360) + 1800; // ৫ বার ঘুরবে
    wheel.style.transform = `rotate(${randomDeg}deg)`;

    setTimeout(() => {
        if(confirm("Congratulations! You won a bonus. Click OK to watch an ad and collect 5 coins!")) {
            window.open(AD_LINK, '_blank');
            addCoins(5, 'lastAdWatch'); 
        }
        btn.disabled = false;
        wheel.style.transform = `rotate(0deg)`;
    }, 3500);
};

// কয়েন যোগ করার ফাংশন
async function addCoins(amount, timeField) {
    const user = auth.currentUser;
    if (!user) return;
    try {
        await updateDoc(doc(db, "users", user.uid), {
            coins: increment(amount),
            [timeField]: serverTimestamp()
        });
        alert(`Success! ${amount} Coins added.`);
        location.reload();
    } catch (e) {
        alert("Permission Error: Please check your Firestore Rules.");
    }
}

// বাটন ক্লিক ইভেন্ট
document.getElementById('checkInBtn').onclick = () => addCoins(10, 'lastCheckIn');
document.getElementById('watchAdBtn').onclick = () => {
    window.open(AD_LINK, '_blank');
    setTimeout(() => addCoins(5, 'lastAdWatch'), 3000);
};

// টাইমার চেক ফাংশন
function checkLimit(lastTime, btnId, limitMs, originalText) {
    const btn = document.getElementById(btnId);
    if (!lastTime || !btn) return;
    const lastDate = lastTime.toDate().getTime();
    
    const update = () => {
        const now = new Date().getTime();
        const diff = limitMs - (now - lastDate);
        if (diff > 0) {
            btn.disabled = true;
            const h = Math.floor(diff/3600000), m = Math.floor((diff%3600000)/60000), s = Math.floor((diff%60000)/1000);
            btn.innerText = `Wait: ${h}h ${m}m ${s}s`;
            setTimeout(update, 1000);
        } else {
            btn.disabled = false;
            btn.innerText = originalText;
        }
    };
    update();
}

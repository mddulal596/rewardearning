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

            // বাটনগুলোর লিমিট ও টাইমার চেক করা
            checkLimit(data.lastCheckIn, 'checkInBtn', 24 * 60 * 60 * 1000, "Daily Check-in (+10)"); 
            checkLimit(data.lastAdWatch, 'watchAdBtn', 1 * 60 * 60 * 1000, "Watch Ad & Earn (+5)"); 
        }
    } else {
        window.location.href = "login.html";
    }
});

// টাইমার ফাংশন
function checkLimit(lastTime, btnId, limitMs, originalText) {
    const btn = document.getElementById(btnId);
    if (!lastTime || !btn) return;

    const lastDate = lastTime.toDate().getTime();
    
    const updateTimer = () => {
        const now = new Date().getTime();
        const diff = now - lastDate;
        const remaining = limitMs - diff;

        if (remaining > 0) {
            btn.disabled = true;
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((remaining % (1000 * 60)) / 1000);
            btn.innerText = `Wait: ${hours}h ${mins}m ${secs}s`;
            setTimeout(updateTimer, 1000);
        } else {
            btn.disabled = false;
            btn.innerText = originalText;
        }
    };
    updateTimer();
}

// ডেইলি চেক-ইন লজিক
document.getElementById('checkInBtn').onclick = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const btn = document.getElementById('checkInBtn');
    btn.disabled = true;

    try {
        await updateDoc(doc(db, "users", user.uid), { 
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

// আপনার দেওয়া নতুন অ্যাড লিঙ্ক দিয়ে অ্যাড লজিক
document.getElementById('watchAdBtn').onclick = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please Login!");
    
    const btn = document.getElementById('watchAdBtn');
    
    // আপনার নতুন অ্যাড লিঙ্ক এখানে বসানো হয়েছে
    const adLink = "https://middayopened.com/uuh65fp1c?key=0d0044249c1cef410a86dcfa8f7e3460"; 
    
    // বিজ্ঞাপনটি নতুন ট্যাবে ওপেন হবে
    window.open(adLink, '_blank');

    btn.disabled = true;
    btn.innerText = "Processing...";

    // ৩ সেকেন্ড পর কয়েন যোগ হবে যাতে বিজ্ঞাপনটি লোড হওয়ার সময় পায়
    setTimeout(async () => {
        try {
            await updateDoc(doc(db, "users", user.uid), { 
                coins: increment(5),
                lastAdWatch: serverTimestamp() 
            });
            alert("Success! 5 Coins added.");
            location.reload();
        } catch (e) { 
            alert("Error: " + e.message); 
            btn.disabled = false;
            btn.innerText = "Watch Ad & Earn (+5)";
        }
    }, 3000);
};

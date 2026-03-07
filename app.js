import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// ইউজারের ব্যালেন্স ও ছবি লোড করা
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
            const data = snap.data();
            document.getElementById('topUserName').innerText = data.name || "User";
            document.getElementById('userCoins').innerText = data.coins || 0;

            if (data.photoURL) {
                const pic = document.getElementById('topUserProfilePic');
                const icon = document.getElementById('topUserIcon');
                if(pic && icon) {
                    pic.src = data.photoURL;
                    pic.style.display = 'block';
                    icon.style.display = 'none';
                }
            }
        }
    } else {
        window.location.href = "login.html";
    }
});

// ১০ কয়েন যোগ করার বাটন (Daily Check-in)
document.getElementById('checkInBtn').onclick = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const btn = document.getElementById('checkInBtn');
    btn.disabled = true;
    try {
        await updateDoc(doc(db, "users", user.uid), { coins: increment(10) });
        alert("Success! 10 Coins Added.");
        location.reload();
    } catch (e) { 
        alert(e.message); 
        btn.disabled = false;
    }
};

// বিজ্ঞাপন দেখে ৫ কয়েন পাওয়ার বাটন
document.getElementById('watchAdBtn').onclick = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please Login!");

    // বিজ্ঞাপনের লিঙ্ক (এখানে আপনার অ্যাড লিঙ্কটি বসান)
    const adLink = "https://middayopened.com/44ea16fb3bf3a48a9a140ddd4fa5dc93/invoke.js"; 
    
    // বিজ্ঞাপনটি নতুন ট্যাবে ওপেন হবে
    window.open(adLink, '_blank');

    try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { coins: increment(5) });
        alert("Success! 5 Coins added for watching ad.");
        location.reload();
    } catch (e) { 
        alert("Error: " + e.message); 
    }
};

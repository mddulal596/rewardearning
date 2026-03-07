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
                pic.src = data.photoURL;
                pic.style.display = 'block';
                icon.style.display = 'none';
            }
        }
    } else {
        window.location.href = "login.html";
    }
});

// ১০ কয়েন যোগ করার বাটন
document.getElementById('checkInBtn').onclick = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
        await updateDoc(doc(db, "users", user.uid), { coins: increment(10) });
        alert("Success! 10 Coins added.");
        location.reload();
    } catch (e) { alert(e.message); }
};

// ৫ কয়েন যোগ করার বাটন
document.getElementById('watchAdBtn').onclick = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
        await updateDoc(doc(db, "users", user.uid), { coins: increment(5) });
        alert("Success! 5 Coins added.");
        location.reload();
    } catch (e) { alert(e.message); }
};

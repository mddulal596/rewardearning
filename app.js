import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        
        if (snap.exists()) {
            const data = snap.data();
            
            // ব্যালেন্স আপডেট (ID: userCoins)
            if(document.getElementById('userCoins')) {
                document.getElementById('userCoins').innerText = data.coins || 0;
            }
            
            // নাম আপডেট (ID: topUserName)
            if(document.getElementById('topUserName')) {
                document.getElementById('topUserName').innerText = data.name || "User";
            }

            // প্রোফাইল ছবি আপডেট
            const topIcon = document.getElementById('topUserIcon');
            const topPic = document.getElementById('topUserProfilePic');
            
            if (data.photoURL && topPic) {
                topPic.src = data.photoURL + "?t=" + new Date().getTime(); // ক্যাশ এড়াতে টাইমস্ট্যাম্প
                topPic.style.display = 'block';
                if(topIcon) topIcon.style.display = 'none';
            }
        }
    } else {
        window.location.href = "login.html";
    }
});

import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

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

// Watch Ad Logic
document.getElementById('watchAdBtn')?.addEventListener('click', async () => {
    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    const lastClick = snap.data().lastAdClick || 0;

    if (Date.now() - lastClick < 30000) return alert("Wait 30 seconds!");

    window.open("https://middayopened.com/rmm8pbwe?key=a42d11bce0966c10bc9b3f909ae44009", "_blank");
    await updateDoc(userRef, { coins: increment(5), lastAdClick: Date.now() });
    alert("Reward Added!");
    location.reload();
});

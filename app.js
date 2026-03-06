import { db, auth } from './firebase.js';
import { doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const AD_REWARD = 5;
const COOLDOWN_TIME = 30000; // 30 seconds

window.watchAd = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please Login!");

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    const lastClick = snap.data().lastAdClick || 0;

    if (Date.now() - lastClick < COOLDOWN_TIME) {
        alert("Wait 30 seconds before next ad!");
        return;
    }

    // Open Adsterra Direct Link
    window.open("https://middayopened.com/rmm8pbwe?key=a42d11bce0966c10bc9b3f909ae44009", "_blank");

    // Update Balance after small delay
    setTimeout(async () => {
        await updateDoc(userRef, {
            coins: increment(AD_REWARD),
            lastAdClick: Date.now()
        });
        document.getElementById('userCoins').innerText = (snap.data().coins + AD_REWARD);
        alert("Reward Added!");
    }, 2000);
};

// Daily Check-in Logic
window.claimDailyBonus = async () => {
    // Logic similar to Watch Ad but with 24-hour timestamp check
};

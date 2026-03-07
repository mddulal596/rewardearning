import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { doc, getDoc, updateDoc, increment, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
            const data = snap.data();
            if(document.getElementById('topUserName')) document.getElementById('topUserName').innerText = data.name || "User";
            if(document.getElementById('userCoins')) document.getElementById('userCoins').innerText = data.coins || 0;
            
            // রেফার কোড জেনারেট (যদি না থাকে)
            if(!data.referCode) {
                const code = "PRO" + Math.floor(1000 + Math.random() * 9000);
                await updateDoc(userRef, { referCode: code });
            }
        }
    } else { window.location.href = "login.html"; }
});

// উন্নত চ্যাটবট রিপ্লাই
const chatInput = document.getElementById('chat-input');
const sendChat = document.getElementById('send-chat');
const chatContent = document.getElementById('chat-content');

if(sendChat) {
    sendChat.onclick = () => {
        const text = chatInput.value.trim().toLowerCase();
        if (!text) return;
        chatContent.innerHTML += `<div style="background: var(--primary); color: white; padding: 8px 12px; border-radius: 12px; margin-bottom: 10px; align-self: flex-end; max-width: 80%;">${text}</div>`;
        chatInput.value = "";

        let reply = "দুঃখিত, আমি বুঝতে পারিনি। দয়া করে পেমেন্ট, রেফার বা ইনকাম নিয়ে প্রশ্ন করুন।";
        if (text.includes("টাকা") || text.includes("withdraw")) reply = "১০০০ কয়েন হলে উইথড্র পেজ থেকে বিকাশ বা নগদে রিকোয়েস্ট দিতে পারবেন।";
        if (text.includes("রেফার") || text.includes("refer")) reply = "রেফার পেজ থেকে আপনার কোড শেয়ার করলে প্রতি রেফারে ৫০ কয়েন বোনাস পাবেন।";
        if (text.includes("লিডারবোর্ড") || text.includes("leaderboard")) reply = "লিডারবোর্ডে আপনি টপ ১০ ইনকামকারীর তালিকা দেখতে পাবেন।";
        if (text.includes("hi") || text.includes("হ্যালো")) reply = "হ্যালো! EarnPro তে আপনাকে স্বাগতম। আমি কীভাবে সাহায্য করতে পারি?";

        setTimeout(() => {
            chatContent.innerHTML += `<div style="background: #eee; padding: 8px 12px; border-radius: 12px; margin-bottom: 10px; align-self: flex-start; max-width: 80%;">${reply}</div>`;
            chatContent.scrollTop = chatContent.scrollHeight;
        }, 800);
    };
}

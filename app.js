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
            checkLimit(data.lastCheckIn, 'checkInBtn', 24*60*60*1000, "Daily Check-in (+10)");
            checkLimit(data.lastAdWatch, 'watchAdBtn', 1*60*60*1000, "Watch Ad & Earn (+5)");
        }
    } else { window.location.href = "login.html"; }
});

// Lucky Spin Logic
document.getElementById('spinBtn').onclick = () => {
    const wheel = document.getElementById('wheel-container');
    const btn = document.getElementById('spinBtn');
    btn.disabled = true;
    const deg = Math.floor(Math.random() * 360) + 1800; 
    wheel.style.transform = `rotate(${deg}deg)`;

    setTimeout(() => {
        if(confirm("অভিনন্দন! আপনি বোনাস জিতেছেন। ৫ কয়েন পেতে বিজ্ঞাপনটি দেখুন।")) {
            window.open(AD_LINK, '_blank');
            addCoins(5, 'lastAdWatch'); 
        }
        btn.disabled = false;
        wheel.style.transform = `rotate(0deg)`;
    }, 3500);
};

// Chatbot Logic
const chatIcon = document.getElementById('chat-icon');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const sendChat = document.getElementById('send-chat');
const chatInput = document.getElementById('chat-input');
const chatContent = document.getElementById('chat-content');

chatIcon.onclick = () => chatWindow.style.display = 'flex';
closeChat.onclick = () => chatWindow.style.display = 'none';

function getBotReply(msg) {
    msg = msg.toLowerCase();
    if (msg.includes("টাকা") || msg.includes("withdraw")) return "আপনি ১০০০ কয়েন হলে বিকাশ বা নগদে টাকা তুলতে পারবেন।";
    if (msg.includes("কয়েন") || msg.includes("coin")) return "চেক-ইন করলে ১০ কয়েন এবং অ্যাড দেখলে ৫ কয়েন পাওয়া যায়।";
    if (msg.includes("স্পিন") || msg.includes("spin")) return "স্পিন করে আপনি বাড়তি বোনাস কয়েন আয় করতে পারেন।";
    return "দুঃখিত, আমি এটি বুঝতে পারছি না। দয়া করে ইনকাম বা উইথড্র নিয়ে প্রশ্ন করুন।";
}

sendChat.onclick = () => {
    const text = chatInput.value.trim();
    if (!text) return;
    chatContent.innerHTML += `<div style="background: #764ba2; color: white; padding: 8px 12px; border-radius: 12px; margin-bottom: 10px; align-self: flex-end; max-width: 80%;">${text}</div>`;
    chatInput.value = "";
    setTimeout(() => {
        const reply = getBotReply(text);
        chatContent.innerHTML += `<div style="background: #eee; padding: 8px 12px; border-radius: 12px; margin-bottom: 10px; align-self: flex-start; max-width: 80%;">${reply}</div>`;
        chatContent.scrollTop = chatContent.scrollHeight;
    }, 800);
};

// Coin Update Function
async function addCoins(amount, field) {
    const user = auth.currentUser;
    if (!user) return;
    try {
        await updateDoc(doc(db, "users", user.uid), { coins: increment(amount), [field]: serverTimestamp() });
        alert(`সফল হয়েছে! ${amount} কয়েন যোগ করা হলো।`);
        location.reload();
    } catch (e) { alert("Error updating coins."); }
}

document.getElementById('checkInBtn').onclick = () => addCoins(10, 'lastCheckIn');
document.getElementById('watchAdBtn').onclick = () => {
    window.open(AD_LINK, '_blank');
    setTimeout(() => addCoins(5, 'lastAdWatch'), 3000);
};

function checkLimit(last, id, ms, txt) {
    const btn = document.getElementById(id);
    if (!last || !btn) return;
    const update = () => {
        const diff = ms - (new Date().getTime() - last.toDate().getTime());
        if (diff > 0) {
            btn.disabled = true;
            const h = Math.floor(diff/3600000), m = Math.floor((diff%3600000)/60000), s = Math.floor((diff%60000)/1000);
            btn.innerText = `অপেক্ষা করুন: ${h}h ${m}m ${s}s`;
            setTimeout(update, 1000);
        } else { btn.disabled = false; btn.innerText = txt; }
    };
    update();
}

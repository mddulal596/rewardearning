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

// Lucky Spin
document.getElementById('spinBtn').onclick = () => {
    const wheel = document.getElementById('wheel-container');
    const btn = document.getElementById('spinBtn');
    btn.disabled = true;
    const deg = Math.floor(Math.random() * 360) + 1800; 
    wheel.style.transform = `rotate(${deg}deg)`;
    setTimeout(() => {
        if(confirm("অভিনন্দন! ৫ কয়েন বোনাস পেতে বিজ্ঞাপনটি দেখুন।")) {
            window.open(AD_LINK, '_blank');
            addCoins(5, 'lastAdWatch'); 
        }
        btn.disabled = false;
        wheel.style.transform = `rotate(0deg)`;
    }, 3500);
};

// --- উন্নত চ্যাটবট লজিক ---
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
    // অভিবাদন
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("সালাম") || msg.includes("হ্যালো")) 
        return "সালাম! আমি EarnPro AI। আপনার দিনটি শুভ হোক। আমি আপনাকে কীভাবে সাহায্য করতে পারি?";
    
    // পেমেন্ট/টাকা
    if (msg.includes("টাকা") || msg.includes("withdraw") || msg.includes("উইথড্র") || msg.includes("পেমেন্ট")) 
        return "আপনি ১০০০ কয়েন জমালে বিকাশ বা নগদে টাকা তুলতে পারবেন। উইথড্র পেজ থেকে রিকোয়েস্ট দিন।";
    
    // বিকাশ/নগদ
    if (msg.includes("বিকাশ") || msg.includes("নগদ") || msg.includes("bkash") || msg.includes("nagad")) 
        return "হ্যাঁ, আমরা বিকাশ এবং নগদে পেমেন্ট করি। আপনার নম্বর সঠিক দিয়ে রিকোয়েস্ট করবেন।";
    
    // কয়েন/ইনকাম
    if (msg.includes("কয়েন") || msg.includes("coin") || msg.includes("আয়") || msg.includes("ইনকাম")) 
        return "ডেইলি চেক-ইন থেকে ১০ কয়েন এবং অ্যাড দেখলে ৫ কয়েন পাবেন। এছাড়া স্পিন তো আছেই!";
    
    // স্পিন
    if (msg.includes("স্পিন") || msg.includes("spin")) 
        return "লাকি স্পিন খেলে আপনি প্রতিবার বোনাস কয়েন জেতার সুযোগ পাবেন।";

    return "দুঃখিত, আমি আপনার কথাটি ঠিক বুঝতে পারিনি। দয়া করে ইনকাম বা টাকা তোলা নিয়ে প্রশ্ন করুন।";
}

sendChat.onclick = () => {
    const text = chatInput.value.trim();
    if (!text) return;
    chatContent.innerHTML += `<div style="background: var(--primary); color: white; padding: 8px 12px; border-radius: 12px; margin-bottom: 10px; align-self: flex-end; max-width: 80%;">${text}</div>`;
    chatInput.value = "";
    setTimeout(() => {
        const reply = getBotReply(text);
        chatContent.innerHTML += `<div style="background: #eee; padding: 8px 12px; border-radius: 12px; margin-bottom: 10px; align-self: flex-start; max-width: 80%;">${reply}</div>`;
        chatContent.scrollTop = chatContent.scrollHeight;
    }, 800);
};

// Coin Functions
async function addCoins(amount, field) {
    const user = auth.currentUser;
    if (!user) return;
    try {
        await updateDoc(doc(db, "users", user.uid), { coins: increment(amount), [field]: serverTimestamp() });
        alert(`অভিনন্দন! ${amount} কয়েন যোগ হয়েছে।`);
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
            btn.innerText = `অপেক্ষা: ${h}h ${m}m ${s}s`;
            setTimeout(update, 1000);
        } else { btn.disabled = false; btn.innerText = txt; }
    };
    update();
}

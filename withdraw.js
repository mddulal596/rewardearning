<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Withdraw - EarnCash</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="card balance-card">
        <h3>Available Balance</h3>
        <h2 id="currentBalance">Loading...</h2>
    </div>

    <div class="card">
        <h4>Withdraw Request</h4>
        <form id="withdrawForm">
            <input type="text" id="name" placeholder="Your Name" required class="input-field">
            <select id="method" class="input-field">
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
            </select>
            <input type="number" id="number" placeholder="Account Number" required class="input-field">
            <input type="number" id="amount" placeholder="Minimum 500 Coins" min="500" required class="input-field">
            <button type="submit" class="btn-main">Submit Request</button>
        </form>
    </div>

    <div class="card">
        <h4>Withdraw History</h4>
        <div id="historyList">No history found.</div>
    </div>

    <nav class="bottom-nav">
        <a href="index.html" class="nav-item"><i class="fa fa-home"></i>Home</a>
        <a href="withdraw.html" class="nav-item active"><i class="fa fa-wallet"></i>Withdraw</a>
    </nav>

    <script type="module">
        import { db, auth } from './firebase.js';
        import { collection, addDoc, doc, getDoc, updateDoc, increment, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

        // উইথড্র সাবমিট করার লজিক
        document.getElementById('withdrawForm').onsubmit = async (e) => {
            e.preventDefault();
            const user = auth.currentUser;
            const amount = parseInt(document.getElementById('amount').value);
            
            // ইউজারের বর্তমান ব্যালেন্স চেক করা
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.data().coins < amount) {
                alert("আপনার পর্যাপ্ত কয়েন নেই!");
                return;
            }

            // রিকোয়েস্ট ডাটাবেসে সেভ করা
            await addDoc(collection(db, "withdrawals"), {
                uid: user.uid,
                name: document.getElementById('name').value,
                method: document.getElementById('method').value,
                number: document.getElementById('number').value,
                amount: amount,
                status: "Pending",
                timestamp: Date.now()
            });

            // ব্যালেন্স থেকে কয়েন কেটে নেওয়া
            await updateDoc(userRef, {
                coins: increment(-amount)
            });

            alert("রিকোয়েস্ট পাঠানো হয়েছে!");
            location.reload();
        };
    </script>
</body>
</html>

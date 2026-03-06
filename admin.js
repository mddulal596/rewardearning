<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="style.css">
    <style>
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 10px; border: 1px solid #ddd; text-align: left; background: white;}
        .status-pending { color: orange; font-weight: bold; }
        .btn-approve { background: green; color: white; border: none; padding: 5px 10px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="card">
        <h2>Admin Panel - Withdraw Requests</h2>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Method</th>
                    <th>Number</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody id="adminList">
                </tbody>
        </table>
    </div>

    <script type="module">
        import { db } from './firebase.js';
        import { collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

        async function loadRequests() {
            const querySnapshot = await getDocs(collection(db, "withdrawals"));
            const list = document.getElementById('adminList');
            list.innerHTML = "";

            querySnapshot.forEach((documentData) => {
                const data = documentData.data();
                const row = `
                    <tr>
                        <td>${data.name}</td>
                        <td>${data.method}</td>
                        <td>${data.number}</td>
                        <td>${data.amount}</td>
                        <td class="status-pending">${data.status}</td>
                        <td>
                            ${data.status === 'Pending' ? `<button class="btn-approve" onclick="approveRequest('${documentData.id}')">Approve</button>` : 'Done'}
                        </td>
                    </tr>
                `;
                list.innerHTML += row;
            });
        }

        window.approveRequest = async (id) => {
            const reqRef = doc(db, "withdrawals", id);
            await updateDoc(reqRef, { status: "Approved" });
            alert("পেমেন্ট অ্যাপ্রুভ করা হয়েছে!");
            loadRequests();
        };

        loadRequests();
    </script>
</body>
</html>

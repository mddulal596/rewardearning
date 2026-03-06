db.ref("withdraw").on("value", snap=>{
    let data=snap.val();
    let html="";
    for(let id in data){
        let w=data[id];
        html+=`
        <div>
            User: ${w.uid} <br>
            Amount: ${w.amount} <br>
            Number: ${w.number} <br>
            Status: ${w.status} <br>
            <button onclick="approve('${id}')">Approve</button>
            <button onclick="reject('${id}')">Reject</button>
        </div>
        <hr>`;
    }
    document.getElementById("list").innerHTML = html;
});
function approve(id){ db.ref("withdraw/"+id+"/status").set("approved"); }
function reject(id){ db.ref("withdraw/"+id+"/status").set("rejected"); }

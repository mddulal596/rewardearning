function withdraw(){
    let user=auth.currentUser;
    let amount=document.getElementById("amount").value;
    let number=document.getElementById("number").value;
    let id=Date.now();
    db.ref("withdraw/"+id).set({
        uid:user.uid,
        amount:amount,
        number:number,
        status:"pending",
        time:Date.now()
    });
    alert("Withdraw request sent");
}

auth.onAuthStateChanged(user=>{
    if(user){
        db.ref("users/"+user.uid+"/balance").on("value",snap=>{
            document.getElementById("balance").innerText = snap.val();
        });
    }
});

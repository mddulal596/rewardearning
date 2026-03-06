auth.onAuthStateChanged(user=>{
    if(user){
        let link = location.origin+"?ref="+user.uid;
        document.getElementById("reflink").innerText = link;
    }
});

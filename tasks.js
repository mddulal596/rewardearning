function watchAd(){
    let user = auth.currentUser;
    setTimeout(()=>{
        db.ref("users/"+user.uid+"/balance").transaction(b=>{return (b||0)+5});
        alert("5 coins added");
    },15000);
}

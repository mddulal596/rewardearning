function spin(){
    let rewards=[2,5,10,20];
    let reward=rewards[Math.floor(Math.random()*rewards.length)];
    let user=auth.currentUser;
    db.ref("users/"+user.uid+"/balance").transaction(b=>{return (b||0)+reward});
    alert("You won "+reward+" coins");
}

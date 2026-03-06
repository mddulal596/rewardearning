function signup(){
    let email=document.getElementById("email").value;
    let pass=document.getElementById("pass").value;
    auth.createUserWithEmailAndPassword(email,pass).then(res=>{
        db.ref("users/"+res.user.uid).set({
            balance:0,
            totalEarn:0,
            lastDaily:"",
            referCount:0
        });
        alert("Account Created");
    });
}
function login(){
    let email=document.getElementById("email").value;
    let pass=document.getElementById("pass").value;
    auth.signInWithEmailAndPassword(email,pass).then(()=>{
        window.location="dashboard.html";
    });
}

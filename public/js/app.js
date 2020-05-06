
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDWr3Q0AhdiXzO4E_R1MMRLLdhCp56fAlg",
    authDomain: "lcb-event-app.firebaseapp.com",
    databaseURL: "https://lcb-event-app.firebaseio.com",
    projectId: "lcb-event-app",
    storageBucket: "lcb-event-app.appspot.com",
    messagingSenderId: "459243035928",
    appId: "1:459243035928:web:c599a24b030ac7453a926d"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var db = firebase.firestore();


  //getting all the elements
  const circle = document.querySelector('.dot');
  const guest = document.querySelector('.guest');
  const logout = document.querySelector('.logout');
  const signup = document.querySelector('.signup');
  const login = document.querySelector('.login');
  const txtEmail = document.getElementById('inputEmail');
  const txtPass = document.getElementById('inputPassword');
  const form = document.querySelector('.user-form');
  const attend = document.querySelector('.attend');
  const count = document.querySelector('.count');
  const note = document.querySelector('.note');
  const sendBtn = document.querySelector('.send');
  const btnYes = document.querySelector('.btnYes');
  const btnNo = document.querySelector('.btnNo');
  const fillupForm = document.querySelector('.fillup-form');
  const modal = document.querySelector('.modal');
  const fade = document.querySelector('.fade');
  const modalMessage = document.querySelector('.modal-body');
  const modalTitle = document.querySelector('.modal-title');
  let d = new Date();

  //login user
  login.addEventListener('click', (e)=>{
    let email = txtEmail.value;
    let pass = txtPass.value;

    const auth = firebase.auth();

    auth.signInWithEmailAndPassword(email, pass).catch(function(error) {
          modalDisplay(['Login failed \u{1F631}',error.message]);
      });
      // modalDisplay(['Login successfully \u{1F604}','Now you can join the event']);
  });

  //modal display message
  function modalDisplay(msg) { 
    modalTitle.textContent = msg[0]; 
    modalMessage.textContent = msg[1];
    modal.style.display = 'block';       
    modal.classList.add('fadeStart');
  }

  function closeModal(){
    modal.style.display = 'none';       
    modal.classList.remove('fadeStart');
  }

  //signup user
  signup.addEventListener('click', ()=>{
    let email = txtEmail.value;
    let pass = txtPass.value;
    
    if(pass.toString().length >= 8){
    const auth = firebase.auth();
    auth.createUserWithEmailAndPassword(email,pass).catch((error)=>{
        modalDisplay([error.message, 'Try different account']);
    });
}else{
    alert('password should contain minimum 8 characters');
}
    
  });


  //true for attending the event
  btnYes.addEventListener('click', ()=>{
    fillupForm.style.display = 'block';
    db.collection('attendees').doc(firebase.auth().currentUser.uid).set({
      attending: true
    })
    .catch(function(error){
      console.error("Error adding document: ", error);
    });
  });



  //false for attending the event
  btnNo.addEventListener('click', ()=>{
    fillupForm.style.display = 'none';
    db.collection('attendees').doc(firebase.auth().currentUser.uid).set({
      attending: false
    })
    .catch(function(error){
      console.error("Error adding document: ", error);
    });
  });


  //attending counts
  db.collection('attendees').where('attending','==', true).onSnapshot( snap => {
    const attendCount = snap.docs.length;
    count.textContent = attendCount;
  });  

  //send the user message to the firestore database
  sendBtn.addEventListener('click', (e) => {
    //prevent redirect 
    e.preventDefault();
    //add the message
      db.collection('guestbook').add({
      name: fillupForm['fullname'].value,
      phone: fillupForm['phone'].value,
      college: fillupForm['college'].value,
      text: fillupForm['msg'].value,
      timestamp: Date.now(),
      userId: firebase.auth().currentUser.uid
    })
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
    //clear the inputs fields
    fillupForm.style.display = 'none';
    btnNo.disabled = 'true';
    btnYes.disabled = 'true';
    return false;
  })

  //logout user
  logout.addEventListener('click', (e) => {
        firebase.auth().signOut();
  });

  function afterLogout(){
    guest.textContent = 'Guest';
    logout.style.display = 'none';
    attend.style.display = 'none';
    form.style.display = 'block';
    note.style.display = 'block';
    fillupForm.style.display = 'none';
    circle.style.backgroundColor = 'rgb(255, 70, 70)';
  }

  function beforeLogout(){
    circle.style.backgroundColor = '#2fff24';
    form.style.display = 'none';
    logout.style.display = 'block';
    form.style.display = 'none';
    note.style.display = 'none';
    fillupForm.style.display = 'none';
    attend.style.display = 'flex';
  }


  //authentication state observer
  firebase.auth().onAuthStateChanged((user) =>{
      if(user){
        guest.textContent = `${user.email}`;
        beforeLogout();
        console.log('logged in');
      }else{
    afterLogout();
        console.log('logged out');
      }
  })


  

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
var storage = firebase.storage();
var rdb = firebase.database();
  

  //getting all the elements
  const body = document.querySelector("body");
  const circle = document.querySelector('.dot');
  const guest = document.querySelector('.guest');
  const register = document.querySelector('.register');
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
  //getting all the event elements
  const eventPara = document.querySelector('.event-para');
  const eventDate = document.querySelector('.event-date');
  const eventTime = document.querySelector('.event-time');
  const eventVenue = document.querySelector('.event-venue');
  const eventPhone = document.querySelector('.event-phone');
  const eventImg = document.querySelector('.img-css');
  const aboutImg = document.querySelector('.about-img');
  //attendee fields
  const atd = document.querySelector('.atd');
  const atdName = document.querySelector('.atd-name');
  const atdClg = document.querySelector('.atd-college');
  const atdPhn = document.querySelector('.atd-phone');
  const atdMsg = document.querySelector('.atd-message');
  let d = new Date();
  

  //admin Realtime Database & Storage
var storageRef = storage.ref()
var eventImgRef = storageRef.child('images/pexels-photo-325944.jpeg');
  var aboutImgRef = storageRef.child('images/classroom.png');
  eventImgRef.getDownloadURL().then((url) => {
  eventImg.setAttribute('src', url)
  loading.style.display = 'none';
}).catch((error) => {
  console.log(error);
});
aboutImgRef.getDownloadURL().then((url) => {
  aboutImg.style.background = `url(${url})`;
  loading.style.display = 'none';
}).catch((error) => {
  console.log(error);
});

  var dbRefObject = rdb.ref().child('event');
  dbRefObject.once('value', (snapshot) => {
    const event = JSON.stringify(snapshot.val(), null, 3);
    const eventData = JSON.parse(event);
    eventPara.innerText = eventData.para;
    eventDate.innerHTML = `<b>Date: </b>` + eventData.date;
    eventTime.innerHTML = `<b>Time: </b>` + eventData.time;
    eventVenue.innerHTML = `<b>Venue: </b>` + eventData.venue;
    eventPhone.innerHTML = `<b>Phone: </b>` + eventData.phone;
   });


  //event attendee data
  function attendeeData(){
    db.collection("guestbook").doc(firebase.auth().currentUser.uid)
    .onSnapshot((doc) => {
      //conditions to show the ticket details
      var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        let objectToJSON = JSON.stringify(doc.data(), null, 2);           
        let atdData = JSON.parse(objectToJSON);
        atdName.textContent = `${atdData.name}`;
        atdClg.textContent = `${atdData.college}`;
        atdPhn.textContent = `${atdData.phone}`;
        atd.style.display = 'block';
        if(atdData.text == undefined){
          atdMsg.textContent = `${atdData.text}`;
        }else{
          atdMsg.textContent = 'No Message';
        }   
    });
  }



  //modal display message
  function modalDisplay(msg) {
    alert(msg[1]);
  }



  //login user
  login.addEventListener('click', (e) => {
    let email = txtEmail.value;
    let pass = txtPass.value;
    const auth = firebase.auth();
    auth.signInWithEmailAndPassword(email, pass).catch(function (error) {
      modalDisplay(['Login failed \u{1F631}', error.message]);
    });
  });



  //signup user
  signup.addEventListener('click', () => {
    let email = txtEmail.value;
    let pass = txtPass.value;
    if (pass.toString().length >= 8) {
      const auth = firebase.auth();
      auth.createUserWithEmailAndPassword(email, pass).catch((error) => {
        modalDisplay([error.message, 'Try different account']);
      });
    } else {
      alert('password should contain minimum 8 characters');
    }
  });


  //true for attending the event
  btnYes.addEventListener('click', () => {
    fillupForm.style.display = 'block';
    db.collection('attendees').doc(firebase.auth().currentUser.uid).set({
      attending: true
    })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  });



  //false for attending the event
  btnNo.addEventListener('click', () => {
    fillupForm.style.display = 'none';
    db.collection('attendees').doc(firebase.auth().currentUser.uid).set({
      attending: false
    })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
      db.collection("guestbook").doc(firebase.auth().currentUser.uid).delete().then(() => {
        console.log("Document successfully deleted!");
        location.reload();
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
  });


  //attending counts
  db.collection('attendees').where('attending', '==', true).onSnapshot(snap => {
    const attendCount = snap.docs.length;
    count.textContent = attendCount;
  });

  //send the user message to the firestore database
  sendBtn.addEventListener('click', (e) => {
    //prevent redirect 
    e.preventDefault();
    //add the message
    db.collection('guestbook').doc(firebase.auth().currentUser.uid).set({
      name: fillupForm['fullname'].value,
      phone: fillupForm['phone'].value,
      college: fillupForm['college'].value,
      text: fillupForm['msg'].value,
      timestamp: Date.now(),
      userId: firebase.auth().currentUser.uid
    })

      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });

    //clear the inputs fields
    fillupForm.style.display = 'none';
    btnNo.disabled = 'false';
    btnYes.disabled = 'true';
    alert('You have successfully attended the event.');
    location.reload();
    return false;
  })

  //logout user
  logout.addEventListener('click', (e) => {
    firebase.auth().signOut();
  });

  function afterLogout() {
    guest.textContent = '';
    logout.style.display = 'none';
    attend.style.display = 'none';
    register.style.display = 'block';
    form.style.display = 'block';
    note.style.display = 'block';
    fillupForm.style.display = 'none';
    // circle.style.backgroundColor = 'rgb(255, 70, 70)';
  }

  function beforeLogout() {
    // circle.style.backgroundColor = '#2fff24';
    form.style.display = 'none';
    register.style.display = 'none';
    logout.style.display = 'block';
    form.style.display = 'none';
    note.style.display = 'none';
    fillupForm.style.display = 'none';
    attend.style.display = 'flex';
  }


  //authentication state observer
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      guest.textContent = `${user.email}`;
      attendeeData();
      beforeLogout();
      console.log('logged in');
    } else {
      afterLogout();
      console.log('logged out');
    }
  })
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

  const submitBtn = document.querySelector('#submitBtn');
  const forms = document.querySelector('form');

  forms.addEventListener('submit', function(e){
    e.preventDefault();
    db.collection("contact").add({
      guestEmail: forms[0].value,
      guestMessage: forms[1].value 
    }).then(function(docRef){
      console.log("Document written with ID: ", docRef.id, docRef);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  })


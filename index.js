// Import the functions you need from the SDKs you need
import 'boxicons'

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';


import { getDatabase, ref, push, set, get, remove} from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'; // Adjusted import

import { gsap } from "gsap";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdG2nO6ZDtzGfpZD9SiI7LNiLALkKqxhA",
  authDomain: "hahadotcom-8143.firebaseapp.com",
  databaseURL: "https://hahadotcom-8143-default-rtdb.firebaseio.com",
  projectId: "hahadotcom-8143",
//   storageBucket: "hahadotcom-8143.appspot.com",
  storageBucket:"gs://hahadotcom-8143.appspot.com",
  messagingSenderId: "415336461369",
  appId: "1:415336461369:web:a0e33b4da959b9fcf5c9e8",
  measurementId: "G-3ZNLCE0LWJ"
};


// uncomment tomorrow ==============================

if(sessionStorage.getItem("loadedOnce")){
  document.querySelector(".animation").classList.add('hidden')
  document.querySelector("#logoimg").classList.add('logo-small')
  document.querySelector("#logoimg").classList.remove('logo')
}


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getDatabase(app); // Use getDatabase to get a reference to the Realtime Database
const storage = getStorage(app); // Use getStorage to get a reference to Firebase Storage


// uncomment when back online=======================================

const postRef = ref(db, 'posts/'); // Use ref to get a reference to a location in the database

// Fetch data from the database
// get(postRef).then((snapshot) => {
  
//   get(postRef).then((snapshot) => {
//     if (snapshot.exists()) {
//       snapshot.forEach((childSnapshot) => {
//         const postData = {
//           key: childSnapshot.key,
//           image: childSnapshot.child("/image").val(),
//           username: childSnapshot.child("/username").val(),
//           caption: childSnapshot.child("/caption").val(),
              
//           // Add other properties as needed
//         };
//         // Call your displayPostData function here
//          displayPostData(postData);
//       });
//     } else {
//       console.log("No data available");
//     }
//   });
// }).catch((error) => {
//   console.error("Error fetching data:", error);
// });

// Fetch data from the database
get(postRef).then((snapshot) => {
  if (snapshot.exists()) {
    // Convert snapshot to an array
    const postsArray = [];
    snapshot.forEach((childSnapshot) => {
      const postData = {
        key: childSnapshot.key,
        image: childSnapshot.child("/image").val(),
        username: childSnapshot.child("/username").val(),
        caption: childSnapshot.child("/caption").val(),
      };
      postsArray.push(postData);
    });

    // Reverse the array
    const reversedPostsArray = postsArray.reverse();

    // Iterate over the reversed array
    reversedPostsArray.forEach((postData) => {
      displayPostData(postData);
    });
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error("Error fetching data:", error);
});

document.querySelector('.v-close-btn').addEventListener('click', (event) => toggleComments(event))

function toggleComments(event){
  event.preventDefault();

  const id = event.currentTarget.dataset.postId;

  // const alert = document.querySelector(".alert")
  document.querySelector(".v-com-pop").classList.toggle("active")
  if (document.querySelector(".v-com-pop").classList.contains("active")) {
     displayComments(id);
  }
  else{
    clearComments();
  }
  // alert.textContent = "";
}











  //form


  
 

  
 
  











    
 

  

 
  





  //image preview code

  const File = document.getElementById('image');
const imagePreview = document.getElementById('imagePreview');

// Add an event listener to the file input
File.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    // Read the selected file as a data URL and set it as the img src
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    // Clear the img src if no file is selected
    imagePreview.src = 'add-pic.png';
  }
});


//SESSIONNNNNNNN
if (sessionStorage.getItem("adminLoggedIn")) {
  // If it exists, do something
  document.getElementById("loginButton").classList.add('hidden')
  document.getElementById("logoutButton").classList.remove('hidden')

} else {
  // If it doesn't exist, do something else
  console.log("No login data found in sessionStorage.");
}


//DELEETEEEE


function Deletepic(imageURL) {

        // Create a reference to the image in Firebase Storage
        const imageRefToDelete = storageRef(storage, imageURL);

         deleteObject(imageRefToDelete)
          .then(() => {
            console.log('Image deleted successfully');
          })
          .catch((error) => {
            console.error('Error deleting image:', error);
          });
}


function DeletePost(event) {
  const folderToDelete = event.currentTarget.dataset.postId;

  const postRefToDelete = ref(db, 'posts/' + folderToDelete);
  const repRefToDelete = ref(db, 'replies/' + folderToDelete);
  let url;

  // Create an array to store promises
  const deletePromises = [];

  get(postRefToDelete)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const postData = snapshot.val();
        url = postData.image;

        // Call Deletepic function here, inside the then block
        deletePromises.push(Deletepic(url));
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });

  // Add the promises to delete the post and replies
  deletePromises.push(remove(postRefToDelete));
  deletePromises.push(remove(repRefToDelete));

  // Wait for all promises to complete
  Promise.all(deletePromises)
    .then(() => {
      console.log('Post and replies deleted successfully');

      // Reload the page only after all operations are done
      location.reload();
    })
    .catch((error) => {
      console.error('Error deleting post and replies:', error);
    });
}








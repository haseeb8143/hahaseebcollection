// Import the functions you need from the SDKs you need
import 'boxicons'

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';


import { getDatabase, ref, push, set, get, remove } from 'firebase/database';
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getDatabase(app); // Use getDatabase to get a reference to the Realtime Database
const storage = getStorage(app); // Use getStorage to get a reference to Firebase Storage


const postRef = ref(db, 'posts/'); // Use ref to get a reference to a location in the database

// Fetch data from the database
get(postRef).then((snapshot) => {
  
  get(postRef).then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const postData = {
          key: childSnapshot.key,
          image: childSnapshot.child("/image").val(),
          username: childSnapshot.child("/username").val(),
          caption: childSnapshot.child("/caption").val(),
              
          // Add other properties as needed
        };
        // Call your displayPostData function here
         displayPostData(postData);
      });
    } else {
      console.log("No data available");
    }
  });
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


function displayComments(id) {
  // const commentsArray = [];
  const postRef = ref(db, 'replies/' + id); // Use ref to get a reference to a location in the database

  // Fetch data from the database
  get(postRef).then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const commentKey = childSnapshot.key;
        const commentData = {
          username: childSnapshot.child("username").val(),
          comment: childSnapshot.child("comment").val(),
        };
        // console.log(`Comment key: ${commentKey}`);
                // commentsArray.push(commentData)
                commentsBox(commentData);
        // Call your displayPostData function here
        // displayPostData(commentData);
      });
    } else {
      // No comments available for this ID
      console.log("No comments available for ID: " + id);
    }
  }).catch((error) => {
    console.error("Error fetching comments:", error);
  });

}


function commentsBox(postData){

    const comContainer = document.querySelector('.commentsbox');
      const comdiv = document.createElement('div');
      comdiv.classList.add('comment-div')
      const username = document.createElement('div');
      username.classList.add('username-comment')
      username.textContent = '@' + postData.username;
      const comment = document.createElement('div');
      comment.classList.add('comment-comment')
      comment.textContent = postData.comment;
  
      comdiv.appendChild(username);
      comdiv.appendChild(comment);

      comContainer.appendChild(comdiv)

    
 

}

function clearComments() {
  const comContainer = document.querySelector('.commentsbox'); // Replace with your actual class or ID

  while (comContainer.firstChild) {
    comContainer.removeChild(comContainer.firstChild);
  }
}


function displayPostData(postData) {
    // console.log(postData.caption)
    const postContainer = document.querySelector('.posts'); // Assuming you have a container element in your HTML

    const postboox = document.createElement('div')
    postboox.classList.add('post')

    if (sessionStorage.getItem("adminLoggedIn")) {
      const delbtn = document.createElement("button")
      delbtn.textContent = "X"
      delbtn.classList.add("del-btn")
      delbtn.dataset.postId = postData.key
      delbtn.addEventListener('click', (event) => DeletePost(event));
      postboox.appendChild(delbtn);
    }
  
    const postimg = document.createElement('div');
    postimg.classList.add("image");

// Create the img element
    const imageElement = document.createElement('img');
    imageElement.src = postData.image; // Set the image source URL
    imageElement.alt = "Image Alt Text"; // Set alt text for accessibility
    imageElement.classList.add("post-img")

// Append the img element to the postimg div
    postimg.appendChild(imageElement);
    // postTitle.textContent = postData.title;

    const postText = document.createElement('div');
    postText.classList.add('t-content')

    const postuser = document.createElement('div');

    postuser.classList.add("username")
    const username = document.createElement('p');
    username.textContent = "@" + postData.username

    const commDiv = document.createElement('div')
    commDiv.classList.add('comm-div')
    //view comments
    const viewComm = document.createElement('button');
    viewComm.dataset.postId = postData.key
    viewComm.classList.add("view-comm")
    viewComm.id = postData.key
    viewComm.textContent = "comments"
    viewComm.addEventListener('click', (event) => toggleComments(event));
    //addcoemmnts
    const addCom = document.createElement('button');
    addCom.dataset.postId = postData.key
    addCom.classList.add("add-comm")
    addCom.textContent = "+"
    addCom.addEventListener('click', (event) => toggleComPopup(event));

    commDiv.appendChild(addCom)
    commDiv.appendChild(viewComm)


    postuser.appendChild(username)
    postuser.appendChild(commDiv)

    const postcap = document.createElement('div');
    postcap.classList.add("caption")
    const caption = document.createElement('p');
    caption.textContent = postData.caption
    postcap.appendChild(caption)


    postText.appendChild(postuser)
    postText.appendChild(postcap)

    

  
    // Append the elements to the container
    
    postboox.appendChild(postimg);
    postboox.appendChild(postText);


    postContainer.appendChild(postboox);

    if (!sessionStorage.getItem("loadedOnce")){
      gsap.to('.logo', {y: "-35%",  delay:0.5, duration: 0.5, scale: 0.3});
      gsap.to('.animation', { y: '-100rem', duration: 2,delay: 1 })
      sessionStorage.setItem("loadedOnce", "true")
    }
    else{
      document.getElementById("logoimg").classList.remove("logo")
      document.getElementById("logoimg").classList.add("logo-small")
      document.querySelector(".animation").classList.add("hidden")


    }

  }




  //form


  //add post form
  const postForm = document.getElementById('postForm');
  const imageFile = document.getElementById('image');
  const username = document.getElementById('user');
  const caption = document.getElementById('caption');
  const alert = document.querySelector(".alert")
  const imagetoclear = document.getElementById('imagePreview');

  postForm.addEventListener('submit', (e) => {

    alert.textContent = ""

    e.preventDefault();

    // Check if the imageFile input is empty
    if (imageFile.value.trim() === '') {
    //   alert('Please select an image.');
      alert.textContent = "Please select an image"
      return; // Stop form submission
    }
  
    // Check if the username input is empty
    if (username.value.trim() === '') {
    //   alert('Please enter a username.');
      alert.textContent = "Please select a name"
      return; // Stop form submission
    }
  
    // Check if the caption input is empty
    if (caption.value.trim() === '') {
    //   alert('Please enter a caption.');
      alert.textContent = "Please select a caption"
      return; // Stop form submission
    }
    imagetoclear.src = 'add-pic.png';
    addInfo();

  });




  function addInfo() {
    // Get the file from the input element
    const file = imageFile.files[0];
  
    // Generate a unique key using Firebase's push method
    const newPostRef = push(ref(db, 'posts'));
  
    // Upload the image to Firebase Storage (without a specific "images" folder)
    const postId = newPostRef.key; // Get the unique key as the post ID
  
    const newStorageRef = storageRef(storage, postId); // Define a new storage reference
  
    // Use uploadBytes to upload the file
    uploadBytes(newStorageRef, file)
    .then(async () => {
      // Image uploaded successfully, now get the download URL
      const downloadURL = await getDownloadURL(newStorageRef);

      // Now you can save the download URL to the Realtime Database
      const postData = {
        image: downloadURL, // Store the download URL as the image path
        username: username.value,
        caption: caption.value,
      };
  
      // Set the post data in the Realtime Database under the unique post ID
      set(ref(db, 'posts/' + postId), postData);
  
      // Reset the form or perform other actions as needed
      postForm.reset();
      location.reload()
    }).catch((error) => {
      console.error('Error uploading image:', error);
    });
  };





  //add comment form
  const commForm = document.querySelector('.commForm');
  const usercom = document.getElementById('usernamecom');
  const comment = document.getElementById('comment');
  const alertCom = document.querySelector(".alertCom")

  commForm.addEventListener('submit', (e) => {
    // console.log(commForm.id)

    alert.textContent = ""

    e.preventDefault();
  
    // Check if the username input is empty
    if (usercom.value.trim() === '') {
    //   alert('Please enter a username.');
    // console.log('usr')
      alertCom.textContent = "Please select a name"
      return; // Stop form submission
    }
  
    // Check if the caption input is empty
    if (comment.value.trim() === '') {
    //   alert('Please enter a caption.');


      alertCom.textContent = "Please add a comment"
      return; // Stop form submission
    }

    const postId = commForm.id
    addComment(postId);

  });



  //login form 

  const logForm = document.querySelector('#loginForm');
  const user = document.getElementById('usernamepass');
  const pass = document.getElementById('password');
  const alertpass = document.querySelector('.alertPass')

  logForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const userRef = ref(db, 'user/');

// Fetch data from the database
    get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
      // Retrieve the values
      const LoginData = {
      userpass: snapshot.child("userpass").val(),
      password:  snapshot.child("password").val(),
      }

      loginValidation(LoginData)
      // Now you have the values of userpass and password
    } else {
      console.log("User not found in the database.");
    }
    }).catch((error) => {
      console.error("Error fetching data:", error);
    });
    // console.log(commForm.id)

  });


  function loginValidation(data) {
    alertpass.textContent = ""


  
    // Check if the username input is empty
    if (user.value.trim() === '') {
      alertpass.textContent = "Please enter a name"
      return; // Stop form submission
    }
  
    // Check if the caption input is empty
    if (pass.value.trim() === '') {
    
      alertpass.textContent = "Please provide password"
      return; // Stop form submission
    }

    if (user.value.trim() != data.userpass | pass.value.trim() != data.password) {
      alertpass.textContent = "username or passowrd incorrect"
    }
    else{
      sessionStorage.setItem('adminLoggedIn', 'true')
      postForm.reset();
      location.reload()
    }
  }




  const lgtBtn = document.getElementById("logoutButton")

  lgtBtn.addEventListener('click' , Logout)

  function Logout() {
    sessionStorage.clear();
    document.getElementById("loginButton").classList.remove('hidden')
    document.getElementById("logoutButton").classList.add('hidden')
    location.reload()
  }


  
  function addComment(postId) {
    const newPostRef = push(ref(db, 'replies/' + postId + '/'));

    const repId = newPostRef.key; 

    const postData = {
      username: usercom.value,
      comment: comment.value,
    };

    set(ref(db, 'replies/' + postId + '/' + repId), postData);
    commForm.reset();
    location.reload();

    }
  
  











    
 

  

 
  





  //image preview code

  const File = document.getElementById('image');
const imagePreview = document.getElementById('imagePreview');

// Add an event listener to the file input
File.addEventListener('change', (e) => {
  const file = e.target.files[0];
console.log('img prvw')
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
  console.log("No data found in sessionStorage.");
}


//DELEETEEEE


function Deletepic(imageURL) {

        // Create a reference to the image in Firebase Storage
        const imageRefToDelete = storageRef(storage, imageURL);

        console.log(imageURL)
        // console.log(imageURL)
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
        console.log(url);

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








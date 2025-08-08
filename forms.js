 //add post form
 import 'boxicons'

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';


import { getDatabase, ref, push, set, get, remove} from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'; // Adjusted import

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

   const sanUsername = sanitizeInput(username.value)
 
   // Check if the username input is empty
   if (sanUsername.trim() === '') {
   //   alert('Please enter a username.');
     alert.textContent = "Please select a name"
     return; // Stop form submission
   }

   const regex = /^[a-zA-Z\s]*$/;

 
   if (!regex.test(sanUsername)) {
     alert.textContent = 'only letters in username';
     return;
   } 

   const sanCaption = sanitizeInput(caption.value)
 
   // Check if the caption input is empty
   if (sanCaption.trim() === '') {
   //   alert('Please enter a caption.');
     alert.textContent = "Please select a caption"
     return; // Stop form submission
   }
   imagetoclear.src = 'add-pic.png';
   addInfo(sanUsername, sanCaption);

 });
 


 function addInfo(username, caption) {
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
       username: username,
       caption: caption,
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


   alert.textContent = ""

   e.preventDefault();

   const sanUsercom = sanitizeInput(usercom.value);
 
   // Check if the username input is empty
   if (sanUsercom.trim() === '') {


     alertCom.textContent = "Please add a name"
     return; // Stop form submission
   }

   const regex = /^[a-zA-Z\s]*$/;

 
   if (!regex.test(sanUsercom)) {
     alertCom.textContent = 'only letters in username';
     return;
   } 

   const sanComment = sanitizeInput(comment.value);

 
   // Check if the caption input is empty
   if (sanComment.trim() === '') {



     alertCom.textContent = "Please add a comment"
     return; // Stop form submission
   }

   const postId = commForm.id
   addComment(sanUsercom, sanComment ,postId);

 });

 function addComment(usercom,comment,postId) {
   const newPostRef = push(ref(db, 'replies/' + postId + '/'));

   const repId = newPostRef.key; 

   const postData = {
     username: usercom,
     comment: comment,
   };

   set(ref(db, 'replies/' + postId + '/' + repId), postData);
   commForm.reset();
   location.reload();

   }
 



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
 

 });


 function sanitizeInput(input) {
   // Replace potentially dangerous characters with safe characters
   const sanitizedInput = input
     .replace(/</g, "&lt;")
     .replace(/>/g, "&gt;")
     .replace(/&/g, "&amp;")
     .replace(/"/g, "&quot;")
     .replace(/'/g, "&#039;");
     
   return sanitizedInput;
 }


 function loginValidation(data) {


   alertpass.textContent = ""

   const sanitizedUsername = sanitizeInput(user.value);
   const sanitizedPassword = sanitizeInput(pass.value);

   const regex = /^[a-zA-Z\s]*$/;

 
   if (!regex.test(sanitizedUsername)) {
     alertpass.textContent = 'only letters in username';
     return;
   } 

   // Check if the username input is empty
   if (sanitizedUsername.trim() === '') {
     alertpass.textContent = "Please enter a name"
     return; // Stop form submission
   }
 
   // Check if the caption input is empty
   if (sanitizedPassword.trim() === '') {
   
     alertpass.textContent = "Please provide password"
     return; // Stop form submission
   }

   if (sanitizedUsername.trim() != data.userpass | sanitizedPassword.trim() != data.password) {
     alertpass.textContent = "username or password incorrect"
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

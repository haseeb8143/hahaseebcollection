function displayPostData(postData) {
    // const postRef = ref(db, 'posts/');
    
    
    let replyNum;
    
    // Fetch data from the "replies" node for the current post
    
    if (sessionStorage.getItem("loadedOnce"))
    {
      // document.querySelector(".animation").classList.add('hidden')
      // document.querySelector("#logoimg").classList.add('logo-small')
      // document.querySelector("#logoimg").classList.remove('logo')
      
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
  
       const repliesRef = ref(db, 'replies/' + postData.key);
  
          get(repliesRef)
      .then((snapshot) => {
          // Initialize a variable to count the replies
          let replyCount = 0;
  
          // Iterate through each child node (reply)
          snapshot.forEach((childSnapshot) => {
            // Increment the reply count for each child node
            replyCount++;
          });
  
          const viewComm = document.createElement('button');
          viewComm.dataset.postId = postData.key
          viewComm.classList.add("view-comm")
          viewComm.id = postData.key
          viewComm.textContent = `${replyCount} comments`;
          viewComm.addEventListener('click', (event) => toggleComments(event));
          commDiv.appendChild(viewComm)
  
        })
  
       //addcoemmnts
       const addCom = document.createElement('button');
       addCom.dataset.postId = postData.key
       addCom.classList.add("add-comm")
       addCom.textContent = "+"
       addCom.addEventListener('click', (event) => toggleComPopup(event));
     
       commDiv.appendChild(addCom)
     
     
       postuser.appendChild(username)
       postuser.appendChild(commDiv)
     
       const postcap = document.createElement('div');
       postcap.classList.add("caption")
       const caption = document.createElement('p');
       caption.textContent = postData.caption
       postcap.appendChild(caption)
     
     
       postText.appendChild(postuser)
       postText.appendChild(postcap)
     
       
     
     
       // Append the elements to the containerSS
       
       postboox.appendChild(postimg);
       postboox.appendChild(postText);
     
     
       postContainer.appendChild(postboox);
       
  
       
  
  }
    else{
      
  
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
      const repliesRef = ref(db, 'replies/' + postData.key);
  
          get(repliesRef)
      .then((snapshot) => {
          // Initialize a variable to count the replies
          let replyCount = 0;
  
          // Iterate through each child node (reply)
          snapshot.forEach((childSnapshot) => {
            // Increment the reply count for each child node
            replyCount++;
          });
  
          const viewComm = document.createElement('button');
          viewComm.dataset.postId = postData.key
          viewComm.classList.add("view-comm")
          viewComm.id = postData.key
          viewComm.textContent = `${replyCount} comments`;
          viewComm.addEventListener('click', (event) => toggleComments(event));
          commDiv.appendChild(viewComm)
  
        })
      //addcoemmnts
      const addCom = document.createElement('button');
      addCom.dataset.postId = postData.key
      addCom.classList.add("add-comm")
      addCom.textContent = "+"
      addCom.addEventListener('click', (event) => toggleComPopup(event));
    
      commDiv.appendChild(addCom)
      // commDiv.appendChild(viewComm)4
    
    
      postuser.appendChild(username)
      postuser.appendChild(commDiv)
    
      const postcap = document.createElement('div');
      postcap.classList.add("caption")
      const caption = document.createElement('p');
      caption.textContent = postData.caption
      postcap.appendChild(caption)
    
    
      postText.appendChild(postuser)
      postText.appendChild(postcap)
    
      
    
    
      // Append the elements to the containerSS
      
      postboox.appendChild(postimg);
      postboox.appendChild(postText);
    
    
      postContainer.appendChild(postboox);
    
    
    
      sessionStorage.setItem("loadedOnce", "true")
      gsap.to('.logo', {y: "-35%",  delay:0.5, duration: 0.5, scale: 0.3});
      gsap.to('.animation', { x: '100rem', duration: 1.5,delay: 1 })
  
  
  
      
    }
    
  
      
  
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
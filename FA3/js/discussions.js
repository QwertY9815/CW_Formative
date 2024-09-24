
const randomReplyNumber = Math.round(Math.random()*500000)

const form = document.getElementById('discussionForm')
const openForm = document.getElementById("openForm").addEventListener("click",(e)=>{
  form.classList.remove("hidden")
})
const closeModal = document.getElementById("closeDiscussionForm").addEventListener("click",()=>{
  form.classList.add("hidden")
})

const questions = document.getElementsByClassName("question");
const firebaseConfig = {
    apiKey: "AIzaSyAfddpGtxMI6GuE5evR76juqJwO37Atelk",
    authDomain: "cwd412-daa02.firebaseapp.com",
    projectId: "cwd412-daa02",
    storageBucket: "cwd412-daa02.appspot.com",
    messagingSenderId: "1013401114329",
    appId: "1:1013401114329:web:1ea03b07e985ad71f090c8"
  };

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const question = document.getElementById('question').value;
    const type = document.getElementById('type').value;

    db.collection('posts').add({
        id: randomReplyNumber,
        type: type,
        question: question,
        replies :[],
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        form.classList.add("hidden")
        setTimeout(()=>{
                location.reload()
              },1000)
    }).catch(error => {
        console.error("Error adding document: ", error);
    });

});

function loadPosts() {
            db.collection('posts').orderBy('timestamp', 'desc').get().then(querySnapshot => {
                const discussionDiv = document.getElementById('discussions');
                querySnapshot.forEach(doc => {
                    const post = doc.data();
      
                    
                    const postElement = document.createElement('div');
                    postElement.innerHTML = `
                                      <div class="question" id=${post.question}>
                                        <div>
                                          <i class="bi bi-chat-left"></i>
                                          <h2>${post.type}</h2>
                                          <p>${post.question}</p>
                                        </div>
                                        <div><i class="bi bi-chat-right-text"></i> ${post.replies.length}</div>
                                        <div class="replies hidden" id="replies">
                                        <p class="closeReply">X</p>
                                        <p>Q: ${post.question} #${post.id}</p>
                                        <h2>Replies:  </h2>
                                        ${post.replies.map((reply)=>{
                                          return(`<div class="reply"><i class="bi bi-reply"></i> ${reply}</div>`)
                                        })}
                                        <form class="postReply" id=${doc.id}>
                                        <input type="text" name="reply" id="reply" placeholder="Reply"required>
                                        <button>Send</button>
                                      </form>
                                      </div>
                                      </div>

                                      
                    `;
                    discussionDiv.appendChild(postElement)
                    
                    // Add a click event listener to each "question" element
                    Array.from(questions).forEach((question) => {
                      question.addEventListener("click", (event) => {
                        question.children[2].classList.remove("hidden")
                      });
                    });
                });
            });
          }
  
  setTimeout(() => {
  const replyForm = document.getElementsByClassName("postReply");
  Array.from(replyForm).forEach((form)=>{
    form.addEventListener("submit",async (e)=>{
      e.preventDefault()
      await db.collection('posts').doc(e.target.id).update({
                replies: firebase.firestore.FieldValue.arrayUnion(e.target.children[0].value)
            }).then(
              setTimeout(()=>{
                location.reload()
              },1000)
            ) 
    })

const closeReplyArray = Array.from(document.querySelectorAll(".closeReply"));

closeReplyArray.forEach((reply) => {
    reply.addEventListener("click", () => {
      Array.from(document.getElementsByClassName("replies")).forEach((el)=>{
        location.reload()
      })
    });
});

  })

}, 1000);


loadPosts()
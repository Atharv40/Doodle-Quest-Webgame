var avatars = document.querySelector('.avatar');
var array = ["a2.png", "a3.png", "a4.png", "a5.png", "a6.png", "a7.png", "a8.png", "a9.png", "a10.png", "a11.png", "a12.png", "a13.png", "a14.png", "a15.png", "a16.png", "a17.png"];
const easyWords = ["Cat", "Dog", "Ant", "Pen", "Fan", "Net", "Sun", "Car", "Bed", "Key", "Bat", "Fox", "Cow", "Pig", "Owl", "Bug", "Hen", "Rug", "Jam", "Pan", "Leg", "Mug", "Van", "Can", "Jug", "Nut", "Fly", "Egg", "Hat"];
 const normalWords = ["Tiger","Chair", "Bridge", "Apple", "Table", "Clock", "Snake", "Lemon", "Water", "Ocean", "Panda", "Mango", "Tower", "Robot", "Laptop", "Plaza", "Market", "Bridge", "House", "Museum", "Horse", "Clock", "Table", "Drone", "Palace", "Motel", "Cabin", "Villa", "Plaza", "Chair"];
 const hardWords = ["Rabbit", "Guitar", "Castle", "Rocket", "Banana", "Plasma", "Forest", "Engine", "Senate", "Plasma", "Koala", "Drone", "Church", "Piston", "Laptop", "Bridge", "Nuclear", "Congress", "Council", "Energy", "Dolphin", "Saturn", "Shrine", "Rotor", "Venus", "Harbor", "Black", "Agency", "Space", "Theory"];
var i = 0;
var avatarName=array[0];
var secretWord="Rony";

function prev() {
    if (i <= 0) i = array.length;
    i--;
    return setavt();

}

function next() {
    if (i >= array.length - 1) i = -1;
    i++;
    return setavt();
}

function setavt() {
  avatarName = array[i];
  console.log("Current avatar image name:", avatarName); // Add this line to log the avatar image name
  return avatars.setAttribute('src', "avatar/" + avatarName);
}

function openCreateRoomModal() {
  var modal = document.getElementById("createRoomModal");
  modal.classList.remove("pop-out"); // Remove pop-out class
  modal.classList.add("pop-in"); // Add pop-in class
  modal.style.display = "flex";
  event.preventDefault();
  var name = document.getElementById("create-name").value;
  console.log("name : ",name);
}

  
function closeCreateRoomModal() {
  var modal = document.getElementById("createRoomModal");
  modal.classList.remove("pop-in"); // Remove pop-in class
  modal.classList.add("pop-out"); // Add pop-out class
  setTimeout(function() {
    modal.style.display = "none"; // Hide modal after animation completes
  }, 300); // Adjust timing to match animation duration
}

function openScoreModal(user, isGameEnded){
    var username=localStorage.getItem("username");
    var gameoverTxt=document.getElementById("Game_over");
    var endGameButton=document.getElementById("Game_end");
    var h2Txt=document.getElementById("roundComplete");
    console.log(" In open score model user and username and isGameEnded:",user,username,isGameEnded);

    // Set initial display settings
    gameoverTxt.style.display = "none";
    endGameButton.style.display = "none";

    if (isGameEnded) {
        gameoverTxt.style.display = "block"; // Show "Game Over!" text
        h2Txt.textContent=" Here are Final scores !!";

        if (username == user) {
            endGameButton.style.display = "block"; // Show "End Game" button for the current user
        }
    }

    var modal = document.getElementById("ScoreModal");
    modal.classList.remove("pop-out"); // Remove pop-out class
    modal.classList.add("pop-in"); // Add pop-in class
    modal.style.display = "flex"; // Display the modal
}


function scorelist(){
    var roomKey = getRoomKeyFromURL();
var roomRef = firebase.database().ref("rooms/" + roomKey);
roomRef.on("value", function(snapshot) {
    var users = snapshot.val().user || [];
    
    // Sort users by score in descending order
    users.sort((a, b) => b.score - a.score);
    console.log(" scorelist function users list here ",users);
    var userListHTML = "";
    users.forEach(function(user, index) {
        var avatarName = user.avatar;
        var avatarURL = "avatar/" + avatarName;


            userListHTML += "<li>" + (index + 1) + ". <img src='" + avatarURL + "' class='avatar'>" + user.name + " - Score: " + user.score + "</li>";
    });
    document.getElementById('score-list').innerHTML = userListHTML;
});

}


function closeScoreModal() {

    setTimeout(() => {
        var modal = document.getElementById("ScoreModal");
        var roomKey=getRoomKeyFromURL();
        modal.classList.remove("pop-in"); // Remove pop-in class
        modal.classList.add("pop-out"); // Add pop-out class
        setTimeout(function() {
          modal.style.display = "none"; // Hide modal after animation completes
        }, 300); // Adjust timing to match animation duration
    
        var roomRef = firebase.database().ref("rooms/" + roomKey);
        roomRef.update({ShowScore:false});
    }, 7000); // Delay of 10 seconds (10000 milliseconds)

  }


  const firebaseConfig = {
    // add config
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);




// Function to create a new room
function createRoom() {
    var name = document.getElementById("create-name").value;
    var numPlayers = document.getElementById("num-players").value; // Get selected number of players
    console.log(" no of players : ",numPlayers);
    var drawTime = document.getElementById("drawTime").value; // Get selected draw time
    var numRounds = document.getElementById("num-rounds").value; // Get selected number of rounds
    var wordMode = document.getElementById("wordMode").value; // get selected word mode
    var remainingTime=drawTime;
    var currentUserIndex=0;
    var SelectedWord="Guess_Word";
    var score=0;
    var displayPopup=false;
    var showWordFlag=true;
    var completedRounds=0;
    var ShowScore=false;
    var user = {
      name: name,
      avatar: avatarName,  // Include the avatar name in the user object  
      score : score, 
      
    };
  
    if (name !== "") {
      localStorage.setItem("username", name); // Store user's name in localStorage
      var roomKey = generateRoomKey(); // Generate a unique room key
      var roomRef = firebase.database().ref("rooms/" + roomKey);
      roomRef.set({
        creator: name,
        numPlayers: numPlayers,
        drawTime: drawTime,
        wordMode: wordMode,
        numRounds: numRounds,
        remainingTime:remainingTime,
        currentUserIndex:currentUserIndex,
        showWordFlag:showWordFlag,
        displayPopup:displayPopup,
      SelectedWord:SelectedWord,
      completedRounds:completedRounds,
      ShowScore:ShowScore,
        user: [user] // Add the user object to the users list
      }).then(function() {
        // Redirect to the created room
        window.location.href = "lobby.html?key=" + roomKey;
      }).catch(function(error) {
        console.error("Error creating room: ", error);
      });
    } else {
      alert("Please enter your name.");
    }
  }

// Function to join an existing room
function joinRoom() {
  var keyInputContainer = $('#roomKeyInputContainer');
  if (keyInputContainer.is(":visible") && $('#roomKey').val() !== '') {
      // If the room key field is visible and not empty, proceed with joining the room
      var key = document.getElementById("join-key").value;
      var name = document.getElementById("create-name").value;
      var score=0;
      localStorage.setItem("username", name);
      if (key !== "") {
          var roomRef = firebase.database().ref("rooms/" + key);
          roomRef.once("value", function(snapshot) {
              if (snapshot.exists()) {
                  var roomData = snapshot.val();
                  var creator = roomData.creator;
                  var users = roomData.user || []; // Change users to user
                  var numPlayers = roomData.numPlayers;

                  // Check if the joining user's name matches any existing username
                  var usernameExists = users.some(function(user) {
                      return user.name === name; // Check if username (nm) matches
                  });

                  if (usernameExists) {
                      // Display alert if username already exists in the room
                      alert("Username already exists in this room. Please choose a different one.");
                  } else if (users.length >= numPlayers) {
                      // Display alert if room is full
                      alert("Room is full. Please join another room.");
                  } else {
                      // Add the joining user's data to the users list
                      var newUser = {
                          name: name,
                          avatar: avatarName, // Include the avatar name in the user object
                          score: score
                      };
                      users.push(newUser);
                      roomRef.update({ user: users }); // Change users to user

                      // Redirect to the joined room
                      window.location.href = "lobby.html?key=" + key;
                  }
              } else {
                  alert("Room not found. Please enter a valid room key.");
              }
          }).catch(function(error) {
              console.error("Error joining room: ", error);
          });
      } else {
          alert("Please enter a room key.");
      }
  } else {
      // If the room key field is empty, hide it
      keyInputContainer.slideToggle(500);
  }
}



function fetchUserNames() {
    var roomKey = getRoomKeyFromURL();
    var roomRef = firebase.database().ref("rooms/" + roomKey);
    roomRef.on("value", function(snapshot) {
        var currentUserIndex = snapshot.val().currentUserIndex || 0;
        var users = snapshot.val().user || [];
        var displayPopup= snapshot.val().displayPopup;
        var completedRounds=snapshot.val().completedRounds;
        var numRounds=snapshot.val().numRounds;
        var ShowScore=snapshot.val().ShowScore;
        secretWord=snapshot.val().SelectedWord;


        var username = '';
        username = users[currentUserIndex].name || '';
        if(ShowScore && completedRounds!=numRounds){
            openScoreModal(username,false);
            closeScoreModal();
            
        }
        else if(completedRounds==numRounds){
            openScoreModal(username,true);
            roomRef.update({ShowScore:false});
            return
        }

        
        console.log(" value of current user name :",username);
        console.log(" value of displayWordsCalled: ",displayPopup);
        
        // Call displayWords only if it hasn't been called already
        if (!displayPopup && !ShowScore) {
            console.log("Delaying displayWord function for 10 seconds...");
            
            setTimeout(() => {
                console.log("Calling displayWord function after delay.");
                displayWords(username);
                roomRef.update({ displayPopup: true });
            }, 1000); // Delay of 10 seconds (10000 milliseconds)
        }

    });
}


fetchUserNames();

function displayWords(username) {
    console.log(" current username in display WOrds : ",username);
    const modalContent = document.getElementById('WordsContent');
    const modal = document.getElementById('createRoomModal');
    var CurrentUsername = localStorage.getItem("username");
    var wordsArray= fetchAndDisplayWords();
    console.log(" selected words array : ",wordsArray);
    var flag=false;
    // Clear previous content
    modalContent.innerHTML = '';
    
    // Add words as buttons
    wordsArray.forEach(word => {
        const button = document.createElement('button');
        button.innerText = word;
        button.classList.add('word-button'); // Add class for styling
        button.addEventListener('click', () => {
            

      // Add selected word to the database
         const roomKey = getRoomKeyFromURL();
         firebase.database().ref('rooms/' + roomKey).update({
              SelectedWord: word,
              showWordFlag:flag
             });
               
            closeCreateRoomModal(); // Close the modal after selecting a word
           
            fetchDrawTime(username);
             console.log(" the selected word by current user: ",word);
         
        });
        modalContent.appendChild(button);

    });

 
    
  // Show the modal only to the specified user
  if (CurrentUsername === username) {
    console.log("showing popup");
    modal.classList.remove('pop-out');
    modal.classList.add('pop-in');
    modal.style.display = 'flex';
   } 
   else{
    console.log("hiding popup");
    manageWord();
    modal.style.display = 'none';
   }

}

// Function to manage word display based on the specified user
// Function to manage word display based on the specified user
function manageWord() {
    const CurrentUsername = localStorage.getItem("username");
    const roomKey = getRoomKeyFromURL();
    
    var roomRef = firebase.database().ref("rooms/" + roomKey);
    roomRef.on("value", function(snapshot) {
        var currentUserIndex = snapshot.val().currentUserIndex || 0;
        var users = snapshot.val().user || [];
        var drawTime= snapshot.val().drawTime;
        const selectedWord = snapshot.val().SelectedWord;
        var showWordFlag= snapshot.val().showWordFlag;
        var username = '';
        
        // Ensure currentUserIndex is within bounds
        if (currentUserIndex >= 0 && currentUserIndex < users.length) {
            username = users[currentUserIndex].name || '';
        }
        console.log(" in manage word show function flag CurrentUsername and username value : ",showWordFlag,CurrentUsername,username);
        // Compare the username with the current username
        if (!showWordFlag) {
            if (CurrentUsername === username) {
                console.log(" showing word: ",selectedWord);
                showWord(selectedWord);
            } else {
                console.log(" hiddenWord: ",selectedWord);
                hideWord(selectedWord, drawTime);
            }
            roomRef.update({showWordFlag:true});

        }
  
    });

}

manageWord();
// Function to display the word only for the specified user
function showWord(word) {
    const wordDiv = document.getElementById('word');
    const hiddenWord = document.getElementById('hiddenWord'); // Create a separate div for hidden word
    hiddenWord.style.display="none";
    wordDiv.innerText = word;
    wordDiv.style.display = "block";
}

// Function to fetch word mode and select words accordingly
function fetchAndDisplayWords() {
    var roomKey= getRoomKeyFromURL();
         let ArrayWords = [];
    firebase.database().ref('rooms/' + roomKey + '/wordMode').once('value', snapshot => {
        const wordMode = snapshot.val().trim();
        console.log(" wordMode in fetchAndDisplayWOrds :",wordMode);
        
        
        if (wordMode === 'easy') {
            ArrayWords = selectRandomWords(easyWords, 3);
        } else if (wordMode === 'medium') {
            ArrayWords = selectRandomWords(normalWords, 3);
        } else if (wordMode === 'hard') {
            ArrayWords = selectRandomWords(hardWords, 3);
        } else {
            console.log("Invalid word mode:", wordMode);
            return; // Exit function if word mode is invalid
        } 

        console.log(" Arraywords",ArrayWords);
    });

    return ArrayWords;
    
}


// Function to reveal certain number of letters based on word mode
function hideWord(word, drawTime) {
    const hiddenWord = document.getElementById('hiddenWord'); // Create a separate div for hidden word
    const wordDiv = document.getElementById('word');
    
    // Initialize the hidden word with dashes
    let hiddenText = '';
    for (let i = 0; i < word.length; i++) {
        hiddenText += '-';
    }

    if (word.length <= 3) {
        // Randomly select one letter to display for 3-letter words
        const randomIndex = Math.floor(Math.random() * word.length);
        hiddenText = hiddenText.substr(0, randomIndex) + word.charAt(randomIndex) + hiddenText.substr(randomIndex + 1);
    } else {
        // Reveal any two random letters initially for words longer than 3 letters
        const firstIndex = Math.floor(Math.random() * word.length);
        let secondIndex = firstIndex;
        while (secondIndex === firstIndex) {
            secondIndex = Math.floor(Math.random() * word.length);
        }
        hiddenText = hiddenText.substr(0, firstIndex) + word.charAt(firstIndex) + hiddenText.substr(firstIndex + 1);
        hiddenText = hiddenText.substr(0, secondIndex) + word.charAt(secondIndex) + hiddenText.substr(secondIndex + 1);

        // Reveal one extra letter after half the drawTime has passed for longer words
        const halfTime = drawTime / 2; // Convert drawTime to seconds
        setTimeout(() => {
            const hiddenIndices = [];
            for (let i = 0; i < word.length; i++) {
                if (hiddenText.charAt(i) === '-') {
                    hiddenIndices.push(i);
                }
            }
            if (hiddenIndices.length > 0) {
                const randomIndex = hiddenIndices[Math.floor(Math.random() * hiddenIndices.length)];
                hiddenText = hiddenText.substr(0, randomIndex) + word.charAt(randomIndex) + hiddenText.substr(randomIndex + 1);
                hiddenWord.innerText = hiddenText; // Display updated hidden word
            }
        }, halfTime * 1000); // Convert halfTime to milliseconds
    }

    hiddenWord.innerText = hiddenText; // Display hidden word in the separate div
    wordDiv.style.display = "none";
    hiddenWord.style.display = "block";
}






// Function to select random words from an array
function selectRandomWords(wordArray, count) {
    const selectedWords = [];
    const shuffledArray = wordArray.sort(() => Math.random() - 0.5); // Shuffle array
    for (let i = 0; i < count; i++) {
        selectedWords.push(shuffledArray[i]);
    }
    return selectedWords;
}


// Fetch drawTime from Firebase
function fetchDrawTime(username) {
    const roomKey = getRoomKeyFromURL();
      // Check if the current user is the creator of the room
      var CurrentUsername = localStorage.getItem("username");
      firebase.database().ref('rooms/' + roomKey).once('value', snapshot => {
          const roomData = snapshot.val();
          const remainingTime= roomData.remainingTime;
          if (CurrentUsername === username) {
               startTimer(remainingTime);
          } 
        });
        
}


// Function to fetch remaining time and display timer for all users
function displayTimer() {
    const roomKey = getRoomKeyFromURL();
    firebase.database().ref('rooms/' + roomKey + '/remainingTime').on('value', snapshot => {
        const timer = snapshot.val();

        const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    // Update timer display
    document.getElementById('timer').innerText = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    if (timer <= 0) {
        document.getElementById('timer').style.color = "red";
        return;
    }
    else{
        document.getElementById('timer').style.color = "black";
    }
    });
}

displayTimer();

// Start countdown timer for the next user
function startTimer(drawTime) {
    const roomKey = getRoomKeyFromURL();
    const roomRef = firebase.database().ref('rooms/' + roomKey);
    let timer = drawTime;
    let timerInterval;

    function updateTimer() {
        if (timer <= 0) {
            // Time's up, stop the timer and shift to the next user
            clearInterval(timerInterval);
            shiftToNextUser();
            return;
        }

        timer--;

        roomRef.update({ remainingTime: timer });
        
        // Check if all users except the current user have guessed correctly
        roomRef.once("value", function(snapshot) {
            var users = snapshot.val().user || [];
            var currentUserIndex = snapshot.val().currentUserIndex;
            users.forEach((user, index) => {
                if (index !== currentUserIndex && user.guessedCorrectly) {
                    clearInterval(timerInterval);
                    shiftToNextUser();
                }
            });
        });


       
    }

    // Call updateTimer immediately to update timer initially
    updateTimer();
    // Update timer every second
    timerInterval = setInterval(updateTimer, 1000);
}


// Function to shift to the next user
function shiftToNextUser() {
    console.log("calling shift to neext user function");
    var roomKey = getRoomKeyFromURL();
    var roomRef = firebase.database().ref("rooms/" + roomKey);
     
    roomRef.once("value", function(snapshot) {
        var drawTime = snapshot.val().drawTime || 60; // Default drawTime value is 60 seconds
        var currentUserIndex = snapshot.val().currentUserIndex || 0;
        var completedRounds=snapshot.val().completedRounds;
        var users = snapshot.val().user || [];
    
        
        if(currentUserIndex>=users.length-1){
            completedRounds++;
            currentUserIndex=0;
            roomRef.update({completedRounds:completedRounds,
                   currentUserIndex:currentUserIndex, ShowScore:true });
            roomRef.child("messages").remove();


        }
        else{

            roomRef.update({currentUserIndex:currentUserIndex+1});
           

        }

            var updates = {};
            updates['remainingTime'] = drawTime;
            updates['showWordFlag'] = false;
            updates['displayPopup'] = false;
    
            roomRef.update(updates);
            unblockUserWithGuessedCorrectly();
            roomRef.child("whiteboard").remove();
            roomRef.update({ CanvasState: "clearCanvas" });
            // Display the popup window for the next user
            fetchUserNames();
  
        

    });
   
}


function generateUsernameSuggestions(username, existingUsers) {
  // Generate suggestions by appending numbers to the username
  var suggestions = [];
  for (var i = 1; i <= 3; i++) {
      var suggestion = username + i;
      if (!existingUsers.includes(suggestion)) {
          suggestions.push(suggestion);
      }
  }
  return suggestions;
}

// Function to generate a unique room key
function generateRoomKey() {
  // Generate a random 6-character alphanumeric string
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var key = "";
  for (var i = 0; i < 6; i++) {
    key += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return key;
}

// Function to get room key from URL
function getRoomKeyFromURL() {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('key');
}

// Function to display room key
document.getElementById('room-key').innerText = getRoomKeyFromURL();

function fetchUsersInRoom(isRoomPage) {
    var roomKey = getRoomKeyFromURL();
    var roomRef = firebase.database().ref("rooms/" + roomKey);
    roomRef.on("value", function(snapshot) {
        var users = snapshot.val().user || [];
        var currentUserIndex = snapshot.val().currentUserIndex;
        var userListHTML = "";
        users.forEach(function(user, index) {
            var avatarName = user.avatar;
            var avatarURL = "avatar/" + avatarName;
            if (isRoomPage) {
                // Display score only on room page
                var listItem = "<li>";
                if (index === currentUserIndex) {
                    listItem += "<span style='color:blue;'>></span>";
                }
                listItem += (index + 1) + ". <img src='" + avatarURL + "' class='avatar'>" + user.name + " - Score: " + user.score + "</li>";
                userListHTML += listItem;
            } else {
                // Display only name and avatar on lobby page
                userListHTML += "<li>" + (index + 1) + ". <img src='" + avatarURL + "' class='avatar'>" + user.name + "</li>";
            }
        });
        document.getElementById('user-list').innerHTML = userListHTML;
    });
}



function handlePlayerCount() {
    const waitingMessage = document.getElementById('waiting-message');
    const startGameButton = document.getElementById('start-game-button');
    const abortGameButton = document.getElementById('abort-lobby-button');
    const leavelobbyButton = document.getElementById('leave-lobby-button');
    var username = localStorage.getItem("username");
    var roomKey = getRoomKeyFromURL();
    var roomRef = firebase.database().ref("rooms/" + roomKey);
    roomRef.on("value", function(snapshot) {
        var roomData = snapshot.val();
        var numPlayers = parseInt(roomData.numPlayers);
        var admin = roomData.creator;
        var joinedPlayers = roomData.user ? roomData.user.length : 0; // Number of players who have joined
        if (username == admin) {
            if (numPlayers > joinedPlayers && joinedPlayers<2 ) {
                waitingMessage.style.display = 'block'; // Show waiting message
                startGameButton.style.display = 'none'; // show start game button
                abortGameButton.style.display = 'inline-block'; // show abort button
            } else if(numPlayers > joinedPlayers && joinedPlayers>=2 ){
                waitingMessage.style.display = 'block'; // Show waiting message
                startGameButton.style.display = 'inline-block'; // show start game button
                abortGameButton.style.display = 'inline-block'; // show abort button
            } 
            else if( numPlayers === joinedPlayers ){
                waitingMessage.textContent = "All players are joined, You can start..";
                waitingMessage.style.display = 'block'; // Show waiting message
                startGameButton.style.display = 'inline-block'; // Show start game button
                abortGameButton.style.display = 'inline-block'; // show abort button
            }
        
        } else {
            if (numPlayers > joinedPlayers) {
                waitingMessage.style.display = 'block'; // Show waiting message
                leavelobbyButton.style.display = 'inline-block' // show leave button
            } 
            else if( numPlayers === joinedPlayers ){
                waitingMessage.textContent = "Waiting for admin to start the game...";
                waitingMessage.style.display = 'block'; // Show waiting message
                leavelobbyButton.style.display = 'inline-block' // show leave button                
            }
          
        }
    });
}


function listenForUsersNumber(){
    var roomKey = getRoomKeyFromURL();
    var roomRef = firebase.database().ref("rooms/"+roomKey);
    var username = localStorage.getItem("username");
    roomRef.on("value", function(snapshot) {
        var roomData = snapshot.val();
        var admin = roomData.creator;
        var joinedPlayers = roomData.user ? roomData.user.length : 0; // Number of players who have joined
      if (username == admin){

        if(joinedPlayers<2){
            alert(" All players have left. You may want to conclude the room");
            roomRef.remove()
          .then(() => {
              // Redirect all users to index.html
              window.location.href = "index.html"; 
          })
          .catch(error => console.error("Error deleting room:", error));
        } 
      }
       
        
    });
  
  }
  
  // Function to start the game (you need to implement this function)
  function startGame() {
    var roomKey = getRoomKeyFromURL();
    var roomRef = firebase.database().ref("rooms/" + roomKey);
    roomRef.once("value", function(snapshot) {
        var roomData = snapshot.val();
        var joinedPlayers = roomData.user ? roomData.user.length : 0;

        // Update numPlayers in the database to the number of joined players
        roomRef.update({ RoomState: "startRoom" })
        .then(() => {
            console.log("Updated numPlayers in the database to", joinedPlayers);
            // Proceed with starting the game
            roomRef.update({ numPlayers: joinedPlayers })
            .then(() => {
                // Redirect the host to index.html
                window.location.href = "room.html?key=" + roomKey;
            })
            .catch(error => console.error("Error starting room:", error));
        })
        .catch(error => console.error("Error updating numPlayers:", error));
    });
}

// Handle aborting the lobby
function abortLobby() {
    var confirmation = confirm("Are you sure you want to abort this lobby?");
    if (confirmation){
        var roomKey = getRoomKeyFromURL();
        var roomRef = firebase.database().ref("rooms/" + roomKey);
        roomRef.update({ RoomState: "abort" }) // Update room state to "abort"
        .then(() => {
            // Redirect to the home page
            window.location.href = "index.html"; 
        })
        .catch(error => console.error("Error aborting lobby:", error));
    }
    else{
        console.log("lobby abort canceled.");
    }

}

function leaveRoom() {
  var roomKey = getRoomKeyFromURL();
  var username = localStorage.getItem("username");
  var roomRef = firebase.database().ref("rooms/" + roomKey);
  roomRef.once("value", function(snapshot) {
      var users = snapshot.val().user || []; 
      var updatedUsers = users.filter(user => user.name !== username); 
      roomRef.update({ user: updatedUsers }); 
  });
  window.location.href = "index.html";
}

function leaveLobby() {
    var roomKey = getRoomKeyFromURL();
    var username = localStorage.getItem("username");
    var roomRef = firebase.database().ref("rooms/" + roomKey);
    roomRef.once("value", function(snapshot) {
        var users = snapshot.val().user || []; // Corrected to 'user'
        var updatedUsers = users.filter(user => user.name !== username); // Changed 'user' to 'user.nm'
        roomRef.update({ user: updatedUsers }); // Changed 'users' to 'user'
    });
    handlePlayerCount();
    window.location.href = "index.html";
    
  }



function fetchMessages() {
    var roomKey = getRoomKeyFromURL();
    var chatBoxRef = firebase.database().ref("rooms/" + roomKey + "/messages");
    chatBoxRef.on("value", function(snapshot) {
        var chatBoxHTML = "";
        var guessedCorrectly = false; // Flag to track if anyone has guessed correctly
        snapshot.forEach(function(childSnapshot) {
            var message = childSnapshot.val();
            var sender = message.sender;
            var content = message.content;
            
            // Check if the sender's message matches the secret word
            if (content.trim() == secretWord) {
                guessedCorrectly = true; // Set the flag to true
                // Replace sender's name and message
                var Newcontent = "<span style='color:green;'> guessed the word!</span>";
                chatBoxHTML += "<div><strong>" + sender + ": "+Newcontent + " </strong></div>";
                
                // Retrieve the user's score and update it in the database
                var userRef = firebase.database().ref("rooms/" + roomKey + "/user").orderByChild("name").equalTo(sender);
                userRef.once("value", function(userSnapshot) {
                    userSnapshot.forEach(function(userChildSnapshot) {
                        var userKey = userChildSnapshot.key;
                        var userScore = parseInt(userChildSnapshot.val().score) || 0; // If score is not available, initialize it to 0
                        var newScore = userScore + 5; // Increase score by 5
                        firebase.database().ref("rooms/" + roomKey + "/user/" + userKey).update({ score: newScore , guessedCorrectly:guessedCorrectly});
                    });
                });

                firebase.database().ref("rooms/" + roomKey + "/messages").orderByChild("content").equalTo(content).once("value", function(messageSnapshot) {
                    messageSnapshot.forEach(function(messageChildSnapshot) {
                        var messageId = messageChildSnapshot.key;
                        // Update the content of the message
                        firebase.database().ref("rooms/" + roomKey + "/messages/" + messageId).update({ content: Newcontent });
                    });
                });
                
            } else {
                chatBoxHTML += "<div><strong>" + sender + ":" + content + "</strong> </div>";
            }
        });
        document.getElementById('chat-box').innerHTML = chatBoxHTML;
    });
}

  fetchUsersInRoom();
  fetchMessages();
  


function sendMessage() {
  var senderName = localStorage.getItem("username");
  var messageInput = document.getElementById("message-input");
  var message = messageInput.value.trim();
  if (senderName && message !== "") {
      var roomKey = getRoomKeyFromURL();
      var messageRef = firebase.database().ref("rooms/" + roomKey + "/messages");
      messageRef.push({
          sender: senderName,
          content: message
      }).then(function() {
          messageInput.value = ""; // Clear the message input field after sending
      }).catch(function(error) {
          console.error("Error sending message: ", error);
      });
  } else {
      alert("Please enter a message.");
  }
}

// Function to toggle join options visibility
function toggleJoinOptions() {
  var joinOptions = document.getElementById("join-options");
  if (joinOptions.style.display === "none") {
      joinOptions.style.display = "block";
  } else {
      joinOptions.style.display = "none";
  }
}



function toggleCreateOptions() {
  var createOptions = document.querySelector('#create-room .create-options');
  var createButton = document.querySelector('#create-room .creating');
  if (createOptions.style.display === "none") {
      createOptions.style.display = "block";
      createButton.innerHTML = "Cancel"; // Change button text to "Cancel"
  } else {
      createOptions.style.display = "none";
      createButton.innerHTML = "Create a room"; // Change button text back to "Create"
  }
}


function endRoom() {
  var confirmation = confirm("Are you sure you want to end this room?");
  if (confirmation) {
      var roomKey = getRoomKeyFromURL();
      var roomRef = firebase.database().ref("rooms/" + roomKey);
      roomRef.update({ RoomState: "endRoom"}) // Update the room state to indicate that the room has ended
      .then(() => {
          // Redirect the host to index.html
          window.location.href = "index.html"; 
      })
      .catch(error => console.error("Error ending room:", error));
  }
  else {
    // Do nothing or display a message indicating that the room was not ended
    console.log("Room ending canceled.");
}
}

function listenForRoomState() {
  var roomKey = getRoomKeyFromURL();
  var roomRef = firebase.database().ref("rooms/" + roomKey);
  var username = localStorage.getItem("username");
  roomRef.on('value', snapshot => {
      const roomData = snapshot.val();
      var isHost = username === roomData.creator;
      if (roomData && roomData.RoomState === "endRoom") {
              if (!isHost) {
                  // Inform other users that the host has ended the room
                  alert("The host has ended this room. Click OK to continue to the home page.");
              }
          // If the room state is marked as "endRoom", delete the room entirely
          roomRef.remove()
          .then(() => {
              // Redirect all users to index.html
              window.location.href = "index.html"; 
          })
          .catch(error => console.error("Error deleting room:", error));
      }
      else if(roomData && roomData.RoomState === "startRoom"){   
       
        roomRef.child("RoomState").remove()
        .then(() => {
            // Redirect to room.html
            window.location.href = "room.html?key=" + roomKey;
        })
        .catch(error => console.error("Error removing startRoom state:", error));
        
        }
      else if (roomData && roomData.RoomState === "abort")
      {

        if(!isHost)
        {
            alert("The admin has aborted the lobby. Click OK to continue to the home page.");
        }
        roomRef.remove()
        .then(() => {
            // Redirect to the home page
            window.location.href = "index.html"; 
        })
        .catch(error => console.error("Error deleting room:", error));

        }
        
  }, error => {
      console.error("Error listening for room state changes:", error);
  });
}

// Call the function to listen for changes in the room state
listenForRoomState();




 function EndRoomButtons() {
  var roomKey = getRoomKeyFromURL();
  console.log(" Room key : ",roomKey);
  var username = localStorage.getItem("username");
  console.log("username : ",username);
  var roomRef = firebase.database().ref("rooms/" + roomKey);
  roomRef.once("value", function(snapshot) {
      var creator = snapshot.val().creator;
      console.log(" creator : ",creator);
      var endRoomButton = document.querySelector('#end-room-button');
      var leaveRoomButton = document.querySelector('#leave-room-button');
      if (username === creator) {
          endRoomButton.style.display = "block";
          endRoomButton.innerHTML = "End Room";
          endRoomButton.onclick = function() {
              endRoom();
          };
      } else {
          leaveRoomButton.style.display = "block";
          leaveRoomButton.innerHTML = "Leave Room";
          leaveRoomButton.onclick = function() {
              leaveRoom();
          };
      }
  });
}

EndRoomButtons();

function blockCanvasAndMessage() {
    var roomKey = getRoomKeyFromURL();
    var currentUserIndex;
    var CurrentUsername = localStorage.getItem("username");

    // Get the current user index from the database
    var roomRef = firebase.database().ref("rooms/" + roomKey);
    roomRef.on("value", function(snapshot) {
        currentUserIndex = snapshot.val().currentUserIndex || 0;

        // Fetch the users array
        var users = snapshot.val().user || [];
        var currentUsernameInArray;

        // Find the username of the current user based on their index
        if (currentUserIndex >= 0 && currentUserIndex < users.length) {
            currentUsernameInArray = users[currentUserIndex].name;
        }

        // Check if the current user is the one who should be blocked
        if (currentUsernameInArray === CurrentUsername) {
            // Make message input and send message fields invisible for the current user
            document.getElementById('message-input').style.visibility = 'hidden';
            document.getElementById('send-message').style.visibility = 'hidden';
            document.getElementById('whiteboard').style.pointerEvents = 'auto';
        } else {
            // Make message input and send message fields visible for the previous user
            document.getElementById('message-input').style.visibility = 'visible';
            document.getElementById('send-message').style.visibility = 'visible';
            document.getElementById('whiteboard').style.pointerEvents = 'none';
        }


    });
}

blockCanvasAndMessage();

function blockUserWithGuessedCorrectly() {
    var roomKey=getRoomKeyFromURL();
    var currentUser=localStorage.getItem("username");
    var userRef = firebase.database().ref("rooms/" + roomKey + "/user").orderByChild("name").equalTo(currentUser);
    userRef.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var user = childSnapshot.val();
            var guessedCorrectly = user.guessedCorrectly || false;
                        // Check if the current user has guessed correctly
            if (guessedCorrectly) {
                // Disable message input and send message button for this user
                document.getElementById('message-input').disabled = true;
                document.getElementById('send-message').disabled = true;
            } else {
                // Enable message input and send message button for this user
                document.getElementById('message-input').disabled = false;
                document.getElementById('send-message').disabled = false;
            }
        });
    });
}
blockUserWithGuessedCorrectly();

function unblockUserWithGuessedCorrectly() {
    var roomKey = getRoomKeyFromURL();
    var roomRef = firebase.database().ref("rooms/" + roomKey);
    roomRef.once("value", function(snapshot) {
        var users = snapshot.val().user || []; // Get the users array or an empty array if it doesn't exist
                // Iterate over the users array
        users.forEach(function(user, index) {
            // Check if the user has guessed correctly
            console.log("user and their index",index);
            if (user.guessedCorrectly === true) {
                // Update guessedCorrectly to false for the current user
                var userRef = roomRef.child("user/" + index);
                userRef.update({ guessedCorrectly: false });
            }
        });
    });
}


// Function to initialize the whiteboard
function initWhiteboard() {
  const canvas = document.getElementById('whiteboard');
  const ctx = canvas.getContext('2d');

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let color = 'black';
  let lineWidth = 2;
  let tool = 'pencil'; // Default tool

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);

  // Function to start drawing
  function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
}

  // Function to draw
  // Function to draw
  function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    if (tool === 'pencil') {
        ctx.globalCompositeOperation = 'source-over'; // Set drawing mode
    } else if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out'; // Set erasing mode
    }

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    saveDrawingData([lastX, lastY], [offsetX, offsetY], color, lineWidth, tool);

    [lastX, lastY] = [offsetX, offsetY];
}


  // Function to stop drawing
  function stopDrawing() {
      isDrawing = false;
  }

  // Function to save drawing data to Firebase
  function saveDrawingData(start, end, color, lineWidth, tool) {
      var roomKey = getRoomKeyFromURL();
      var whiteboardRef = firebase.database().ref("rooms/" + roomKey + "/whiteboard");
      whiteboardRef.push({
          start: start,
          end: end,
          color: color,
          lineWidth: lineWidth,
          tool: tool
      });
  }

  // Listen for changes to the whiteboard data in Firebase
  var roomKey = getRoomKeyFromURL();
  var whiteboardRef = firebase.database().ref("rooms/" + roomKey + "/whiteboard");
  whiteboardRef.on('child_added', snapshot => {
      const data = snapshot.val();
      drawLine(data.start, data.end, data.color, data.lineWidth, data.tool);
  });

  // Function to draw a line on the canvas
  function drawLine(start, end, color, lineWidth, tool) {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;

      if (tool === 'pencil') {
          ctx.globalCompositeOperation = 'source-over'; // Set drawing mode
      } else if (tool === 'eraser') {
          ctx.globalCompositeOperation = 'destination-out'; // Set erasing mode
      }

      ctx.beginPath();
      ctx.moveTo(start[0], start[1]);
      ctx.lineTo(end[0], end[1]);
      ctx.stroke();
  }

  // Function to handle tool selection
  function selectTool(toolName) {
      tool = toolName;
      updateCursor(tool);
      console.log(" tool selected:",tool);
  }

  // Function to update cursor style based on selected tool
  function updateCursor(tool) {
    const canvasContainer = document.querySelector('.whiteboard-container');
    if (tool === 'pencil') {
        canvasContainer.classList.remove('eraser');
    } else if (tool === 'eraser') {
        canvasContainer.classList.add('eraser');
    }
}


  // Function to handle color selection
  function selectColor(newColor) {
      color = newColor;
  }

  // Function to handle line width selection
  function selectLineWidth(newLineWidth) {
      lineWidth = newLineWidth;
  }

  // Function to clear the canvas
  function clearCanvas() {
      const canvas = document.getElementById('whiteboard');
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Clear whiteboard data in Firebase
      var roomKey = getRoomKeyFromURL();
      var whiteboardRef = firebase.database().ref("rooms/" + roomKey + "/whiteboard");
      whiteboardRef.remove()
      .then(() => {
          // Broadcast clear canvas action to all users in the room
          var roomRef = firebase.database().ref("rooms/" + roomKey);
          roomRef.update({ CanvasState: "clearCanvas" });
      })
      .catch(error => console.error("Error clearing whiteboard data:", error));
  }

function listenForCanvasState() {
  var roomKey = getRoomKeyFromURL();
  var roomRef = firebase.database().ref("rooms/" + roomKey);
   // Listen for changes in the canvas state
  roomRef.on('value', snapshot => {
      const roomData = snapshot.val();
      if (roomData && roomData.CanvasState === "clearCanvas") {
          console.log("Clear canvas action detected.");
          // If the last action is to clear the canvas, clear it locally
          const canvas = document.getElementById('whiteboard');
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          console.log("Canvas cleared locally.");
          // Remove the canvas state snapshot from the database
          roomRef.update({ CanvasState: null });
      }
  }, error => {
      console.error("Error listening for room data changes:", error);
  });
}


// Call the function to listen for changes in the room's last action
listenForCanvasState();
  // Event listeners for drawing tools
  document.getElementById('tool-pencil').addEventListener('click', () => selectTool('pencil'));
  document.getElementById('tool-eraser').addEventListener('click', () => selectTool('eraser'));
  document.getElementById('tool-clear').addEventListener('click', clearCanvas);
  // Event listener for color picker
  document.getElementById('color-picker').addEventListener('change', (e) => selectColor(e.target.value));
 // Event listener for line width slider
  document.getElementById('line-width-slider').addEventListener('input', (e) => selectLineWidth(e.target.value));
}
document.addEventListener('DOMContentLoaded', initWhiteboard);

/* =========================
   PAGE NAVIGATION
========================= */
function goToRegister() {
  window.location.href = "register.html";
}

function goToLogin() {
  window.location.href = "login.html";
}

function goToProfile() {
  window.location.href = "profile.html";
}

function logout() {
  localStorage.removeItem("fbCurrentUser");
  window.location.href = "login.html";
}

/* =========================
   AUTH CHECK
========================= */
function requireLogin() {
  const protectedPages = [
    "home.html",
    "profile.html",
    "friends.html",
    "messages.html",
    "notifications.html",
    "settings.html"
  ];

  const path = window.location.pathname;
  const currentUser = JSON.parse(localStorage.getItem("fbCurrentUser"));

  const isProtected = protectedPages.some(page => path.includes(page));

  if (isProtected && !currentUser) {
    window.location.href = "login.html";
  }
}

/* =========================
   STORAGE HELPERS
========================= */
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("fbCurrentUser"));
}

function setCurrentUser(user) {
  localStorage.setItem("fbCurrentUser", JSON.stringify(user));
}

function setSavedUser(user) {
  localStorage.setItem("fbUser", JSON.stringify(user));
}

function getPosts() {
  return JSON.parse(localStorage.getItem("fbPosts")) || [];
}

function savePosts(posts) {
  localStorage.setItem("fbPosts", JSON.stringify(posts));
}

function getNotifications() {
  return JSON.parse(localStorage.getItem("fbNotifications")) || [];
}

function saveNotifications(notifications) {
  localStorage.setItem("fbNotifications", JSON.stringify(notifications));
}

function getTheme() {
  return localStorage.getItem("fbTheme") || "light";
}

function saveTheme(theme) {
  localStorage.setItem("fbTheme", theme);
}

/* =========================
   REGISTER
========================= */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    const confirmPassword = document.getElementById("regConfirmPassword").value.trim();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const user = {
      name,
      email,
      password,
      bio: "No bio yet."
    };

    localStorage.setItem("fbUser", JSON.stringify(user));
    localStorage.setItem("fbCurrentUser", JSON.stringify(user));

    addNotification("Welcome!", "Your account was created successfully.");
    alert("Account created successfully!");
    window.location.href = "home.html";
  });
}

/* =========================
   LOGIN
========================= */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const savedUser = JSON.parse(localStorage.getItem("fbUser"));

    if (!savedUser) {
      alert("No account found. Please register first.");
      return;
    }

    if (email === savedUser.email && password === savedUser.password) {
      localStorage.setItem("fbCurrentUser", JSON.stringify(savedUser));
      addNotification("Login successful", "You logged into your account.");
      alert("Login successful!");
      window.location.href = "home.html";
    } else {
      alert("Invalid email or password.");
    }
  });
}

/* =========================
   CURRENT USER UI
========================= */
function loadCurrentUser() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const firstLetter = currentUser.name.charAt(0).toUpperCase();

  const navUserName = document.getElementById("navUserName");
  const sidebarName = document.getElementById("sidebarName");
  const sidebarEmail = document.getElementById("sidebarEmail");
  const sidebarAvatar = document.getElementById("sidebarAvatar");
  const feedAvatar = document.getElementById("feedAvatar");

  const profileAvatar = document.getElementById("profileAvatar");
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const profileBioText = document.getElementById("profileBioText");

  const settingsUserEmail = document.getElementById("settingsUserEmail");

  if (navUserName) navUserName.textContent = currentUser.name;
  if (sidebarName) sidebarName.textContent = currentUser.name;
  if (sidebarEmail) sidebarEmail.textContent = currentUser.email;
  if (sidebarAvatar) sidebarAvatar.textContent = firstLetter;
  if (feedAvatar) feedAvatar.textContent = firstLetter;

  if (profileAvatar) profileAvatar.textContent = firstLetter;
  if (profileName) profileName.textContent = currentUser.name;
  if (profileEmail) profileEmail.textContent = currentUser.email;
  if (profileBioText) profileBioText.textContent = currentUser.bio || "No bio yet.";

  if (settingsUserEmail) settingsUserEmail.textContent = currentUser.email;
}

/* =========================
   POSTS
========================= */
function addDefaultPostsIfEmpty() {
  const posts = [
    {
      author: "Jane Dignos",
      content: "Kani nga system binuhat sakong future programmer nga bf",
      time: "Just now"
    },
    {
      author: "Clark Justin Umpad",
      content: "Unta ma pansin nako sakoan crush nga naa sa BSED",
      time: "10 mins ago"
    }
  ];

  savePosts(posts);
}

function addPost() {
  const currentUser = getCurrentUser();
  const postInput = document.getElementById("postInput");

  if (!postInput) return;

  const content = postInput.value.trim();

  if (content === "") {
    alert("Please write something before posting.");
    return;
  }

  const posts = getPosts();

  posts.unshift({
    author: currentUser ? currentUser.name : "User",
    content: content,
    time: "Just now"
  });

  savePosts(posts);
  addNotification("New Post", "You created a new post.");
  postInput.value = "";
  renderPosts();
  renderMyPosts();
}

function renderPosts() {
  const postList = document.getElementById("postList");
  if (!postList) return;

  const posts = getPosts();
  postList.innerHTML = "";

  posts.forEach((post, index) => {
    const letter = post.author.charAt(0).toUpperCase();

    const postCard = document.createElement("div");
    postCard.className = "post-card";

    postCard.innerHTML = `
      <div class="post-card-header">
        <div class="avatar">${letter}</div>
        <div>
          <h4>${post.author}</h4>
          <div class="post-time">${post.time}</div>
        </div>
      </div>

      <div class="post-content">${post.content}</div>

      <div class="post-actions">
        <button onclick="likePost(${index})">👍 Like</button>
        <button onclick="commentPost()">💬 Comment</button>
        <button onclick="sharePost()">↗ Share</button>
      </div>
    `;

    postList.appendChild(postCard);
  });
}

function renderMyPosts() {
  const myPostsList = document.getElementById("myPostsList");
  if (!myPostsList) return;

  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const posts = getPosts().filter(post => post.author === currentUser.name);

  myPostsList.innerHTML = "";

  if (posts.length === 0) {
    myPostsList.innerHTML = `<p class="small-text">You have not posted anything yet.</p>`;
    return;
  }

  posts.forEach((post) => {
    const card = document.createElement("div");
    card.className = "post-card";
    card.innerHTML = `
      <div class="post-card-header">
        <div class="avatar">${currentUser.name.charAt(0).toUpperCase()}</div>
        <div>
          <h4>${post.author}</h4>
          <div class="post-time">${post.time}</div>
        </div>
      </div>
      <div class="post-content">${post.content}</div>
    `;
    myPostsList.appendChild(card);
  });
}

function likePost(index) {
  addNotification("Post Liked", "You liked a post.");
  alert("You liked post #" + (index + 1));
}

function commentPost() {
  addNotification("Comment", "Comment feature will be added later.");
  alert("Comment feature will be added in the next version.");
}

function sharePost() {
  addNotification("Share", "Share feature will be added later.");
  alert("Share feature will be added in the next version.");
}

/* =========================
   PROFILE PAGE
========================= */
const profileForm = document.getElementById("profileForm");

if (profileForm) {
  profileForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const newName = document.getElementById("editName").value.trim();
    const newEmail = document.getElementById("editEmail").value.trim();
    const newBio = document.getElementById("editBio").value.trim();

    if (newName) currentUser.name = newName;
    if (newEmail) currentUser.email = newEmail;
    if (newBio) currentUser.bio = newBio;

    setCurrentUser(currentUser);
    setSavedUser(currentUser);

    addNotification("Profile Updated", "Your profile information was updated.");
    alert("Profile updated successfully!");
    loadCurrentUser();
    renderMyPosts();
    profileForm.reset();
  });
}

/* =========================
   FRIENDS PAGE
========================= */
const demoFriends = [
  { name: "Jane Dignos", mutual: "12 mutual friends" },
  { name: "Clark Justin Umpad", mutual: "8 mutual friends" },
  { name: "Vince Rocel Goopio", mutual: "15 mutual friends" },
  { name: "John Carlo Nunez", mutual: "10 mutual friends" },
  { name: "John Rim Neis", mutual: "5 mutual friends" },
  { name: "Hyacinth Gomez", mutual: "9 mutual friends" }
];

function renderFriends() {
  const friendsGrid = document.getElementById("friendsGrid");
  if (!friendsGrid) return;

  friendsGrid.innerHTML = "";

  demoFriends.forEach((friend) => {
    const letter = friend.name.charAt(0).toUpperCase();

    const card = document.createElement("div");
    card.className = "friend-card";
    card.innerHTML = `
      <div class="avatar">${letter}</div>
      <h3>${friend.name}</h3>
      <p>${friend.mutual}</p>
      <div class="friend-actions">
        <button class="btn-primary" onclick="viewFriend('${friend.name}')">View</button>
        <button class="logout-btn" onclick="messageFriend('${friend.name}')">Message</button>
      </div>
    `;
    friendsGrid.appendChild(card);
  });
}

function viewFriend(name) {
  addNotification("Friend Profile", `You viewed ${name}'s profile.`);
  alert("Viewing " + name + "'s profile (demo only).");
}

function messageFriend(name) {
  localStorage.setItem("fbActiveChat", name);
  addNotification("Message Opened", `You opened a chat with ${name}.`);
  window.location.href = "messages.html";
}

/* =========================
   MESSAGES PAGE
========================= */
const chatData = {
  "Jane Dignos": [
    { sender: "Jane Dignos", text: "Hii bbyy eat nya ha kay mana kog eat po" },
    { sender: "You", text: "yes po bbyy I will eat napo" },
    { sender: "Jane Dignos", text: "goods ka, eatwell bbyy." }
  ],
  "Clark Justin Umpad": [
    { sender: "Clark Justin Umpad", text: "tah laag pista" },
    { sender: "You", text: "pass dili nako laagan man, mag code nalang kko" }
  ],
  "Vince Rocel Goopio": [
    { sender: "Vince Rocel Goopio", text: "gawn mo skuyla ka ron??" }
  ],
  "John Carlo Nunez": [
    { sender: "John Carlo Nunez", text: "pa like sakong post sa tiktok gaw." }
  ]
};

let activeChatUser = "John Rim Neis";

function renderChatUsers() {
  const chatUserList = document.getElementById("chatUserList");
  if (!chatUserList) return;

  const savedActive = localStorage.getItem("fbActiveChat");
  if (savedActive) activeChatUser = savedActive;

  chatUserList.innerHTML = "";

  Object.keys(chatData).forEach((name) => {
    const item = document.createElement("div");
    item.className = "chat-user-item" + (name === activeChatUser ? " active" : "");
    item.innerHTML = `
      <div class="avatar">${name.charAt(0).toUpperCase()}</div>
      <div>
        <strong>${name}</strong>
        <div class="post-time">Tap to chat</div>
      </div>
    `;

    item.addEventListener("click", function () {
      activeChatUser = name;
      localStorage.setItem("fbActiveChat", name);
      renderChatUsers();
      renderMessages();
    });

    chatUserList.appendChild(item);
  });
}

function renderMessages() {
  const chatMessages = document.getElementById("chatMessages");
  const activeChatName = document.getElementById("activeChatName");
  const activeChatAvatar = document.getElementById("activeChatAvatar");

  if (!chatMessages) return;

  const messages = chatData[activeChatUser] || [];

  if (activeChatName) activeChatName.textContent = activeChatUser;
  if (activeChatAvatar) activeChatAvatar.textContent = activeChatUser.charAt(0).toUpperCase();

  chatMessages.innerHTML = "";

  messages.forEach((msg) => {
    const bubble = document.createElement("div");
    bubble.className = "message-bubble " + (msg.sender === "You" ? "message-right" : "message-left");
    bubble.textContent = msg.text;
    chatMessages.appendChild(bubble);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("messageInput");
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  if (!chatData[activeChatUser]) {
    chatData[activeChatUser] = [];
  }

  chatData[activeChatUser].push({
    sender: "You",
    text: text
  });

  addNotification("Message Sent", `You sent a message to ${activeChatUser}.`);
  input.value = "";
  renderMessages();
}

/* =========================
   NOTIFICATIONS
========================= */
function addNotification(title, text) {
  const notifications = getNotifications();

  notifications.unshift({
    title,
    text,
    time: new Date().toLocaleString(),
    read: false
  });

  saveNotifications(notifications);
}

function seedDemoNotifications() {
  const demo = [
    {
      title: "New Friend Suggestion",
      text: "Sophia Lee might be someone you know.",
      time: new Date().toLocaleString(),
      read: false
    },
    {
      title: "Welcome Back",
      text: "Check your latest messages and posts.",
      time: new Date().toLocaleString(),
      read: false
    },
    {
      title: "Security Notice",
      text: "Your account activity looks normal.",
      time: new Date().toLocaleString(),
      read: true
    }
  ];

  const current = getNotifications();
  saveNotifications([...demo, ...current]);
  renderNotifications();
  alert("Demo notifications added.");
}

function renderNotifications() {
  const notificationsList = document.getElementById("notificationsList");
  if (!notificationsList) return;

  const notifications = getNotifications();
  notificationsList.innerHTML = "";

  if (notifications.length === 0) {
    notificationsList.innerHTML = `
      <div class="notification-card">
        <h3>No notifications yet</h3>
        <p class="post-time">Your updates will appear here.</p>
      </div>
    `;
    return;
  }

  notifications.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "notification-card" + (item.read ? "" : " unread");
    card.innerHTML = `
      <div class="notification-top">
        <div>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
          <span class="post-time">${item.time}</span>
        </div>
        <button class="logout-btn small-btn" onclick="markNotificationRead(${index})">
          ${item.read ? "Read" : "Mark Read"}
        </button>
      </div>
    `;
    notificationsList.appendChild(card);
  });
}

function markNotificationRead(index) {
  const notifications = getNotifications();
  if (!notifications[index]) return;
  notifications[index].read = true;
  saveNotifications(notifications);
  renderNotifications();
}

function markAllNotificationsRead() {
  const notifications = getNotifications().map(item => ({
    ...item,
    read: true
  }));
  saveNotifications(notifications);
  renderNotifications();
}

/* =========================
   SETTINGS / DARK MODE
========================= */
function applyTheme() {
  const theme = getTheme();
  document.body.classList.toggle("dark-mode", theme === "dark");
}

function setupDarkModeToggle() {
  const toggle = document.getElementById("darkModeToggle");
  if (!toggle) return;

  const currentTheme = getTheme();
  toggle.checked = currentTheme === "dark";

  toggle.addEventListener("change", function () {
    const newTheme = toggle.checked ? "dark" : "light";
    saveTheme(newTheme);
    applyTheme();
    addNotification("Theme Updated", `Theme changed to ${newTheme} mode.`);
  });
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", function () {
  requireLogin();
  applyTheme();
  loadCurrentUser();
  addDefaultPostsIfEmpty();

  renderPosts();
  renderMyPosts();
  renderFriends();
  renderChatUsers();
  renderMessages();
  renderNotifications();
  setupDarkModeToggle();
});
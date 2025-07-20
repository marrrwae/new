// ✅ Make sure this file is in the same folder as index.html

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const remember = document.getElementById("remember").checked;
    const message = document.getElementById('message')

    const correctPassword = "1234";

    if (password === correctPassword) {
      if (remember) {
        localStorage.setItem("savedUsername", username);
        localStorage.setItem("savedEmail", email);
      }
      // alert("✅ Login successful! Welcome, " + username + "!");
      message.innerHTML = "<p>✅ Login successful! Welcome, " + username + "! </p>"
      message.style.color = "green" 
    } else {
      // alert("❌ Incorrect password. Try again.");
      message.innerText = "❌ Incorrect password. Try again."
      message.style.color = "red"

    }
  });
});

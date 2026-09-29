// Confirmation popup before closing a quiz page

console.log("confirmexit.js linked");

window.addEventListener("beforeunload", (event) => {
  event.preventDefault();
  event.returnValue = "";
});
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

if (
  accessToken !== "undefined" &&
  accessToken !== null &&
  accessToken !== "" &&
  refreshToken !== "undefined" &&
  refreshToken !== null &&
  refreshToken !== ""
) {
  window.location.href = "index.html";
}

const submitForm = (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  const fetch = new XMLHttpRequest();
  fetch.open("POST", "https://freddy.codesubmit.io/login");
  fetch.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  fetch.send(
    JSON.stringify({
      username: username,
      password: password,
    })
  );
  fetch.onreadystatechange = function () {
    if (this.readyState == 4) {
      const response = JSON.parse(this.responseText);
      console.log(response);

      if (this.status == 200) {
        localStorage.setItem("accessToken", response.access_token);
        localStorage.setItem("refreshToken", response.refresh_token);
        window.location.href = "index.html";
      }
    } else {
      if (this.status == 401) {
        errorMessage.innerHTML = "Bad credentials";
      } else if (this.status == 500) {
        errorMessage.innerHTML = "Internal server error.";
      }
    }
  };
};

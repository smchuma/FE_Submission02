let accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

if (accessToken == null) {
  window.location.href = "login.html";
}

const xhr = new XMLHttpRequest();
xhr.open("POST", "https://freddy.codesubmit.io/refresh");
xhr.setRequestHeader("Authorization", "Bearer " + refreshToken);
xhr.send("refreshToken" + refreshToken);
xhr.onload = () => {
  const response = JSON.parse(xhr.response);

  if (xhr.status == 200) {
    accessToken = response.access_token;
    localStorage.setItem("accessToken", response.access_token);
  }
};

const loadUser = () => {
  const fetch = new XMLHttpRequest();
  fetch.open("GET", "https://freddy.codesubmit.io/dashboard");
  fetch.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  fetch.setRequestHeader("Authorization", "Bearer " + accessToken);
  fetch.responseType = "json";

  fetch.onload = () => {
    const data = fetch.response;
    console.log(data);
  };
  fetch.send();
};
loadUser();

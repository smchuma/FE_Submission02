const accessToken = localStorage.getItem("accessToken");

if (accessToken == null) {
  window.location.href = "login.html";
}

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

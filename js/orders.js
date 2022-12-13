import { fetchRefresh } from "./utils/fetchRefresh.js";
import { fetchData } from "./utils/fetchData.js";
import { logout } from "./utils/logout.js";

let accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");
const url = "https://freddy.codesubmit.io/orders";
const refreshUrl = "https://freddy.codesubmit.io/refresh";

if (accessToken == null) {
  window.location.href = "login.html";
}

// function to refresh the token
fetchRefresh(refreshUrl, accessToken, refreshToken);

const fetchOrders = () => {
  fetchData(accessToken, url).then((orders) => {
    console.log(orders);
    const placeholder = document.getElementById("data-output");
    let output = "";
    orders.orders.forEach((item) => {
      output += `
            <tr>
            <td>${item.product.name}</td>
            <td>${item.created_at}</td>
            <td></td>
            <td>${item.status}</td>
            </tr>`;
    });
    placeholder.innerHTML = output;
  });
};
fetchOrders(url, accessToken);

// const logoutUser = document.getElementById("logoutUser");
// logoutUser.addEventListener("click", () => logout(accessToken, refreshToken));

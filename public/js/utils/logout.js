export const logout = (accessToken, refreshToken) => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "./login.html";
};

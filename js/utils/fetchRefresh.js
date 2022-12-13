export const fetchRefresh = (method, url, accessToken, refreshToken) => {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader("Authorization", "Bearer " + refreshToken);
  xhr.send("refreshToken" + refreshToken);

  xhr.onload = () => {
    const response = JSON.parse(xhr.response);
    if (xhr.status == 200) {
      accessToken = response.access_token;
      localStorage.setItem("accessToken", response.access_token);
    }
  };
};

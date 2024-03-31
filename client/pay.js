window.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("signin-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      function getCookie(name) {
        const cookies = document.cookie.split('; ');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].split('=');
          if (cookie[0] === name) {
            return cookie[1];
          }
        }
        return null;
      }
      
      const customerCode = getCookie('customer');
      console.log(customerCode);

      let { authorization_url }  = await fetch("/payment/initial-payment", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerCode
        }),
      })
        .then((res) => res.json())
        .catch((error) => console.log(error));

        window.location.href = authorization_url;
    });
  }
});

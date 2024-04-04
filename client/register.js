window.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("signin-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const firstname = document.getElementById("firstname").value;
      const lastname = document.getElementById("lastname").value;
      const phone = document.getElementById("phone").value;
      const address = document.getElementById("address").value;
      const dob = document.getElementById("dob").value;
      const nextofkin = document.getElementById("nextofkin").value;
      const nextofkinPhone = document.getElementById("nextofkinPhone").value;
      console.log({email,firstname, lastname, phone, address, nextofkin, nextofkinPhone})

      const customer = await fetch("/payment/create-customer", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          firstname, 
          lastname, 
          phone, 
          address,  
          nextofkin, 
          nextofkinPhone
        }),
      })
        .then((res) => res.json())
        .catch((error) => console.log(error));
      window.localStorage.setItem("customer_email", email);
      window.localStorage.setItem("customer_code", customer.customer_code);
      window.localStorage.setItem("customer_id", customer.id);

      window.location.href = "/pay.html";
    });
  }
});
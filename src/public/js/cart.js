
let addToCartById = document.getElementsByClassName("cartInfo")[0];
const API_URL = "http://localhost:8080/api";

function putIntoCart(_id) {
  const cartIdValue = addToCartById?.getAttribute("id");
  const url = API_URL + "/carts/" + cartIdValue + "/product/" + _id;
  const data = {};
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((res) => {
      alert("Product add to cart");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(JSON.stringify(error));
    });    
}

function removeProductFromCart(_id) {
  addToCartById = localStorage.getItem("carrito-id");
  const url = API_URL + "/carts/" + addToCartById + "/products/" + _id;

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((res) => {
      alert("Product removed from cart");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(JSON.stringify(error));
    });
}

//FUNCION PARA VACIAR CARRITO
function clearCart() {
  addToCartById = localStorage.getItem("carrito-id");
  const url = API_URL + "/carts/" + addToCartById;

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  window.location.reload();

  fetch(url, options)
    .then((response) => response.json())
    .then((res) => {
      alert("Cart cleared successfully");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(JSON.stringify(error));
    });
}


const buyButton = document.querySelector("#buy-button");
SetCartID();

async function SetCartID(_id) {
  try {
    if (!buyButton) return;
    const result = await fetch(`/carts/${cart}`);
    const data = await result.json();
    if (!data.payload) return;
    const cartID = data.payload;
    setButton(cartID);
  } catch (error) {
    console.log("Couldn't get cart ID");
  }
}

function setButton(cartID) {
  buyButton.onclick = (e) => {
    const loadingAlert = Swal.fire({
      title: "Loading...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    fetch(`/api/carts/${cart}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "nostock" || result.status === "empty") {
          loadingAlert.close();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: result.message,
          });
        } else if (result.status === "success") {
          loadingAlert.close();
          Swal.fire({
            icon: "success",
            timer: 2500,
            title: "Redirecting to Products Page...",
            text: "Purchase successful!",
            allowOutsideClick: false,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
            },
            willClose: () => {
              // Redirect to another URL after the specified time
              window.location.href = "/products";
            },
          });
        } else {
          loadingAlert.close();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Couldn't purchase items. Try again later!",
          });
        }
      })
      .catch((error) => {
        loadingAlert.close();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  };
}


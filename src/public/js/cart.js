
let addToCartById = document.getElementsByClassName("cartInfo")[0];
const API_URL = "http://localhost:8080/api";

function putIntoCart(_id) {
  const cartIdValue = addToCartById?.getAttribute("id");
  console.log("cartIdValue:", cartIdValue); 
  console.log("_id:", _id);
  if (cartIdValue === undefined) {
    window.location.href = "/api/sessions/current";
  }
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

const purchaseCart = (cartId) => {
  fetch(`/api/carts/${cartId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const products = data.payload.products;
      const formatProduct = products.map((product) => {
        return {
          id: product.id._id,
          quantity: product.quantity,
        };
      });

      fetch(`/api/carts/${cartId}/purchase`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formatProduct),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          const id = data.payload._id;
          setTimeout(() => {
            window.location.href = `/api/carts/purchase/${id}`;
          }, 3000);
          console.log(
            "Productos agregados al ticket"
          );
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

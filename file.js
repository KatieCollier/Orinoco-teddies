/* Get teddy info from the server and store it in an easily usable array*/
const getInfo = async function(){
  let response = await fetch('http://localhost:3000/api/teddies')
  if(response.ok){
    let Teddies = await response.json()
    return Teddies
  }
}

/*####################################################*/
/*functions relating to the vue page*/
/* create a custon HTML element in which to insert the info for each teddy*/
class TeddyCard extends HTMLElement{
  connectedCallback(){
    this.innerHTML = '<div class="card m-2"\>\
                        <div class="card-body pb-0"\>\
                          <div class="img-size">\
                          </div>\
                          <div class="card-text row mb-0 py-2"\>\
                            <a class="stretched-link"></a>\
                            <h2 class="teddy-name col my-auto"> Name </h2\>\
                            <p class="teddy-price col text-right my-auto ml-auto"> Price </p\>\
                          </div\>\
                        </div\>\
                      </div\>';
  }
}

customElements.define('teddy-card', TeddyCard);

/*create a function that loops through all the teddies and fills out a card for each one*/
const createCards = async function(){
    let Teddies = await getInfo();
    let main = document.getElementById("main-vue");
    for(t=0; t<Teddies.length; t++){
      let newCard = document.createElement("teddy-card");
      main.appendChild(newCard);
      let image = document.querySelectorAll(".img-size");
      image[t].innerHTML = "<img class=\"card-img-top mb-2\" src=\"" + Teddies[t].imageUrl + "\" alt=\"\">" ;
      let teddyName = document.querySelectorAll(".teddy-name");
      teddyName[t].innerHTML = Teddies[t].name;
      let teddyPrice = document.querySelectorAll(".teddy-price");
      teddyPrice[t].innerHTML = Teddies[t].price + " €";
      let link = document.querySelectorAll(".stretched-link");
      link[t].id = "card-" + t;
      link[t].href = "product.html?" + Teddies[t]._id;
    }
    
}

/* Create a function to identify which teddy is clicked on in the vue page
  Save teddy number to session storage for future use in filling out product page*/
  const goToProduct = async function(){
    let Teddies = await getInfo();
    let main = document.getElementById("main-vue");
    main.addEventListener("click", function(event){
      let j = parseInt(event.target.id.replace("card-",""));
      sessionStorage.setItem("clickedTeddy", Teddies[j]._id);     
    })
  }

  /* run the vue page function only on the vue page*/
  if(document.getElementById("main-vue")){
    createCards()
    goToProduct()
  }
 

  /*#######################################################*/
  /*Functions for the product page*/
  /*create a function for color translation that will be needed later*/
  const colorTranslation = function(color){
    let frenchColor = "Non défini";
        switch(color){
          case "Brown":
            frenchColor = "Marron";
            break;
          case "Tan":
            frenchColor = "Roux";
            break;
          case "Chocolate":
            frenchColor = "Chocolat";
            break;
          case "White":
            frenchColor = "Blanc";
            break;
          case "Pale brown":
            frenchColor = "Marron clair";
            break;
          case "Dark brown":
            frenchColor = "Marron foncé";
            break;
          case "Blue":
            frenchColor = "Bleu";
            break;
          case "Pink":
            frenchColor = "Rose";
            break;
          case "Black":
            frenchColor = "Noir";
            break;
          case "Beige":
            frenchColor = "Beige";
            break;
        }
        return frenchColor
  }

/* create a function to complet the teddy details in the teddy page*/
const giveTeddyDetails = async function(){
  let Teddies = await getInfo();
  for (i=0; i<Teddies.length; i++){
    let teddy = Teddies[i];
    let clickedTeddy = sessionStorage.getItem("clickedTeddy");
    if(teddy._id == clickedTeddy){
      let productPhoto = document.getElementById("product-photo");
      productPhoto.innerHTML = "<img src=\"" + teddy.imageUrl + "\" alt=\"\">";
      let productName = document.getElementById("product-name");
      productName.innerHTML = teddy.name;
      let productPrice = document.getElementById("product-price");
      productPrice.innerHTML = teddy.price + " €";
      let productDescription = document.getElementById("product-description");
      productDescription.innerHTML = "<strong> Description: </strong>" + teddy.description;
      let productColor = document.getElementById("product-color");
      let colors = teddy.colors;
      for (let k=0; k<colors.length; k++){
        let color = colors[k];
        let newOption = document.createElement("option");
        productColor.appendChild(newOption);
        newOption.value = color;
        newOption.innerHTML = colorTranslation(color);
      }
    }
  }
}

/*create a function that collects necessary info from the product page to add to basket*/
let addToBasket = function(){
  let btnAddBasket = document.getElementById("add-to-basket");
  btnAddBasket.addEventListener("click", function(event){
    let teddyBought = sessionStorage.getItem("clickedTeddy");
    let quantity = parseInt(document.getElementById("product-quantity").value);
    if(localStorage.getItem(teddyBought)){
      let prevQuantity = parseInt(localStorage.getItem(teddyBought));
      localStorage.setItem(teddyBought, prevQuantity+quantity);
    } else {
      localStorage.setItem(teddyBought, quantity);
    }
  })
}

if(document.getElementById("main-product")){
  giveTeddyDetails();
  addToBasket();
}

/*###########################################################*/
/*Functions for the basket page*/
/* create a custom HTML object for the besket items*/
class BasketItem extends HTMLElement{
  connectedCallback(){
    this.innerHTML = "<div class=\"item row m-3 pb-2 px-0\">\
                        <div class=\"col-6 col-md-3 article-miniature align-self-center\">\
                          <a class=\"img-min\" href=\Need URL here\">\
                          </a>\
                        </div>\
                        <div class=\"col article-info my-3 mx-0 mr-sm-3 mr-md-5\">\
                          <div class=\"row align-items-center\">\
                            <div class=\"basket-article col-12 col-lg-3 text-right my-0\">\
                              <a href=\"need URL here\">\
                                <p class=\"order-teddy-name\">  </p>\
                              </a>\
                            </div>\
                            <div class=\"article-price col-12 col-lg-3 text-right my-0\">\
                              <p class=\"order-teddy-price\">  </p>\
                            </div>\
                            <div class=\"article-quantity col-12 col-lg-3 my-0 choice-group\">\
                              <input type=\"number\" name=\"article-quantity\" value=\"1\" class=\"input-number pr-2 mb-2\">\
                            </div>\
                            <div class=\"article-total col-12 col-lg-3 text-right my-0\">\
                              <p> Total price of items € </p>\
                            </div>\
                          </div>\
                        </div>\
                      </div>" 
  }
}

customElements.define('basket-item', BasketItem);

/*Create function to:
fill in basket from add to basket buttons on order page
give the quantity of items ordered - can be updated directly on the basket page
give the total price per item - is updated if the quantity changes
give the totla price of the order - is updated if the quantities of an item change*/
const fillBasket = async function(){
  let Teddies = await getInfo();
  let items = document.getElementById("items");
  let basketTotal = 0;
  let keys = Object.keys(localStorage);
  if(keys.length>0){
    let emptyBasket = document.getElementById("empty-basket");
    emptyBasket.classList.add("not-empty")
  }
  for(let l=0; l<keys.length; l++){
    let key = keys[l];
    let newBasketItem = document.createElement("basket-item");
    items.appendChild(newBasketItem);
    for (let m=0; m<Teddies.length; m++){
      let teddy = Teddies[m];
      if(teddy._id == key){
        let imgMin = document.querySelectorAll(".img-min");
        imgMin[l].innerHTML = "<img src=\"" + teddy.imageUrl + "\" alt=\"\">";
        let orderTeddyName = document.querySelectorAll(".order-teddy-name");
        orderTeddyName[l].innerHTML = teddy.name;
        let orderTeddyPrice = document.querySelectorAll(".order-teddy-price");
        orderTeddyPrice[l].innerHTML = teddy.price + " €";
        let orderTeddyQuantity = document.querySelectorAll(".input-number");
        orderTeddyQuantity[l].value = parseInt(localStorage.getItem(key));
        let articleTotal = document.querySelectorAll(".article-total");
        let articleTotalPrice = teddy.price*orderTeddyQuantity[l].value;
        articleTotal[l].innerHTML = articleTotalPrice + " €";
        basketTotal = basketTotal + articleTotalPrice;
        orderTeddyQuantity[l].addEventListener("change", function(event){
          localStorage.setItem(teddy._id, orderTeddyQuantity[l].value);
          articleTotalPrice = teddy.price*orderTeddyQuantity[l].value;
          articleTotal[l].innerHTML = articleTotalPrice + " €";
        })
      } 
    } 
  }
  let basketTotalPrice = document.getElementById("basket-total-price");
  basketTotalPrice.innerHTML = "Prix total:  " + basketTotal + " €";
  items.addEventListener("change", function(event){
    let articleTotal = document.querySelectorAll(".article-total");
    let basketTotal = 0;
    for(let h=0; h<articleTotal.length; h++){
      let articlePrice = articleTotal[h].innerHTML;
      let nbArticlePrice = parseInt(articlePrice.replace(" €",""));
      basketTotal = basketTotal + nbArticlePrice;
      basketTotalPrice.innerHTML = "Prix total:  " + basketTotal + " €";
    }
  })
}

const emptyBasket = function(){
  let empty = document.getElementById("empty");
  empty.addEventListener("click", function(event){
    localStorage.clear();
    location.reload();
  })
}

/*create function to get order info to later use in the POST request*/
const orderInfo = function(){
  let products = [];/* array with product IDs*/
  let keys = Object.keys(localStorage);
  for (let k=0; k<keys.length; k++){
    let key = keys[k];
    let qty = parseInt(localStorage.getItem(key));
    for(let q=0; q<qty; q++){
      products.push(key);
    }
  }
  let jsonProducts = "\"products\": " + JSON.stringify(products)

  let contact = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value,
  }
  let jsonContact = "\"contact\": " + JSON.stringify(contact);

  let order = "{" + jsonContact + "," + jsonProducts + "}";
  return order
}

/*create function to send order and retrieve order id*/
const sendOrder = async function(data){
  let order = await orderInfo();
  let response = await fetch("http://localhost:3000/api/teddies/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: order
  })
  if(response.ok){
    let data= await response.json();
    let orderId = data.orderId;
    sessionStorage.setItem("orderID", orderId);
    let basketTotalPrice = document.getElementById("basket-total-price");
    let totalAmount = parseInt(basketTotalPrice.innerHTML.replace(/Prix total:  | €/gi, ""));
    sessionStorage.setItem("totalAmount", totalAmount);
    console.log(totalAmount)
    console.log(orderId)
    window.location.href = "confirmation.html";
    localStorage.clear();
  }else{
    console.log("Not Working!")
  }
}

/* send order when the user clicks on the order button*/
const sendOrderOnClick = function(){
  let orderButton = document.getElementById("order");
  orderButton.addEventListener("click", function(event){
    event.preventDefault();
    sendOrder();
  })
}

/*run basket page functions only for the basket page*/
if(document.getElementById("main-basket")){
  fillBasket();
  sendOrderOnClick();
  emptyBasket();
}


/*###################################################################*/
/*Function for the confirmation page*/

/*create function to get order id and enter it in page*/
const getOrderId = function(){
  let orderId = sessionStorage.getItem("orderID");
  let orderNumber = document.getElementById("order-number");
  orderNumber.innerHTML = "Le numéro de votre commande:  " + orderId;
}

/*create function to get total amount of order*/
const getOrderAmount = function(){
  let orderAmount = sessionStorage.getItem( "totalAmount");
  let orderTotal = document.getElementById("order-amount");
  orderTotal.innerHTML = "Le montant de votre commande:  " + orderAmount + " €";
}

/*only run confirmation functions on confirmation page*/
if(document.getElementById("main-confirmation")){
  getOrderId()
  getOrderAmount()
}


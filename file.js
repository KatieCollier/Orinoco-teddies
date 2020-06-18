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
/* create a custon HTML element in which to insert the info for each teddy
this element takes the form of a bootstrap card*/
class TeddyCard extends HTMLElement{
  connectedCallback(){
    this.innerHTML = '<div class="card m-2"\>\
                        <div class="card-body pb-0"\>\
                          <div class="img-size">\
                          </div>\
                          <div class="card-text row mb-0 py-2"\>\
                            <a class="stretched-link" href="product.html"></a>\
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
    let Teddies = await getInfo(); /* needs the info from the server to run */
    let main = document.getElementById("main-vue");
    for(t=0; t<Teddies.length; t++){ /* for each teddy... */
      let newCard = document.createElement("teddy-card");
      main.appendChild(newCard);/*...create and append a new card using the custon element...*/
      /*...and fill in the different sections:*/
      /* Photo of product*/
      let image = document.querySelectorAll(".img-size");
      image[t].innerHTML = "<img class=\"card-img-top mb-2\" src=\"" + Teddies[t].imageUrl + "\" alt=\"\">";
      /* Name of product */
      let teddyName = document.querySelectorAll(".teddy-name");
      teddyName[t].innerHTML = Teddies[t].name;
      /*Price of product*/
      let teddyPrice = document.querySelectorAll(".teddy-price");
      teddyPrice[t].innerHTML = Teddies[t].price + " €";
      /*id of link necessary to fill in the product page that the link leads to*/
      let link = document.querySelectorAll(".stretched-link");
      link[t].id = "card-" + t;
    } 
}

/* Create a function to identify which teddy is clicked on in the vue page
  Save teddy number to session storage for future use in filling out product page*/
  const goToProduct = async function(){
    let Teddies = await getInfo(); /* needs the info from the server to run */
    let main = document.getElementById("main-vue");
    main.addEventListener("click", function(event){/*Listen for clicks on any part of the main section of the HTML page*/
      let j = parseInt(event.target.id.replace("card-","")); /*get number of the link that was clicked on from its id - corresponds to the number of the teddy in the Teddies array*/
      sessionStorage.setItem("clickedTeddy", Teddies[j]._id); /* store the id of the corresponding teddy in the sessionStorage where it can be retrieved from the product page*/    
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

/*create a function use teddy details to fill out product page*/
const fillTeddyDetails = async function(chosenTeddy){
  let Teddies = await getInfo(); /*needs the info from the server to run */
    for (let t=0; t<Teddies.length; t++){ /*loops through the teddies to find which one has the id that matches "choseTeddy"(must be an id number from the server)*/
    let teddy = Teddies[t];  
    if(teddy._id == chosenTeddy){/*if that teddy is found, then use it's info (from the server) to fill in the product page*/
      /*Photo of product*/
        let productPhoto = document.getElementById("product-photo");
        productPhoto.innerHTML = "<img src=\"" + teddy.imageUrl + "\" alt=\"\">";
        /*Name of product*/
        let productName = document.getElementById("product-name");
        productName.innerHTML = teddy.name;
        /*Price of product*/
        let productPrice = document.getElementById("product-price");
        productPrice.innerHTML = teddy.price + " €";
        /*Description of product*/
        let productDescription = document.getElementById("product-description");
        productDescription.innerHTML = "<strong> Description: </strong>" + teddy.description;
        /*Color of product*/
        let productColor = document.getElementById("product-color");
        let colors = teddy.colors; /*gets colors available*/
        for (let k=0; k<colors.length; k++){/*for each color available for this teddy...*/
          let color = colors[k];
          /*creates a new option in the dropdown box...*/
          let newOption = document.createElement("option");
          productColor.appendChild(newOption);
          /*... the value of this option is the color text (in English)*/
          newOption.value = color;
          /*... the text of this option (readable by the user) is the color in French - found using the colorTranslation function*/
          newOption.innerHTML = colorTranslation(color);
      }
    }
  }
}

/*create a function to fill out the product page depending on the circumstances*/
const fillProductPage = function(){
  let storageTeddy = sessionStorage.getItem("clickedTeddy"); /*get id of the teddy that was clicked on in the vue page from the session storage*/  
  fillTeddyDetails(storageTeddy); /*use it to fill in the details of the product page*/
  let url = new URL(window.location.href);
  let params = new URLSearchParams(url.search);
  if(!params.has("id")){/*if the url doesn't have an "id" parameter, then set it*/
    params.set("id", storageTeddy);/*the teddy's id is used for the search parameter "id"*/
    window.history.replaceState({}, '', `${location.pathname}?${params}`);
  } else{/*if the url does have an "id" parameter, then use it to fill out the product page - allows to save the url and come back to the same product page later*/
    let urlTeddy = params.get("id");
    fillTeddyDetails(urlTeddy);
  }
}

/*create a function that collects necessary info from the product page to add to basket*/
let addToBasket = function(){
  let btnAddBasket = document.getElementById("add-to-basket");
  btnAddBasket.addEventListener("click", function(event){ /*when the user clicks on the "add to basket" button...*/
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    let teddyBought = params.get("id"); /* get the id of the bought teddy using the url parameter "id"*/
    let quantity = parseInt(document.getElementById("product-quantity").value);/*get the quantity of teddies bought from the "number of articles" input box*/
    if(localStorage.getItem(teddyBought)){ /*if this article is already present in the basket (localStorage), then...*/
      let prevQuantity = parseInt(localStorage.getItem(teddyBought));
      localStorage.setItem(teddyBought, prevQuantity + quantity); /*...add the old quantity to the new quantity to give the total number of this article in the basket*/
    } else { /*if there are no articles of this type already in the basket (local storage), then...*/
      localStorage.setItem(teddyBought, quantity); /* use the quantity from the input box as the quantity in the basket*/
    }
  })
}

/*only run the product page functions on the product page*/
if(document.getElementById("main-product")){
  fillProductPage();
  addToBasket();
}


/*########################################################################################*/
/*create a function find out how many articles are in the basket*/
const itemsInBasket = function(){
  let keys = Object.keys(localStorage); /*get all the teddy ids stored as keys in the localStorage = each type of teddy that has been added to the basket*/
  let nbItems = 0;
  for (let k=0; k<keys.length; k++){ /* loop through the ids of teddies in basket (=keys), and for each of them...*/
    let nbItem = parseInt(localStorage.getItem(keys[k]));/*...get the number of this type of teddy added to the basket...*/
    nbItems = nbItems + nbItem; /*add this number to the number of articles already in the basket*/
  }
  let basketNb = document.getElementById("items-in-basket");
  basketNb.innerHTML = nbItems; /*insert the total number of articles in the circle on the basket icon*/
}

/* only run this function on pages that have a basket icon*/
if(document.getElementById("items-in-basket")){
  itemsInBasket();
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
                              <a class=\"name-link\" href=\"need URL here\">\
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
fill in basket from "add to basket" button on order page
give the quantity of items ordered - can be updated directly on the basket page
give the total price per item - is updated if the quantity changes
give the total price of the order - is updated if the quantities of any item change*/
const fillBasket = async function(){
  let Teddies = await getInfo(); /*needs the info from the server to run*/
  let items = document.getElementById("items");
  let basketTotal = 0; /*set total price of basket at 0 € until there are items in it*/
  let keys = Object.keys(localStorage); /* =ids of teddies added to basket*/
  if(keys.length>0){/*if there are items in the basket...*/
    let emptyBasket = document.getElementById("empty-basket");
    emptyBasket.classList.add("not-empty")/*...then remove the empty basket message*/
  }
  for(let k=0; k<keys.length; k++){ /*for each type of teddy added to the basket...*/
    let key = keys[k];
    /*...create a new line with the item on the basket page*/
    let newBasketItem = document.createElement("basket-item");
    items.appendChild(newBasketItem);
    for (let t=0; t<Teddies.length; t++){ /*loop through the teddies in the Teddies array (info retrieved from the server)*/
      let teddy = Teddies[t];
      if(teddy._id == key){ /*if the teddy in the basket matches the current teddy from the Teddies array...*/
        /*...fill in the information on the basket page*/
        /*Photo of the product*/
        let imgMin = document.querySelectorAll(".img-min");
        imgMin[k].innerHTML = "<img src=\"" + teddy.imageUrl + "\" alt=\"\">";
        /*link on image to return to the product page*/
        let minLink = document.querySelectorAll(".img-min");
        minLink[k].href = "product.html?id=" + teddy._id;
        /*Name of product*/
        let orderTeddyName = document.querySelectorAll(".order-teddy-name");
        orderTeddyName[k].innerHTML = teddy.name;
        /*link on name of product to return to product page*/
        let nameLink = document.querySelectorAll(".name-link");
        nameLink[k].href = "product.html?id=" + teddy._id;
        /*Price per item of product*/
        let orderTeddyPrice = document.querySelectorAll(".order-teddy-price");
        orderTeddyPrice[k].innerHTML = teddy.price + " €";
        /*Quantity of this product that were added to the basket*/
        let orderTeddyQuantity = document.querySelectorAll(".input-number");
        orderTeddyQuantity[k].value = parseInt(localStorage.getItem(key));
        /*Total price for this product*/
        let articleTotal = document.querySelectorAll(".article-total");
        let articleTotalPrice = teddy.price*orderTeddyQuantity[k].value; /*= price per item multiplied by number of items*/
        articleTotal[k].innerHTML = articleTotalPrice + " €";
        /*add total price for this product to the total price of the basket*/
        basketTotal = basketTotal + articleTotalPrice;
        orderTeddyQuantity[k].addEventListener("change", function(event){/*if there is a change in the quantity of this item (number input box)...*/
          localStorage.setItem(teddy._id, orderTeddyQuantity[k].value); /*...update localStorage (basket)*/
          articleTotalPrice = teddy.price*orderTeddyQuantity[k].value; 
          articleTotal[k].innerHTML = articleTotalPrice + " €"; /*...recalculate total price for that item*/
        })
      } 
    } 
  }
  /*Total Price of basket*/
  let basketTotalPrice = document.getElementById("basket-total-price");
  basketTotalPrice.innerHTML = "Prix total:  " + basketTotal + " €";
  items.addEventListener("change", function(event){ /*if there are any changes to the quantities in the whole basket ...*/
    let articleTotal = document.querySelectorAll(".article-total"); /*get the article totals for each item*/
    let basketTotal = 0;
    for(let h=0; h<articleTotal.length; h++){ /* use the article totals to recalculate the total price of the basket*/
      let articlePrice = articleTotal[h].innerHTML;
      let nbArticlePrice = parseInt(articlePrice.replace(" €",""));
      basketTotal = basketTotal + nbArticlePrice;
      basketTotalPrice.innerHTML = "Prix total:  " + basketTotal + " €";
    }
  })
}

/*create a function to empty the basket on the click of the "empty basket" button*/
const emptyBasket = function(){
  let empty = document.getElementById("empty");
  empty.addEventListener("click", function(event){
    localStorage.clear(); /*clear the localStorage(basket)*/
    location.reload();/*reload the page with the now empty basket*/
  })
}

/*create function to get order info to later use in the POST request*/
const orderInfo = function(){
  let products = [];/* array with product IDs*/
  let keys = Object.keys(localStorage);
  for (let k=0; k<keys.length; k++){ /*for each item in the basket...*/
    let key = keys[k]; /*...get its id*/
    let qty = parseInt(localStorage.getItem(key));/*...get the number of this item in the basket*/
    for(let q=0; q<qty; q++){/*copy the id of the item into the products array as many times as there are items ordered*/
      products.push(key);
    }
  }
  let jsonProducts = "\"products\": " + JSON.stringify(products); /*convert the array to a json object*/

  let contact = {/*create a contact object that uses the values from the contact form*/
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value,
  }
  let jsonContact = "\"contact\": " + JSON.stringify(contact);/*convert the object to a json object*/

  let order = "{" + jsonContact + "," + jsonProducts + "}"; /*concatenate products and contact into an order object in the json format*/
  return order
}

/*create function to send order and retrieve order id*/
const sendOrder = async function(data){
  let order = await orderInfo(); /*needs the information about the order to run*/
  let response = await fetch("http://localhost:3000/api/teddies/order", { /*needs the response from the server to run*/
    method: "POST", /*POST method sends as well as receives data to and from the server*/
    headers: {
      "Content-Type": "application/json"
    },
    body: order
  })
  if(response.ok){ /*if the request has worked: correct data sent and data received, then...*/
    let data= await response.json();
    let orderId = data.orderId;/*get the order id from the response of the server*/
    sessionStorage.setItem("orderID", orderId);/*store it in the sessionStorage to use on the order confirmation page*/
    let basketTotalPrice = document.getElementById("basket-total-price");
    let totalAmount = parseInt(basketTotalPrice.innerHTML.replace(/Prix total:  | €/gi, ""));
    sessionStorage.setItem("totalAmount", totalAmount);/*store total amount of order in the sessionStorage to use on the order confirmation page*/
    window.location.href = "confirmation.html";/*go to the confirmation page*/
    localStorage.clear(); /*clear the localStorage(basket)*/
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
  orderNumber.innerHTML = "Le numéro de votre commande:  <span>" + orderId +"</span>";
}

/*create function to get total amount of order*/
const getOrderAmount = function(){
  let orderAmount = sessionStorage.getItem( "totalAmount");
  let orderTotal = document.getElementById("order-amount");
  orderTotal.innerHTML = "Le montant de votre commande:  <span>" + orderAmount + " € </span>";
}

/*only run confirmation functions on confirmation page*/
if(document.getElementById("main-confirmation")){
  getOrderId()
  getOrderAmount()
}


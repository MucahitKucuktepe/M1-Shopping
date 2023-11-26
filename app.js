const btnDivs = document.getElementById("btns");
const productDivs = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const categoryTitle = document.getElementById("category");

const modalBody=document.querySelector(".modal-body")

let products = [];
let baskets = [];

const getProducts = async ()=>{
    const res = await fetch(
      "https://anthonyfs.pythonanywhere.com/api/products/"
    );

    const data = await res.json()
    // console.log(data);

    products=data
    console.log(products);
}
getProducts()
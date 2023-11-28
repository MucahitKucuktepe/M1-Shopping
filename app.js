const btnDivs = document.getElementById("btns");
const productDivs = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const categoryTitle = document.getElementById("category");
const canvasBody = document.querySelector(".offcanvas-body");
const hesap = document.getElementById("toplam-tutar");
const sepeteEkle = document.querySelector(".ekle");

const modalBody = document.querySelector(".modal-body");
const sepet = document.getElementById("sepet");
const btnColors = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "danger",
  "light",
  "dark",
];
let products = [];
let baskets = [];

const getProduct = async () => {
  const res = await fetch("https://anthonyfs.pythonanywhere.com/api/products/");

  const data = await res.json();
  // console.log(data);
  products = data;
  // console.log(products);
  category();
  displayProducts(products);
};
getProduct();

const category = () => {
  console.log(products);

  // const categoryArr=products.reduce((acc,item)=>{
  //     if(!acc.includes(item.category)){
  //         acc.push(item.category)
  //     }
  //     return acc
  // },["all"])
  // console.log(categoryArr);

  // let categoryArr2=["ALL"]

  // products.forEach(item=>{
  //     if(!categoryArr2.includes(item.category)){
  //         categoryArr2.push(item.category)
  //     }
  // })
  // console.log(categoryArr2);

  // const categoryArr3=["ALL3",...new Set(products.map(item=>{
  //     return item.category
  // }))]
  // console.log(categoryArr3);
  // //+ 1.yol
  // const categoryArr=products.reduce((acc,item)=>{
  //     if(!acc.includes(item.category)){
  //        acc.push(item.category)
  //     }
  // return acc
  // },["all"])
  // console.log(categoryArr);

  //+ 2.yol

  // let categoryArr=["all"]
  // products.forEach(item=>{
  //     if(!categoryArr.includes(item.category)){
  //         categoryArr.push(item.category)
  //     }
  // })
  // console.log(categoryArr);

  //+3.yol

  const categoryArr = [
    "all",
    ...new Set(
      products.map((item) => {
        return item.category;
      })
    ),
  ];
  console.log(categoryArr);

  //   categoryArr.forEach((category, i) => {
  //     const btn = document.createElement("button");
  //     btn.innerText = category.toUpperCase();
  //     btn.classList.add("btn",`btn-${btnColors[i]}`)
  //     btnDivs.appendChild(btn);
  //   });

  // categoryArr.forEach((category,i)=>{
  //     const btn=document.createElement("button")
  //     btn.innerText=category.toUpperCase()
  //     btn.classList.add("btn",`btn-${btnColors[i]}`)
  //     btnDivs.appendChild(btn)
  // })

  categoryArr.forEach((category, i) => {
    const btn = document.createElement("button");
    btn.classList.add("btn", `btn-${btnColors[i]}`);
    btn.innerText = category.toUpperCase();
    btnDivs.appendChild(btn);
  });
};

//!ürünleri dom a bastırma işlemi

const displayProducts = (arr) => {
  productDivs.innerHTML = "";
  arr.forEach((item) => {
    const { id, description, price, title, image } = item;
    const productDiv = document.createElement("div");
    productDiv.classList.add("col");
    productDiv.setAttribute("id", id);

    productDiv.innerHTML = ` <div class="card">
             <img src="${image}" class="p-2" height="250px" alt="...">
            <div class="card-body">
      <h5 class="card-title line-clamp-1">${title}</h5>
               <p class="card-text line-clamp-3">${description}</p>
             </div>
             <div class="card-footer w-100 fw-bold d-flex justify-content-between gap-3">
             <span>Price:</span><span>${price} $</span>
                
             </div>
             <div class="card-footer w-100 d-flex justify-content-center gap-3">
                 <button class="btn btn-danger ekle">
                 Sepete Ekle
                 </button>
                 <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                 See Details
                 </button>
            </div>
           </div>`;
    productDiv.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-danger")) {
        addToCart(item);
        ekle(item);
        calculateTotalPrice();
      } else if (e.target.classList.contains("btn-primary")) {
        showModal(item);
      }
    });
    productDivs.appendChild(productDiv);
  });
};

//!Sepete ekleme-çıkarma fonksiyonu

const addToCart = (product) => {
  if (baskets.some((item) => item.title === product.title)) {
    baskets = baskets.map((item) => {
      return item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item;
    });
  } else {
    baskets.push(product);
  }
};

const addToCart2 = (product) => {
  if (baskets.some((item) => item.title === product.title)) {
    baskets = baskets.map((item) => {
      return item.id === product.id
        ? { ...item, quantity: item.quantity - 1 }
        : item;
    });
  }
};

const removeProduct = (product) => {
  const index = baskets.indexOf("product");
  return delete baskets[index];
};

//!! FİLTRELEME İŞLEMLERİ

btnDivs.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn")) {
    const selectedCategory = e.target.innerText.toLowerCase();
    categoryTitle.innerText = selectedCategory.toUpperCase();
    const value = searchInput.value;
    const filteredProducts = filtered(selectedCategory, value);

    displayProducts(filteredProducts);
  }
});

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  const selectedCategory = categoryTitle.innerText.toLowerCase();
  const filteredProducts = filtered(selectedCategory, value);
  displayProducts(filteredProducts);
});

function filtered(selectedCategory, value) {
  const newArr =
    selectedCategory === "all"
      ? products
      : products.filter(
          (item) =>
            item.category.toLowerCase() === selectedCategory &&
            item.title.toLowerCase().includes(value.toLowerCase())
        );
  return newArr;
}

//! Modal kısmına ekleme

function showModal(product) {
  const { image, title, description, price } = product;
  modalBody.innerHTML = `
  <div class="text-center">
    <img src="${image}" class="p-2" height="250px" alt="...">
    <h5 class="card-title">${title}</h5>
    <p class="card-text">${description}</p>
    <p class="card-text">Fiyat: ${price} $</p>
    </div>
  
  `;
}

//! sepetteki ürünleri canvas kısmına basma

const ekle = () => {
  canvasBody.innerHTML = "";

  baskets.forEach((item) => {
    const { id, image, title, quantity, price } = item;
    const cart = document.createElement("div");

    cart.innerHTML = `
<div class="offcanvas-body">
        <div class="card mb-3" style="max-width: 540px">
          <div id="${id}" class="row g-0">
            <div class="col-md-4 my-auto">
              <img
                src="${image}"
                class="img-fluid rounded-start"
                alt="..."
              />
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <div class="d-flex align-items-center gap-2" role="button">
                  <i
                    class="fa-solid fa-minus border rounded-circle bg-danger text-white p-2"
                  ></i
                  ><span class="fw-bold quantity">${quantity}</span
                  ><i
                    class="fa-solid fa-plus border bg-danger text-white rounded-circle p-2"
                  ></i>
                </div>
                <p class="card-text">Total : <span id="price" >${price} </span> x <span id="adet">${quantity}</span> =<span id="total-price">${(
      price * quantity
    ).toFixed(2)}$</span></p>
                <button class="btn btn-danger remove">Remove</button>
              </div>
            </div>
          </div>
        </div>
      </div>

`;

    canvasBody.appendChild(cart);
    adet();
  });
};

//!sepete eklenen ürünlerin toplanması fonksiyonu

const adet = () => {
  return (sepet.innerText = baskets.reduce(
    (acc, item) => acc + item.quantity,
    0
  ));
};

// //!sepetteki ürünlerin toplam fiyatını bulan fonksiyon

// const hesapla = () => {
//   const totalAdet = document.querySelector(".quantity").innerText;
//   const productprice = document.querySelector("#price").innerText;
//   const totalPrice = document.querySelector("#total-price");
//   totalPrice.textContent = totalAdet * productprice;
// };

//!SEPET KISMINA EVENT TANIMLAMA
canvasBody.addEventListener("click", (e) => {
  // console.log(e.target);
  // if (e.target.classList.contains("fa-minus")) {
  //   alert("minus");
  // } else if (e.target.classList.contains("fa-plus")) {
  //   alert("plus");
  // } else if (e.target.classList.contains("remove")) {
  //   alert("remove");
  // }

  if (e.target.classList.contains("fa-plus")) {
    e.target.closest(".card-body").querySelector("#adet").innerText++;
    e.target.previousElementSibling.innerText++;
    sepet.innerText++;
    const title = e.target
      .closest(".card-body")
      .querySelector(".card-title").innerText;
    // console.log(title);

    const filteredProduct = baskets.filter((product) => product.title == title);
    addToCart(filteredProduct[0]);
    console.log(baskets);
    console.log(filteredProduct[0]);
    calculateProductPrice(e.target);
    calculateTotalPrice();
  } else if (e.target.classList.contains("fa-minus")) {
    if (e.target.nextElementSibling.innerText >= 1) {
      e.target.closest(".card-body").querySelector("#adet").innerText--;
      e.target.nextElementSibling.innerText--;
      sepet.innerText--;
      const title = e.target
        .closest(".card-body")
        .querySelector(".card-title").innerText;
      // console.log(title);
      const filteredProduct = baskets.filter(
        (product) => product.title == title
      );
      addToCart2(filteredProduct[0]);
      console.log(baskets);
      calculateProductPrice(e.target);
      calculateTotalPrice();
    }
  } else if (e.target.classList.contains("remove")) {
    e.target.closest(".offcanvas-body").remove();
    const title = e.target
      .closest(".card-body")
      .querySelector(".card-title").innerText;
    // console.log(title);
    const filteredProduct = baskets.filter((product) => product.title == title);
    console.log(filteredProduct[0]);
    baskets = baskets.filter((item) => item !== filteredProduct[0]);
    calculateTotalPrice();
    sepet.innerText = baskets.reduce(
      (acc, product) => acc + product.quantity,
      0
    );
  }
});

//!ÜRÜNLERİN TOPLAM FİYATLARINI HESAPLAMA FONKSİYONU
const calculateProductPrice = (btn) => {
  const totalAdet = btn
    .closest(".card-body")
    .querySelector("#adet").textContent;
  const productprice = btn
    .closest(".card-body")
    .querySelector("#price").textContent;
  const totalPrice = btn.closest(".card-body").querySelector("#total-price");
  console.log(totalPrice);
  console.log(totalAdet);
  console.log(productprice);
  totalPrice.textContent = (totalAdet * productprice).toFixed(2) + "$";
};
//! TOPLAM SEPET TUTARINI HESAPLAMA
const calculateTotalPrice = () => {
  return (hesap.innerText =
    baskets
      .reduce((acc, item) => acc + item.quantity * item.price, 0)
      .toFixed(2) + "$");
};

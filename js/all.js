const productList = document.querySelector('.productWrap');
const productSelect = document.querySelector('.productSelect');
const cartList = document.querySelector('.cartList');
const total = document.querySelector('.total');
const clear = document.querySelector('.discardAllBtn');
const orderForm = document.querySelector('.orderInfo-form');
let str = ``;
let strSelect = ``;
let strCart = ``;
let productData = [];
let cartData = [];
let productId;
const Name = document.getElementById("customerName")
const phone = document.getElementById('customerPhone');
const email = document.getElementById('customerEmail');
const address = document.getElementById('customerAddress');
const payment = document.getElementById('tradeWay');
const submit = document.querySelector('.orderInfo-btn');


//初始化
function initial() {
    renderProductList();
    renderCartList();
}
initial();

//產品列表
function renderProductList() {
    axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/products`)
        .then((response) => {
            str = ``;
            productData = response.data.products
            console.log(productData);
            productData.forEach((item) => {
                str += `<li class="productCard">
                <h4 class="productType">新品</h4>
                <img src=${item.images} alt="">
                <a href="#" class="addCardBtn" itemID="${item.id}">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$${item.origin_price}</del>
                <p class="nowPrice">NT$${item.price}</p>
            </li>`
            });
            productList.innerHTML = str;
        })
}

//產品篩選
//在篩選後forEach內容的地方卡住，不知怎麼只讓篩選的條件組字串
//解決之後發現等號==右邊不知道要放什麼，怎不能一個個中文字下去寫，用getAttribute('value')也沒用
productSelect.addEventListener('change', function(e) {
    axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/products`)
        .then((response) => {
            strSelect = ``;

            productData.forEach((item) => {
                if (item.category == e.target.value) {
                    strSelect += `<li class="productCard">
                <h4 class="productType">新品</h4>
                <img src=${item.images} alt="">
                <a href="#" class="addCardBtn">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$${item.origin_price}</del>
                <p class="nowPrice">NT$${item.price}</p>
            </li>`
                    productList.innerHTML = strSelect;
                } else if (e.target.value == '全部') {
                    renderProductList();
                }
            });
        })

})

//購物車列表
//innerHTML程式碼的位置在forEach裡面或外面，會影響刪除後資料更新的渲染
function renderCartList(item) {
    axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`)
        .then((response) => {
            strCart = ``;
            let totalPrice = 0;
            cartData = response.data.carts
            cartData.forEach((item) => {
                strCart += `<tr>
                    <td>
                        <div class="cardItem-title">
                            <img src="${item.product.images}" alt="">
                            <p>${item.product.title}</p>
                        </div>
                    </td>
                    <td>NT$${item.product.price}</td>
                    <td>${item.quantity}</td>
                    <td>NT$${item.product.price*item.quantity}</td>
                    <td class="discardBtn">
                        <a href="#" class="material-icons" orderID="${item.id}">
                            clear
                        </a>
                    </td>
                </tr> `

                totalPrice += (item.product.price) * (item.quantity);

            })
            cartList.innerHTML = strCart;
            total.innerHTML = `NT$${totalPrice}`;
        })
}

//刪除訂單
cartList.addEventListener('click', function(e) {
    if (e.target.getAttribute('class') == 'material-icons') {
        let cartID = e.target.getAttribute('orderID');
        axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts/${cartID}`)
            .then((response) => {
                alert('Item Deleted!');
                renderCartList();
            })
    }
})

//全部清空
clear.addEventListener('click', function(e) {
    axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`)
        .then((response) => {
            alert('Clear All!');
            renderCartList();
        })

})

//加入購物車
//如何看購物車已有的品項，再累加數量或新增
productList.addEventListener('click', function(e) {
    productId = e.target.getAttribute('itemID');
    let addNum = 1;

    cartData.forEach((item) => {
        if (item.product.id == productId) {
            addNum += item.quantity;
            return;
        }
    })
    axios.post(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`, {
            "data": {
                "productId": productId,
                "quantity": addNum
            }
        })
        .then((response) => {
            alert('Item Added!');
            renderCartList();
        })

})

// 提交訂單
//程式碼都一樣的情況下，用大範圍監聽再點到送出有作用的話，會發生網頁錯誤400的問題
submit.addEventListener('click', (e) => {
    e.preventDefault();
    if (cartData == []) {
        alert('Please add items in shopping cart!');
        return;
    }

    if (Name.value == '' || phone.value == '' || email.value == '' || address.value == '') {

        alert('Please insert the right data!');
        return;
    }
    axios.post(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/orders`, {
            "data": {
                "user": {
                    "name": Name.value,
                    "tel": phone.value,
                    "email": email.value,
                    "address": address.value,
                    "payment": payment.value
                }
            }
        })
        .then((response) => {
            alert('Order submitted!');
            renderCartList();
            Name.value = '';
            phone.value = '';
            email.value = '';
            address.value = '';
        });


})
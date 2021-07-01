const orderTable = document.querySelector('.js-orderList');
let str = ``;
const orderStatus = document.querySelector('.orderStatus');
const deleteAll = document.querySelector('.discardAllBtn');
let orderData;
let status = '';

function init() {
    renderOrderList();
}
init();

function renderOrderList() {
    axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders`, { headers: { 'authorization': token } })
        .then((response) => {
            orderData = response.data.orders;
            str = ``;
            orderData.forEach((item) => {
                //訂單狀態
                if (item.paid == true) { status = "已處理" } else if (item.paid == false) { status = "未處理" };

                //訂單品項
                let strItem = ``;
                item.products.forEach((item) => {
                    strItem += `${item.title}x${item.quantity}`
                });

                //訂單日期
                let time = new Date(item.createdAt * 1000);
                strTime = `${time.getFullYear()}/${time.getMonth()+1}/${time.getDate()}`;

                //組表單字串
                str += ` <tr>
                <td>${item.id}</td>
                <td>
                    <p>${item.user.name}</p>
                    <p>${item.user.tel}</p>
                </td>
                <td>${item.user.address}</td>
                <td>${item.user.email}</td>
                <td>
                    <p>${strItem}</p>
                </td>
                <td>${strTime}</td>
                <td>
                    <a href="#" class="orderStatus" orderID=${item.id} statusID=${item.paid}>${status}</a>
                </td>
                <td>
                    <input type="button" class="delSingleOrder-Btn" orderID=${item.id} value="刪除">
                </td>
            </tr>`
            })
            orderTable.innerHTML = str;
            renderC3();
        })
}

//訂單狀態
//PUT 404 403 (Forbidden)
orderTable.addEventListener('click', function(e) {
    if (e.target.getAttribute('class') == "orderStatus") {
        let ID = e.target.getAttribute('orderID')
        let statusID = e.target.getAttribute('statusID')
        let updatedStatus;
        if (statusID == false) {
            updatedStatus = true
        } else if (statusID == true) {
            updatedStatus = false
        }
        axios.put(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders`, { headers: { 'authorization': token } }, {
                "data": {
                    "id": ID,
                    "paid": updatedStatus
                }
            })
            .then((response) => {
                alert('Status Changed!');
                renderOrderList();
            })
    }
})


//刪除訂單
orderTable.addEventListener('click', function(e) {
    if (e.target.getAttribute('class') == 'delSingleOrder-Btn') {
        let ordersID = e.target.getAttribute('orderID');
        axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders/${ordersID}`, { headers: { 'authorization': token } })
            .then((response) => {
                alert('Order Deleted!');
                renderOrderList();
            })
    }
})

//清除全部訂單
deleteAll.addEventListener('click', (e) => {
    axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders`, {
            headers: {
                'authorization': token,
            }
        })
        .then((response) => {
            alert('All deleted!');
            renderOrderList();
        })

})

//圓餅圖
function renderC3() {

    let total = {};
    orderData.forEach((item) => {
        item.products.forEach((productItem) => {
            if (total[productItem.category] == undefined) { total[productItem.category] = productItem.price * productItem.quantity } else {
                total[productItem.category] += productItem.price * productItem.quantity
            }
        })
    })

    //做出資料關聯//
    let categoryAry = Object.keys(total);
    let newData = [];
    categoryAry.forEach((item) => {
        let ary = [];
        ary.push(item);
        ary.push(total[item]);
        newData.push(ary);
    })


    // C3.js
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: newData
        }
    });
}


//     data: {
//         type: "pie",
//         columns: [
//         ['Louvre 雙人床架', 1],
//         ['Antony 雙人床架', 2],
//         ['Anty 雙人床架', 3],
//         ['其他', 4],
//         ],
//         colors:{
//             "Louvre 雙人床架":"#DACBFF",
//             "Antony 雙人床架":"#9D7FEA",
//             "Anty 雙人床架": "#5434A7",
//             "其他": "#301E5F",
//         }
//     },
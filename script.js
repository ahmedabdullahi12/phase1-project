const apikey ='1d0cdcd3adab4da9b048845f98462b77'
const apiurl ='https://api.spoonacular.com/food/menuItems/424571'

document.addEventListener("DOMContentLoaded", () => {
    getMenu();
});

let menu = [];

function getMenu() {
    fetch("http://localhost:3000/menu")
        .then(res => res.json())
        .then(data => {
            menu = [...data];
            displayMenu(menu);
            if (menu.length > 0) {
                displayMenuDetails(menu[0]);
            }
        });
}

function displayMenu(menuData) {
    const menuList = document.getElementById("menu-list");
    menuList.innerHTML = '';

    menuData.forEach((menuItem) => {
        const listItem = document.createElement("li");
        listItem.textContent = menuItem.title;
        listItem.addEventListener("click", () => {
            displayMenuDetails(menuItem);
        });
        menuList.appendChild(listItem);
    });
}

function displayMenuDetails(menuItem) {
    const menuDetails = document.querySelector("#menu-details");
    menuDetails.innerHTML = `
        <div class="card" style="width: 100%; max-width: 500px;">
            <img src="${menuItem.image}" class="card-img-top" alt="${menuItem.title}">
            <h2>Menu Title: ${menuItem.title}</h2>
            <p>Price: $${menuItem.price.toFixed(2)}</p>
            <p>Quantity Available: <span id="quantity">${menuItem.qnty}</span></p>
            <button id="btn-buy">BUY</button>
            <button id="btn-like">LIKE</button>
        </div>
    `;

    const buyButton = document.querySelector("#btn-buy");
    buyButton.addEventListener("click", () => {
        if (menuItem.qnty > 0) {
            const updatedItem = { ...menuItem, qnty: menuItem.qnty - 1 };

            fetch(`http://localhost:3000/menu/${updatedItem.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    qnty: updatedItem.qnty
                })
            }).then(() => {
                // Update the displayed quantity without reloading the page
                const quantitySpan = document.getElementById("quantity");
                quantitySpan.textContent = updatedItem.qnty;
            });
        } else {
            alert("Item is out of stock!");
        }
    });

    const likeButton = document.querySelector("#btn-like");
    likeButton.addEventListener("click", () => {
        alert("You liked this item!");
    });
}



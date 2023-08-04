import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-fec21-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)

const database = getDatabase(app)
const ShoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const shoppingListUl = document.getElementById("shopping-list")

inputBtn.addEventListener("click", function() {
    let inputValue = inputFieldEl.value

    push(ShoppingListInDB, inputValue)

    clearInputFieldEl()
})

onValue(ShoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        clearShoppingListUl()

        for (let i = 0; i < itemsArray.length; i++) {
            let CurrentItem = itemsArray[i]

            appendItemToShoppingListEl(CurrentItem)
        }
    } else {
        shoppingListUl.innerHTML = "Nothing in cart... yet"
    }
})

function clearShoppingListUl() {
    shoppingListUl.innerHTML = ""
}

function clearInputFieldEl()  {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")
    newEl.textContent = itemValue

    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })

    shoppingListUl.append(newEl)
}
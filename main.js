
// Selecting elements

(function(){
    const formElm = document.querySelector('form')
const nameInputElm = document.querySelector('.product-name')
const priceInputElm = document.querySelector('.product-price')
const listGroupElm = document.querySelector('.list-group')
const filterElm = document.querySelector('#filter')
const submitBtnElm = document.querySelector('.add-product')


//tracking Input Item in data store

let products = []

function init(){
    let updatedProductID


    formElm.addEventListener('submit', (evt)=>{
        evt.preventDefault()
    
        // Receiving User Given Inputs From (receiveInputs ())
       const  {name,price} = receiveInputs() // return kora value gulo ke destructure korlam 
      
       // Ebar Input er data guloke receive er por validation check korbo 
       
       const isError = validateInput(name,price)
       
       // ekon jodi validateInput function trough te check kora
       // name and price e jodi error na thake 
       if (isError){
           alert('Provide Valid Input')
           return
       }
    
       if (!isError){
    
        // add item to data store to keep track of product based on unique ID
    
        const id = products.length
        const product = {
            id: id,
            name: name,
            price: price

        }
        products.push(product)
        // add item to UI
        // UI te show korate gele age ui element ke select korte hobe Line 7
    
        // ekon ekta function call korbo jar through te input gulo 
        //UI te add hobe 
        addItemToUI(id,name,price)
    
        // input add howar por input field reset
        resetInput()

        //add item to local storage 
        addItemToStorage(product)

       }
    
        
    })

    formElm.addEventListener('click', (evt)=>{
        if(evt.target.classList.contains('update-product')){
            // Pick data from input field
            const {name,price} = receiveInputs()
            // validating updated inputs
           const isError= validateInput(name,price)
           if(isError){
               alert('Provide Valid Input')
               return
           }
        

            // Updating data in Data source 
           products = products.map((product)=>{
                if(product.id===updatedProductID){
                    // item updated
                    return{
                        id: product.id,
                        name:name,
                        price: price
                    }

                }else{
                    return product//
                }
                
            })
              // reset input Field 
                 resetInput()
           
        // Updated data then updated in UI

             showAllItemsToUI(products)

        // After update show submit button and hide Update Button

        submitBtnElm.style.display = 'block'
        document.querySelector('.update-product').remove()


        // Updating data in local storage 
        const product = {
            id: updatedProductID,
            name: name,
            price: price
        }

        updateProductToLocalStorage(product)
        }

      
        
          
        
    })
    // Dynamically add howa prodcut Item ke 
// delete korte amra event Delegation use korbo 

// Je data add hosse li te ter parent ke dhore event apply korbo 

// Now Deleting Product item From UI

    listGroupElm.addEventListener('click', (evt)=>{

        if (evt.target.classList.contains('delete-item')){
    
            // Je item delete korbo ter id dhorte hobe
            const id = getItemID(evt.target)
    
            // delete item from UI id dhore 
            removeItemFromUI(id)
            //delete Item from data store id dhore
            removeItemFromDataStore(id) 
            //delete item from local storage
            removeProductFromStorage(id)
          
        }else if (evt.target.classList.contains('edit-item')){

           // je item edit hobe setar id pick korbo
           updatedProductID = getItemID(evt.target)
           
           // then find the Item attached to id
           const foundProduct = products.find((product)=>product.id === updatedProductID)
          

           // populate item to UI
           populateUIInEditState(foundProduct)
           // Show Update Button
           if(!document.querySelector('.update-product')){
            showUpdateBtn()
           }
          
       

        }
       
       })

    
    
    // filtering / searching item data store er upor base kore
    
    filterElm.addEventListener('keyup', (evt)=>{
        const filterValue = evt.target.value
        const filteredArr = products.filter((product) =>{
            product.name.includes(filterValue)
            
        })
        
        showAllItemsToUI(filteredArr)
        // Searched item ke UI te show korbo
    
    
    
    })
 
    document.addEventListener('DOMContentLoaded', (e)=>{
        // checking if any product is available in local storage

        if(localStorage.getItem('storeProducts')){
            products = JSON.parse(localStorage.getItem('storeProducts'))
            //Show Items to UI
            showAllItemsToUI(products)
            //Populate temporary data store
            

        }
    })
}

init()

function updateProductToLocalStorage(updateProduct){
    if (localStorage.getItem('storeProducts')){
       // localStorage.setItem('storeProducts', JSON.stringify(products))
       const products = JSON.parse(localStorage.getItem('storeProducts'))
       const updatedProduct = products.map((product)=>{
           if (product.id===updateProduct.id){
               return{
                   id: updateProduct.id,
                   name: updateProduct.name,
                   price:updateProduct.price
               }

               }else{
                   return product
               }
           })
           localStorage.setItem('storeProducts', JSON.stringify(updatedProduct))
    }
}

function showUpdateBtn(){
   const elm = `<button type='button' class="btn mt-3 btn-block btn-secondary update-product">Update</button>`
   // Disable submit btn
   submitBtnElm.style.display = 'none'
   // Enabling update Btn in Form
   formElm.insertAdjacentHTML('beforeend',elm)

}

function populateUIInEditState(foundProduct){ //listelm e used
    nameInputElm.value = foundProduct.name
    priceInputElm.value = foundProduct.price
}


// complex data type Local Storage e joma rakte JSON.stringify use hobe 
// complext data return pete hole JSON.parse use korbo

// local Storage e Product Item Joma Rakbo

function addItemToStorage(product){ // fromElm event Listener used

   let products
   if (localStorage.getItem('storeProducts')){// 
       products = JSON.parse(localStorage.getItem('storeProducts'))
       products.push(product)
       localStorage.setItem('storeProducts', JSON.stringify(products))
   }else{
       products = []
       products.push(product)
       localStorage.setItem('storeProducts', JSON.stringify(products))
   }
}
function removeProductFromStorage(id){ //used in listelm event listener
    // const products = updateProductAfterDelete(id)
    // removing products from local storage after delete

    //product get korbo age
    const products = JSON.parse(localStorage.getItem('storeProducts'))
    // filerting hobe 
   const productsAfterRemove= updateProductAfterDelete(products,id)
    // save data to local storage
    localStorage.setItem('storeProducts', JSON.stringify(productsAfterRemove))
}

function showAllItemsToUI(items){ //filterElm section e used
    listGroupElm.innerHTML = ''
    items.forEach(item =>{
        const listElm= `<li class="list-group-item item-${item.id} collection-item">
              <strong>${item.name}</strong>- <span class= "price">$ ${item.price}</span>
              <i class="fa fa-trash delete-item float-right"></i>
              <i class="fa fa-pencil-alt edit-item float-right"></i>
          </li>`
        
        listGroupElm.insertAdjacentHTML('afterbegin', listElm)

    })
}

    function updateProductAfterDelete(products,id){
        return productsAfterDelete =products.filter(product => product.id!==id)
    }

   function removeItemFromUI(id){ // used in delete listener
    document.querySelector(`.item-${id}`).remove()

   }
   function removeItemFromDataStore(id){ // data store theke delete howar por je product thakbe sudu segulo show korbe
      products = updateProductAfterDelete(products,id)
   }
 


function getItemID(elm){ // used in delete event in listgroupElm event Listener

   const liElm= elm.parentElement
   return Number(liElm.classList[1].split('-')[1])
}




function resetInput(){ // formElm event listener e call kora
    nameInputElm.value = ''
    priceInputElm.value = ''
}
function addItemToUI(id,name, price){ //  formElm event listener e call kora
    // generate Unique id for each product
    
    
    const listElm= `<li class="list-group-item item-${id} collection-item">
              <strong>${name}</strong>- <span class= "price">$ ${price}</span>
             
              <i class="fa fa-trash delete-item float-right"></i>
              <i class="fa fa-pencil-alt edit-item float-right"></i>
              
          </li>`
        // Ekon listgroupelm e input gulo ke show korabo
        
        listGroupElm.insertAdjacentHTML('afterbegin', listElm)
}

function receiveInputs(){ // formelm event listener e call kora
    const name = nameInputElm.value
    const price = priceInputElm.value
    return { // complex data structure akare return korbo , karon multiple Element return korlam
        name,
        price 
    }
}

function validateInput(name, price){ // formelm event lister e call kora

    let isError = false

    if (!name || name.length <=3){
        isError = true
    }
    if (!price || Number(price) <=0){
        isError = true

    }
    return isError
}


})()


// Local Storage concept 

/*let data = {
    name: 'zaman',
    id: 132
}

localStorage.setItem('value',JSON.stringify(data))
console.log(JSON.parse(localStorage.getItem('value'))) */

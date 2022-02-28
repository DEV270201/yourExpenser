let val1 = document.querySelector("#inp1");
let val2 = document.querySelector("#inp2");
let btn = document.querySelector("#plus1");
let dispdup = document.querySelector(".disp");
let disdup1 = document.querySelector(".disp1");
let search_inp = document.querySelector(".input_search");
let lim1 = document.querySelector("#limit1");
let lim2 = document.querySelector("#limit2");
let inp = document.querySelectorAll(".form-control");

//function for getting the items stored in the local storage
function getInfo(){
  let list =  JSON.parse(localStorage.getItem("lists"));
  let amt =   JSON.parse(localStorage.getItem("Expense"));
  return { list,amt };
}

//function for generating random ids
function idGenerator(){
  return Math.random();
}

//function for tracking user input
function track(e){
   //inorder to stop the user from entering characters beyond the specified length then freeze its input value 
   if(e.target.value.trim().length >= 10){
     //selecting first 10 characters and ignoring others
     e.target.value = e.target.value.trim().slice(0,10);
   }
 if(e.target.id === "inp1"){
   lim1.innerHTML =  `${e.target.value.trim().length}`;
 }else{
      lim2.innerHTML = `${e.target.value.trim().length}`;
 }
}



//function to search
function filterRecords(event){
   let search_val = event.target.value;
   let total = 0;
   let {list,amt} = getInfo();
   list = list === null ? [] : list;
   if(search_val.trim() !== ""){
   list = list.filter((element)=>{
        if(element["desc"].toLowerCase().includes(search_val.toLowerCase())){
          total = total + element["spent"];
        }
     return element["desc"].toLowerCase().includes(search_val.toLowerCase());
   });
    display(list,total,"Sorry, Cannot find such expenses!");
   }else{
    display(list,amt,"Not able to remember your expenses??..Do add it!");
   }
}
     
//function for performing calculations
function cal(){
  let {list,amt} = getInfo();
  list = list === null ? [] : list;
  amt = amt === null ? 0 : amt;
  const money={}; //created an object to store the date, money spent and its description
  let inpValue1= val1.value;
  let inpValue2= val2.value.toUpperCase();
  
  //validating the input
  if(validate(inpValue1,inpValue2)){
  amt = amt + parseInt(inpValue1);  
  money.spent=parseInt(inpValue1); //updating the attributes of the object
  money.desc= inpValue2.toLowerCase();
  money.id = idGenerator();
  money.moment=  new Date().toLocaleDateString();
  list.push(money); //pushing the object into the array
  localStorage.setItem("lists",JSON.stringify(list));
  localStorage.setItem("Expense",JSON.stringify(amt));
  display(list,amt,"Not able to remember your expenses??..Do add it!");
}
  val1.value=null; //once clicked on add button the input text boxes will be empty
  val2.value=null;
  lim1.innerHTML = 0;
  lim2.innerHTML = 0;
}

//performing validations
function validate(inp1,inp2){
  let display_msg =  document.querySelector(".msg");
  var letters = /\d+/;
  if(inp2.length === 0 || inp2.match(letters)){
    display_msg.innerHTML = `<div class="alert alert-danger fade show" role="alert" >
                                    <b> Sorry, Input was not recognized!! </b>
                                             </div>`;
  setTimeout(()=>{
    display_msg.innerHTML = "";
  },3000);
  return false;
  }
  else if(!inp1.match(letters)){
    display_msg.innerHTML = `<div class="alert alert-danger fade show" role="alert" >
                                    <b> Sorry, Input was not recognized!! </b>
                                             </div>`;
  setTimeout(()=>{
    display_msg.innerHTML = "";
  },3000);
  return false;
  }
  else{
    display_msg.innerHTML = `<div class="alert alert-success" role="alert">
                                    <b> Expense added sucessfully!! </b>
                                             </div>`
  setTimeout(()=>{
    display_msg.innerHTML = "";
  },3000);
  return true;
  }
}

//function for displaying the contents
function display(list,amt,customMsg){
  list = list === null ? [] : list;
  amt = amt === null ? 0 : amt;
  if(list.length === 0){
    let header = document.createElement("h6");
    header.setAttribute("class","text-primary");
    let textNode = document.createTextNode(customMsg);
    header.appendChild(textNode);
    disdup1.innerHTML = "";
    disdup1.appendChild(header);
  }
  else{
  let txtobj=" ";
  list.forEach((element,index)=>{
    txtobj += `<ul class="list-group">
      <li class="list-group-item d-flex justify-content-between align-items-center" style="width: 100%;">
         <div class="d-flex flex-column" style="width:30%;overflow-x:scroll;">
           ${element.desc.toUpperCase()}
         <small class="text-muted">${element.moment} </small>
         </div>
           <span class="px-5"> <i class="fas fa-rupee-sign"></i> ${element.spent} </span>
           <button type="button" id="${element.id}" class="btn btn-outline-danger" onclick="deleteItems(this.id)">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
            </svg>
           </button>
       </li>
    </ul><br>
    `
  }
  );
    disdup1.innerHTML  = txtobj;
  }    
  //displaying the total expense on the DOM
    dispdup.innerHTML = `Rs : ${amt>=0 && amt<=9 ? "0" + amt : amt}`;
}


//function for deleting the items
function deleteItems(id){
  let {list,amt} = getInfo();
 list = list.filter((element)=>{
      if(id == element.id){
        amt = amt - element["spent"];
      }
      return id != element.id;
 });

 search_inp.value = null;
 localStorage.setItem("lists",JSON.stringify(list));
 localStorage.setItem("Expense",JSON.stringify(amt));
 display(list,amt,"Not able to remember your expenses??..Do add it!"); //call again the display function to remove the item from the screen
}

//event listeners
btn.addEventListener("click",cal);
search_inp.addEventListener("input", filterRecords);

//adding the event listener to the array of input fields
for(input of inp){
  input.addEventListener("input",track);
}

//function call
let {list,amt} = getInfo();
display(list,amt,"Not able to remember your expenses??..Do add it!");








var itemController = (function(){
  var numItems = 0;

  var Item = function(des, ID) {
    this.des = des;
    this.ID = ID;
    this.complete = false;
  };

  var data = {
    allItems: [],
    uncheckedItems: 0
  };

  var updateListNum = function() {
    var uncheckedItems = 0;
    data.allItems.forEach(function(curr){
      if (curr.complete === false && data.allItems.length !== 0){
        uncheckedItems += 1;
      };
    });
    data.uncheckedItems = uncheckedItems;
  };

  return {
    testing: function(){
      return data
    },
    addItem: function(userInput){
      var item, i;
      if(data.allItems.length > 0){
        id = data.allItems[data.allItems.length - 1].ID + 1;
      } else {
        id = 0;
      };
      item = new Item(userInput, id);
      data.allItems.push(item);
      return item
    },
    getItem: function() {
      var itemNum = data.allItems.length - 1;
      item = data.allItems[itemNum];
      return item
    },
    updateListNum: function(){
      // Would this be better as a proptotype..?
      updateListNum();
    },
    getData: function(){
      return data
    },
    completeItem: function(id){
      var ID = parseInt(id)
      data.allItems.forEach(function(curr){
        if (curr.ID === ID){
          curr.complete = curr.complete ? false : true
        };
      });
    },
    deleteItem: function(id){
      var eventID, listIDs, index;
      eventID = parseInt(id)
      listIDs = data.allItems.map(function(curr){
        return curr.ID
      });
      index = listIDs.indexOf(eventID);
      data.allItems.splice(index, 1);
    }
  };
})();

var uiController = (function(){

  var DOMstrings = {
    addBtn: '.add__item--button',
    addItem: '.add__item',
    allItems: '.all__items',
    itemTotal: '.item__total--number',
    container: '.container',
    itemComplete: 'item__complete',
    strikeName: 'strike__name',
    complete: 'complete',
    itemDelete: 'item__delete'
  };

  return {
    getDOMstrings: function(){
      return DOMstrings
    },
    getUserInput: function(){
      var userInput = document.querySelector(DOMstrings.addItem).value;
      return userInput
    },
    addNewItem: function(newItem) {
      var html, newHtml, el;
      //online
      html = "<div class='item' id='item-%0%'><div class='item__name' id='item__name-&0&'>%description%</div><button class='item__complete'><i class='far fa-check-circle'></i></button><button class='item__delete'><i class='far fa-trash-alt'></i></button></div>";
      //offline
      //html = "<div class='item' id='item-%0%'><div class='item__name' id='item__name-&0&'>%description%</div><button class='item__complete'><span>BTN</span></button></div>";
      newHtml = html.replace('&0&', newItem.ID);
      newHtml = newHtml.replace('%description%', newItem.des);
      newHtml = newHtml.replace('%0%', newItem.ID)
      document.querySelector(DOMstrings.allItems).insertAdjacentHTML('beforeend', newHtml);
    },
    updateNumItems: function(data) {
      document.querySelector(DOMstrings.itemTotal).textContent = data.uncheckedItems;
    },
    clearFields: function() {
      var el = document.querySelector(DOMstrings.addItem)
      el.value = '';
      el.focus();
    },
    getEventID: function(event){
      if (event.target.parentNode.classList.contains(DOMstrings.itemComplete) || event.target.parentNode.classList.contains('item__delete')) {
        var ID, splitID;
        ID = event.target.parentNode.parentNode.id
        splitID = ID.split('-');
        return splitID[1];
      };
    },
    toggleClass: function(eventID){
      var itemNameID = 'item__name-' + eventID;
      if(event.target.parentNode.classList.contains(DOMstrings.itemComplete) && !event.target.parentNode.parentNode.classList.contains('complete')){
        //This is an opportunity to research and better understand the cascade
        //effect in CSS. I feel a better solution than the one below exists
        document.getElementById(itemNameID).classList.add(DOMstrings.strikeName);
        event.target.parentNode.parentNode.classList.add(DOMstrings.complete);

      } else if(event.target.parentNode.classList.contains(DOMstrings.itemComplete) && event.target.parentNode.parentNode.classList.contains('complete')){

        document.getElementById(itemNameID).classList.remove(DOMstrings.strikeName);
        event.target.parentNode.parentNode.classList.remove(DOMstrings.complete);

      };
    },
    deleteItem: function(eventID){
      var itemNameID = 'item-' + eventID;
      var el = document.getElementById(itemNameID);
      el.parentNode.removeChild(el);
    }
  };
})();

var controller = (function(itemCtrl, uiCtrl){
  var DOM = uiCtrl.getDOMstrings();

  var setEventListeners = function() {
    document.querySelector(DOM.addBtn).addEventListener('click', addItem);

    document.addEventListener('keypress', function(event){
      if (event.keyCode === 13 || event.which === 13){
        addItem();
      };
    });

    document.querySelector(DOM.container).addEventListener('click', function(event){
      if(event.target.parentNode.classList.contains(DOM.itemComplete)){
        completeItem(event);
      };
    });
    document.querySelector(DOM.container).addEventListener('click', function(event){
      if(event.target.parentNode.classList.contains(DOM.itemDelete)){
        deleteItem(event);
      };
    });
  };
  var addItem = function(){
    // 1. get user input
    var userInput = uiCtrl.getUserInput();

    if (userInput !== ''){
      // 2. add name to data list
      itemCtrl.addItem(userInput);
      // 3. update list number in data structure
      itemCtrl.updateListNum();
      // 4. get num items
      var data = itemCtrl.getData();
      // 5. update num of items in UI
      uiCtrl.updateNumItems(data);
      // 6. add new html to page
      uiCtrl.addNewItem(itemCtrl.getItem());
      // 7. clear fields
      uiCtrl.clearFields();
    };
  };

  var completeItem = function(event) {
    // 1. get event.target ID
    var eventID = uiCtrl.getEventID(event);

    if (eventID) {
      // 2. toggle the css class of the target
      uiCtrl.toggleClass(eventID);
      // 3. change complete-incomplete status of item in data structure
      itemCtrl.completeItem(eventID);
      // 4. update number of items to do in data structure
      itemCtrl.updateListNum();
      // 5. update to do num in UI
      uiCtrl.updateNumItems(itemCtrl.getData());
    };
  };

  var deleteItem = function(event) {
    // 1. get event.target ID
    var eventID = uiCtrl.getEventID(event);
    // 2. Delete item from UI
    uiCtrl.deleteItem(eventID);
    // 3. remove item from data structure
    itemCtrl.deleteItem(eventID);
    // 4. update number of items to do in data structure
    itemCtrl.updateListNum();
    // 5. update to do num in UI
    uiCtrl.updateNumItems(itemCtrl.getData());
  };

  return {
    init: function(){
      setEventListeners();
      uiCtrl.updateNumItems({
        allItems: [],
        uncheckedItems: 0
      });
    }
  };
})(itemController, uiController);

controller.init();

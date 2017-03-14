$(document).ready(function() {
  // Getting a reference to the input field where user adds a new item
  var newOrderInput = $("input.new-item");
  // Our new todos will go inside the todoContainer
  var itemContainer = $(".item-container");
  var devourContainer = $(".devour-container");
  // Adding event listeners for deleting, editing, and adding todos
  $(document).on("click", "button.delete", deleteItem);
  $(document).on("click", "button.devour", moveDevour);
  $(document).on("click", ".item-item", editItem);
  $(document).on("keyup", ".item-item", finishEdit);
  $(document).on("blur", ".item-item", cancelEdit);
  $(document).on("submit", "#item-form", insertItem);

  // Our initial items array
  var items;
  var itemsDevoured;

  // Getting todos from database when page loads
  getItems();
  getItemsDevoured();

  // This function resets the item displayed with new todos from the database
  function initializeRows() {
    itemContainer.empty();
    var rowsToAdd = [];
    for (var i = 0; i < items.length; i++) {
      rowsToAdd.push(createNewRow(items[i]));
    }
    itemContainer.prepend(rowsToAdd);
  }

  // This function resets the item displayed with new todos from the database
  function initializeDevouredRows() {
    devourContainer.empty();
    var rowsToAdd = [];
    for (var i = 0; i < itemsDevoured.length; i++) {
      rowsToAdd.push(createNewDevourRow(itemsDevoured[i]));
    }
    devourContainer.prepend(rowsToAdd);
  }


  // This function grabs items from the database and updates the view
  function getItems() {
    $.get("/api/items/0", function(data) {
      console.log("burgers", data);
      items = data;
      initializeRows();
    });
  }

  // This function grabs all devoured items from the database and updates the view
  function getItemsDevoured() {
    $.get("/api/items/1", function(data) {
      console.log("burgers", data);
      itemsDevoured = data;
      initializeDevouredRows();
    });
  }

  // This function deletes a item when the user clicks the delete button
  function deleteItem() {
    var id = $(this).data("id");
    $.ajax({
      method: "DELETE",
      url: "/api/items/" + id
    })
    .done(function() {
      //getItems();
      getItemsDevoured();
    });
  }

  // This function sets a item as devoured attribute to the opposite of what it is
  // and then runs the updateTodo function
  function moveDevour() {
    var item = $(this)
      .parent()
      .data("item");

    item.devoured = !item.devoured;
    updateItem(item);
  }

  // This function handles showing the input box for a user to edit a item
  function editItem() {
    var currentItem = $(this).data("item");
    $(this)
      .children()
      .hide();
    $(this)
      .children("input.edit")
      .val(currentItem.text);
    $(this)
      .children("input.edit")
      .show();
    $(this)
      .children("input.edit")
      .focus();
  }

  // This function starts updating a item in the database if a user hits the
  // "Enter Key" While in edit mode
  function finishEdit(event) {
    var updatedItem;
    if (event.key === "Enter") {
      updatedItem = {
        id: $(this)
          .data("item")
          .id,
        text: $(this)
          .children("input")
          .val()
          .trim()
      };
      $(this).blur();
      updateItem(updatedItem);
    }
  }

  // This function updates a item in our database
  function updateItem(item) {
    $.ajax({
      method: "PUT",
      url: "/api/items",
      data: item
    })
    .done(function() {
      getItems();
      getItemsDevoured();
    });
  }

  // This function is called whenever a item item is in edit mode and loses focus
  // This cancels any edits being made
  function cancelEdit() {
    var currentItem = $(this).data("item");
    $(this)
      .children()
      .hide();
    $(this)
      .children("input.edit")
      .val(currentItem.text);
    $(this)
      .children("span")
      .show();
    $(this)
      .children("button")
      .show();
  }

  // This function constructs a item row
  function createNewRow(item) {
    var newInputRow = $("<li>");
    newInputRow.addClass("list-group-item item-item");
    var newItemSpan = $("<span>");
    newItemSpan.text(item.burger_name);
    newInputRow.append(newItemSpan);
    var newItemInput = $("<input>");
    newItemInput.attr("type", "text");
    newItemInput.addClass("edit");
    newItemInput.css("display", "none");
    newInputRow.append(newItemInput);
    // var newDeleteBtn = $("<button>");
    // newDeleteBtn.addClass("delete btn btn-default");
    // newDeleteBtn.text("x");
    // newDeleteBtn.data("id", item.id);
    var newDevourBtn = $("<button>");
    newDevourBtn.addClass("devour btn btn-default");
    newDevourBtn.text("Devour");
    //newInputRow.append(newDeleteBtn);
    newInputRow.append(newDevourBtn);
    newInputRow.data("item", item);
    if (item.complete) {
      newItemSpan.css("text-decoration", "line-through");
    }
    return newInputRow;
  }

    // This function constructs a item row
  function createNewDevourRow(item) {
    var newInputRow = $("<li>");
    newInputRow.addClass("list-group-item item-item");
    var newItemSpan = $("<span>");
    newItemSpan.text(item.burger_name);
    newInputRow.append(newItemSpan);
    var newItemInput = $("<input>");
    newItemInput.attr("type", "text");
    newItemInput.addClass("edit");
    newItemInput.css("display", "none");
    newInputRow.append(newItemInput);
    var newDeleteBtn = $("<button>");
    newDeleteBtn.addClass("delete btn btn-default");
    newDeleteBtn.text("x");
    newDeleteBtn.data("id", item.id);
    // var newDevourBtn = $("<button>");
    // newDevourBtn.addClass("devour btn btn-default");
    // newDevourBtn.text("Devour");
    newInputRow.append(newDeleteBtn);
    //newInputRow.append(newDevourBtn);
    newInputRow.data("item", item);
    if (item.complete) {
      newItemSpan.css("text-decoration", "line-through");
    }
    return newInputRow;
  }

  // This function inserts a new item into our database and then updates the view
  function insertItem(event) {
    event.preventDefault();
    // if (!newItemInput.val().trim()) {   return; }
    var newItem = {
      burger_name: newOrderInput
        .val()
        .trim(),
      devoured: false
    };

    // Posting the new item, calling getItems when done
    $.post("/api/items", newItem, function() {
      getItems();
    });
    newOrderInput.val("");
  }

});

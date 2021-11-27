/** This function loads the user information onto the Parking Pass Records page */
function loadUserInformation() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    if (window.navigator.vendor === "Google Inc.") {
      if (e === DOMException.QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
    } else if (e === QUOTA_EXCEEDED_ERR) {
      alert("Error: Saving to local storage.");
    }

    console.log(e);
  }

  if (user != null) {
    $("#div-user-section").empty();

    $("#div-user-section").append(
      "<p>User's Name: " +
        user.FirstName +
        " " +
        user.LastName +
        "<br>Address: " +
        user.Address +
        "</p>"
    );
    $("#div-user-section").append(
      "<a href='#page-user-info' data-mini='true' " +
        "id='btn-edit-profile' data-role='button' data-icon='edit' data-iconpos=" +
        "'left' data-inline='true'>Edit Profile</a>"
    );
    $("#btn-edit-profile").buttonMarkup();
  }
}

/*This onclick function sets the value of the button to Add and then does a refresh */
$("#btn-add-record").click(function () {
  $("#btn-submit-record").val("Add");
  $("#btn-submit-record").button();
  $("#btn-submit-record").button("refresh");
});

/*This pageshow is used if adding a new record it will clear the form and if the form is being edited it will pre-load the information saved so that it can be edited. */
$("#page-record-form").on("pageshow", function () {
  const formOperation = $("#btn-submit-record").val();

  if (formOperation == "Add") {
    clearRecordForm();
  } else if (formOperation == "Edit") {
    showRecordForm($("#btn-submit-record").attr("index-to-edit"));
  }
});

/*This function clears the values if the Clear Entry button is pressed */
function clearRecordForm() {
  $("#data-parking-pass-date").val("");
  $("#data-member-name").val("");
  $("#data-member-address").val("");
  $("#data-make").val("");
  $("#data-model").val("");
  $("#data-license-plate").val("");
}

/*
  This function is the validation check for new Parking Pass Records to ensure there is a proper value. An alert is triggered if the condition does not pass.
*/
function checkRecordForm() {
  if ($("#data-parking-pass-date").val() < getCurrentDateFormatted()) {
    alert("The date can't be in the past");
    return false;
  } else if ($("#data-parking-pass-date").val() > getCurrentDateFormatted()) {
    alert("The date can't be in the future");
    return false;
  } else if ($("#data-parking-pass-date").val() == "") {
    alert("You need to enter a date.");
    return false;
  } else if ($("#data-member-name").val() == "") {
    alert("You need to enter the name of the HOA Member.");
    return false;
  } else if ($("#data-member-address").val() == "") {
    alert("You need to enter the Address ofthe HOA Member.");
    return false;
  } else if ($("#data-make").val() == "") {
    alert("You need to enter the Make of the vehicle.");
    return false;
  } else if ($("#data-model").val() == "") {
    alert("You need to enter the Model of the vehicle.");
    return false;
  } else if ($("#data-license-plate").val() == "") {
    alert("You need to enter the License Plate of the vehicle.");
    return false;
  } else {
    return true;
  }
}

/*This Submit function gets the value from submit button on the records form page. If the value is "add" then it adds the record and changes the page to the Records page, if the value is "edit" then it calls editRecord to get the value with the index-to-edit attribute, changes the page to the records page and then removed the index-to-edit record page. It then returns false to prevent from reloading */
$("#form-record").submit(function () {
  const formOperation = $("#btn-submit-record").val();

  if (formOperation == "Add") {
    if (addRecord()) {
      $.mobile.changePage("#page-records");
    }
  } else if (formOperation == "Edit") {
    if (editRecord($("#btn-submit-record").attr("index-to-edit"))) {
      $.mobile.changePage("#page-records");
      $("#btn-submit-record").removeAttr("index-to-edit");
    }
  }

  return false;
});

/*This function adds records */
function addRecord() {
  if (checkRecordForm()) {
    const record = {
      Date: $("#data-parking-pass-date").val(),
      Name: $("#data-member-name").val(),
      Address: $("#data-member-address").val(),
      Make: $("#data-make").val(),
      Model: $("#data-model").val(),
      LicensePlate: $("#data-license-plate").val(),
    };

    try {
      let tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
      const totalSpots = 35; // Total Guest Spots
      if (tbRecords == null) {
        tbRecords = [];
      }

      if (tbRecords.length < totalSpots) {
        tbRecords.push(record);
        tbRecords.sort(compareDates);
        localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
        alert("Saving Information");
        clearRecordForm();
        listRecords();
      } else
        alert(
          "Guest Parking Spots are full for today. We apologize for the inconvenience."
        );

      return true;
    } catch (e) {
      if (window.navigator.vendor === "Google Inc.") {
        if (e === DOMException.QUOTA_EXCEEDED_ERR) {
          alert("Error: Saving to local storage.");
        }
      } else if (e === QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }

      console.log(e);

      return false;
    }
  } else {
    return false;
  }
}

/*This function looks at the data entered and sorts it by date into a table. On the Records page. If there are no records then the table is cleared.  */
function listRecords() {
  let tbRecords = null;
  try {
    tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
  } catch (e) {
    if (window.navigator.vendor === "Google Inc.") {
      if (e === DOMException.QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
    } else if (e === QUOTA_EXCEEDED_ERR) {
      alert("Error: Saving to local storage.");
    }

    console.log(e);
  }

  if (tbRecords != null) {
    tbRecords.sort(compareDates);

    // initialize the table
    $("#tbl-records").html(
      "<thead>" +
        "  <tr>" +
        "    <th>Date</th>" +
        "    <th>Name</th>" +
        "    <th>Address</th>" +
        "    <th>Make</th>" +
        "    <th>Model</th>" +
        "    <th>License Plate</th>" +
        "    <th>Edit / Delete</th>" +
        "  </tr>" +
        "</thead>" +
        "<tbody>" +
        "</tbody>"
    );

    // insert each record into the table
    for (let i = 0; i < tbRecords.length; i++) {
      const rec = tbRecords[i];
      $("#tbl-records tbody").append(
        "<tr>" +
          "  <td>" +
          rec.Date +
          "</td>" +
          "  <td>" +
          rec.Name +
          "</td>" +
          "  <td>" +
          rec.Address +
          "</td>" +
          "  <td>" +
          rec.Make +
          "</td>" +
          "  <td>" +
          rec.Model +
          "</td>" +
          "  <td>" +
          rec.LicensePlate +
          "</td>" +
          "  <td><a data-inline='true' data-mini='true' data-role='button'" +
          "href='#page-record-form' onclick='callEdit(" +
          i +
          ");' " +
          "data-icon='edit' data-iconpos='notext'></a>" +
          "    <a data-inline='true' data-mini='true' data-role='button' " +
          "href='#' onclick='callDelete(" +
          i +
          ");' data-icon='delete' " +
          "data-iconpos='notext'></a></td>" +
          "</tr>"
      );
    }

    $("#tbl-records [data-role='button']").buttonMarkup();
  } else {
    $("#tbl-records").html("");
  }
  $("#tbl-records").table();
  $("#tbl-records").table("refresh");

  recordCount();
}

/*This function is used to compare 2 dates together that will help with sorting the records */
function compareDates(record1, record2) {
  const date1 = new Date(record1.Date);
  const date2 = new Date(record2.Date);

  if (date1 > date2) {
    return 1;
  } else {
    return -1;
  }
}

/*This onclick functions clears all records on tbRecords */
$("#btn-clear-history").click(function () {
  try {
    localStorage.removeItem("tbRecords");
    listRecords();
    alert("All records have been deleted.");
  } catch (e) {
    if (window.navigator.vendor === "Google Inc.") {
      if (e === DOMException.QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
    } else if (e === QUOTA_EXCEEDED_ERR) {
      alert("Error: Saving to local storage.");
    }

    console.log(e);
  }
});

/*This function calls the deleteRecord function to delete the record with the index and the updates the table */
function callDelete(index) {
  deleteRecord(index);
  listRecords();
}

/*This function deletes the indexed record from the table and then update the table with the new records */
function deleteRecord(index) {
  try {
    const tbRecords = JSON.parse(localStorage.getItem("tbRecords"));

    tbRecords.splice(index, 1);

    if (tbRecords.length == 0) {
      localStorage.removeItem("tbRecords");
    } else {
      localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
    }
  } catch (e) {
    if (window.navigator.vendor === "Google Inc.") {
      if (e === DOMException.QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
    } else if (e === QUOTA_EXCEEDED_ERR) {
      alert("Error: Saving to local storage.");
    }

    console.log(e);
  }
}

/*This function sets the attribute index-to-edit on the record being submitted, sets the value of the button to Edit and then refreshes the button */
function callEdit(index) {
  $("#btn-submit-record").attr("index-to-edit", index);
  $("#btn-submit-record").val("Edit");
  $("#btn-submit-record").button();
  $("#btn-submit-record").button("refresh");
}

/*This function retrieves the records from localStorage (if available) and then parse them with JSON. */
function showRecordForm(index) {
  try {
    const tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
    const rec = tbRecords[index];

    $("#data-parking-pass-date").val(rec.Date);
    $("#data-member-name").val(rec.Name);
    $("#data-member-address").val(rec.Address);
    $("#data-make").val(rec.Make);
    $("#data-model").val(rec.Model);
    $("#data-license-plate").val(rec.LicensePlate);
  } catch (e) {
    if (window.navigator.vendor === "Google Inc.") {
      if (e === DOMException.QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
    } else if (e === QUOTA_EXCEEDED_ERR) {
      alert("Error: Saving to local storage.");
    }

    console.log(e);
  }
}

/*This function edits the indexed record */
function editRecord(index) {
  if (checkRecordForm()) {
    try {
      const tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
      tbRecords[index] = {
        Date: $("#data-parking-pass-date").val(),
        Name: $("#data-member-name").val(),
        Address: $("#data-member-address").val(),
        Make: $("#data-make").val(),
        Model: $("#data-model").val(),
        LicensePlate: $("#data-license-plate").val(),
      };

      tbRecords.sort(compareDates);
      localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
      alert("Saving Information");
      clearRecordForm();
      listRecords();

      return true;
    } catch (e) {
      if (window.navigator.vendor === "Google Inc.") {
        if (e === DOMException.QUOTA_EXCEEDED_ERR) {
          alert("Error: Saving to local storage.");
        }
      } else if (e === QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }

      console.log(e);

      return false;
    }
  } else {
    return false;
  }
}

/*This function is used to count the remaining parking spots available.*/
function recordCount() {
  let tbRecords = null;
  try {
    tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
  } catch (e) {
    if (window.navigator.vendor === "Google Inc.") {
      if (e === DOMException.QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
    } else if (e === QUOTA_EXCEEDED_ERR) {
      alert("Error: Saving to local storage.");
    }
    console.log(e);
  }

  parkingSpots = 35; //Total Guest Parking Spots available

  if (tbRecords == null) {
    remainingSpots = parkingSpots;
  } else {
    remainingSpots = parkingSpots - tbRecords.length;
  }

  document.getElementById("recordcount").innerHTML = remainingSpots;

  return remainingSpots;
}

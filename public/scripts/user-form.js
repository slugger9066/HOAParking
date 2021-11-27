/*This function is used to check the user form to ensure the data that is entered is valid */
function checkUserForm() {
  if ($("#data-first-name").val() == "") {
    alert("You need to enter your first name.");
    return false;
  } else if ($("#data-last-name").val() == "") {
    alert("You need to enter your last name.");
    return false;
  } else if ($("#data-address").val() == "") {
    alert("You need to enter your address");
    return false;
  } else {
    return true;
  }
}

/*This function is used to get today's date  */
function getCurrentDateFormatted() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
/* Format the date correctly yyyy-mm-dd so that it can be compared against date selection in checkUserForm */
  const formattedDate =
    year +
    "-" +
    (("" + month).length < 2 ? "0" : "") +
    month +
    "-" +
    (("" + day).length < 2 ? "0" : "") +
    day;

  return formattedDate;
}

/*This calls saveUserForm when the Update button is clicked to save the information entered by the User. */
$("#form-user-info").submit(function () {
  saveUserForm();
  return false;
});

/*This function saves the users information that is entered */
function saveUserForm() {
  if (checkUserForm()) {
    const user = {
      FirstName: $("#data-first-name").val(),
      LastName: $("#data-last-name").val(),
      Address: $("#data-address").val(),
      NewPassword: $("#data-new-password").val(),
    };

    try {
      localStorage.setItem("user", JSON.stringify(user));
      alert("Saving Information");

      $.mobile.changePage("#page-menu");
      window.location.reload();
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
}

/* This function looks at the localStorage to see if their is information present. If there is no information then it sets the information from the JSON from saveUserForm, if information is already contained for the user then it updates it based on the new information provided. */
function showUserForm() {
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
    $("#data-first-name").val(user.FirstName);
    $("#data-last-name").val(user.LastName);
    $("#data-address").val(user.Address);
    $("#data-new-password").val(user.NewPassword);

    $("#select-tsh-range option:selected").val(user.TSHRange);
    $("#select-tsh-range").selectmenu("refresh", true);
  }
}

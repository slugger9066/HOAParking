/*This function is used to enter the passcode by entering the number associated to the button pressed*/
function addValueToPassword(key) {
  const currVal = $("#data-password").val();
  if (key == "bksp") {
    $("#data-password").val(currVal.substring(0, currVal.length - 1));
  } else {
    $("#data-password").val(currVal.concat(key));
  }
}

/*This function returns the password of the user, if there isnt a user then it uses the default password */
function getPassword() {
  if (typeof Storage == "undefined") {
    alert("Your browser does not support HTML5 localStorage.  Try upgrading.");
  } else if (localStorage.getItem("user") != null) {
    return JSON.parse(localStorage.getItem("user")).NewPassword;
  } else {
    return "1234"; // default password
  }
}

/*This function is used to validate the password that is entered to be able to enter the application */
$("#btn-enter-password").click(function () {
  const enteredPasscode = $("#data-password").val();
  const storedPasscode = getPassword();

  if (enteredPasscode == storedPasscode) {
    // This is to clear the password input on success so it isn't pre-loaded when returning to the page again
    $("#data-password").val("");

    // check if they have agreed to the legal disclaimer
    if (localStorage.getItem("agreedToLegal") == null) {
      $("#btn-enter-password").attr("href", "#page-disclaimer").blur();
    } else if (localStorage.getItem("agreedToLegal") == "true") {
      // check if a user profile has been saved yet
      if (localStorage.getItem("user") == null) {
        $("#btn-enter-password").attr("href", "#page-user-info").blur();
      } else {
        $("#btn-enter-password").attr("href", "#page-menu").blur();
      }
    }
  } else {
 
    $("#btn-enter-password").attr("href", "#").blur();

    alert("Incorrect password, please try again.");
  }
});

/* This function sets the value of agreedToLegal to true that is used to bypass the disclaimer  */
$("#btn-notice-yes").click(function () {
  try {
    localStorage.setItem("agreedToLegal", "true");
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

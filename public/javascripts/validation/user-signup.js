$(document).ready(function () {
  console.log("started");
  jQuery.validator.addMethod(
    "testUsername",
    function (value, element) {
      return this.optional(element) || /^[a-zA-Z0-9_]+$/.test(value);
    },
    "Use only alphabets and undersore"
  );
  jQuery.validator.addMethod(
    "testName",
    function (value, element) {
      return this.optional(element) || /^[a-zA-Z ]+$/.test(value);
    },
    "Use only alphabets"
  );
  
  jQuery.validator.addMethod(
    "minlength",
    function (value, element, params) {
      return this.optional(element) || value.trim().length >= params;
    },
    jQuery.validator.format("Please enter at least {0} characters.")
  );
  $("#signup").validate({
    rules: {
      name: {
        required: true,
        minlength: 4,
        maxlength: 50,
        testName : true,
      },
      username: {
        required: true,
        maxlength: 50,
        testUsername: true,
        minlength: 5,
      },
      email: {
        required: true,
        email: true,
      },
      password: {
        required: true,
        minlength: 8,
      },
      confirmPassword: {
        required: true,
        minlength: 8,
        equalTo: "#password",
      },
    },
    submitHandler: function (form) {
      // form.preventDefault();
      console.log("recieved");
      $.ajax({
        url: "/signuped",
        data: $("#signup").serialize(),
        method: "POST",
        success: function (response) {  
          window.location.reload();
        },
        error: function (err) {
          err = jQuery.parseJSON(err.responseText);
          console.log(err.message);
          $("#error").text(err.message);
        },
      });
    },
  });
});

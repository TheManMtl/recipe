
   

$(document).ready(() => {


    $("#btnLogin").click(function(e){
        console.log("login")
       loginBtnClick();
    })

    $("#btnRegister").click(function(e){
        registerBtnClick();
    })

    $("#oppositeAuth").click(function(e){
        if (authAction == "Register") {
            loginBtnClick()
        } else {
            registerBtnClick()
        }
        
    })
    $("#saveAuth").click(function(){
        if (authAction == "Register") {
            // errorMsg
            let username = $( "input[name=tfUsernameReg]" ).val();
            let email = $( "input[name=tfEmailReg]" ).val();
             let fullName = $( "input[name=tfFullName]" ).val();
             let password1 = $("input[name=tfPassword1]").val();
             let password2 = $("input[name=tfPassword2]").val();
             let profileImg = $("input[name=profileImg]").prop('files')[0];
             let mimeType = profileImg.type;
        
             if( registrationValid(username, email, fullName, password1, password2, profileImg, mimeType)) {
                registerUser(username, email, fullName, password1, password2, profileImg, mimeType)
                .then(function (message) {
                    $("#authFields").html("<h5>You have been registered!</h5>")
                    setTimeout(function() {
                        loginBtnClick();
                    }, 2000);
                    
                }).catch(function (error) {
                    if (error.status === 413) {
                        console.log(error + " MYYYY ERRROR")
                        $("#errorMsg").show().text("The file you selected is too large, please select another image")

                    }
                })
             }
        } else {
            let username = $( "input[name=tfUsername]" ).val();
            let password = $( "input[name=tfPassword]" ).val();
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('password', password);
            console.log(username);
            console.log(password);


            $("#loginRegister").modal("hide");
        }


    })

  
})


let authAction;



function registerBtnClick() {
    authAction = "Register"
    console.log(authAction);
    $("#authTitle").text(authAction)
    $("#oppositeAuth").text("Take me to log in")
    $("#saveAuth").text("Register")

    let authForm = 
    `<label for="tfUsernameReg">Username</label>
    <input type="text" name="tfUsernameReg"><br>
    <div id="usernameError"></div>
  
    <label for="tfEmailReg">Email</label>
    <input type="text" name="tfEmailReg"><br>
    <div id="emailError"></div>
    <label for="tfFullName">Full Name</label>
    <input type="text" name="tfFullName"><br>
    <label for="tfPassword1">Password</label>
    <input type="password" name="tfPassword1"><br>
    <label for="tfPassword2">Re-Enter Password</label>
    <input type="password" name="tfPassword2"><br>
    <div id="matchPw"></div>
    <label for="profileImg">Select your profile picture</label>
    <input type="file" name="profileImg" accept="image/*">
    <div id="error></div>
   
    ` 
    $("#authFields").html(authForm);

    $( "input[name=tfUsernameReg]" ).on( "blur", function() {
        console.log("BLUR")
        let username = $(this).val();
        if (!/^([a-zA-Z0-9_]){5,45}$/.test(username)) {
            $("#usernameError").show().text("username must be 5-45 characters long made up of letters, digits and underscore").css("color", "red")
            usernameValid = false;
            return;
        }  
        checkUsername(username ).then((valid) => {
            if (!valid.valid) {
                $("#usernameError").show().text("This username is already in use").css("color", "red");
                usernameValid = false;

            } else {
                $("#usernameError").hide()
                usernameValid = true;
            }
        }).catch((error) =>{
            console.log(error + " MY USERNAME ERRRORRRRR");
            $("#usernameError").show().text(error);
        })
      });

      // FIX ME 
      $( "input[name=tfEmailReg]" ).on( "blur", function() {
        let email = $(this).val();
        if (!isEmail(email)) {
            $("#emailError").show().text("Please provide a valid email").css("color", "red");
            return;
        }

        checkEmail(email ).then((valid) => {
            if (!valid.valid) {
                $("#emailError").show().text("This email address is already in use").css("color", "red");

            } else if (!isEmail(email)){
                $("#emailError").show().text("Please provide a valid email address")
            } else {
                $("#emailError").hide()
            }
        }).catch((error) => {
            console.log(error + " MY EMAIL ERRRORRRRR");
            $("#emailError").show().text(error);

        })
      });

    $( "input[name=tfPassword2]" ).on( "blur", function() {
        if ($("input[name=tfPassword1]").val() !== $("input[name=tfPassword2]").val()) {

            $("#matchPw").show().text("passwords must match").css("color", "red")
        } else {
            $("#matchPw").hide();
        }
      });


      $( "input[name=tfPassword1]" ).on( "blur", function() {
        if (!checkPassword($( "input[name=tfPassword1]" ).val()))  {

            $("#matchPw").text("Password must be between 6 and 13 characters long, and contain at least one digit, one uppercase letter, and one lowercase letter").css("color", "red")
        } else {
            $("#matchPw").hide();
        }
      });





}



function loginBtnClick() {
    authAction = "Login"
    console.log(authAction);
    $("#authTitle").text(authAction)
    $("#oppositeAuth").text("take me to registration")
    $("#saveAuth").text("Log In")

    let authForm = 
    `<label for="tfUsername">Username</label>
    <input type="text" name="tfUsername"><br>
    <label for="tfPassword">Password</label>
    <input type="text" name="tfPassword"><br>
    <div id="loginErr"><div><br>    
    `

    $("#authFields").html(authForm)
}



function registerUser(username, email, fullName, password1, password2, profileImg, mimeType) {

    // get file input value and type

    return new Promise((resolve, reject) => {

        let reader = new FileReader();
        reader.onload = function () {
    
            // prepare recipe obj
            newUser = { 
                username: username, 
                email: email,
                fullName: fullName, 
                password: password1,  
                profileImg: btoa(reader.result),
                mimeType: mimeType
            }
    
    
            $.ajax({   // FIXME: escape special characters using urlencode
                url: "/api/users/",
                type: "POST",
                dataType: "json",
                data: newUser,
                // error: function (jqxhr, status, errorThrown) {
                //     console.log(error);
                // }
            }).done(function () {
                resolve("Registration successful");
                //refreshList();
            }).fail(function (jqxhr, status, errorThrown) {
                reject({status: jqxhr.status, error: errorThrown});
              });
      
        };
        reader.onerror = function () {
            console.log(error + " MY ERROR")
            let errorMessage = reader.error;
           // $("#errorMsg").show().text(errorMessage);
        };
        reader.readAsBinaryString(profileImg);
    
        return;

    })



}

 async function checkUsername(username) {
   return new Promise ((resolve, reject) => {
    $.ajax({
        url: "/api/users/exists/username?username=" + username,
        type: "GET",
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
           // alert("AJAX error: " + jqxhr.responseText);
            reject(jqxhr.responseText);
        },
        success: function(valid) {
            resolve(valid);
        }
    })
   }) 

}

async function checkEmail(email) {
    console.log("EEEEEEEEEEMAIL")
   return new Promise ((resolve, reject) => {
    $.ajax({
        url: "/api/users/exists/email?email=" + email,
        type: "GET",
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
            reject(jqxhr.responseText);
        },
        success: function(valid) {
            resolve(valid);
        }
    })
   }) 

}


function checkPassword(password) {
 if(!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,32}$/.test(password) ) {
    return false;
 } 
 return true;
}


function registrationValid(username, email, fullName, password1, password2) {
    // TODO ADD IMG/MIMETYPE VALIDATION - image size??? 
    if (!/^([a-zA-Z0-9_]){5,45}$/.test(username)) {
        $("#errorMsgValid").show().text("username must be 5-45 characters long made up of letters, digits and underscore").css("color", "red")
        return false;
    }  

    if (!isEmail(email)) {
        $("#errorMsgValid").show().text("Please provide a valid email").css("color", "red");
        return false;
    }

    checkUsername(username ).then((valid) => {
        if (!valid.valid) {
            $("#errorMsgValid").show().text("This username is already in use").css("color", "red");
            usernameValid = false;

        } else {
            $("#errorMsgValid").hide()
            usernameValid = true;
        }
    }).catch((error) =>{
        console.log(error);
    })


    checkEmail(email ).then((valid) => {
        if (!valid.valid) {
            $("#errorMsgValid").show().text("This email address is already in use").css("color", "red");
            usernameValid = false;

        } else {
            $("#errorMsgValid").hide()
            usernameValid = true;
        }
    }).catch((error) =>{
        console.log(error.jqxhr.responseText + "MY RESPONSE");
    })


     if(!fullName) {
        $("#errorMsgValid").show().text("Please provide your full name").css("color", "red");
        return false;
     } else if (fullName.replace(/\s/g, "") == fullName ) {
        $("#errorMsgValid").show().text("Please provide your full name").css("color", "red");
        return false;
     } else if (!checkPassword(password1)) {
        $("#errorMsgValid").show().text("Password must be between 6 and 13 characters long, and contain at least one digit, one uppercase letter, and one lowercase letter").css("color", "red");
        return false;
     } else if (password1 !== password2) {
        $("#errorMsgValid").show().text("Passwords must match")
        return false;
     } else if (!isEmail(email)) {
        $("#errorMsgValid").show().text("Please provide a valid email")
        return false;
     } else {
        $("#errorMsgValid").hide()
        return true;
     }
}

function isEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true;
    } else {
        return false;
    }
}



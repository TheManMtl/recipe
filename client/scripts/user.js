$(document).ready(function () {

    $("#registerButton").click(function () {
        var newUsername = $("input[name=newUsername]").val();
        var newPass1 = $("input[name=newPass1]").val();
        var newPass2 = $("input[name=newPass2]").val();
        var email = $("input[name=email]").val();
        var fullName = $("input[name=fullName]").val();

        if (newPass1 != newPass2) {
            alert("Both passwords must be the same");
            return;
        }

        // get file input value and type
        let file = $("#imgUpload").prop('files')[0];
        let mimeTypeVal = file.type;

        // read file
        let reader = new FileReader();
        reader.onload = function () {
            var userObj = { username: newUsername, email: email, fullName: fullName, password: newPass1 };
            $("#waitForIt").show();
            // NOTE: if currId = 0 then adding, otherwise updating
            $.ajax({ // FIXME: escape special characters using urlencode
                url: "/api/users",
                type: "POST",
                dataType: "json",
                data: userObj,
                error: function (jqxhr, status, errorThrown) {
                    alert("AJAX error: " + jqxhr.responseText);
                }
            }).done(function () {
                // TODO: alerts are obsolete, instead use HTML z-layer popup that shows up for 2-3 seconds
                alert("User registered successfully. You may now login.");
                $("input[name=newUsername]").val("");
                $("input[name=newPass1]").val("");
                $("input[name=newPass2]").val("");
            }).always(function () {
                $("#waitForIt").hide();
            });
        };
        reader.onerror = function () {
            console.log(reader.error);
            alert(reader.error);
        };
        //reader.readAsDataURL(file); // read file and trigger one of the above handlers
        reader.readAsBinaryString(file);

        return;
    });
});
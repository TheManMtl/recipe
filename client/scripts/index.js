/* 
    ONLY TO TEST THE COMMENTS EHSAN
*/

/*
$(document).ready(() => {

    refreshTodoList();//load all records todos in db 
})


function refreshTodoList(sortOrder) {

    let url =  "/api/comments?recipe=1";
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }
    }).done((comments) => {
        var thId = `<th onclick="refreshTodoList('id')">#</th>`;
        var thTask = `<th onclick="refreshTodoList('recipeId')">Task</th>`;
        var thDueDate = `<th onclick="refreshTodoList('dueDate')">Due date</th>`;
        var thIsDone = `<th onclick="refreshTodoList('isDone')">Done?</th></tr>`;
        var result = `<tr>${thId}${thTask}${thDueDate}${thIsDone}</tr>`;
        for (var i = 0; i < comments.length; i++) {
            var comment = comments[i];

            result += '<tr onclick="">';
            result += '<td>' + comment.id + '</td>';
            result += '<td>' + comment.cleanDate + '</td>';
            result += '<td>' + comment.text + '</td>';
            result += '<td>' + comment.helpful + '</td>';
            result += '</tr>' + "\n";
        }
        $("#listTable").html(result);
        table = result;
    })
}*/
var recipeId;
var userId;
var username = sessionStorage.getItem('username');

$(document).ready(() => {

    /* VIEW MAIN PANE */
    $('#viewRecipeGrid').show();
    $('#viewRecipeSingle').hide();
    $('#ViewUserPage').hide();

    /* NAV LINKS DEPENDING ON LOGIN */
    $('#navHome').click(function () {
        refreshRecipeList();
    });
    if (username != null) {
        $('#navUser').show();
        $('#navLinkNew').show();
        $('#navLogin').hide();
        $('#navLinkUser').click(function () {
            viewUser();

        });
        $('#navLinkNew').click(function () {
            newRecipe();

        });
    } else {
        $('#navUser').hide();
        $('#navLogin').show();
        $('#navLinkNew').hide();

    }



    /* GET CURRENT USER ID */


    // TODO: PASS IN VALUES 
    /*
        getId("Timothy").then(function (data){
            userId = data.id
            console.log(data.id + "ID ")
            console.log(userId + " this is the user id")
        }).catch(function(error){
            console.log(error.status + "ALEX IS HERE");
        })
    */


    // registerUser(username, email, fullName, password1, password2, profileImg, mimeType)
    // .then(function (message) {
    //     $("#authFields").html("<h5>You have been registered!</h5>")
    //     setTimeout(function() {
    //         loginBtnClick();
    //     }, 2000);

    // }).catch(function (error) {
    //     if (error.status === 413) {
    //         $("#errorMsg").show().text("The file you selected is too large, please select another image")
    //     }
    // })
    // var username = sessionStorage.getItem('username');
    // $.ajax({
    //     url: "api/users/id/" + username,
    //     headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
    //     type: "GET",
    //     dataType: "json",
    //     error: function (jqxhr, status, errorThrown) {
    //         alert("AJAX error: " + jqxhr.responseText);
    //     }
    // }).done(setId(user));
    //     alert("your id: " + userId);

    refreshRecipeList();


    $('#btnOpenEdit').click(editRecipe);
    $('#btnOpenAdd').click(newRecipe);
    $("#btnAddIng").click(function (event) {
        event.preventDefault();
        addIngredients();
    });
    $("#btnAddStep").click(function (event) {
        event.preventDefault();
        addStep();
    });

    $("#btnAddTag").click(function (event) {
        event.preventDefault();
        addTag();
    });

    $('#btnSaveRecipe').click(function () {
    });

    $('#btnAddNote').click(function (event) {
        event.preventDefault();
        addNote();
    });

    $('#btnPost').click(function (event) {
        event.preventDefault();
        postRecipe();
    });


});


/* RECIPE GRID VIEW */
function refreshRecipeList(sortOrder) {

    $('#viewRecipeSingle').hide();
    $('#viewUserPage').hide();
    $('#viewRecipeGrid').show();



    $.ajax({
        url: "/api/recipes/",
        type: "GET",
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }


    }).done(function (recipeList) {
        console.log(recipeList.length);

        var result = '';

        for (var i in recipeList) {
            var recipe = recipeList[i];

            result +=
                ` <div class="col-sm-3 my-3">
             <div class="recipeGridItem container rounded-5 border-1 p-0 h-100">
                 <div class="row h-50">
                     <img class="col-12 rounded-top-5 border-1 mb-2 w-100 h-100 object-fit-cover" src="/api/recipes/img/${recipe.id}" height="300px" alt="Recipe photo">               

                </div>
                <div class="row text-center mt-4">
                    <div class="col-12">

                            <button id="${recipe.id}" onclick="viewRecipe(${recipe.id})" class="btnRecipe fs-2 w-100">${recipe.title}</button>

                    </div>
                    <div class="row recipeDescription h-100">
                        <div class="col-12 h-100">
                            <p><em>${recipe.description}</em></p>
                        </div>
                    </div>
                </div>
             
                    <div class="row my-2 p-5 align-text-bottom">
                        <div class="recipeAuthor col-8">
                          <div class="row">
                                <div class="col-3 p-0">
                                    <img src="/api/users/img/${recipe.username}" width="30px" alt="User Avatar">
                                </div>                            
                                <div class="col-9 p-0">                            
                                    <div class="author">${recipe.author}</div>
                                </div>
                            </div>
                        </div>
                        <div class="recipeDate" class="col-4 text-end">
                             ${recipe.date}
                        </div>
                    </div>
                </div>
            </div>
         </div>`

        }
        $("#recipeList").html(result);
    });
}


/* RECIPE SINGLE VIEW */


// loads recipe view, hides editor and grid
function viewRecipe(id) {

    recipeId = id;

    $('#viewRecipeGrid').hide();
    $('#viewRecipeSingle').show();
    $('#btnView').hide();
    $('#btnOpenEdit').hide();
    $('#recipeEdit').hide();
    $('#recipe').show();
    $('#btnUpdateNotes').hide();
    $('#notesPatchForm').hide();
    $('#changePrivacy').hide();
    $('#viewUserPage').hide();


    getRecipe(recipeId);
    getComments(recipeId);

    $('#btnComment').click(function (event) {
        event.preventDefault();
        postComment(recipeId);
    });
}

/* GET RECIPE CONTENT */
function getRecipe(id) {
    $.ajax({
        url: "api/recipes/" + id,
        headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
        type: "GET",
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }
    }).done(function (recipe) {

        // convert from total mins to hrs and mins
        let mins = recipe.cookTime % 60;
        let hrs = (recipe.cookTime - mins) / 60;

        $('#recipeImg').attr("src", `/api/recipes/img/${recipe.id}`);
        $('#title').html(recipe.title);
        $('#recipeDate').html(recipe.date);
        $('#author').html(recipe.author);
        $('#authUsername').html(recipe.username);
        $('#authorImg').attr("src", `/api/users/img/${recipe.username}`);
        $('#description').html(recipe.description);
        $('#cookTimeHr').html(hrs);
        $('#cookTimeMin').html(mins);
        $('#yield').html(recipe.yield);

        let ingStr = recipe.ingredients;
        ingStr = ingStr.slice(1, ingStr.length - 1);
        ingStr = ingStr.split(")(");
        let ingList = "";

        for (i = 1; i <= ingStr.length; i += 2) {
            ingList += `<li>${ingStr[i]} ${ingStr[i - 1]}</li>`;
        }

        $('#ingList').html(ingList);

        let stepStr = recipe.instructions;
        stepStr = stepStr.slice(1, stepStr.length - 1);
        stepStr = stepStr.split(")(");
        let stepList = "";

        for (i in stepStr) {
            stepList += `<li>${stepStr[i]}</li>`;
        }
        $('#stepList').html(stepList);

        let noteStr = recipe.notes;
        noteStr = noteStr.slice(1, noteStr.length - 1);
        noteStr = noteStr.split(")(");
        let noteList = "";

        for (i in noteStr) {
            noteList += `<li>${noteStr[i]}</li>`;
        }
        $('#noteList').html(noteList);

        let tagStr = recipe.tags;
        tagStr = tagStr.slice(1, tagStr.length - 1);
        tagStr = tagStr.split(")(");
        let tagList = "";

        for (i in tagStr) {
            tagList += `<li>${tagStr[i]}</li>`;
        }
        $('#tags').html(tagList);

        /* CHECK IF RECIPE BELONGS TO CURRENT USER */
        if (recipe.username == sessionStorage.getItem('username')) {
            allowEdits();
            $('#btnUpdateNotes').show();
            $('#btnUpdateNotes').click(function () {
                $('#notesPatchForm').show();
            });
            $('#btnChangePrivacy').show();
            $('#btnChangePrivacy').click(function () {
                $('#changePrivacy').show();
            });
        }

        $("#btnSendNotePatch").click(patchNotes(recipe.notes, recipe.id));
    });
}


/* GET RECIPE COMMENTS */

// populates element with comments list
function getComments(id) {

    recipeId = id;

    $.ajax({
        url: "/api/comments/recipe/" + recipeId,
        headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
        type: "GET",
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }
    }).done(function (commentsList) {
        $('#comments').html('');

        if (commentsList.length > 0) {
            $('#commentCount').html(commentsList.length);
        }

        for (i = 0; i < commentsList.length; i++) {

            var comment = commentsList[i];

            var result =
                `<div class="userComment row rounded-5 border-1 p-3 my-3">
                <div class="row justify-content-between">
                    <div class="col">
                        <img class="userImg" src="api/users/img/${comment.username}" width="30px"
                            alt="User Avatar">
                        <span class="username">@${comment.username}</span>
                    </div>
                    <div class="col text-end">
                        <span class="commentDate">${comment.date}</span>
                    </div>
                    <div class="row mt-3 px-5">
                        <span class="commentText">${comment.text}</span>
                    </div>
                    <div class="row p-0 mt-3 align-items-center text-end">
                        <div class="col p-0">
                            <img id="imgHelpful" src="images/smiley.png" alt="smile icon" width="20px"
                                class="">
                            <span id="commentHelpful">${comment.helpful}</span> users found this comment helpful
                            <button id="addHelpful" class="btn rounded pill">+</button>
                        </div>
                    </div>
                </div>
            </div>`

            $('#comments').append(result);
        }
    });

    /*CUREENT USER DETAILS (COMMENT FORM)*/
    let username = sessionStorage.getItem('username');
    if (username != null) {
        $('#currentUserImg').attr("src", `/api/users/img/${username}`);
        $('#currentUsername').html(`${username}`);
    } else {
        $('#currentUser').empty();
    }

}

/* POST COMMENT */

function postComment(recipeId) {


    let tfVal = $('#tfComment').val();

    let comment = {
        recipeId: recipeId,
        text: tfVal
    }
    $.ajax({
        url: "/api/comments/",
        headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
        type: "POST",
        dataType: "json",
        data: comment,
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }
<<<<<<< Updated upstream
    }).done(function () {
        getComments();
    });
=======
       
        $.ajax({
            url: "/api/comments/",
            headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
            type: "POST",
            dataType: "json",
            data: comment,
            error: function (jqxhr, status, errorThrown) {
                alert("AJAX error: " + jqxhr.responseText);
            }
        }).done(function () {
            getComments();
        }); 
    });
    
    async function getId(username){
        return new Promise ((resolve, reject) => {
            $.ajax({
                url: "api/users/id/" + username,
               headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
                type: "GET",
                dataType: "json",
                error: function (jqxhr, status, errorThrown) {
                    reject({status: jqxhr.status, error: errorThrown, message: jqxhr.errorMessage});
                }, 
                success: function (data){
                    resolve(data)
                }
            })
    
    })
    
    }




    /* ADD COMMENT HELPFUL */
>>>>>>> Stashed changes

}
/* ADD COMMENT HELPFUL */

function commentHelpful() {

}

/* RECIPE EDITOR VIEWS */





// counts how many lines in ingredients there are. 
let ingCount = 1;
let stepCount = 1;
let tagCount = 1;
let noteCount = 1;
let notePatchCount = 1;

function allowEdits() {
    $('#btnOpenEdit').show();
}

// hides recipe view, loads editor
function editRecipe() {
    $('#btnOpenEdit').hide();
    $('#btnView').show();
    $('#recipe').hide();
    $('#recipeEdit').show();
    $('#editorHeading').html('Recipe Editor');
    //TODO ask to save changes before leaving editor and/or hide view btn until changes saved
    $('#btnView').click(viewRecipe);
    $('#btnSave').show();
    $('#btnPost').hide();
}

// loads "POST" version of editor
function newRecipe() {
    //TODO: empty fields
    $('#viewRecipeGrid').hide();
    $('#viewRecipeSingle').show();
    $('#recipe').hide();
    $('#btnOpenEdit').hide();
    $('#btnView').show();
    $('#recipeEdit').show();
    $('#editorHeading').html('Add New Recipe');
    //TODO ask to save changes before leaving editor and/or hide view btn until changes saved
    $('#btnView').click(viewRecipe);
    $('#btnPost').show();
    $('#btnSave').hide();
}

/* RECIPE EDITOR INPUT */

function convertCookTime() {
    let hrs = $('#hrs').val();
    let mins = $('#mins').val();
    let total = parseInt(hrs * 60) + parseInt(mins);
    return total;
}


function addIngredients() {
    console.log("Ive been clicked")
    var tfIng = $(`id="tfIng${ingCount}"`).val();

    // FIXME: char escape regex for delimiters
    // TODO: further validation 
    if ($(`id="tfIng${ingCount}`).val() == '') {
        return;
    }

    // ingredientList +=
    ingCount++;
    console.log(ingCount);
    // TODO: needs to probably be changed when css changes 
    var newIng = ` <div id='ingredient${ingCount}'>
        <span>Ingredient name: </span>
        <input type="text" id="tfIng${ingCount}" class="ms-3 me-2">
        <span>Amount: <span>
        <input type="text" id="tfAmt${ingCount}" class="ms-3 me-2">
        </div>`;

    $("#newIngList").append(newIng);
}

function addTag() {

    // FIXME: char escape regex for delimiters
    //TODO more validation
    if ($(`id="tfTag${tagCount}"`).val() == '') {
        return;
    }
    stepCount++;
    var newTag = `<input type="text" name="tfTag${tagCount}">`;
    $("#newTagList").append(newTag);
}

function addNote() {

    // FIXME: char escape regex for delimiters
    //TODO more validation
    if ($(`id="tfNote${noteCount}"`).val() == '') {
        return;
    }
    noteCount++;
    var newNote = `<input type="text" name="tfNote${noteCount}">`;
    $("#newNoteList").append(newNote);
}
function addStep() {

<<<<<<< Updated upstream
    // FIXME: char escape regex for delimiters
    //TODO more validation
    if ($(`id="tfStep${stepCount}"`).val() == '') {
        return;
    }
    stepCount++;
    var newLine = `<input type="text" name="tfStep${stepCount}" class="w-75 input-lg">`;
    $("#newStepList").append(newLine);
}

/* PUBLISH NEW RECIPE */

function postRecipe() {

    let title = $('input[name="tfTitle"]').val();
    let desc = $('#tfDesc').val();
    //FIXME: String delimeter?
    let instr = '';
    for (i = 1; i <= stepCount; i++) {
        let stepVal = $(`id="tfStep${i}"`).val();
        instr += `(${stepVal})`;
=======
        let status = $('input[name="radioPubPriv"]:checked').val();
     
        let tags = '';
        for (i = 1; i <= tagCount; i++) {
            let tagVal = $(`id="tfTag${i}"`).val();
            tags += `(${tagVal})`;
        }
        let mins = convertCookTime();
        let yield = $('#tfYield').val();
    
        // FIXME: HANDLE NULL (insert default or prevent submission)
            // get file input value and type
            let file = $("#imgUpload").prop('files')[0];
            let mimeTypeVal = file.type;
        
       

            // read file
            let reader = new FileReader();
            reader.onload = function () {
    
                // prepare recipe obj
                recipe = { 
                    title: title, 
                    description: desc,
                    instructions: instr, 
                    notes: notes,  
                    ingredients: ing, 
                    status: status, 
                    data: btoa(reader.result),
                    mimeType: mimeTypeVal,
                    tags: tags,
                    cookTime: mins, 
                    yield: yield
                }

               
                
                $.ajax({   // FIXME: escape special characters using urlencode
                    url: "/api/recipes/",
                    headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
                    type: "POST",
                    dataType: "json",
                    data: recipe,
                    error: function (jqxhr, status, errorThrown) {
                        alert("AJAX error: " + jqxhr.responseText);
                    }
                }).done(function () {
                    alert("upload successful");
                    //refreshList();
                });
            };
            reader.onerror = function () {
                console.log(reader.error);
                alert(reader.error);
            };
            //reader.readAsDataURL(file); // read file and trigger one of the above handlers
            reader.readAsBinaryString(file);
        
            return;
>>>>>>> Stashed changes
    }

    let notes = '';
    for (i = 1; i <= noteCount; i++) {
        let noteVal = $('id="tfNote${i}"').val();
        notes += `(${noteVal})`;
    }

    let ing = '';
    for (i = 1; i <= ingCount; i++) {
        let ingVal = $(`id="tfIng${i}"`).val();
        let amtVal = $(`id="tfAmt${i}"`).val();
        ing += `(${ingVal})(${amtVal})`;
    }

    let status = $('input[name="radioPubPriv"]:checked').val();

    let tags = '';
    for (i = 1; i <= tagCount; i++) {
        let tagVal = $(`id="tfTag${i}"`).val();
        tags += `(${tagVal})`;
    }
    let mins = convertCookTime();
    let yield = $('#tfYield').val();

    // FIXME: HANDLE NULL (insert default or prevent submission)
    // get file input value and type
    let file = $("#imgUpload").prop('files')[0];
    let mimeTypeVal = file.type;

    // read file
    let reader = new FileReader();
    reader.onload = function () {

        // prepare recipe obj
        recipe = {
            title: title,
            description: desc,
            instructions: instr,
            notes: notes,
            ingredients: ing,
            status: status,
            data: btoa(reader.result),
            mimeType: mimeTypeVal,
            tags: tags,
            cookTime: mins,
            yield: yield
        }

        $.ajax({   // FIXME: escape special characters using urlencode
            url: "/api/recipes/",
            headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
            type: "POST",
            dataType: "json",
            data: recipe,
            error: function (jqxhr, status, errorThrown) {
                alert("AJAX error: " + jqxhr.responseText);
            }
        }).done(function () {
            alert("upload successful");
            //refreshList();
        });
    };
    reader.onerror = function () {
        console.log(reader.error);
        alert(reader.error);
    };
    //reader.readAsDataURL(file); // read file and trigger one of the above handlers
    reader.readAsBinaryString(file);

    return;
}

function postRecipe() {



    
    let title = $('input[name="tfTitle"]').val();
    let desc = $('#tfDesc').val();
    //FIXME: String delimeter?
    let instr = '';
 
    for (i = 1; i <= stepCount; i++) {
        let stepVal = $(`input[name="tfStep${i}"]`).val();
        instr += `(${stepVal})`;
    }

        //FIXME: concatenate notes
    let notes = '';
    for (i = 1; i <= noteCount; i++) {
        let noteVal = $(`input[name="tfNote${i}"]`).val();
        notes += `(${noteVal})`;
    }
    //FIXME: ingredient String
    let ing = '';
    for (i = 1; i <= ingCount; i++) {
        let ingVal = $(`input[name="tfIng${i}"]`).val();
        let amtVal = $(`input[name="tfAmt${i}"]`).val();
        ing += `(${ingVal})(${amtVal})`;
    }
    let status = $('input[name="radioPubPriv"]:checked').val();
    //FIXME: tag String
    let tags = '';
    for (i = 1; i <= tagCount; i++) {
        let tagVal = $(`[name="tfTag${i}"]`).val();
        tags += `(${tagVal})`;
    }
    let mins = convertCookTime();
    let yield = $('#tfYield').val();


    console.log($("#imgUpload").val() + " Is this true???")
    if ($("#imgUpload").val()){
        postRecipeValid(title, desc, instr, notes, ing, status, mins, yield, tags)
        // get file input value and type

        let file = $("#imgUpload").prop('files')[0];
        let mimeTypeVal = file.type;
        // read file
        createRecipe(title, desc, instr, notes, ing, status, mins, yield, tags, file, mimeTypeVal)
        .then(function (message) {
           console.log("recipe has been created")
    
            
        }).catch(function (error) {
            if (error.status === 413) {
                console.log(error + " Recipe creation error")
            } else if (error.status === 403){
                console.log("You must be logged in to create a recipe");
            }
        })
    } else {
            console.log("Please upload an image")
            return;
    } 

}



function convertCookTime() {
    let hrs =  $('#hrs').val();
    let mins = $('#mins').val();
    let total = parseInt(hrs * 60) + parseInt(mins);
    return total;
}


// prompts delete confirmation, deletes recipe
$('#deleteRecipe').click(function () {
    var id;
    var confirmDelete = false;
    if (confirmDelete == true) {
        $.ajax({
            url: "/api/recipes/" + id,
            headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
            type: "DELETE",
            dataType: "json",
            error: function (jqxhr, status, errorThrown) {
                alert("AJAX error: " + jqxhr.responseText);
            }
        }).done(function () {

        });
    }
});

function postRecipeValid(title, description, instructions, notes, ingredients, status, cookTime, yield, tags) {
    console.log(title+ " TITLE")
    if (!title || !description || !instructions || 
        !notes || !ingredients || !status || !cookTime || !yield){
            console.log("You don't have all the content")
            return false
        }
    if (tags) {
            if (tags.length > 150 ) {
                console.log("tags must be uer 150 characters long")
            }
        } 
    if (title.length > 100) {
        console.log("Your title must be less than 100 characters long")
        return false;
    } 
    if (instructions.length > 1500) {
        console.log("Your instructions must be less than 1500 characters in length")
        return false;
    }
    if (notes.length > 1500) {
        console.log("Your notes must not exceed 1500 characters.")
        return false;
    }
    if (ingredients.length > 250) {
        console.log("Your ingredients must not exceed 250 characters")
        return false;
    }
    if (isNaN(cookTime)) {
        console.log("Your cooktime must be in whole numbers")
        return false;
    }
    if (yield.length > 100) {
        console.log("Your yield field must be less than 100 characters in length")
        return false;
    }

    return true;

}


async function createRecipe(title, desc, instr, notes, ing, status, mins, yield, tags, data, mimeTypeVal){



        console.log("We are creating now")

    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = function () {

            // prepare recipe obj
            recipe = { 
                title: title, 
                description: desc,
                instructions: instr, 
                notes: notes,  
                ingredients: ing, 
                status: status, 
                data: btoa(reader.result),
                mimeType: mimeTypeVal,
                tags: tags,
                cookTime: mins, 
                yield: yield
            }


            $.ajax({   // FIXME: escape special characters using urlencode
                url: "/api/recipes/",
                headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
                type: "POST",
                dataType: "json",
                data: recipe,
                error: function (jqxhr, status, errorThrown) {
                    alert("AJAX error: " + jqxhr.responseText);
                }
            }).done(function () {
                resolve("upload successful");
                //refreshList();
            }).fail(function (jqxhr, status, errorThrown) {
                reject({status: jqxhr.status, error: errorThrown});
              });
        };
        reader.onerror = function () {
            console.log(reader.error);
            alert(reader.error);
        };
        //reader.readAsDataURL(file); // read file and trigger one of the above handlers
        reader.readAsBinaryString(data);
    
        return;
    })


}


/* UPDATE RECIPE */

/* NOTES PATCH */
function addNotePatch() {

    // FIXME: char escape regex for delimiters
    //TODO more validation
    if ($(`id="tfNotePatch${notePatchCount}"`).val() == '') {
        return;
    }
    notePatchCount++;
    var newNote = `<input type="textarea" id="tfNotePatch${notePatchCount}">`;
    $("#notePatchList").append(newNote);
}

function patchNotes(notes, id) {
    this.id = id;
    //FIXME ALEX SOS get user id for patch
    let newNotes = notes;
    for (i = 1; i <= notePatchCount; i++) {
        let notePatchVal = $(`id="tfNotePatch${i}"`).val();
        newNotes += `(${notePatchVal})`;
    }

    let recipe = {
        notes: newNotes
    }

    $.ajax({   // FIXME: escape special characters using urlencode
        url: "/api/recipes/" + id,
        headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
        type: "POST",
        dataType: "json",
        data: recipe,
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }
    }).done(function () {
        alert("notes added successfully");
        viewRecipe(id);
    });
}



/* DELETE RECIPE */
// FIXME: incomplete
// prompts delete confirmation, deletes recipe
$('#deleteRecipe').click(function () {
    var id;
    var confirmDelete = false;
    if (confirmDelete == true) {
        $.ajax({
            url: "/api/recipes/" + id,
            headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
            type: "DELETE",
            dataType: "json",
            error: function (jqxhr, status, errorThrown) {
                alert("AJAX error: " + jqxhr.responseText);
            }
        }).done(function () {

        });
    }
});

/* USER PAGE VIEWS */
function viewUser() {
    let username = sessionStorage.getItem('username');
    $('#viewRecipeGrid').hide();
    $('#viewRecipeSingle').hide();
    $('#profileImg').attr("src", `/api/users/img/${username}`);
    $('#profileUsername').html(`${username}`);

   // $('#viewUserPage').show();
}
$('#currentUserImg').attr("src", `/api/users/img/${username}`);
/* USER RECIPE LIST */
//incomplete
function refreshUserRecipeList(sortOrder) {

    $.ajax({
        url: "/api/recipes/",
        type: "GET",
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }


    }).done(function (recipeList) {
        console.log(recipeList.length);

        var result = '';

        for (var i in recipeList) {
            var recipe = recipeList[i];

            result +=
                ` <div class="col-sm-3 my-3">
             <div class="recipeGridItem container rounded-5 border-1 p-0 h-100">
                 <div class="row h-50">
                     <img class="col-12 rounded-top-5 border-1 mb-2 w-100 h-100 object-fit-cover" src="/api/recipes/img/${recipe.id}" height="300px" alt="Recipe photo">               

                </div>
                <div class="row text-center mt-4">
                    <div class="col-12">

                            <button id="x${recipe.id}" onclick="viewRecipe(${recipe.id})" class="btnRecipe fs-2 w-100">${recipe.title}</button>

                    </div>
                    <div class="row recipeDescription h-100">
                        <div class="col-12 h-100">
                            <p><em>${recipe.description}</em></p>
                        </div>
                    </div>
                </div>
             
                    <div class="row my-2 p-5 align-text-bottom">
                        <div class="recipeAuthor col-8">
                          <div class="row">
                                <div class="col-3 p-0">
                                    <img src="/api/users/img/${recipe.username}" width="30px" alt="User Avatar">
                                </div>                            
                                <div class="col-9 p-0">                            
                                    <div class="author">${recipe.author}</div>
                                </div>
                            </div>
                        </div>
                        <div class="recipeDate" class="col-4 text-end">
                             ${recipe.date}
                        </div>
                    </div>
                </div>
            </div>
         </div>`

        }
        $("#recipeList").html(result);
    });
}

/* UPDATE USER PROFILE IMAGE */
function updateProfileImg() {

    // get file input value and type
    let file = $("#profileImgUpdate").prop('files')[0];
    let mimeTypeVal = file.type;

    // read file
    let reader = new FileReader();
    reader.onload = function () {


        var userObj = { profileImg: btoa(reader.result), mimeType: mimeTypeVal };
        $("#waitForIt").show();
        // NOTE: if currId = 0 then adding, otherwise updating
        $.ajax({ // FIXME: escape special characters using urlencode
            url: "/api/users/img/" + sessionStorage.getItem('username'),
            headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
            type: "PATCH",
            dataType: "json",
            data: userObj,
            error: function (jqxhr, status, errorThrown) {
                alert("AJAX error: " + jqxhr.responseText);
            }
        }).done(function () {
            // TODO: alerts are obsolete, instead use HTML z-layer popup that shows up for 2-3 seconds
            alert("Image updated successfully.");

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
}

/* UPDATE RECIPE IMAGE */
function updateRecipeImg() {

    // get file input value and type
    let file = $("#imgRecipeUpdate").prop('files')[0];
    let mimeTypeVal = file.type;

    // read file
    let reader = new FileReader();
    reader.onload = function () {
        //TODO: get recipe ID
        let id;

        var recipe = { data: btoa(reader.result), mimeType: mimeTypeVal };
        $("#waitForIt").show();
        // NOTE: if currId = 0 then adding, otherwise updating
        $.ajax({ // FIXME: escape special characters using urlencode
            url: "/api/recipes/img/" + id, //+ sessionStorage.getItem('username'),
            // headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
            type: "PATCH",
            dataType: "json",
            data: recipe,
            error: function (jqxhr, status, errorThrown) {
                alert("AJAX error: " + jqxhr.responseText);
            }
        }).done(function () {
            // TODO: alerts are obsolete, instead use HTML z-layer popup that shows up for 2-3 seconds
            alert("Image updated successfully.");

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
}



// ALEX WORKING ZONE 

async function getId(username) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "api/users/id/" + username,
            headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
            type: "GET",
            dataType: "json",
            error: function (jqxhr, status, errorThrown) {
                reject({ status: jqxhr.status, error: errorThrown, message: jqxhr.errorMessage });
            },
            success: function (data) {
                resolve(data)
            }
        })

    })

}



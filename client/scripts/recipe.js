$(document).ready(function () {

    // TEST session storage
    alert("Session username: " + sessionStorage.getItem('username') +
    "Session password: " +  sessionStorage.getItem('password') );

    viewRecipe();
    // TODO: Check if recipe belongs to logged in user
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

    $('#btnSave').click(function () {
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

// counts how many lines in ingredients there are. 
let ingCount = 1;
let stepCount = 1;
let tagCount = 1;
let noteCount = 1;

// loads recipe view, hides editor
function viewRecipe() {
    $('#btnView').hide();
    $('#btnOpenEdit').show();
    $('#recipeEdit').hide();
    $('#recipe').show();
    $('#btnOpenEdit').click(editRecipe);
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





function addIngredients() {
    console.log("Ive been clicked")
    var tfIng = $(`id="tfIng${ingCount}"`).val();


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

    $("#ingEdit").append(newIng);
}

function addTag() {

    //TODO more validation
    if ($(`id="tfTag${tagCount}"`).val() == '') {
        return;
    }
    stepCount++;
    var newTag = `<input type="text" name="tfTag${tagCount}">`;
    $("#tagsEdit").append(newTag);    
}

function addNote() {

    //TODO more validation
    if ($(`id="tfNote${noteCount}"`).val() == '') {
        return;
    }
    noteCount++;
    var newNote = `<input type="text" name="tfNote${noteCount}">`;
    $("#notesEdit").append(newNote);    
}

/*
function addIngredients() {
    console.log("Ive been clicked")
    const tfIng = $(`#tfIng${ingCount}`).val();
    const tfAmt = $(`#tfAmt${ingCount}`).val();
    const tfUnits = $(`#tfUnit${ingCount}`).val();

    // TODO: further validation 
    if (tfIng == '' || isNaN(tfAmt) || tfUnits == '') {
        return;
    }

    ingredientList +=
        ingCount++;
    console.log(ingCount);
    // TODO: needs to probably be changed when css changes 
    var newLine = ` <div id='ingredient${ingCount}'>
    <span class="">Ingredient name: </span>
    <input type="text" name="tfIng${ingCount}" id="tfIng${ingCount}" class="ms-3 me-2">
    <span class="">Amount: </span>
    <input type="number" name="tfAmt${ingCount}" id="tfAmt${ingCount}" class="ms-3 me-2">
    <span class="">Units: </span>
    <input type="text" name="tfUnit${ingCount}" id="tfUnit${ingCount}" class="ms-3 me-2">
    </div>`
    $("#ingredient1").append(newLine);
}
*/

function addStep() {

    //TODO more validation
    if ($(`id="tfStep${stepCount}"`).val() == '') {
        return;
    }
    stepCount++;
    var newLine = `<input type="text" name="tfStep${stepCount}" class="w-75 input-lg">`;
    $("#stepsEdit").append(newLine);
}


/* TODO: Incomplete; come back later */

$('#formComment').on("submit", function (event) {
    event.preventDefault();

});


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




$(document).ready(() => {
    $("#users").on('click', viewAllUsers);// view all users
    $("#comments").on('click', viewAllComments);// view all comments
    $("#recipes").on('click', viewAllRecipes);// view all revipes
    $("#activateUser").on('click', activateUser);// show activate pane
    $("#addAdmin").on('click', createAdminPanel);// create admin


})


//view all users active/deactive
function viewAllUsers() {

    let usertTitle = `<h4 class="text-dark text-center mt-2" >All User's Info</h4>`;
    let usersTableHead =
        `<thead class="thead-dark">
        <tr>
         <th scope="col">#</th>
         <th scope="col">username</th>
         <th scope="col">email</th>
         <th scope="col">fullname</th>
         <th scope="col">role</th>
         <th scope="col">is deleted</th>
         
        </tr>
    </thead>`;


    let usersPane = usertTitle + `<table class="table">` + usersTableHead;

    let url = `/api/users/`;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
            //FIXME: not working
            //showModal('Error', jqxhr.responseText);
        }
    }).done((usersList) => {
        //console.log('front get all comments: ', commentList);
        var usersTableBody = `<tbody>`;

        for (var i = 0; i < usersList.length; i++) {
            var user = usersList[i];

            usersTableBody += '<tr>';
            usersTableBody += '<td>' + (i + 1) + '</td>';
            usersTableBody += '<td>' + user.username + '</td>';
            usersTableBody += '<td>' + user.email + '</td>';
            usersTableBody += '<td>' + user.fullname + '</td>';
            usersTableBody += '<td>' + user.role + '</td>';
            usersTableBody += '<td>' + user.isDeleted + '</td>';
            usersTableBody += '</tr>' + "\n";
        }
        usersTableBody += `</tbody></table>`;
        usersPane += usersTableBody;
        $("#data-content").html(usersPane);
    })


}

function viewAllComments() {


    let commentTitle = `<h4 class="text-dark text-center mt-2" >All Comments Date ordered</h4>`;
    let commentsTableHead =
        `<thead class="thead-dark">
        <tr>
         <th scope="col">#</th>
         <th scope="col">username</th>
         <th scope="col">profil image</th>
         <th scope="col">comment</th>
         <th scope="col">date published</th>
         <th scope="col">recipe title</th>
         
        </tr>
    </thead>`;


    let commentsPane = commentTitle + `<table class="table">` + commentsTableHead;
    //commentsPane +=  commentsTableHead;


    let url = `/api/comments/admin`;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
            //FIXME: not working
            //showModal('Error', jqxhr.responseText);
        }
    }).done((commentList) => {
        //console.log('front get all comments: ', commentList);
        var commentsTableBody = `<tbody>`;

        for (var i = 0; i < commentList.length; i++) {
            var comment = commentList[i];

            commentsTableBody += '<tr>';
            commentsTableBody += '<td>' + (i + 1) + '</td>';
            commentsTableBody += '<td>' + comment.username + '</td>';
            commentsTableBody += '<td>' + comment.profilImg + '</td>';
            commentsTableBody += '<td>' + comment.text + '</td>';
            commentsTableBody += '<td>' + comment.date + '</td>';
            commentsTableBody += '<td>' + comment.title + '</td>';
            commentsTableBody += '</tr>' + "\n";
        }
        commentsTableBody += `</tbody></table>`;
        commentsPane += commentsTableBody;
        $("#data-content").html(commentsPane);
    })




}


function viewAllRecipes() {
    let recipeTitle = `<h4 class="text-dark text-center mt-2" >All Comments Date ordered</h4>`;
    let recipesTableHead =
        `<thead class="thead-dark">
        <tr>
         <th scope="col">#</th>
         <th scope="col">email</th>
         <th scope="col">username</th>
         <th scope="col">title</th>
         <th scope="col">date</th>
         <th scope="col">description</th>
         <th scope="col">instruction</th>
         <th scope="col">notes</th>
         <th scope="col">ingredients</th>
         <th scope="col">status</th>
         <th scope="col">tags</th>
         <th scope="col">cookTime</th>
         <th scope="col">yield</th>
         
        </tr>
    </thead>`;


    let recipesPane = recipeTitle + `<table class="table">` + recipesTableHead;



    let url = `/api/recipes/admin/all`;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
            //FIXME: not working
            //showModal('Error', jqxhr.responseText);
        }
    }).done((recipesList) => {
        //console.log('front get all comments: ', commentList);
        var recipessTableBody = `<tbody>`;

        for (var i = 0; i < recipesList.length; i++) {
            var recipe = recipesList[i];

            recipessTableBody += '<tr>';
            recipessTableBody += '<td>' + (i + 1) + '</td>';
            recipessTableBody += '<td>' + recipe.email + '</td>';
            recipessTableBody += '<td>' + recipe.username + '</td>';
            recipessTableBody += '<td>' + recipe.title + '</td>';
            recipessTableBody += '<td>' + recipe.date + '</td>';
            recipessTableBody += '<td>' + recipe.description + '</td>';
            recipessTableBody += '<td>' + recipe.instruction + '</td>';
            recipessTableBody += '<td>' + recipe.notes + '</td>';
            recipessTableBody += '<td>' + recipe.ingredients + '</td>';
            recipessTableBody += '<td>' + recipe.status + '</td>';
            recipessTableBody += '<td>' + recipe.tags + '</td>';
            recipessTableBody += '<td>' + recipe.cookTime + '</td>';
            recipessTableBody += '<td>' + recipe.yield + '</td>';
            recipessTableBody += '</tr>' + "\n";
        }
        recipessTableBody += `</tbody></table>`;
        recipesPane += recipessTableBody;
        $("#data-content").html(recipesPane);
    })
}

//reactivate a deleted user 
function activateUser() {


    let pane =
        `
        <section class=''>
            <div class='row mt-5'>
                <div class='card col-md-4 form-inline'>

                    <div class="form-group mx-sm-3 mt-5 pb-5">
                        <label for="email" class="sr-only mb-2 text-dark">email</label>
                        <input type="text" class="form-control" id="email" placeholder="name@email.com">
                        <button type="button" class="btn btn-success mt-2" onclick="findUserByusername()">Find User</button>
                    </div>
                    
                </div>
            
        
         `;

    let userInfo =
        `
            <div class="card col-md-8 " style="width: 25rem;" id="user-info">
                
                <div class="card-body">
                   
                    <div class="form-group row">
                        <label for="username" class="col-sm-4 col-form-label">Username</label>
                        <div class="col-sm-7">
                            <input type="text" class="form-control" id="username" placeholder="username">
                        </div>
                        <label for="fullname" class="col-sm-4 col-form-label">Fullname</label>
                        <div class="col-sm-7">
                            <input type="text" class="form-control" id="fullname" placeholder="fullname">
                        </div>
                        
                        
                        <label for="role" class="col-sm-4 col-form-label">Role</label>
                        <div class="col-sm-7">
                            <input type="text" class="form-control" id="role" placeholder="">
                        </div>
                    </div>
                    <hr>
                    <div  id="data-rest"></div>
                    
    `;


    //call to find the user     
    pane += userInfo;


    $("#data-content").html(pane);

    $('#user-info').hide();
    return pane;

}

function findUserByusername() {

    $('#user-info').show();
    let email = $('#email').val();
    console.log('username:kJZBDCkjsahcb ', email);

    let url = 'http://localhost:8500/api/users/exists/admin/email?email=' + email;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
            //FIXME: not working
            //showModal('Error', jqxhr.responseText);
        }
    }).done((user) => {




        $('#username').val(user.username);
        $('#fullname').val(user.fullname);

        $('#role').val(user.role);
        let isDeleted = user.isDeleted === 0 ? $('#notDeleted').prop("checked", true) : $('#deleted').prop("checked", true);



        console.log('isdeleted', $('#notDeleted').prop("checked", true));
        let rest = `<a href="#" class="btn btn-warning mt-3">Activate User</a>

        <div class="form-check form-check-inline">
            <label class="form-check-label" for="notDeleted">Active</label>
                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="notDeleted" value="option1" ${isDeleted}>
            </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="deleted" value="option2" ${isDeleted}>
            <label class="form-check-label" for="deleted">Deleted</label>
          </div>
    </div>
</div>
</div>
</section>`
        if (user.isDeleted === 0) { $('#notDeleted').prop("checked", true); }
        else $('#deleted').prop("checked", true)

        $("#data-rest").html(rest);

        // recipesPane += recipessTableBody;
        //$("#data-content").html(recipesPane);
    })

}


// FIXME: not implemented 
// add new admin html
function createAdminPanel() {

    let pane = `
    <section class="vh-100 gradient-custom">
    <div class="container py-5 h-100">
      <div class="row justify-content-center align-items-center h-100">
        <div class="col-12 col-lg-9 col-xl-7">
          <div class="card shadow-2-strong card-registration" style="border-radius: 15px;">
            <div class="card-body p-4 p-md-5">
              <h3 class="mb-4 pb-2 pb-md-0 mb-md-5">New Admin Registration</h3>
             
  
                <div class="row">
                  <div class="col-md-6 mb-4">
  
                    <div class="form-outline">
                      <input type="text" id="username" class="form-control form-control-lg" />
                      <label class="form-label" for="username">Username</label>
                    </div>
  
                  </div>
                  <div class="col-md-6 mb-4">
  
                    <div class="form-outline">
                      <input type="text" id="email" class="form-control form-control-lg" />
                      <label class="form-label" for="email">Email</label>
                    </div>
  
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-4">
  
                    <div class="form-outline">
                      <input type="text" id="password" class="form-control form-control-lg" />
                      <label class="form-label" for="password">password</label>
                    </div>
  
                  </div>
                  <div class="col-md-6 mb-4">
  
                    <div class="form-outline">
                      <input type="text" id="repeat" class="form-control form-control-lg" />
                      <label class="form-label" for="repeat">repeate password</label>
                    </div>
  
                  </div>
                </div>
  
                <div class="row">
                  <div class="col-md-6 mb-4 d-flex align-items-center">
  
                    <div class="form-outline datepicker w-100">
                      <input type="text" class="form-control form-control-lg" id="fullname" />
                      <label for="fullname" class="form-label">Fullname</label>
                    </div>
  
                  </div>

                <div class="mt-4 pt-2">
                  <input class="btn btn-primary btn-lg" type="button" value="Add and Activate" onclick="addAdmin()"/>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
    
    
    `;


    $("#data-content").html(pane);

}
// FIXME: not implemented 
function addAdmin() {

    let username = $('#username').val();
    let email = $('#email').val();
    let fullname = $('#fullname').val();
    let pass = $('#password').val() === $('#repeat').val() ? $('#password').val() : alert('dose not match');

    console.log('paasss validation: ', pass);

    var data = {
        username: username,
        email: email,
        fullname: fullname,
        pass: pass
    };

    let url;
    $.ajax({
        url: url,
        type: "POST",
        data: data,
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
            //FIXME: not working
            //showModal('Error', jqxhr.responseText);
        }
    }).done((commentList) => {
        //console.log('front get all comments: ', commentList);
        var commentsTableBody = `<tbody>`;

        for (var i = 0; i < commentList.length; i++) {
            var comment = commentList[i];

            commentsTableBody += '<tr>';
            commentsTableBody += '<td>' + (i + 1) + '</td>';
            commentsTableBody += '<td>' + comment.username + '</td>';
            commentsTableBody += '<td>' + comment.profilImg + '</td>';
            commentsTableBody += '<td>' + comment.text + '</td>';
            commentsTableBody += '<td>' + comment.date + '</td>';
            commentsTableBody += '<td>' + comment.title + '</td>';
            commentsTableBody += '</tr>' + "\n";
        }
        commentsTableBody += `</tbody></table>`;
        commentsPane += commentsTableBody;
        $("#data-content").html(commentsPane);
    })
}




function showModal(title, bodyMsg) {
    let modal = `
    <div class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${bodyMsg}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>${title}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>`;

}

const API_URL = "https://ne45kkw7zi.execute-api.us-east-1.amazonaws.com/dev";
const PHOTOGALLERY_S3_BUCKET_URL = "photobucket-ahmed-2021-4150";

function clearSession() {
    sessionStorage.clear();
    location.href='login.html';
};

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
}

function processLogin() {
    var username =  $("#username" ).val();
    var password = $("#password" ).val();

    var datadir = {
        username: username,
        password: password
    };

    $.ajax({
        url: `${API_URL}/login`,
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        contentType: "application/json",
        success: function(data) {
            var result = JSON.parse(data.body);
            console.log(result);
            if(result.result){
                sessionStorage.setItem('username', result.userdata.username);
                sessionStorage.setItem('name', result.userdata.name);
                sessionStorage.setItem('email', result.userdata.email);
                location.href='index.html';
            }else{
                $("#message").html(result.message);
            }
            
            console.log(data);
        },
        error: function(data) {
            console.log(data);
            console.log("Failed");
        },        
        data: JSON.stringify(datadir)
    });    
}


function processSignup() {
    var username =  $("#username" ).val();
    var password = $("#password" ).val();
    var password1 = $("#password1" ).val();
    var name = $("#name" ).val();
    var email = $("#email" ).val();

    var datadir = {
        username: username,
        password: password,
        name: name,
        email: email
    };

    $.ajax({
        url: `${API_URL}/signup`,
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        contentType: "application/json",
        success: function(data) {
            var result = JSON.parse(data.body);
            console.log(result);
            $("#message").html(result.message);
            if(result.result){
                sessionStorage.setItem('username', result.userdata.username);
                $("#messageaction").html("Click  <a href=\"confirmemail.html\">here</a> to confirm your email");
            }
        },
        error: function() {
            console.log("Failed");
        },        
        data: JSON.stringify(datadir)
    });    
}

function loadConfirmEmailPage(){
    var username = $("#username").val();
    var code = $("#code").val();

    var datadir = {
        username: username,
        code: code
    };

    $.ajax({
        url: `${API_URL}/confirmemail`,
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        contentType: "application/json",
        success: function(data) {
            var result = JSON.parse(data.body);
            console.log(result);
            if(result.result){                
                $("#confirmemail-message").html(result.message);
                $("#confirmemail-message-action").html("Click  <a href=\"login.html\">here</a> to login");                
            }else{
                $("#confirmemail-message").html(result.message);
            }
            
            console.log(data);
        },
        error: function(data) {
            console.log(data);
            console.log("Failed");
        },        
        data: JSON.stringify(datadir)
    });  
}


function uploadPhoto(){
    var title = $("#title").val();
    var description = $("#description").val();
    var tags = $("#tags").val();
    var imageFile = $('#imagefile')[0].files[0];
    var contenttype = imageFile.type;
    var filename=imageFile.name;
    console.log(imageFile);
    console.log(filename);

    $.ajax({
        url: `${API_URL}/uploadphoto/${filename}`,
        type: 'PUT',
        crossDomain: true,
        contentType: contenttype,
        processData: false,
        statusCode: {
        200: function(data) {
            console.log(data);
            console.log("Uploaded");
            processAddPhoto(filename, title, description, tags);
         }
        },       
        data: imageFile
    }); 
}

function searchPhotos(){
    var query = $("#query").val();

    var datadir = {
        query: query
    };

    console.log(datadir);

    $.ajax({
        url: `${API_URL}/search`,
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        contentType: "application/json",
        success: function(data) {                        
            console.log(data);
            sessionStorage.setItem('query', query);
            sessionStorage.setItem('searchdata', JSON.stringify(data));
            location.href='search.html';            
        },
        error: function() {
            console.log("Failed");
        },        
        data: JSON.stringify(datadir)
    }); 
}

function loadSearchPage(){
    var query = sessionStorage.getItem('query');
    var data = JSON.parse(sessionStorage.getItem('searchdata'));
    console.log(data);
    $("#searchquery-container").html("Showing search results for: "+query);
    var htmlstr="";
    $.each(data.body, function(index, value) {
        //console.log(value); //can add delete here as well?
        htmlstr = htmlstr + '<div class=\"cbp-item idea web-design theme-portfolio-item-v2 theme-portfolio-item-xs\"> <div class=\"cbp-caption\"> <div class=\"cbp-caption-defaultWrap theme-portfolio-active-wrap\"> <img src=\"'+value.URL+'\" alt=\"\"> <div class=\"theme-icons-wrap theme-portfolio-lightbox\"> <a class=\"cbp-lightbox\" href=\"'+value.URL+'\" data-title=\"Portfolio\"> <i class=\"theme-icons theme-icons-white-bg theme-icons-sm radius-3 icon-focus\"></i> </a> </div> </div> </div> <div class=\"theme-portfolio-title-heading\"> <h4 class=\"theme-portfolio-title\"><a href=\"viewphoto.html?id='+value.PhotoID+'\">'+value.Title+'</a></h4> <span class=\"theme-portfolio-subtitle\">by '+value.Username+'<br>'+value.CreationTime+'</span> </div> </div>';
                });
        //console.log(htmlstr);
        $('#portfolio-4-col-grid-search').html(htmlstr);
        handlePortfolio4ColGridSearch();        
}

function processAddPhoto(filename, title, description, tags){
    var username = sessionStorage.getItem('username');    
    var uploadedFileURL = `https://${PHOTOGALLERY_S3_BUCKET_URL}.s3.amazonaws.com/photos/${filename}`;

    var datadir = {
        username: username,
        title: title,
        description: description,
        tags: tags,
        uploadedFileURL: uploadedFileURL
    };

    console.log(datadir);

    $.ajax({
        url: `${API_URL}/photos`,
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        contentType: "application/json",
        success: function(data) {                        
            console.log(data);
            location.href='index.html';            
        },
        error: function() {
            console.log("Failed");
        },        
        data: JSON.stringify(datadir)
    }); 
}

function handlePortfolio4ColGridSearch() {
        $('#portfolio-4-col-grid-search').cubeportfolio({
            filters: '#portfolio-4-col-grid-filter',
            layoutMode: 'grid',
            defaultFilter: '*',
            animationType: 'rotateRoom',
            gapHorizontal: 30,
            gapVertical: 30,
            gridAdjustment: 'responsive',
            mediaQueries: [{
                width: 1500,
                cols: 4
            }, {
                width: 1100,
                cols: 4
            }, {
                width: 800,
                cols: 4
            }, {
                width: 550,
                cols: 2
            }, {
                width: 320,
                cols: 1
            }],
            caption: ' ',
            displayType: 'bottomToTop',
            displayTypeSpeed: 100,

            // lightbox
            lightboxDelegate: '.cbp-lightbox',
            lightboxGallery: true,
            lightboxTitleSrc: 'data-title',
            lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',
        });
    }

function handlePortfolio4ColGrid() {
        $('#portfolio-4-col-grid').cubeportfolio({
            filters: '#portfolio-4-col-grid-filter',
            layoutMode: 'grid',
            defaultFilter: '*',
            animationType: 'rotateRoom',
            gapHorizontal: 30,
            gapVertical: 30,
            gridAdjustment: 'responsive',
            mediaQueries: [{
                width: 1500,
                cols: 4
            }, {
                width: 1100,
                cols: 4
            }, {
                width: 800,
                cols: 4
            }, {
                width: 550,
                cols: 2
            }, {
                width: 320,
                cols: 1
            }],
            caption: ' ',
            displayType: 'bottomToTop',
            displayTypeSpeed: 100,

            // lightbox
            lightboxDelegate: '.cbp-lightbox',
            lightboxGallery: true,
            lightboxTitleSrc: 'data-title',
            lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',
        });
    }

function checkIfLoggedIn(){
    var email = sessionStorage.getItem('email');
    var username = sessionStorage.getItem('username');
    if (email == null || username == null) {
            location.href='login.html';
    }
}

function loadHomePage(){
    checkIfLoggedIn();
    $("#userdata-container").html("Logged in as "+sessionStorage.getItem('name')+" ("+sessionStorage.getItem('username')+")");
    var datadir = {};
    var htmlstr="";
    $.ajax({
        url: `${API_URL}/photos`,
        type: 'GET',
        crossDomain: true,
        contentType: "application/json",
        success: function(data) {
            console.log(data);
            $.each(data.body, function(index, value) {
                //console.log(value);
                htmlstr = htmlstr + '<div class=\"cbp-item idea web-design theme-portfolio-item-v2 theme-portfolio-item-xs\"> <div class=\"cbp-caption\"> <div class=\"cbp-caption-defaultWrap theme-portfolio-active-wrap\"> <img src=\"'+value.URL+'\" alt=\"\"> <div class=\"theme-icons-wrap theme-portfolio-lightbox\"> <a class=\"cbp-lightbox\" href=\"'+value.URL+'\" data-title=\"Portfolio\"> <i class=\"theme-icons theme-icons-white-bg theme-icons-sm radius-3 icon-focus\"></i> </a> </div> </div> </div> <div class=\"theme-portfolio-title-heading\"> <h4 class=\"theme-portfolio-title\"><a href=\"viewphoto.html?id='+value.PhotoID+'\">'+value.Title+'</a></h4> <span class=\"theme-portfolio-subtitle\">by '+value.Username+'<br>'+value.CreationTime+'</span> </div> </div>';
                });
            console.log(htmlstr);
            $('#portfolio-4-col-grid').html(htmlstr);
            handlePortfolio4ColGrid();
            
        },
        error: function() {
            console.log("Failed");
        }
    });    
}

function loadAddPhotosPage(){
    checkIfLoggedIn();
    $("#userdata-container").html("Logged in as "+sessionStorage.getItem('name')+" ("+sessionStorage.getItem('username')+")");
}

function loadViewPhotoPage(){
    checkIfLoggedIn();
    $("#userdata-container").html("Logged in as "+sessionStorage.getItem('name')+" ("+sessionStorage.getItem('username')+")");
    PhotoID=$.urlParam('id');
    console.log(PhotoID);
    var htmlstr="";
    var tagstr="";
    $.ajax({
        url: `${API_URL}/photos/${PhotoID}`,
        type: 'GET',
        crossDomain: true,
        dataType: 'json',
        contentType: "application/json",
        success: function(data) {            
            console.log(data);
            photo=data.body[0];
            htmlstr = htmlstr + '<img class=\"img-responsive\" src=\"'+photo.URL+'\" alt=\"\"> <div class=\"blog-grid-content\"> <h2 class=\"blog-grid-title-lg\"><a class=\"blog-grid-title-link\" href=\"#\">'+photo.Title+'</a></h2> <p>By: '+photo.Username+'</p> <p>Uploaded: '+photo.CreationTime+'</p> <p>'+photo.Description+'</p></div>'
            $('#viewphoto-container').html(htmlstr);
            tags=photo.Tags.split(',');
            console.log(tags)
            $.each(tags, function(index, value) {
                tagstr=tagstr+'<li><a class=\"radius-50\" href=\"#\">'+value+'</a></li>';
            });
            $('#tags-container').html(tagstr);
        },
        error: function() {
            console.log("Failed");
        }
    });   
}

//function supports the edit functionality, loads photo in
function loadEditor(){
    checkIfLoggedIn();
    $("#userdata-container").html("Logged in as "+sessionStorage.getItem('name')+" ("+sessionStorage.getItem('username')+")");
    PhotoID=$.urlParam('id');
    var htmlstr="";
    $.ajax({
        url: `${API_URL}/photos/${PhotoID}`,
        type: 'GET',
        crossDomain: true,
        dataType: 'json',
        contentType: "application/json",
        success: function(data) {            
            console.log(data);
            photo=data.body[0];
            htmlstr = htmlstr + '<img class=\"img-responsive\" src=\"'+photo.URL+'\" alt=\"\">  <div class=\"blog-grid-content\"> <h2> Title </h2> <input type="text" name="newTitle" id="newTitle" class="form-control"> <br> <h2> Description </h2><textarea name="newDescription" id="newDescription" class="form-control" rows="3"> </textarea> <br> <h2> Tags </h2><input type="text" name="newTags" id="newTags" class="form-control"> <br> <button type="button" class="btn btn-primary" onclick="editPhoto()">Update</button> '
            $('#viewphoto-container').html(htmlstr);
            document.getElementById('newTitle').value = photo.Title;
            document.getElementById('newDescription').innerHTML = photo.Description;
            document.getElementById('newTags').value = photo.Tags;
        },
        error: function() {
            console.log("Failed to get photo.");
        }
    });
}

//function to delete a photo
function deletePhoto(){
    checkIfLoggedIn();
    PhotoID=$.urlParam('id');
    //AJAX call to server with DELETE request to API for removing picture from DB
    $.ajax({
        url:`${API_URL}/photos/${PhotoID}`,
        type: 'DELETE',
        crossDomain: true,
        dataType: 'json',
        contentType: "application/json",
        success: function(data) {
            console.log(data);
            window.location.href = 'index.html';
        },
        error: function() {
            console.log("Failed");
        }
    });
}

//function to route the submit button to edit html page
function routeToEdit(){
    checkIfLoggedIn();
    var PhotoID=$.urlParam('id');
    window.location.href = 'editphoto.html?id='+ PhotoID;
}

//fucntion to edit photo information
function editPhoto(){
    checkIfLoggedIn();
    var PhotoID=$.urlParam('id');
    //Note, no validation on input text is being done on front-end or back-end
    var title = document.getElementById('newTitle').value;
    var description = document.getElementById('newDescription').value;
    var tags = document.getElementById('newTags').value;

    var datadir = {
        title: title,
        description: description,
        tags: tags,
    };
    //alert(datadir);
    //AJAX call to server with UPDATE request to API for updating info in DB
    $.ajax({
        url: `${API_URL}/photos/${PhotoID}`,
        type: 'PATCH',
        crossDomain: true,
        dataType: 'json',
        contentType: "application/json",
        success: function(data) {                        
            console.log(data);
            //redirect back to view photo page
            window.location.href = 'viewphoto.html?id='+ PhotoID;           
        },
        error: function() {
            console.log("Failed");
        },        
        data: JSON.stringify(datadir)
    });

    
}

$(document).ready(function(){
    $("#loginform" ).submit(function(event) {
      processLogin();
      event.preventDefault();
    });

    $("#signupform" ).submit(function(event) {
      processSignup();
      event.preventDefault();
    });

    $("#addphotoform" ).submit(function(event) {
      uploadPhoto();
      event.preventDefault();
    });

    $("#searchform" ).submit(function(event) {
      searchPhotos();
      event.preventDefault();
    });

    $("#confirmemail-form" ).submit(function(event) {
      loadConfirmEmailPage();
      event.preventDefault();
    });


    var pathname = window.location.pathname; 
    console.log(pathname);

    if(pathname=='/index.html' || pathname==='/'){
        loadHomePage();
    }else if(pathname=='/addphoto.html'){
        loadAddPhotosPage();
    }else if(pathname=="/viewphoto.html"){
        loadViewPhotoPage();
    }else if(pathname=="/search.html"){
        loadSearchPage();
    }else if(pathname=="/confirmemail.html"){
        var username =  sessionStorage.getItem('username');
        $("#username").val(username);        
    }
    else if(pathname=="/editphoto.html"){
        loadEditor();
    }


    $("#logoutlink" ).click(function(event) {
      clearSession();
      event.preventDefault();
    });

});

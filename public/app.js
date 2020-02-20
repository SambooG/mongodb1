// Grab the articles as a json
console.log("APP.JS IS LOADED");


$.getJSON("/articles", function (data) {
    // For each one
    console.log("DATA: ", data);
    for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");

        // Template string way
        $("#articles").append(`
        <div class = "article" data-id='${data[i]._id}'>
          <p>
            ${data[i].title}
            <br /> 
            ${data[i].description}
            <br />
            <a href="${data[i].link}">${data[i].link}</a>
          </p>
        </div>
      `);
    }
});

  
  // Whenever someone clicks a p tag
  $(document).on("click", ".article", function() {
    // Empty the notes from the note section
    $("#Comment").empty();
    // Save the id from the p tag
    const thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    // $.ajax({
    //   method: "GET",
    //   url: "/articles/" + thisId
    // })
      // With that done, add the note information to the page
      // .then(
        // function(data) {
        // console.log(data);
        // The title of the article
        // $("#articles").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $(this).append("<input id='titleinput'name='title' >");
        // A textarea to add a new note body
        $(this).append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $(this).append("<button data-id=" + thisId + "id='savecomment'>Save Comment</button>");
  
        // If there's a note in the article
        // if (data.comment) {
        //   // Place the title of the note in the title input
        //   $("#titleinput").val(data.comment.title);
        //   // Place the body of the note in the body textarea
        //   $("#bodyinput").val(data.comment.body);
        // }
        // console.log("comment", data.comment);
      });
    // });
  
  // When you click the savenote button
  $(document).on("click", "#savecomment", function() {
    // Grab the id associated with the article from the submit button
    const thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#Comment").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  
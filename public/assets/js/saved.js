$(document).ready(function () {
    // Getting a reference to the article container div we will be rendering all articles inside of
    var articleContainer = $(".article-container");
  
    // Adding event listeners for dynamically generated buttons for deleting articles,
    // pulling up article notes, saving article notes, and deleting article notes
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);
  
    // initPage kicks everything off when the page is loaded
    initPage();
  
    function initPage() {
      // Empty the article container, run an AJAX request for any saved headlines
      articleContainer.empty();
      $.get("/api/headlines?saved=true").then(function (data) {
        // If we have headlines, render them to the page
        if (data && data.length) {
          renderArticles(data);
        } else {
          // Otherwise, render a message explaining we have no articles
          renderEmpty();
        }
      });
    }
  
    function renderArticles(articles) {
      // This function handles appending HTML containing our article data to the page
      // We are passed an array of JSON containing all available articles in our database
      var articleCards = [];
      // We pass each article JSON object to the createCard function which returns a bootstrap
      // card with our article data inside
      for (var i = 0; i < articles.length; i++) {
        articleCards.push(createCard(articles[i]));
      }
      // Once we have all of the HTML for the articles stored in our articleCards array, 
      // append them to the articleContainer
      articleContainer.append(articleCards);
    }
  
  
    function createCard(article) {
      var card = $(
        [
          "<div class='card  shadow mb-4'>",
          "<div class='card-header p-2 pt-3 pl-3 bg-light'>",
          "<h4>",
          article.headline,
          "</h4>",
          "</div>",
          "<div class='card-body bg-white text-dark'>",
          "<h5>",
          article.summary,
          "</h5>",
          `<a class='linkTag' href='${article.link}'>`,
          article.link,
          "</a>",
          "</div>",
          "<div class='card-text bg-white pb-3 pl-3'>",
          "<a class='btn btn-light border mr-3 delete'>",
          "Delete Article</a>",
          "<a class='btn btn-light border notes'>Article Notes</a>",
          "</div>",
          "</div>"
        ].join(""));
  
      card.data("_id", article._id);
      return card;
    }
  
    function renderEmpty() {
      // This function renders some HTML to the page explaining we don't have any articles to view
      // Using a joined array of HTML string dta because it's easier to read/change than a concatenated string
      var emptyAlert = $(
        [
          "<div class='alert alert-warning text-center'>",
          "<h4>No saved Articles Currently Available.</h4>",
          "</div>",
          "<div class='card'>",
          "<div class='card-header text-center text-danger'>",
          "<h3> Do you want to Browse Available Articles?</h3>",
          "</div>",
          "<div class='card-body text-center'>",
          "<h4><a href='/'>Browse Articles</a></h4>",
          "</div>",
          "</div>"
  
        ].join(""));
      // appending this data to the page
      articleContainer.append(emptyAlert);
    }
  
    function handleArticleDelete() {
      // This function handles deleting articles/headlines
      // We grab the id of the article to delete from the card element the delete button sits inside
      var articleToDelete = $(this).parents(".card").data();
      // Using a delete method here just to be semantic since we are deleting an article/headlkne
      $.ajax({
        method: "DELETE",
        url: "/api/headlines/" + articleToDelete._id
      }).then(function(data) {
        if (data.ok) {
          initPage();
        }
      });
    }
  
    function renderNotesList(data) {
      // This function handles rendering note list items to our notes modal
      // Setting up an array of notes to render after finished
      // Also setting up a currentNote variable to temporarily store each note
      var notesToRender = [];
      var currentNote;
      if (!data.notes.length) {
        // If no notes, just display a message explaing
        currentNote = ["<li class='list-group-item'>", "No notes added for this article.", "</li>"].join("");
        notesToRender.push(currentNote);
      } else {
        // If have notes, go through each one
        for (var i = 0; i < data.notes.length; i++) {
          // Constructs an li element to contain noteText and a delete button
          currentNote = $(
            [
              "<li class='list-group-item note'>",
              "<button class='btn btn-light border note-delete mr-3'>x</button>",
              data.notes[i].noteText,
              "</li>"
            ].join(""));
          // Store note id on the delete button for easy access when trying to delete
          currentNote.children("button").data("_id", data.notes[i]._id);
          // Adding our currentNote to the notesToRender array
          notesToRender.push(currentNote);
        }
      }
      // append notesToRender to the note-container inside the note modal
      $(".note-container").append(notesToRender);
    }
  
  
    function handleArticleNotes() {
      // function handles opending the notes modal and displaying notes
      // grab the id of the article to get notes for from the card element the delete button sits inside
      var currentArticle = $(this).parents(".card").data();
      // Grab any notes with this headline/article id
      $.get("/api/notes/" + currentArticle._id).then(function (data) {
        // Constructing initial HTML to add to the notes modal
        
        var modalText = [
          "<div class='card border-0 pt-3 pl-3'>",
          "<h5>Article #: ",
          currentArticle._id,
          "</h5>",
          "<hr />",
          "<ul class='list-group mb-3 note-container'>",
          "</ul>",
          "<textarea placeholder='Add New Note' rows='10' cols='60''></textarea>",
          "<button class='btn btn-light border ml-auto mt-2 save'>Save Note</button>",
          "</div>"
        ].join("");
  
        // Adding the formatted HTML to the note modal
        bootbox.dialog({
          message: modalText,
          closeButton: true,
          centerVertical: true,
          size: 'large',
          className: 'rubberBand animated'                             
        });
        var noteData = {
          _id: currentArticle._id,
          notes: data || []
        };
        // Adding some information about the article and article notes to the save button for easy access
        // when trying to add a new note
        $(".btn.save").data("article", noteData);
        renderNotesList(noteData);
  
      });
    }
  
    function handleNoteSave() {
      // This function handles what happens when a user tries to savea new note for an article
      // Setting a variable to hold some formatted data about our note,
      // grabbing the note typed into the input box
      var noteData;
      var newNote = $(".bootbox-body textarea").val().trim();
      
      // If we actually have data typed into the note input field, format it
      // and post it to the "/api/notes" route and send the formatted noteData as well
      if (newNote) {
        noteData = {
          _id: $(this).data("article")._id,
          noteText: newNote
        };
        $.post("/api/notes", noteData).then(function () {
          // When complete, close the modal
          bootbox.hideAll();
        });
      }
    }
  
    function handleNoteDelete() {
      // This function handles the deletion of notes
      // First we grab the id of the note we want to delete
      // We stored this data on the delete button when we created it
      var noteToDelete = $(this).data("_id");
      // Perform an DELETE request to "/api/notes/" whith the id of the note we're deleting as a parameter
      $.ajax({
        url: "/api/notes/" + noteToDelete,
        method: "DELETE"
  
      }).then(function () {
        // When done, hide the modal
        bootbox.hideAll();
      });
    }
  
  });
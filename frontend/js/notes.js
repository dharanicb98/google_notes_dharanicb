$(document).ready(function() {
  const token = localStorage.getItem('token');
  if (!token) {
      window.location.href = 'login.html';
  }

  // Function to fetch notes and populate the UI
  function fetchNotes() {
      try {
          $.ajax({
              url: 'http://localhost:3000/api/notes',
              method: 'GET',
              headers: { 'Authorization': token },
              success: function(response) {
                  const notesList = $('#notes-list');
                  notesList.empty();
                  response.notes.forEach(note => {
                      const noteElement = `
                          <div class="border p-4 mb-4" style="background-color: ${note.backgroundColor}">
                              <h3 class="text-xl">${note.title}</h3>
                              <p>${note.content}</p>
                              <p>Created At: ${formatDate(note.createdAt)}</p>
                              <p>Last Updated: ${formatDate(note.updatedAt)}</p>
                              <div>
                                  <button class="edit-note bg-blue-500 text-white px-4 py-2 rounded mr-2" data-id="${note._id}">Edit</button>
                                  <button class="delete-note bg-red-500 text-white px-4 py-2 rounded" data-id="${note._id}">Delete</button>
                              </div>
                          </div>
                      `;
                      notesList.append(noteElement);
                  });
              },
              error: function(xhr) {
                  const errorMessage = xhr.responseJSON.message || 'Failed to fetch notes';
                  alert(errorMessage);
              }
          });
      } catch (error) {
          console.error('Error fetching notes:', error);
          alert('An error occurred while fetching notes');
      }
  }

  // Function to format date
  function formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
  }

  // Fetch notes on page load
  fetchNotes();

  // Save or update note
  $('#save-note').on('click', function() {
      const noteId = $('#note-id').val();
      const title = $('#note-title').val();
      const content = $('#note-content').val();

      const method = noteId ? 'PUT' : 'POST';
      const url = noteId ? `http://localhost:3000/api/notes/${noteId}` : 'http://localhost:3000/api/notes';

      try {
          $.ajax({
              url: url,
              method: method,
              headers: { 'Authorization': token },
              contentType: 'application/json',
              data: JSON.stringify({ title, content }),
              success: function() {
                  fetchNotes();
                  $('#note-id').val('');
                  $('#note-title').val('');
                  $('#note-content').val('');
                  $('#save-note').text('Save Note');
                  $('#delete-note').addClass('hidden');
              },
              error: function(xhr) {
                  const errorMessage = xhr.responseJSON.message || 'Failed to save note';
                  alert(errorMessage);
              }
          });
      } catch (error) {
          console.error('Error saving note:', error);
          alert('An error occurred while saving note');
      }
  });

  // Edit note
  $(document).on('click', '.edit-note', function() {
      const noteId = $(this).data('id');
      $('#note-id').val(noteId);
      $('#save-note').text('Update Note');
      $('#delete-note').removeClass('hidden').data('id', noteId);
      
      // Fetch the note details and populate the input fields
      $.ajax({
          url: `http://localhost:3000/api/notes/${noteId}`,
          method: 'GET',
          headers: { 'Authorization': token },
          success: function(response) {
              const note = response.note;
              $('#note-title').val(note.title); // Populate title input
              $('#note-content').val(note.content); // Populate content textarea
          },
          error: function(xhr) {
              const errorMessage = xhr.responseJSON.message || 'Failed to fetch note';
              alert(errorMessage);
          }
      });
  });

  // Delete note
  $(document).on('click', '.delete-note', function() {
      const noteId = $(this).data('id');
      if (confirm('Are you sure you want to delete this note?')) {
          $.ajax({
              url: `http://localhost:3000/api/notes/${noteId}`,
              method: 'DELETE',
              headers: { 'Authorization': token },
              success: function() {
                  fetchNotes();
                  $('#note-id').val('');
                  $('#note-title').val('');
                  $('#note-content').val('');
                  $('#save-note').text('Save Note');
                  $('#delete-note').addClass('hidden');
              },
              error: function(xhr) {
                  const errorMessage = xhr.responseJSON.message || 'Failed to delete note';
                  alert(errorMessage);
              }
          });
      }
  });

  // Logout
  $('#logout').on('click', function() {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
  });

  // tooggle-theme

  $('#toggle-theme').on('click', function() {
    $('body').toggleClass('dark');
    $('#note-form').toggleClass('dark');
    $('#notes-list .note').toggleClass('dark');
    if ($('body').hasClass('dark')) {
      $('#toggle-theme').text('Light Mode');
    } else {
      $('#toggle-theme').text('Dark Mode');
    }
  });

// search-notes

$('#search-bar').on('keyup', function() {
  const searchTerm = $(this).val().toLowerCase();
  $('#notes-list .note').filter(function() {
    $(this).toggle($(this).find('.note-title').text().toLowerCase().indexOf(searchTerm) > -1);
  });
});

});

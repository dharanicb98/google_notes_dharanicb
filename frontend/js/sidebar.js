// $(document).ready(function() {
//     $('#show-notes').on('click', function() {
//         fetchNotes();
//     });

//     $('#show-archived-notes').on('click', function() {
//         fetchArchivedNotes();
//     });

//     $('#show-trashed-notes').on('click', function() {
//         fetchTrashedNotes();
//     });

//     $('#edit-labels').on('click', function() {
//         // Handle editing labels logic here
//         alert('Edit labels functionality is not implemented yet.');
//     });

//     $('#view-archived').on('click', function() {
//         fetchArchivedNotes(); // Implement this function to fetch archived notes
//         $('#unarchive-note').show(); // Show unarchive button
//     });

//     // Click event for other sidebar buttons (Notes, Trash, Reminders, Edit Labels)
//     $('#view-notes, #view-trash, #view-reminders, #view-labels').on('click', function() {
//         // Implement appropriate fetch functions for each section
//         $('#unarchive-note').hide(); // Hide unarchive button
//     });

//     $('#unarchive-note').on('click', function() {
//         const noteId = getSelectedNoteId(); // Implement this function to get the selected note ID
//         if (noteId) {
//             unarchiveNoteById(noteId);
//         }
//     });

//     function unarchiveNoteById(id) {
//         const token = localStorage.getItem('token');
//         $.ajax({
//             url: `http://localhost:3000/api/notes/unarchive/${id}`,
//             method: 'PUT',
//             headers: { 'Authorization': token },
//             success: function(response) {
//                 fetchArchivedNotes(); // Update with your function to fetch archived notes
//             },
//             error: function(xhr) {
//                 const errorMessage = xhr.responseJSON.message || 'Failed to unarchive note';
//                 alert(errorMessage);
//             }
//         });
//     }

//     function fetchNotes() {
//         const token = localStorage.getItem('token');
//         $.ajax({
//             url: 'http://localhost:3000/api/notes',
//             method: 'GET',
//             headers: { 'Authorization': token },
//             success: function(response) {
//                 displayNotes(response.notes);
//             }
//         });
//     }

//     function fetchArchivedNotes() {
//         const token = localStorage.getItem('token');
//         $.ajax({
//             url: 'http://localhost:3000/api/notes/archived',
//             method: 'GET',
//             headers: { 'Authorization': token },
//             success: function(response) {
//                 displayNotes(response.notes);
//             }
//         });
//     }

//     function fetchTrashedNotes() {
//         const token = localStorage.getItem('token');
//         $.ajax({
//             url: 'http://localhost:3000/api/notes/trashed',
//             method: 'GET',
//             headers: { 'Authorization': token },
//             success: function(response) {
//                 displayTrashedNotes(response.notes);
//             }
//         });
//     }

//     function displayNotes(notes) {
//         const notesContainer = $('#notes-container');
//         notesContainer.empty();
//         notes.forEach(note => {
//             const noteElement = $(`
//                 <div class="note" style="background-color: ${note.backgroundColor}">
//                     <h2>${note.title}</h2>
//                     <p>${note.content}</p>
//                     <div class="note-actions">
//                         <button class="edit-note" data-id="${note._id}">Edit</button>
//                         <button class="delete-note" data-id="${note._id}">Delete</button>
//                         <button class="archive-note" data-id="${note._id}">Archive</button>
//                     </div>
//                 </div>
//             `);
//             notesContainer.append(noteElement);
//         });
//     }

//     function displayTrashedNotes(notes) {
//         const notesContainer = $('#notes-container');
//         notesContainer.empty();
//         notes.forEach(note => {
//             const noteElement = $(`
//                 <div class="note" style="background-color: ${note.backgroundColor}">
//                     <h2>${note.title}</h2>
//                     <p>${note.content}</p>
//                     <div class="note-actions">
//                         <button class="restore-note" data-id="${note._id}">Restore</button>
//                         <button class="permanently-delete-note" data-id="${note._id}">Delete Permanently</button>
//                     </div>
//                 </div>
//             `);
//             notesContainer.append(noteElement);
//         });
//     }

//     $(document).on('click', '.restore-note', function() {
//         const id = $(this).data('id');
//         const token = localStorage.getItem('token');
//         $.ajax({
//             url: `http://localhost:3000/api/notes/restore/${id}`,
//             method: 'PUT',
//             headers: { 'Authorization': token },
//             success: function() {
//                 fetchTrashedNotes();
//             }
//         });
//     });

//     $(document).on('click', '.permanently-delete-note', function() {
//         const id = $(this).data('id');
//         const token = localStorage.getItem('token');
//         $.ajax({
//             url: `http://localhost:3000/api/notes/permanently/${id}`,
//             method: 'DELETE',
//             headers: { 'Authorization': token },
//             success: function() {
//                 fetchTrashedNotes();
//             }
//         });
//     });
// });



// $(document).ready(function() {
//     $('#show-notes').on('click', function() {
//         $('#note-form').show();
//         $.ajax({
//             url: 'http://localhost:3000/api/notes',
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`
//             },
//             success: function(data) {
//                 renderNotes(data.notes);
//             },
//             error: function(err) {
//                 console.error('Error fetching notes:', err);
//             }
//         });
//     });

//     $('#show-archived-notes').on('click', function() {
//         $('#note-form').hide();
//         $.ajax({
//             url: 'http://localhost:3000/api/notes/archived',
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`
//             },
//             success: function(data) {
//                 renderNotes(data.notes);
//             },
//             error: function(err) {
//                 console.error('Error fetching archived notes:', err);
//             }
//         });
//     });

//     $('#show-trashed-notes').on('click', function() {
//         $('#note-form').hide();
//         $.ajax({
//             url: 'http://localhost:3000/api/notes/trashed',
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`
//             },
//             success: function(data) {
//                 renderNotes(data.notes);
//             },
//             error: function(err) {
//                 console.error('Error fetching trashed notes:', err);
//             }
//         });
//     });

//     function renderNotes(notes) {
//         const notesList = $('#notes-list');
//         notesList.empty();

//         if (!notes.length) {
//             notesList.append('<p>No notes available</p>');
//             return;
//         }

//         notes.forEach(note => {
//             const noteElement = $('<div>').addClass('bg-white dark:bg-gray-900 p-4 rounded shadow note').css('background-color', note.backgroundColor);
//             noteElement.append($('<h3>').text(note.title).addClass('font-bold text-lg mb-2'));
//             noteElement.append($('<p>').text(note.content).addClass('mb-2'));

//             const actions = $('<div>').addClass('flex justify-end space-x-2');
//             actions.append($('<button>').text('Edit').addClass('bg-yellow-500 text-white px-2 py-1 rounded').on('click', function() {
//                 editNote(note);
//             }));
//             actions.append($('<button>').text('Archive').addClass('bg-blue-500 text-white px-2 py-1 rounded').on('click', function() {
//                 archiveNote(note._id);
//             }));
//             actions.append($('<button>').text('Delete').addClass('bg-red-500 text-white px-2 py-1 rounded').on('click', function() {
//                 deleteNotePermanently(note._id);
//             }));

//             noteElement.append(actions);
//             notesList.append(noteElement);
//         });
//     }

//     function editNote(note) {
//         $('#note-id').val(note._id);
//         $('#note-title').val(note.title);
//         $('#note-content').val(note.content);
//         $('#note-form').show();
//     }

//     function archiveNote(id) {
//         $.ajax({
//             url: `http://localhost:3000/api/notes/${id}/archive`,
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`
//             },
//             success: function() {
//                 fetchNotes('notes');
//             },
//             error: function(err) {
//                 console.error('Error archiving note:', err);
//             }
//         });
//     }

//     function deleteNotePermanently(id) {
//         $.ajax({
//             url: `http://localhost:3000/api/notes/${id}`,
//             method: 'DELETE',
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`
//             },
//             success: function() {
//                 fetchNotes('notes');
//             },
//             error: function(err) {
//                 console.error('Error deleting note permanently:', err);
//             }
//         });
//     }

//     function fetchNotes(type) {
//         let url = 'http://localhost:3000/api/notes';
//         if (type === 'archived') url += '/archived';
//         if (type === 'trashed') url += '/trashed';

//         $.ajax({
//             url,
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`
//             },
//             success: function(data) {
//                 renderNotes(data.notes);
//             },
//             error: function(err) {
//                 console.error(`Error fetching ${type} notes:`, err);
//             }
//         });
//     }
// });

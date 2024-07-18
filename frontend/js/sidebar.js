$(document).ready(function() {
    $('#show-notes').on('click', function() {
        fetchNotes();
    });

    $('#show-archived-notes').on('click', function() {
        fetchArchivedNotes();
    });

    $('#show-trashed-notes').on('click', function() {
        fetchTrashedNotes();
    });

    $('#edit-labels').on('click', function() {
        // Handle editing labels logic here
        alert('Edit labels functionality is not implemented yet.');
    });

    function fetchNotes() {
        const token = localStorage.getItem('token');
        $.ajax({
            url: 'http://localhost:3000/api/notes',
            method: 'GET',
            headers: { 'Authorization': token },
            success: function(response) {
                displayNotes(response.notes);
            }
        });
    }

    function fetchArchivedNotes() {
        const token = localStorage.getItem('token');
        $.ajax({
            url: 'http://localhost:3000/api/notes/archived',
            method: 'GET',
            headers: { 'Authorization': token },
            success: function(response) {
                displayNotes(response.notes);
            }
        });
    }

    function fetchTrashedNotes() {
        const token = localStorage.getItem('token');
        $.ajax({
            url: 'http://localhost:3000/api/notes/trashed',
            method: 'GET',
            headers: { 'Authorization': token },
            success: function(response) {
                displayTrashedNotes(response.notes);
            }
        });
    }

    function displayNotes(notes) {
        const notesContainer = $('#notes-container');
        notesContainer.empty();
        notes.forEach(note => {
            const noteElement = $(`
                <div class="note" style="background-color: ${note.backgroundColor}">
                    <h2>${note.title}</h2>
                    <p>${note.content}</p>
                    <div class="note-actions">
                        <button class="edit-note" data-id="${note._id}">Edit</button>
                        <button class="delete-note" data-id="${note._id}">Delete</button>
                        <button class="archive-note" data-id="${note._id}">Archive</button>
                    </div>
                </div>
            `);
            notesContainer.append(noteElement);
        });
    }

    function displayTrashedNotes(notes) {
        const notesContainer = $('#notes-container');
        notesContainer.empty();
        notes.forEach(note => {
            const noteElement = $(`
                <div class="note" style="background-color: ${note.backgroundColor}">
                    <h2>${note.title}</h2>
                    <p>${note.content}</p>
                    <div class="note-actions">
                        <button class="restore-note" data-id="${note._id}">Restore</button>
                        <button class="permanently-delete-note" data-id="${note._id}">Delete Permanently</button>
                    </div>
                </div>
            `);
            notesContainer.append(noteElement);
        });
    }

    $(document).on('click', '.restore-note', function() {
        const id = $(this).data('id');
        const token = localStorage.getItem('token');
        $.ajax({
            url: `http://localhost:3000/api/notes/restore/${id}`,
            method: 'PUT',
            headers: { 'Authorization': token },
            success: function() {
                fetchTrashedNotes();
            }
        });
    });

    $(document).on('click', '.permanently-delete-note', function() {
        const id = $(this).data('id');
        const token = localStorage.getItem('token');
        $.ajax({
            url: `http://localhost:3000/api/notes/permanently/${id}`,
            method: 'DELETE',
            headers: { 'Authorization': token },
            success: function() {
                fetchTrashedNotes();
            }
        });
    });
});

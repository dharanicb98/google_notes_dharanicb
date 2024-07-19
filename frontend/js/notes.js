$(document).ready(function () {
    const apiUrl = 'http://localhost:3000/api/notes';
    const token = localStorage.getItem('token'); // Retrieve token

    function handleApiError(xhr) {
        if (xhr.status === 401) {
            console.error('Unauthorized access - 401');
            window.location.href = 'login.html';
        } else {
            console.error('API Error:', xhr);
        }
    }

    function loadNotes() {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function (data) {
                console.log('Fetched Notes:', data);
                displayNotes(data.notes, 'notes'); // Pass page type
            },
            error: handleApiError
        });
    }

    function displayNotes(notes, type) {
        const notesList = $('#notes-list');
        notesList.empty();
        
        if (!notes.length) {
            notesList.append('<p>No notes available</p>');
            return;
        }
    
        notes.forEach(note => {
            let buttons = '';
            if (type === 'notes') {
                buttons = `
                    <button class="edit-note bg-blue-500 text-white px-4 py-2 rounded" data-id="${note._id}">Edit</button>
                    <button class="delete-note bg-red-500 text-white px-4 py-2 rounded" data-id="${note._id}">Delete</button>
                    <button class="archive-note bg-yellow-500 text-white px-4 py-2 rounded ${note.archived ? 'hidden' : ''}" data-id="${note._id}">Archive</button>
                `;
            } else if (type === 'archived') {
                buttons = `
                    <button class="unarchive-note bg-green-500 text-white px-4 py-2 rounded" data-id="${note._id}">Unarchive</button>
                `;
            } else if (type === 'trashed') {
                buttons = `
                    <button class="untrash-note bg-gray-500 text-white px-4 py-2 rounded" data-id="${note._id}">Untrash</button>
                `;
            }
    
            const tags = note.tags.length ? note.tags.map(tag => `<span class="bg-gray-200 text-gray-800 px-2 py-1 rounded mr-1">${tag}</span>`).join('') : '';
    
            const noteElement = $(`
                <div class="bg-white dark:bg-gray-900 p-4 rounded shadow" style="background-color: ${note.backgroundColor || '#ffffff'}">
                    <h2 class="text-xl font-bold">${note.title}</h2>
                    <p>${note.content}</p>
                    <div class="flex flex-wrap mb-2">
                        ${tags}
                    </div>
                    <div class="flex justify-between mt-2">
                        ${buttons}
                    </div>
                </div>
            `);
            notesList.append(noteElement);
        });
    }
    

    function showNotes() {
        $('#note-edit-form').hide();
        $('#note-form').show();
        loadNotes();
    }

    function showArchivedNotes() {
        $('#note-form').hide();
        $('#note-edit-form').hide();
        $.ajax({
            url: `${apiUrl}/archived`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function (data) {
                displayNotes(data.notes, 'archived'); // Pass page type
            },
            error: handleApiError
        });
    }

    function showTrashedNotes() {
        $('#note-form').hide();
        $('#note-edit-form').hide();
        $.ajax({
            url: `${apiUrl}/trashed`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function (data) {
                displayNotes(data.notes, 'trashed'); // Pass page type
            },
            error: handleApiError
        });
    }

    $('#show-notes').click(showNotes);
    $('#show-archived-notes').click(showArchivedNotes);
    $('#show-trashed-notes').click(showTrashedNotes);

    $('#logout').click(function () {
        console.log('Logging out'); // Debug logout
        $.ajax({
            url: 'http://localhost:3000/api/logout', // Adjust the logout endpoint as needed
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function () {
                console.log('Logout successful'); // Debug logout success
                // Clear the token from localStorage
                localStorage.removeItem('token');
                // Redirect to login page
                window.location.href = 'login.html';
            },
            error: handleApiError
        });
    });

    $('#save-note').click(function () {
        const id = $('#note-id').val();
        const title = $('#note-title').val();
        const content = $('#note-content').val();
        const tags = $('#note-tags').val().split(',').map(tag => tag.trim());
        const backgroundColor = $('#note-backgroundColor').val();
    
        if (!title || !content) {
            alert('Title and content are required');
            return;
        }
    
        $.ajax({
            url: id ? `${apiUrl}/${id}` : apiUrl,
            method: id ? 'PUT' : 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ title, content, tags, backgroundColor }),
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function () {
                showNotes(); // Refresh the notes list
                $('#note-title').val('');
                $('#note-content').val('');
                $('#note-tags').val('');
                $('#note-backgroundColor').val('#ffffff');
                $('#note-id').val('');
            },
            error: handleApiError
        });
    });

    $(document).on('click', '.delete-note', function () {
        const id = $(this).data('id');
        console.log('Deleting note:', id); // Debug note delete
        $.ajax({
            url: `${apiUrl}/${id}`,
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function () {
                console.log('Note deleted successfully'); // Debug note delete success
                showNotes();
            },
            error: handleApiError
        });
    });

    $(document).on('click', '.edit-note', function () {
        const id = $(this).data('id');
        $.ajax({
            url: `${apiUrl}/${id}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function (response) {
                const note = response.note;
                $('#edit-note-id').val(note._id);
                $('#edit-note-title').val(note.title);
                $('#edit-note-content').val(note.content);
                $('#edit-note-tags').val(note.tags.join(', '));
                $('#edit-note-backgroundColor').val(note.backgroundColor);
                
                // Show the edit form
                $('#note-form').hide();
                $('#note-edit-form').show();
            },
            error: handleApiError
        });
    });

    $(document).on('click', '.archive-note', function () {
        const id = $(this).data('id');
        console.log('Archiving note:', id); // Debug note archive
        $.ajax({
            url: `${apiUrl}/archive/${id}`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function () {
                console.log('Note archived successfully'); // Debug note archive success
                showNotes();
            },
            error: handleApiError
        });
    });

    $(document).on('click', '.unarchive-note', function () {
        const id = $(this).data('id');
        console.log('Unarchiving note:', id); // Debug note unarchive
        $.ajax({
            url: `${apiUrl}/unarchive/${id}`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function () {
                console.log('Note unarchived successfully'); // Debug note unarchive success
                showArchivedNotes();
            },
            error: handleApiError
        });
    });

    $(document).on('click', '.untrash-note', function () {
        const id = $(this).data('id');
        console.log('Untrashing note:', id); // Debug note untrash
        $.ajax({
            url: `${apiUrl}/restore/${id}`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function () {
                console.log('Note untrashed successfully'); // Debug note untrash success
                showTrashedNotes();
            },
            error: handleApiError
        });
    });

    $('#update-note').click(function () {
        const id = $('#edit-note-id').val();
        const title = $('#edit-note-title').val();
        const content = $('#edit-note-content').val();
        const tags = $('#edit-note-tags').val().split(',').map(tag => tag.trim());
        const backgroundColor = $('#edit-note-backgroundColor').val();
    
        $.ajax({
            url: `${apiUrl}/${id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ title, content, tags, backgroundColor }),
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function () {
                console.log('Note updated successfully'); // Debug note update success
                showNotes(); // Refresh the notes list
                $('#note-title').val('');
                $('#note-content').val('');
                $('#note-tags').val('');
                $('#note-backgroundColor').val('#ffffff');
                $('#note-id').val('');
                $('#note-edit-form').hide();
                $('#note-form').show();
            },
            error: handleApiError
        });
    });

    $('#search-bar').on('input', function () {
        const query = $(this).val().toLowerCase();
        filterNotes(query);
    });

    function filterNotes(query) {
        const notesList = $('#notes-list');
        const notes = notesList.find('.bg-white, .bg-gray-900'); // Adjust selector based on note background

        notes.each(function () {
            const title = $(this).find('h2').text().toLowerCase();
            const content = $(this).find('p').text().toLowerCase();
            const tags = $(this).find('.bg-gray-200').text().toLowerCase();

            if (title.includes(query) || content.includes(query) || tags.includes(query)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    $('#toggle-theme').on('click', function() {
        $('body').toggleClass('dark');
        $('#note-form').toggleClass('dark');
        $('#notes-list .bg-white').toggleClass('bg-gray-900');
        $('#notes-list .bg-gray-900').toggleClass('bg-gray-800');

        const themeText = $('body').hasClass('dark') ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        $('#toggle-theme').text(themeText);
    });

    // Ensure initial theme state
    if ($('body').hasClass('dark')) {
        $('#toggle-theme').text('Switch to Light Mode');
    } else {
        $('#toggle-theme').text('Switch to Dark Mode');
    }

    // Initialize the page by showing the notes
    showNotes();
});


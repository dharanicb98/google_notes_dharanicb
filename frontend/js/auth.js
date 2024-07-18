$(document).ready(function() {
  $('#login-form').on('submit', function(e) {
      e.preventDefault();
      const username = $('#username').val();
      const password = $('#password').val();

      $.ajax({
          url: 'http://localhost:3000/api/auth/login',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ username, password }),
          success: function(response) {
              localStorage.setItem('token', response.token);
              window.location.href = 'index.html';
          },
          error: function(xhr) {
              const errorMessage = xhr.responseJSON.message || 'Login failed';
              alert(errorMessage);
          }
      });
  });

  $('#signup-form').on('submit', function(e) {
      e.preventDefault();
      const username = $('#username').val();
      const email = $('#email').val();
      const password = $('#password').val();

      $.ajax({
          url: 'http://localhost:3000/api/auth/signup',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ username, email, password }),
          success: function() {
              window.location.href = 'login.html';
          },
          error: function(xhr) {
              const errorMessage = xhr.responseJSON.message || 'Signup failed';
              alert(errorMessage);
          }
      });
  });
});

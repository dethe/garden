      var gun = GUN(['http://localhost:8080/gun', 'https://gunjs.herokuapp.com/gun']);

      var todos = gun.get('garden-xyzzy-todo')

      $('form')._.bind('submit', function (event) {
        var input = $('form input');
        todos.set({title: input.value});
        input.value = '';
        event.preventDefault();
      })

      todos.map().on(function (todo, id) {
        var li = $('#z' + id)
        if (!li) {
          li = $.create('li', {id: 'z' + id, after: $('ul')});
        }
        if (todo) {
          li.innerHTML = '<input type="checkbox" onclick="clickCheck(this)" ' + (todo.done ? 'checked' : '') + '>' +
            '<span onclick="clickTitle(this)">' + todo.title + '</span>' +
            '<img onclick="clickDelete(this)" src="https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-x.svg"/>';
        } else {
          li.remove();
        }
      })
      function clickTitle (element) {
        element = $(element)
        if (!$('input', element)) {
          element.innerHTML = '<input value="' + element.html() + '" onkeyup="keypressTitle(this)">';
        }
      }

      function keypressTitle (element) {
        if (event.keyCode === 13) {
          todos.get(element.parentElement.parentElement.id.slice(1)).put({title: element.value});
        }
      }

      function clickCheck (element) {
        todos.get(element.parentElement.id.slice(1)).put({done: element.checked});
      }

      function clickDelete (element) {
        todos.get(element.parentElement.id.slice(1)).put(null);
      }

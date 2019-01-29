      var gun = GUN(['http://localhost:8080/gun', 'https://gunjs.herokuapp.com/gun']);

    var user = gun.user();

    $('#up')._.bind('click', function(e){
      user.create($('#alias').value, $('#pass').value);
    });

    $('#sign')._.bind('submit', function(e){
      e.preventDefault();
      user.auth($('#alias').value, $('#pass').value);
    });

    let worlds;
    let world_list = $('#world_list');
    gun.on('auth', function(){
      $('#sign').setAttribute('hidden', 'hidden');
         worlds = gun.get('garden-xyzzy-worlds');
         worlds.map().on(function (world, id){
           var li = $('#' + id);
           if (!li){
             li = $.create('li', {id: id, after: world_list});
           }
           if (world){
             li.innerHTML = '<strong>' + world.name + '</strong> ' + world.summary;
           }else{
             li.remove();
           }
         });
//       user.get('said').map().once(UI);
    });

      var todos = gun.get('garden-xyzzy-todo');

//       $('form')._.bind('submit', function (event) {
//         var input = $('form input');
//         todos.set({title: input.value});
//         input.value = '';
//         event.preventDefault();
//       })

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

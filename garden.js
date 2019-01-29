let gun = GUN(['http://localhost:8080/gun', 'https://gunjs.herokuapp.com/gun']);
let user = gun.user();
user.recall({sessionStorage: true})

// extend Bliss.js to get values from forms
$.add('form', function(){
  $$('input, textarea', this).map(a => [a.name, a.value]);
});

// Sign up handling
$('#up')._.bind('click', function(e){
  e.preventDefault();
  user.create($('#alias').value, $('#pass').value);
});

// Sign in handling
$('#sign')._.bind('submit', function(e){
  e.preventDefault();
  user.auth($('#alias').value, $('#pass').value);
});


let worlds;
let world_list = $('#world_list');
gun.on('auth', function(){
  $('#sign').setAttribute('hidden', '');
  showWorlds();
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
});

function hideAll(){
  $$('.title, .list, .add_form')._.setAttribute('hidden',  '');
}

function showWorlds(){
  hideAll();
  $$('#world_title, #world_list, #world_add')._.removeAttribute('hidden');
}

$('#world_button')._.bind('click', function(event) {
  event.preventDefault();
  console.log(this.closest('form')._.form());
});




//       $('form')._.bind('submit', function (event) {
//         var input = $('form input');
//         todos.set({title: input.value});
//         input.value = '';
//         event.preventDefault();
//       })

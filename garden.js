let gun = GUN(['http://localhost:8080/gun', 'https://gunjs.herokuapp.com/gun']);
let user = gun.user();
user.recall({sessionStorage: true})

// extend Bliss.js to get values from forms
$.add('form', function(){
  let ret = {}
  $$('input, textarea', this).map(a => ret[a.name]=a.value);
  return ret;
});

// Sign up handling
$('#up')._.bind('click', function(e){
  e.preventDefault();
  user.create($('#alias').value, $('#pass').value);
});

// Sign in handling
$('#sign')._.bind('click', function(e){
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

const smallRandom = () => Math.floor(Math.random() * 0xFFFFFFFF).toString(36);
const bigRandom = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36);
const worldId = () => 'W' + smallRandom();
const roomId = () => 'R' + bigRandom();
const userId = () => 'U' + bigRandom();

function initWorld(world){
  world.id = worldId();
  world.rooms = [];
  world.characters = [];
  world.exits = [];
  world.startingRoom = null;
  worlds.set(world.id, world.name);
  // add world globally for players
}

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

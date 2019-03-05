const socket = io();
const app = feathers();
app.configure(feathers.socketio(socket));
app.configure(feathers.authentication({
  storage: window.localStorage
}));

function showLogin(evt){
  $('#login-form').removeAttribute('hidden');
  $('#signup-form').setAttribute('hidden', '');
}

function showSignup(evt){
  $('#signup-form').removeAttribute('hidden');
  $('#login-form').setAttribute('hidden', '');
}

$('#login-button')._.bind('click', showLogin);
$('#signup-button')._.bind('click', showSignup);
$('#logout-button')._.bind('click', evt => app.logout());

// Retrieve email/password object from the login/signup page
const getLoginCredentials = () => {
  const user = {
    email: document.querySelector('#login-email').value,
    password: document.querySelector('#login-password').value
  };
  return user;
};

const getSignupCredentials = () => {
  const user = {
    name: document.querySelector('#signup-name').value,
    email: document.querySelector('#signup-email').value,
    password: document.querySelector('#signup-password').value
  };
  return user;
}

// Log in either using the given email/password or the token from storage
const login = async credentials => {
  try {
    if(!credentials) {
      // Try to authenticate using the JWT from localStorage
      await app.authenticate();
    } else {
//      console.log('credentials: %o', credentials);      // If we get login information, add the strategy we want to use for login
      const payload = Object.assign({ strategy: 'local' }, credentials);

      await app.authenticate(payload);
    }
  } catch(error) {
    console.error('authentication error: %o', error);
    console.log('credentials: %o', credentials);
 }
};

// sign up and log in at the same time
const signup = async credentials => {
//  console.log('credentials: %o', credentials);      // If we get login information, add the strategy we want to use for login
  await app.service('users').create(credentials);
  await login(credentials);
};


const state = {

};

function getWorld(){
  return {
    name: $('#world-name').value,
    summary: $('#world-summary').value,
    description: $('#world-description').value,
    _id: $('#world-id').value
  }
}

function getRoom(){
  return {
    name: $('#room-name'.value),
    summary: $('#room-summary').value,
    description: $('#room-description').value,
    notes: $('#room-notes').value,
    world: state.currentWorld._id,
    _id: $('#room-id').value
  }
}

async function saveWorld(){
  try{
    const world = getWorld();
    console.log('saving the world: %o', world);
  if (world._id){
    await app.service('worlds').update(world._id, world);  
  }else{
    await app.service('worlds').create(world);
  }
  console.log('world has been saved! %o', world);
}catch(e){
  console.error('problem saving world: %o', e);
}
}

async function saveRoom(){
  try{
    const room = getRoom();
    if (room._id){
      await app.service('rooms').update(room._id, room);
    }else{
      await app.service('rooms').create(room);
    }
  }catch(e){
    console.log('problem saving room: %o', e);
  }
}


$('#login-action')._.bind('click', evt => login(getLoginCredentials()));
$('#signup-action')._.bind('click', evt => signup(getSignupCredentials()));
$('#world-action')._.bind('click', () => saveWorld());
$('#choose-world')._.bind('change', evt => chooseWorld(evt)); 

async function authenticated(response){
  $('#login-form').setAttribute('hidden', '');
  $('#signup-form').setAttribute('hidden', '');
  $('#login-button-ui').setAttribute('hidden', '');
  $('#signup-button-ui').setAttribute('hidden', '');
  $('#logout-button-ui').removeAttribute('hidden');
  $('#edit-world').removeAttribute('hidden');

//  console.log('Authenticated: %o', response);
await loadWorlds();

}

async function loadWorlds(){
  try{
    // FIXME: filter to only world I have admin privs
    let worldsResp = await app.service('worlds').find({});
    if (worldsResp){
      state.worlds = worldsResp.data;
      state.worlds.forEach(addWorld);
    }
  }catch(e){
    console.error('Error listing worlds: %o', e);
  }
}

async function loadRooms(worldId){
  try {
    // FIXME: only load rooms for current world
    let roomsResp = await app.service('rooms').find({});
    if(roomsResp){
      state.rooms = roomsResp.data.filter(r => r.world === worldId);
      state.rooms.forEach(addRoom);
    }
  }catch(e){
    console.error('Error listing rooms: %o', e)
  }
}

function loggedOut(response){
  console.log('log out: %o', response);
  $('#login-button-ui').removeAttribute('hidden');
  $('#signup-button-ui').removeAttribute('hidden');
  $('#logout-button-ui').setAttribute('hidden', '');
  // $('#edit-world').setAttribute('hidden', '');
  $('#edit-character').setAttribute('hidden', '');
  $('#edit-room').setAttribute('hidden', '');
}

function addWorld(world){
  let worldSel = $('#choose-world');
  $.create('option', {inside: worldSel, value: world._id, contents: world.name});
}

function addRoom(room){
  if (!state.currentWorld || room.world !== state.currentWorld._id){
    return;
  }
  let roomSel = $('#choose-room');
  let startRoom = $('#world-starting-room');
  $.create('option', {inside: roomSel, value: room._id, contents: room.name});
  $.create('option', {inside: startRoom, value: room._id, contents: room.name});
  if (room._id === state.selectedWorld){
    startRoom.lastChildElement.select();
  }
}

function worldForId(id){
  for (let i = 0; i < state.worlds.length; i++){
    if (id === state.worlds[i]._id){
      state.currentWorld = state.worlds[i];
      return state.currentWorld;
    }
  }
}

function roomForId(id){
  for(let i = 0; i < state.rooms.length; i++){
    if (id === state.rooms[i]._id){
      state.currentRoom = state.rooms[i];
      return state.currentRoom;
    }
  }
}

function clearWorldForm(){
  $('#edit-world-ui').removeAttribute('hidden');
  $('#edit-room').setAttribute('hidden', '');
  $('#world-name').value = '';
  $('#world-name').select();
  $('#world-summary').value = '';
  $('#world-description').value = '';
  $('#world-id').value = '';
  state.rooms = [];
}

function clearRoomForm(){
  $('#edit-room-ui').removeAttribute('hidden');
  $('#room-name').value = '';
  $('#room-name').select();
  $('#room-summary').value = '';
  $('#room-description').value = '';
  $('#room-notes').value = '';
  $('#room-id').value = '';
}

function populateWorldForm(){
  let world = state.currentWorld;
  $('#edit-world-ui').removeAttribute('hidden');
  $('#edit-room').removeAttribute('hidden');
  $('#world-name').value = world.name;
  $('#world-summary').value = world.summary;
  $('#world-description').value = world.description;
  $('#world-id').value = world._id;
}

function populateRoomForm(){
  let room = state.currentRoom;
  $('#edit-room-ui').removeAttribute('hidden');
  $('#room-name').value = room.name;
  $('#room-summary').value = room.summary;
  $('#room-description').value = room.description;
  $('#room-notes').value = room.notes;
  $('#room-id').value = room._id;
}

async function chooseWorld(evt){
  const id = evt.target.value;
  switch(id){
    case '':
      // nothing chosen, hide form
      $('#edit-world-ui').setAttribute('hidden', '');
      $('#edit-room').setAttribute('hidden', '');
      break;
    case 'new-world':
      clearWorldForm();
      break;
    default:
      // id of world.
      state.currentWorld = worldForId(id);
      populateWorldForm();
      break;
  }
}

function chooseRoom(evt){
  const id = evt.target.value;
  switch(id){
    case '':
      // nothing chosen, hide form
      $('#edit-room-ui').setAttribute('hidden', '');
      break;
    case 'new-room':
      clearRoomForm();
      break;
    default:
      state.currentRoom = roomForId(id);
      populateRoomForm();
      break;
  }
}


app.service('worlds').on('created', addWorld);
app.service('rooms').on("created", addRoom);

app.on('authenticated', authenticated);
app.on('logout', loggedOut);
app.on('reauthentication-error', login);

login();


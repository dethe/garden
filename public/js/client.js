 // Initialize FeatherJS
const socket = io();
const app = feathers();
app.configure(feathers.socketio(socket));
app.configure(feathers.authentication({
  storage: window.localStorage
}));


let state;
// App state, treat as immutable (only updated by Vue events, never directly)
function initState(){
  state = {
    loginp: false,
    signupp: true,
    loggedIn: false,
    worlds: [],
    currentWorld: null,
    rooms: [],
    currentRoom: null,
    users: [],
    currentUser: {}
  };
}
initState();


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
      const payload = Object.assign({ strategy: 'local' }, credentials);

      await app.authenticate(payload);
    }
  } catch(error) {
    console.error('authentication error: %o', error);
 }
};

// sign up and log in at the same time
const signup = async credentials => {
  await app.service('users').create(credentials);
  await login(credentials);
};


async function saveWorld(){
  try{
    const world = state.currentWorld;
    if (world._id){
      state.currentWorld = (await app.service('worlds').patch(world._id, world)).data;
    }else{
      world.admins = [state.currentUser._id];
      state.currentWorld = (await app.service('worlds').create(world)).data;
    }
  }catch(e){
    console.error('problem saving world: %o', e);
  }
}

async function saveRoom(){
  try{
    const room = state.currentRoom;
    console.log('Saving room for later: %o', room);
    if (room._id){
      await app.service('rooms').patch(room._id, room);
    }else{
      await app.service('rooms').create(room);
    }
    state.currentRoom = null;
  }catch(e){
    console.log('problem saving room: %o', e);
  }
}

async function authenticated(response){
  state.loggedIn = true;
  state.loginp = false;
  state.signupp = false;
  await loadUsers();
  await loadWorlds();
}

async function loadUsers(){
  try{
    let users = await app.service('users').find({});
    state.currentUser = users.currentUser;
    users.data.forEach(addUser);
  }catch(e){
    console.error('Error listing users: %o', e);
  }
}

async function loadWorlds(){
  try{
    let worlds = (await app.service('worlds').find({
      query: {
        admins: state.currentUser._id
      }
    })).data;
    state.worlds = worlds;
  }catch(e){
    console.error('Error listing worlds: %o', e);
  }
}

async function loadRooms(worldId){
  try {
    let rooms = (await app.service('rooms').find({
      query: {
        world: state.currentWorld._id
      }
    })).data;
    state.rooms = rooms;
  }catch(e){
    console.error('Error listing rooms: %o', e)
  }
}

function loggedOut(response){
  initState();
}

function addWorld(world){
  state.worlds.push(world);
}

function addRoom(room){
  if (!state.currentWorld || room.world !== state.currentWorld._id){
    return;
  }
  state.rooms.push(room);
}

function addUser(user){
  state.users.push(user);
}

function addExit(){
  state.currentRoom.exits.push({
    name: "",
    room: null
  });
}

function worldForId(id){
  for (let i = 0; i < state.worlds.length; i++){
    if (id === state.worlds[i]._id){
      return state.worlds[i];
    }
  }
  console.error('No world found for id: %s', id);
}

function roomForId(id){
  for(let i = 0; i < state.rooms.length; i++){
    if (id === state.rooms[i]._id){
      return state.rooms[i];
    }
  }
  console.error('No room found for id: %s', id);
}

async function chooseWorld(evt){
  const id = evt.target.value;
  if (!id){
    return;
  }
  state.currentWorld = worldForId(id);
  loadRooms();
}

function chooseRoom(evt){
  state.currentRoom = roomForId(evt.target.value);
}

function newWorld(){
  state.currentWorld = {
    name: '',
    summary: '',
    description: '',
    startingRoom: null
  };
  state.rooms = [];
}

function newRoom(){
  state.currentRoom = {
    name: '',
    summary: '',
    description: '',
    notes: '',
    exits: [{
      name: '',
      room: null
    }]
  };
}

function showSignup(){
  state.signupp = true;
  state.loginp = false;
}

function showLogin(){
  state.loginp = true;
  state.signupp = false;
}


// Data listeners

app.service('worlds').on('created', addWorld);
app.service('rooms').on("created", addRoom);
app.service('users').on("created", addUser);

app.on('authenticated', authenticated);
app.on('logout', loggedOut);
app.on('reauthentication-error', login);

const uinav = new Vue({
  el: "#nav",
  data: state,
  methods: {
    showLogin: evt => showLogin(),
    showSignup: evt => showSignup(),
    logout: evt => app.logout()
  }
});

const uimain = new Vue({
  el: "#main",
  data: state,
  methods: {
    login: evt => login(getLoginCredentials()),
    signup: evt => signup(getSignupCredentials()),
    saveWorld: evt => saveWorld(),
    saveRoom: evt => saveRoom(),
    chooseWorld: evt => chooseWorld(evt),
    saveRoom: evt => saveRoom(),
    chooseRoom: evt => chooseRoom(evt),
    newWorld: evt => newWorld(),
    newRoom: evt => newRoom(),
    addExit: evt => addExit()
  }
});

login();


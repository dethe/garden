let app;
let state;

function initFeathers(){
  // Initialize FeatherJS
  const socket = io();
  app = feathers();
  app.configure(feathers.socketio(socket));
  app.configure(feathers.authentication({
    storage: window.localStorage
  }));
}

function initWizardState(){
  state = {
    loginp: false,
    signupp: true,
    loggedIn: false,
    worlds: [],
    world: null,
    startingRoom: null,
    rooms: [],
    room: null,
    users: [],
    currentUser: {}
  };
}

function initFoolState(){
  state = {
    loginp: false,
    signupp: false,
    loggedIn: false
  };
}

function initPlayerState(){
  state = {
    loginp: false,
    signupp: false,
    loggedIn: false,
    world: null,
    worlds: [],
    room: null,
    rooms: [],
    characters: [],
    player: {}, // the character of the current user
    currentUser: {},
    messages: []
  }
}


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


async function saveWorld(world){
  try{
    if (!world){
      world = state.world;
    }
    console.log('Saving world for later: %s', JSON.stringify(world));
    if (world._id){
      state.world = await app.service('worlds').patch(world._id, world);
    }else{
      world.admins = [state.currentUser._id];
      state.world = (await app.service('worlds').create(world)).data;
    }
  }catch(e){
    console.error('problem saving world: %o', e);
  }
}

async function savePlayer(){
  const player = state.player;
  let savePlayer;
  if (player._id){
    savedPlayer = await app.service('characters').patch(player._id, player);
    console.log('patched player: %o', savedPlayer);
  }else{
    player.world = state.world._id;
    player.room = state.world.startingRoom;
    player.user = state.currentUser._id;
    savedPlayer = (await app.service('characters').create(player));
    console.log('created player: %o', savedPlayer);
  }
}

async function saveRoom(){
  try{
    const room = state.room;
    room.world = state.world._id;
    console.log('Saving room for later: %s', JSON.stringify(room));
    if (room._id){
      state.room = await app.service('rooms').patch(room._id, room);
    }else{
      state.room = await app.service('rooms').create(room);
    }
    state.room = null;
  }catch(e){
    console.log('problem saving room: %o', e);
  }
}

async function onWizardLogin(response){
  state.loggedIn = true;
  state.loginp = false;
  state.signupp = false;
  await loadUsers();
  state.worlds = await loadWorlds();
}

async function onPlayerLogin(response){
  state.loggedIn = true;
  state.loginp = false;
  state.signupp = false;
  await loadGame();
}

async function loadGame(){
  const url = new URL(location.toString());
  const worldId = url.searchParams.get('w');
  state.currentUser =  await loadCurrentUser();
  // if world, load world and room
  if (worldId){
    loadWorld(worldId);
  // FIXME: load characters
  }else{
  // else load public worlds
    state.worlds = await loadPublicWorlds();
  }
}
async function loadWorld(id) {
  if (!id) {
    return null;
  }
  // console.log('loadWorld(%s)', id);
  state.player = await loadPlayer(id, state.currentUser._id);
  // console.log('state.player: %o', state.player);
  state.world = await app.service('worlds').get(id);
  // console.log('state.world: %o', state.world);
  loadRoom();
}

async function loadRoomById(id){
  return await app.service('rooms').get(id);
}

async function loadRoomByEvt(evt){
  evt.preventDefault();
  state.room = await loadRoomById(evt.target.dataset.room);
  player.room = state.room.id;
  savePlayer();
  return state.room;
}


async function loadRoom(){
  console.log('loadRoom()');
  const url = new URL(location.toString());
  let roomId;
  if (state.player && state.player.room) {
    roomId = state.player.room;
    console.log('player room: %s', roomId);
  }
  let roomParam = url.searchParams.get('r');
  if (roomParam){
    roomId = roomParam;
    console.log('parameter room: %s', roomId);
  }
  if (!roomId) {
    roomId = state.world.startingRoom;
    if (!roomId){
      console.log('No room set for world %o', state.world);
      return null;
    }
  }
  state.room = await loadRoomById(roomId);
}

async function loadPlayer(worldId, userId){
  try{
    return (await app.service('characters').find({
      world: worldId,
      user: userId
    })).data[0] || {};
  }catch(e){
    console.error("Error loading player: %o", e);
    return null;
  }
}

async function loadCurrentUser(){
  return (await app.service('users').find({
    query: {_id: 0}
  })).currentUser;
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
    return (await app.service('worlds').find({
      query: {
        admins: state.currentUser._id
      }
    })).data;
  }catch(e){
    console.error('Error listing worlds: %o', e);
    return [];
  }
}

async function loadPublicWorlds(){
  try{
    return (await app.service('worlds').find({
      query: {
//        private: false
      }
    })).data;
  }catch(e){
    console.error('Error listing worlds: %o', e);
    return [];
  }
}

async function loadAllRooms(){
  let rooms = (await app.service('rooms').find({
  })).data;
  console.log(rooms);
}

async function loadRooms(worldId){
  try {
    let rooms = (await app.service('rooms').find({
      query: {
        world: state.world._id
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
  if (!state.world || room.world !== state.world._id){
    return;
  }
  state.rooms.push(room);
}

function addCharacter(character){
  if (state.world && character.world === state.world._id){
    state.characters.push(character);
  }
}

function addMessage(message){
  if (state.room && message.room === state.room._id){
    state.messages.push();
  }
}

function addUser(user){
  state.users.push(user);
}

function addExit(){
  state.room.exits.push({
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
  state.world = worldForId(id);
  loadRooms();
}

function chooseRoom(evt){
  state.room = roomForId(evt.target.value);
}

function newWorld(){
  state.world = {
    name: '',
    summary: '',
    description: '',
    startingRoom: null
  };
  state.rooms = [];
}

function newRoom(){
  state.room = {
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

function updatePlayerWorld(world){
  state.world = world;
}

function updatePlayerRoom(room){
  state.room = room;
}

function updatePlayerCharacter(character){
  console.log('updatePlayerCharacter(%s)', character);
  // FIXME: update a character in the array
}

function exitRoom(room) {
  // FIXME
  console.log('exitRoom(%s)', room);
}

function sendMessage(message) {
  // FIXME
  console.log('sendMessage(%s)', message);
}

function formatDate(timestamp){
  return new Date(timestamp).toLocaleString();
}

function characterName(id){
  for (let i = 0; i < state.characters.length; i++){
    if (state.characters[i]._id === id){
      return state.characters[i].name;
    }
  }
  return "No name found for " + id;
}


// Data listeners

function initWizardListeners(){
  app.service('worlds').on('created', addWorld);
  app.service('rooms').on("created", addRoom);
  app.service('users').on("created", addUser);

  app.on('authenticated', onWizardLogin);
  app.on('logout', loggedOut);
  app.on('reauthentication-error', login);
}

function initPlayerListeners(){
  app.service('worlds').on('updated', updatePlayerWorld);
  app.service('rooms').on('updated', updatePlayerRoom);
  app.service('characters').on('updated', updatePlayerCharacter);
  app.service('messages').on('created', addMessage);
  app.service('worlds').on('created', addWorld)
  app.service('rooms').on('created', addRoom);
  app.service('characters').on('created', addCharacter);

  app.on('authenticated', onPlayerLogin);
  app.on('logout', loggedOut);
  app.on('reauthentication-error', login);
}

function initLoginUI(){
  const uinav = new Vue({
    el: "#nav",
    data: state,
    methods: {
      showLogin: evt => showLogin(),
      showSignup: evt => showSignup(),
      logout: evt => app.logout()
    }
  });
}

function initWizardUI(){
  const uimain = new Vue({
    el: "#main",
    data: state,
    methods: {
      login: evt => login(getLoginCredentials()),
      signup: evt => signup(getSignupCredentials()),
      saveWorld: evt => saveWorld(),
      saveRoom: evt => saveRoom(),
      chooseWorld: evt => chooseWorld(evt),
      chooseRoom: evt => chooseRoom(evt),
      newWorld: evt => newWorld(),
      newRoom: evt => newRoom(),
      addExit: evt => addExit(),
      path: (world, room) => `/?w=${world._id}&r=${room._id}`
    }
  });
}

function initPlayerUI(){
  const uimain = new Vue({
    el: '#main',
    data: state,
    methods: {
      login: evt => login(getLoginCredentials()),
      signup: evt => signup(getSignupCredentials()),
      exitRoom: evt => exitRoom(evt.target.href),
      sendMessage: evt => sendMessage(evt.target.value),
      loadWorld: evt => state.world = loadWorld(evt.target.value),
      loadRoom: evt => loadRoom(evt),
      loadRoomByEvt: evt => loadRoomByEvt(evt),
      savePlayer: evt => savePlayer(evt),
      characterName: id => characterName(id),
      formatDate: timestamp => formatDate(timestamp),
      path: room => `/?&r=${room._id}`
    }
  });
}

function initWizard(){
  initFeathers();
  initWizardState();
  initWizardListeners();
  initLoginUI();
  initWizardUI();
  login();
}

function initFool(){
  initFeathers();
  initFoolState();
  initFoolListeners();
  initLoginUI();
  initFoolUI();
  login();
}

function initPlayer(){
  initFeathers();
  initPlayerState();
  initPlayerListeners();
  initLoginUI();
  initPlayerUI();
  login();
}

if (location.pathname.includes('wizard')){
  initWizard();
}else if (location.pathname.includes('fool')){
  initFool();
}else{
  initPlayer();
}

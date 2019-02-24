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
    passphrase: document.querySelector('#login-password').value
  };
  return user;
};

const getSignupCredentials = () => {
  const user = {
    name: document.querySelector('#signup-email').value,
    email: document.querySelector('#signup-email').value,
    passphrase: document.querySelector('#signup-password').value
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
      // If we get login information, add the strategy we want to use for login
      const payload = Object.assign({ strategy: 'local' }, credentials);

      await app.authenticate(payload);
    }
  } catch(error) {
    console.log('authentication error: %o', error);
 }
};

// sign up and log in at the same time
const signup = async credentials => {
  await app.service('users').create(credentials);
  await login(credentials);
};


const state = {

};

function getWorld(){
  return {
    name: $('#world-name').value,
    summary: $('#world-summary').value,
    description: $('#world-description').value
  }
}

function saveWorld(evt){
  const world = getWorld();
  if (world._id){
    app.service('worlds').update(world);  
  }else{
    app.service('worlds').create(world);
  }
}


$('#login-action')._.bind('click', evt => login(getLoginCredentials()));
$('#signup-action')._.bind('click', evt => signup(getSignupCredentials()));
$('#world-action')._.bind('click', saveWorld);

function authenticated(response){
  $('#login-form').setAttribute('hidden', '');
  $('#signup-form').setAttribute('hidden', '');
  $('#login-button-ui').setAttribute('hidden', '');
  $('#signup-button-ui').setAttribute('hidden', '');
  $('#logout-button-ui').removeAttribute('hidden');
  $('#edit-world').removeAttribute('hidden');

  console.log('Authenticated: %o', response);
  app.service('worlds').find({}).then(worlds => {console.log('Worlds: %o', worlds); state.worlds = worlds});
}

function loggedOut(response){
  console.log('log out: %o', response);
  $('#login-button-ui').removeAttribute('hidden');
  $('#signup-button-ui').removeAttribute('hidden');
  $('#logout-button-ui').setAttribute('hidden', '');
  $('#edit-world').setAttribute('hidden', '');
  $('#edit-character').setAttribute('hidden', '');
  $('#edit-room').setAttribute('hidden', '');
}

function addWorld(world){
  console.log('add world %o', world);
}

app.service('worlds').on('created', addWorld);

app.on('authenticated', authenticated);
app.on('authenticated',  function(response){ app.service('worlds').find().then(worlds => console.log(worlds))});
app.on('logout', loggedOut);
app.on('reauthentication-error', login);

login();


module.exports = function () {
  return context => {
      let user = Object.assign({}, context.params.user);
      delete user.password;
      context.result.currentUser = user;
      return context;
  }
 };

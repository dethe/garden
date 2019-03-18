// Use this hook to add timestamps and ownership to data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = {
// eslint-disable-next-line no-unused-vars
    created: function(options = {}) {
        return async context => {
            const { data, params } = context;
    
            // The authenticated user
            const user = params.user;
            // The actual message text

            data.createdBy = user._id;
            data.createdAt = new Date().getTime();
            // Best practice: hooks should always return the context
            return context;
        };
    },
    // eslint-disable-next-line no-unused-vars
    updated: function(option = {}){
        return async context => {
            const { data, params } = context;
        
            // The authenticated user
            const user = params.user;
            // The actual message text
    
            data.updatedBy = user._id;
            data.updatedAt = new Date().getTime();
        
        
            // Best practice: hooks should always return the context
            return context;
        };
    }
};
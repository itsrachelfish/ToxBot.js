var fs = require('fs');

// Core functions for loading and reloading modules
module.exports = (function()
{
    var core =
    {
        // Define core variables
        client: false,
        secrets: false,
        loaded: {},
        modules: [],

        init: function(client, modules, secrets)
        {
            core.secrets = secrets;
            
            // Only set the client if it hasn't been initialized yet
            if(!core.client)
                core.client = client;

            // Get core modules
            var core_modules = require("./config/core.js");

            // Loop through core modules
            for(var i = 0, l = core_modules.length; i < l; i++)
            {
                core.modules.push({type: 'core', name: core_modules[i]});
            }

            // Loop through all non-essential modules
            for(var i = 0, l = modules.length; i < l; i++)
            {
                core.modules.push({type: 'modules', name: modules[i]});
            }

            // Now loop through all modules and load them
            for(var i = 0, l = core.modules.length; i < l; i++)
            {
                core.load(core.modules[i]);
            }
        },

        load: function(module)
        {
            var path = "./"+module.type+"/"+module.name+".js";
            
            // Make sure the module exists!
            if(fs.existsSync(path))
            {
                // Create a unique ID for the module based on it's type and name
                var module_id = module.type + "/" + module.name;

                // Now require the module
                core.loaded[module_id] = require(path);

                // And check if it has a load function
                if(typeof core.loaded[module_id].load == "function")
                {
                    core.loaded[module_id].load(core.client, core);
                }
                else
                {
                    console.log("Warning: Module '"+module.name+"' cannot be loaded!");
                }
            }
            else
            {
                console.log("Warning: Module '"+module.name+"' does not exist!");
            }
        },

        unload: function(module)
        {
            var module_id = module.type + "/" + module.name;

            // Make sure this module is actually loaded
            if(typeof core.loaded[module_id] != "undefined")
            {
                // Does this module have an unload function?
                if(typeof core.loaded[module_id].unload == "function")
                {
                    core.loaded[module_id].unload(core.client, core);
                }
                else
                {
                    console.log("Warning: Module '"+module.name+"' cannot be unloaded!");
                }
                
                delete core.loaded[module];
                delete require.cache[require.resolve("./"+module.type+"/"+module.name+".js")];
            }
        },

        reload: function(module)
        {
            core.unload(module);
            core.load(module);
        }
    };

    return {
        init: core.init,
        load: core.load,
        unload: core.unload,
        reload: core.reload
    };
})();

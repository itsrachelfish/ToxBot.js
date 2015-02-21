var tox, core, toxbot;
var readline = require('readline');

// Readline interface
var interface =
{
    commands: ['connect', 'disconnect', 'file', 'module', 'core', 'config', 'name', 'status', 'message', 'quit'],
    
    load: function()
    {
        console.log("Welcome to ToxBot.js! Avalable commands are:");
        console.log(interface.commands.join(', '));

        // Initialize the command line interface
        interface.readline = readline.createInterface(process.stdin, process.stdout);
        interface.readline.prompt();

        // Start requesting input
        interface.readline.on('line', function(line)
        {
            interface.handle(line);
        });
    },

    // Process user input
    handle: function(line)
    {
        line = line.trim().split(/\s+/);
        var command = line.shift();

        // If this command exists
        if(interface.commands.indexOf(command) > -1)
        {
            interface['_'+command](line);
        }
        else
        {
            console.log("Invalid command! Available commands are:");
            console.log(interface.commands.join(', '));
            interface.readline.prompt();
        }
    },

    _connect: function(options)
    {
        toxbot.connect();
        interface.readline.prompt();
    },

    _disconnect: function(options)
    {
        toxbot.disconnect();
        interface.readline.prompt();
    },

    // Handler for file commands
    _file: function(options)
    {
        var action = options.shift().toLowerCase().trim();

        if(action == 'load')
        {
            interface._fileLoad(options);
        }
        else if(action == 'save')
        {
            interface._fileSave(options);
        }
        else
        {
            console.log("Error! You must say file load [filename] or file save [filename].");
            interface.readline.prompt();
        }
    },

    // Load tox identity from a file
    _fileLoad: function(options)
    {
        var filename = options.join(' ');

        // Make sure tox isn't currently connected
        if(tox.isStarted())
        {
            console.log("Warning: Tox is already started, all unsaved data will be lost.");
            toxbot.disconnect();
        }

        toxbot.identity = filename;

        tox.loadFromFile(filename);
        interface.readline.prompt();
    },

    // Save tox identity to a file
    _fileSave: function(options)
    {
        var filename = options.join(' ');

        // Save existing identity file if no filename was passed
        if(!filename && !toxbot.identity)
        {
            console.log("Warning: You must specify a filename.");
        }
        else if(toxbot.identity)
        {
            filename = toxbot.identity;
        }

        toxbot.identity = filename;
        
        tox.saveToFile(filename);
        interface.readline.prompt();
    },

    // Handler for loading modules
    _module: function(options)
    {
        var commands = ['load', 'reload', 'unload'];
        var command = options.shift().toLowerCase().trim();

        if(commands.indexOf(command) > -1)
        {
            core[command]({type: 'modules', name: options[0]});
        }
    },

    // Handler for loading core modules
    _core: function(options)
    {
        var commands = ['load', 'reload', 'unload'];
        var command = options.shift().toLowerCase().trim();

        if(commands.indexOf(command) > -1)
        {
            core[command]({type: 'core', name: options[0]});
        }
    },

    // Handler for changing configuration
    _config: function(options)
    {
        var variables = ['autosave', 'autofriend', 'autogroup'];
        var variable = options.shift();
        var action = (options.shift() || '').toLowerCase();

        // Ignore invalid config options
        if(variables.indexOf(variable) < 0)
        {
            console.log("Invalid configuration option! Available options are:");
            console.log(variables.join(', '));
        }
        else
        {
            if(action == 'on' || action == 'true' || action === 1)
            {
                toxbot[variable] = true;
            }
            else if(action == 'off' || action == 'false' || action === 0)
            {
                toxbot[variable] = false;
            }

            console.log("Option " + variable + " set to:", toxbot.autosave);

            if(!toxbot.identity && variable == 'autosave')
            {
                console.log("Warning: No tox identity file has been loaded, autosaving won't work until one is loaded.");
            }
        }
        
        interface.readline.prompt();
    },

    _name: function(options)
    {
        var name = options.join(' ');
        tox.setNameSync(name);
        interface.readline.prompt();
    },

    _status: function(options)
    {
        var status = parseInt(options[0]);
        tox.setUserStatusSync(status);
        interface.readline.prompt();
    },

    _message: function(options)
    {
        var message = options.join(' ');
        tox.setStatusMessageSync(message);
        interface.readline.prompt();
    },

    _quit: function(options)
    {
        console.log("Bye!");

        toxbot.disconnect();
        interface.unload();
    },

    unload: function()
    {
        // Stop requesting input
        interface.readline.close();
    }
}

module.exports =
{
    load: function(client, _core)
    {
        _core.interface = interface;
        tox = client;
        toxbot = _core.toxbot;
        core = _core;

        interface.load();
    },

    unload: function(client, _core)
    {
        interface.unload();

        delete _core.interface;
        delete tox;
        delete core;
        delete toxbot;
        delete readline;
        delete interface;
    }
};

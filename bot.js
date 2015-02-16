// Required packages
var readline = require('readline');
var toxcore = require('toxcore');
var tox = new toxcore.Tox();

// Main bot code
var toxbot =
{
    events: ['connectionStatus', 'friendAction', 'friendMessage', 'friendRequest', 'groupInvite'],
    
    identity: false,    // Filename for the currently loaded identity
    autosave: true,     // Automatically save tox information?
    autofriend: true,   // Automatically accept friend requests?
    autogroup: true,    // Automatically join group chats?
    
    connect: function()
    {
        // Initialize stuff
        console.log("Connecting to Tox...");
        console.log("Tox ID: " + tox.getAddressHexSync());

         // Some nodes to bootstrap from
        var nodes =
        [
            {
                maintainer: 'nurupo',
                address: '192.210.149.121',
                port: 33445,
                key: 'F404ABAA1C99A9D37D61AB54898F56793E1DEF8BD46B1038B9D822E8460FAB67'
            },

            {
                maintainer: 'Jfreegman',
                address: '104.219.184.206',
                port: 443,
                key: '8CD087E31C67568103E8C2A28653337E90E6B8EDA0D765D57C6B5172B4F1F04C'
            },

            {
                maintainer: 'Impyy',
                address: '178.62.250.138',
                port: 33445,
                key: '788236D34978D1D5BD822F0A5BEBD2C53C64CC31CD3149350EE27D4D9A2F9B6B'
            },
        
            {
                maintainer: 'sonOfRa',
                address: '144.76.60.215',
                port: 33445,
                key: '04119E835DF3E78BACF0F84235B300546AF8B936F035185E2A8E9E0A67C8924F'
            }
        ];

        for(var i = 0, l = nodes.length; i < l; i++)
        {
            var node = nodes[i];
            tox.bootstrapFromAddress(node.address, node.port, node.key);
        }

        // Bind event handlers
        toxbot.bind();

        // Start syncronization with the tox network
        tox.start();
    },

    _default: function(event)
    {
        console.log("Unhandled event!");
        console.log('----- Properties -----');
        console.log(event);
        console.log('----- Prototypes -----');
        console.log(event.__proto__);
        console.log('-----');
        interface.readline.prompt();
    },

    _friendRequest: function(event)
    {
        console.log("Recieved friend request: " + event.data());
        console.log("From: " + event.publicKeyHex());

        if(toxbot.autofriend)
        {
            tox.addFriendNoRequest(event.publicKey())
            console.log("Friend request automatically accepted!");
        }

        if(toxbot.autosave && toxbot.identity)
        {
            tox.saveToFile(toxbot.identity);
        }

        interface.readline.prompt();
    },

    _groupInvite: function(event)
    {
        console.log("Recieved group chat request.");

        if(toxbot.autogroup)
        {
            if(event.isChatText())
            {
                tox.joinGroupchatSync(event.friend(), event.data());
            }
            else if(event.isChatAV())
            {
                tox.getAV().joinGroupchatSync(event.friend(), event.data());
            }
            
            console.log("Group chat request automatically accepted!");
        }

        interface.readline.prompt();
    },

    bind: function()
    {
        for(var i = 0, l = toxbot.events.length; i < l; i++)
        {
            var event = '_'+toxbot.events[i];

            if(typeof toxbot[event] != "function")
                event = '_default';

            tox.on(toxbot.events[i], toxbot[event]);
        }
    },

    unbind: function()
    {
        for(var i = 0, l = toxbot.events.length; i < l; i++)
        {
            var event = '_'+toxbot.events[i];

            if(typeof toxbot[event] != "function")
                event = '_default';
            
            tox.off(toxbot.events[i], toxbot[event]);
        }
    },

    disconnect: function()
    {
        if(toxbot.autosave && toxbot.identity)
        {
            tox.saveToFile(toxbot.identity);
        }
        
        toxbot.unbind();
        tox.stop();
    }
}

// Command line interface
var interface =
{
    commands: ['connect', 'disconnect', 'load', 'save', 'autosave', 'name', 'status', 'message', 'quit'],
    
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

    // Load tox identity from a file
    _load: function(options)
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
    _save: function(options)
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

    // Update toxbot's identity saving behavior
    _autosave: function(options)
    {
        var action = (options.shift() || '').toLowerCase();

        if(action == 'on' || action == 'true' || action === 1)
        {
            toxbot.autosave = true;
        }
        else if(action == 'off' || action == 'false' || action === 0)
        {
            toxbot.autosave = false;
        }
        else
        {
            // Toggle current autosave state
            toxbot.autosave = !toxbot.autosave;
        }

        console.log("Tox identity auto-saving is currently:", toxbot.autosave);

        if(!toxbot.identity)
        {
            console.log("Warning: No tox identity file has been loaded, autosaving won't work until one is loaded.");
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

interface.load();

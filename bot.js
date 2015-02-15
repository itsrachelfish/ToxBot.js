// Required packages
var readline = require('readline');
var toxcore = require('toxcore');
var tox = new toxcore.Tox();

// Main bot code
var toxbot =
{
    connect: function()
    {
        // Initialize stuff
        console.log("Connecting to Tox...");
        console.log("Tox ID: " + tox.getAddressHexSync());
        interface.readline.prompt();

        // Start syncronization with the tox network
        tox.start();
    },

    disconnect: function()
    {
        tox.stop();
    }
}

// Command line interface
var interface =
{
    commands: ['connect', 'disconnect', 'load', 'save', 'quit'],
    
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
    },

    _disconnect: function(options)
    {
        toxbot.disconnect();
    },

    _load: function(options)
    {
        // Load tox identity from a file
    },

    _save: function(options)
    {
        // Save tox identity to a file
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

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
        console.log("Starting ToxBot...");
        console.log("Tox ID: " + tox.getAddressHexSync());
        interface.readline.prompt();

        // Start running main application code
        toxbot.interval = setInterval(toxbot.sync, 100);
    },

    sync: function()
    {
        // Syncronize with the tox network
        tox.doSync();
    },

    disconnect: function()
    {
        clearInterval(toxbot.interval);
    }
}

// Command line interface
var interface =
{
    commands: ['connect', 'disconnect', 'load', 'save'],
    
    load: function()
    {
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

    unload: function()
    {
        // Stop requesting input
        prompt.readline.close();
    }
}

console.log();
interface.load();

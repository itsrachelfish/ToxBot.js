var toxcore = require('toxcore');
var tox = new toxcore.Tox();
var interval = false;

var toxbot =
{
    start: function()
    {
        // Initialize stuff
        console.log("Starting ToxBot...");
        console.log("Tox ID: " + tox.getAddressHexSync());

        // Start running main application code
        interval = setInterval(toxbot.run, 100);
    },

    run: function()
    {
        // Syncronize with the tox network
        tox.doSync();
    },

    end: function()
    {
        clearInterval(interval);
    }
}

toxbot.start();

var tox;

// Functions for handling the tox protocol
var toxbot =
{
    events: [],
    
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
//        interface.readline.prompt();
    },

    bind: function(index)
    {
        if(index == 'all')
        {
            for(var i = 0, l = toxbot.events.length; i < l; i++)
            {
                toxbot.bind(i);
            }
        }
        else
        {
            var event = '_'+toxbot.events[index];

            if(typeof toxbot[event] != "function")
                event = '_default';

            tox.on(toxbot.events[index], toxbot[event]);
        }
    },

    unbind: function(index)
    {
        if(index == 'all')
        {
            for(var i = 0, l = toxbot.events.length; i < l; i++)
            {
                toxbot.unbind(i);
            }
        }
        else
        {
            var event = '_'+toxbot.events[index];

            if(typeof toxbot[event] != "function")
                event = '_default';
            
            tox.off(toxbot.events[index], toxbot[event]);
        }
    },

    disconnect: function()
    {
        if(toxbot.autosave && toxbot.identity)
        {
            tox.saveToFile(toxbot.identity);
        }
        
        toxbot.unbind('all');
        tox.stop();
    }
}

module.exports =
{
    load: function(client, core)
    {
        tox = client;
        core.toxbot = toxbot;
    },

    unload: function(client, core)
    {
        delete tox;
        delete toxbot;
        delete core.toxbot;
    }
}

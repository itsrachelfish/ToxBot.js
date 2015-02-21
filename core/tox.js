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
                maintainer: 'pastly',
                address: '192.3.173.88',
                port: 33445,
                key: '3E1FFDEB667BFF549F619EC6737834762124F50A89C8D0DBF1DDF64A2DD6CD1B'
            },

            {
                maintainer: 'Busindre',
                address: '205.185.116.116',
                port: 33445,
                key: 'A179B09749AC826FF01F37A9613F6B57118AE014D4196A0E1105A98F93A54702'
            },
        
            {
                maintainer: 'stal',
                address: '23.226.230.47',
                port: 33445,
                key: 'A09162D68618E742FFBCA1C2C70385E6679604B2D80EA6E84AD0996A1AC8A074'
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

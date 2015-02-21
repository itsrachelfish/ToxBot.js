var tox, toxbot, interface;

// Module to handle accepting friend requests
var friendship =
{
    events: ['friendRequest'],

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

    bind: function()
    {
        for(var i = 0, l = friendship.events.length; i < l; i++)
        {
            var event = friendship.events[i];
            var handler = '_' + event;

            if(typeof friendship[handler] == "function")
                toxbot[handler] = friendship[handler];
            
            var length = toxbot.events.push(event);
            var index = length - 1;

            toxbot.bind(index);
        }
    },

    unbind: function()
    {
        for(var i = 0, l = friendship.events.length; i < l; i++)
        {
            var event = friendship.events[i];
            var handler = '_' + event;

            // Skip unknown events
            var index = toxbot.events.indexOf(event);
            if(index < 0) continue;

            toxbot.unbind(index);

            if(typeof friendship[handler] == "function")
                delete toxbot[handler];
        }
    }
}

module.exports =
{
    load: function(client, core)
    {
        tox = client;
        toxbot = core.toxbot;
        interface = core.interface;

        friendship.bind();
    },

    unload: function()
    {
        friendship.unbind();
        
        delete tox;
        delete toxbot;
        delete interface;
    }
}

var tox, toxbot, interface;

// Module to handle group chat behavior
var group =
{
    joined: false,
    events: ['connectionStatus', 'friendAction', 'friendMessage', 'groupInvite'],

    _groupInvite: function(event)
    {
        console.log(" ");
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

            group.joined = true;
            console.log("Group chat request automatically accepted!");
        }

        interface.readline.prompt();
    },

    _connectionStatus: function(event)
    {
        if(event.isConnected() && group.joined)
        {
            var friend = tox.getFriendNameSync(event.friend());
            console.log(" ");
            console.log(friend + " came online! Auto inviting...");
            interface.readline.prompt();
            
            // TODO: Make this only apply to a whitelist?
            tox.inviteSync(event.friend(), 0);
        }
    },

    _friendMessage: function(event)
    {
        var friend = tox.getFriendNameSync(event.friend());
        console.log(" ");
        console.log(event.friend(), friend, event.message());
        interface.readline.prompt();

        if(event.message().toLowerCase().trim() == 'invite' && group.joined)
        {
            // FISH CHAT YEAH!
            tox.inviteSync(event.friend(), 0);
        }
    },

    bind: function()
    {
        for(var i = 0, l = group.events.length; i < l; i++)
        {
            var event = group.events[i];
            var handler = '_' + event;

            if(typeof group[handler] == "function")
                toxbot[handler] = group[handler];
            
            var length = toxbot.events.push(event);
            var index = length - 1;

            toxbot.bind(index);
        }
    },

    unbind: function()
    {
        for(var i = 0, l = group.events.length; i < l; i++)
        {
            var event = group.events[i];
            var handler = '_' + event;

            // Skip unknown events
            var index = toxbot.events.indexOf(event);
            if(index < 0) continue;

            toxbot.unbind(index);

            if(typeof group[handler] == "function")
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

        group.bind();
    },

    unload: function()
    {
        group.unbind();
        
        delete tox;
        delete toxbot;
        delete interface;
    }
}

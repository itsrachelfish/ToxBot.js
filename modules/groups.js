var tox, toxbot;

// Module to handle group chat behavior
var group =
{
    events: ['friendAction', 'friendMessage', 'groupInvite'],

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

//        interface.readline.prompt();
    },

    _friendMessage: function(event)
    {
        console.log(event.friend(), event.message());

        if(event.message().toLowerCase().trim() == 'invite')
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

        group.bind();
    },

    unload: function()
    {
        group.unbind();
        
        delete tox;
        delete toxbot;
    }
}

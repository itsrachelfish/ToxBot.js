// Get client configuration
var config = require("./config/client.js");

// Create a new toxcore instance
var toxcore = require('toxcore');
var tox = new toxcore.Tox();

// Get modules that should be loaded immediately
var modules = require("./config/modules.js");

// Require core functions
var core = require("./core.js");

// Initialize tox with default modules
core.init(tox, modules);

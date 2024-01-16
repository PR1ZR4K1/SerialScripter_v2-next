For albertos firewall key update the route for grabbing firewall rules and the route to update them

Currently I pull a key from the db by selecting where the key=his key
this should be refactored.

yo decide if we want input validation for the ssh keys that we can put in. previously I made sure it was a valid rsa key, but idk if we want that this time since we could use different algorithms blah blah

log when user requests web server without user agent string

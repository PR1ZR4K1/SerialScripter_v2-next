For albertos firewall key update the route for grabbing firewall rules and the route to update them

Currently I pull a key from the db by selecting where the key=his key
this should be refactored.

log when user requests web server without user agent string


I need to update the ansible playbook logic to not throw errors on an error for deploying a playbook
the reason is that throwing an error makes the function stop executing which works properly for the toast messages I want to display but doesn't work properly for the data I need to retrieve from a successful ansible playbook deployment.
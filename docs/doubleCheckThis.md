For albertos firewall key update the route for grabbing firewall rules and the route to update them

Currently I pull a key from the db by selecting where the key=his key
this should be refactored.

## Notes for Alberto

- I don't know how to get into the container without the server running...
- How does the reset rules req work? I tried a put request and the server broke and a get request gave me method not allowed
- prolly implement a real update rules function
- have the container create a volume on the host so that if the container goes down it can be restarted with the same configs
- maybe consider running the server on something other than port 8000 to avoid possible conflicts

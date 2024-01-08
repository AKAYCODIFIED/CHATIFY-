// Socket.IO is a JavaScript library for real-time web applications. It enables bidirectional communication between clients (such as web browsers) and servers. Socket.IO provides an abstraction for handling the underlying complexities of real-time communication, including features like WebSocket support, fallbacks to other communication protocols in case WebSocket is not available, and additional features like rooms and namespaces.


// this is the sever we created to handle socket io connections 


const io = require("socket.io")(8000, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
});
// This line creates a Socket.IO server instance and binds it to port 8000. The server will listen for incoming connections on this port.
// The part related to CORS (Cross-Origin Resource Sharing) is like a security measure to control which web pages are allowed to connect to this server.



const users={};
// This initializes an empty object (users) that will be used to store user information. The user information is associated with their socket IDs.


io.on('connection',socket=>{
    // This sets up an event handler for the 'connection' event. When a new client connects to the server, this event is triggered, and the provided callback function is executed. The Socket parameter in the callback represents the connection with the newly connected client.

    // In the context of Socket.IO, a socket ID is a unique identifier assigned to each connected client.

    socket.on('new-user-joined',userName=>{

        users[socket.id]=userName;
        socket.broadcast.emit('user-joined',userName);
    });
    // When a client emits a 'new-user-joined' event, the server captures the provided name and associates it with the client's socket ID in the users dictionary. Then, it broadcasts a 'user-joined' event to all clients (except the sender) to notify them about the new user.

    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message:message,userName: users[socket.id]})
    });
    // When a client emits a 'send' event (presumably with a message), the server captures the message and broadcasts a 'receive' event to all clients (including the sender). The event includes the message and the name of the sender, retrieved from the users dictionary using the sender's socket ID.
    socket.on('disconnect',message=>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
    // In summary, this code handles the situation where a client disconnects from the server. It notifies all other connected clients that a user has left by emitting a 'left' event with the details of the departing user. It then removes the user's information from the server's user tracking data. 
});


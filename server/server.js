// Enable CORS so the client (running on a different port) can connect
const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  const id = socket.handshake.auth?.id || socket.handshake.query?.id;

  console.log("socket connected", { socketId: socket.id, id });

  if (id) {
    socket.join(id);
    console.log(`socket ${socket.id} joined room ${id}`);
  } else {
    console.warn("socket connected without id (handshake.auth or query)");
  }

  socket.on("send-message", ({ recipients, text }) => {
    console.log("send-message", { from: id, recipients, text });

    recipients.forEach((recipient) => {
      const newRecipients = recipients.filter((r) => r !== recipient);

      newRecipients.push(id);

      socket.broadcast.to(recipient).emit("receive-message", {
        recipients: newRecipients,
        sender: id,
        text,
      });

      console.log("emitted receive-message to", recipient, {
        recipients: newRecipients,
        sender: id,
        text,
      });
    });
  });
});

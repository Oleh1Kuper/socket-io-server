const socketMain = (io) => {
  io.on('connection', (socket) => {
    let machineMacAddress;
    const auth = socket.handshake.auth;

    if (auth.token === 'sometoken') {
      socket.join('nodeClient');
    } else if (auth.token === 'reactClientToken') {
      socket.join('reactClient');
    } else {
      socket.disconnect();
    }

    socket.emit('welcome', 'Welcome to our cluster driven socker.io server');

    socket.on('perfData', (data) => {
      if (!machineMacAddress) {
        machineMacAddress = data.macA;
        io.to('reactClient').emit('isConnected', {
          isAlive: true,
          machineMacAddress,
        });
      }

      io.to('reactClient').emit('perfData', data);
    });

    socket.on('disconnect', () => {
      io.to('reactClient').emit('isConnected', {
        isAlive: false,
        machineMacAddress,
      });
    });
  });
};

module.exports = socketMain;

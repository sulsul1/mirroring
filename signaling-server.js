const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;

const io = new Server(PORT, {
    cors: {
        origin: "https://sulsul.pe.kr", 
        methods: ["GET", "POST"]
    }
});

console.log(`Node.js 시그널링 서버가 포트 ${PORT}에서 실행 중입니다.`);

io.on('connection', (socket) => {
    console.log('클라이언트 연결됨:', socket.id);

    socket.on('offer', (offer) => {
        socket.broadcast.emit('offer', offer);
    });

    socket.on('answer', (answer) => {
        socket.broadcast.emit('answer', answer);
    });

    socket.on('candidate', (candidate) => {
        socket.broadcast.emit('candidate', candidate);
    });

    socket.on('disconnect', () => {
        console.log('클라이언트 연결 해제:', socket.id);
    });
});
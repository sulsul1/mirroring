const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;

const io = new Server(PORT, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

console.log(`Node.js 시그널링 서버가 포트 ${PORT}에서 실행 중입니다.`);

// 생성된 방의 암호를 저장하는 객체
const rooms = {}; 

io.on('connection', (socket) => {
    // 1. 송신자가 방을 생성하고 암호를 설정함
    socket.on('create-room', (data) => {
        rooms[data.roomId] = data.password;
        socket.join(data.roomId);
        console.log(`방 생성: [${data.roomId}] 암호: [${data.password}]`);
    });

    // 2. 수신자가 방 접속을 요청함 (암호 확인)
    socket.on('join-room', (data, callback) => {
        if (rooms[data.roomId] && rooms[data.roomId] === data.password) {
            socket.join(data.roomId);
            // 송신자에게 수신자가 접속했음을 알림
            socket.to(data.roomId).emit('viewer-joined');
            callback({ success: true }); // 클라이언트에게 성공 응답
        } else {
            callback({ success: false }); // 클라이언트에게 실패 응답
        }
    });

    // 3. WebRTC 시그널링 중계
    socket.on('offer', (data) => {
        socket.to(data.roomId).emit('offer', data.offer);
    });

    socket.on('answer', (data) => {
        socket.to(data.roomId).emit('answer', data.answer);
    });

    socket.on('candidate', (data) => {
        socket.to(data.roomId).emit('candidate', data.candidate);
    });

    socket.on('disconnect', () => {
        console.log('클라이언트 연결 해제:', socket.id);
    });
});
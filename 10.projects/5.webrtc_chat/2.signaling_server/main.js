const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const callButton = document.getElementById('callButton');
const hangupButton = document.getElementById('hangupButton');

let localStream;
let pc;
const signalingServerUrl = 'ws://localhost:8080';
const signalingSocket = new WebSocket(signalingServerUrl);

startButton.onclick = start;
callButton.onclick = call;
hangupButton.onclick = hangup;

signalingSocket.onmessage = async (message) => {
    if (typeof message.data === 'string') {
        handleSignalingMessage(JSON.parse(message.data));
    } else {
        const reader = new FileReader();
        reader.onload = () => {
            handleSignalingMessage(JSON.parse(reader.result));
        };
        reader.readAsText(message.data);
    }
};

function handleSignalingMessage(data) {
    console.log('Received message:', data);
    if (data.offer) {
        console.log('Received offer');
        createPeerConnection();
        pc.setRemoteDescription(new RTCSessionDescription(data.offer))
          .then(() => pc.createAnswer())
          .then(answer => pc.setLocalDescription(answer))
          .then(() => signalingSocket.send(JSON.stringify({ answer: pc.localDescription })))
          .then(() => console.log('Sent answer'));
    } else if (data.answer) {
        console.log('Received answer');
        pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    } else if (data.candidate) {
        console.log('Received candidate');
        pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
}

async function start() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
        console.log('Local stream added');
    } catch (e) {
        console.error('Error accessing media devices.', e);
    }
}

async function call() {
    createPeerConnection();

    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    console.log('Added local stream tracks to peer connection');

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    signalingSocket.send(JSON.stringify({ offer }));
    console.log('Sent offer');
}

function createPeerConnection() {
    const servers = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    pc = new RTCPeerConnection(servers);

    pc.onicecandidate = ({ candidate }) => {
        if (candidate) {
            signalingSocket.send(JSON.stringify({ candidate }));
            console.log('Sent candidate');
        }
    };

    pc.ontrack = (event) => {
        remoteVideo.srcObject = event.streams[0];
        console.log('Received remote stream');
    };
}

function hangup() {
    if (pc) {
        pc.close();
        pc = null;
        console.log('Peer connection closed');
    }
}

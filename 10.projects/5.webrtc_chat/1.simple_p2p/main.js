const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const callButton = document.getElementById('callButton');
const hangupButton = document.getElementById('hangupButton');

let localStream;
let pc1;
let pc2;

startButton.onclick = start;
callButton.onclick = call;
hangupButton.onclick = hangup;

async function start() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
    } catch (e) {
        console.error('Error accessing media devices.', e);
    }
}

async function call() {
    const servers = null; // Use default STUN servers

    pc1 = new RTCPeerConnection(servers);
    pc1.onicecandidate = e => onIceCandidate(pc1, e);
    pc2 = new RTCPeerConnection(servers);
    pc2.onicecandidate = e => onIceCandidate(pc2, e);
    pc2.ontrack = gotRemoteStream;

    localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));

    try {
        const offer = await pc1.createOffer();
        await onCreateOfferSuccess(offer);
    } catch (e) {
        console.error('Failed to create session description:', e);
    }
}

async function onCreateOfferSuccess(desc) {
    try {
        await pc1.setLocalDescription(desc);
        await pc2.setRemoteDescription(desc);
        const answer = await pc2.createAnswer();
        await onCreateAnswerSuccess(answer);
    } catch (e) {
        console.error('Failed to set session description:', e);
    }
}

async function onCreateAnswerSuccess(desc) {
    try {
        await pc2.setLocalDescription(desc);
        await pc1.setRemoteDescription(desc);
    } catch (e) {
        console.error('Failed to set session description:', e);
    }
}

function onIceCandidate(pc, event) {
    if (event.candidate) {
        const otherPc = pc === pc1 ? pc2 : pc1;
        otherPc.addIceCandidate(event.candidate)
            .then(() => console.log('AddIceCandidate success.'))
            .catch(e => console.error('Failed to add ICE Candidate:', e));
    }
}

function gotRemoteStream(event) {
    if (remoteVideo.srcObject !== event.streams[0]) {
        remoteVideo.srcObject = event.streams[0];
    }
}

function hangup() {
    pc1.close();
    pc2.close();
    pc1 = null;
    pc2 = null;
}

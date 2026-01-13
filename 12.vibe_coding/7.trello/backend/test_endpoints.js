
import fetch from 'node-fetch';

const BASE = 'http://localhost:3001/api/v1';

async function test() {
    console.log('--- Testing API Connectivity ---');

    // 1. Login
    console.log('1. Logging in as demo user...');
    const loginRes = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@sample.com', password: 'password' })
    });
    
    if (!loginRes.ok) {
        console.error('Login Failed:', loginRes.status, await loginRes.text());
        return;
    }
    const { data: { accessToken } } = await loginRes.json();
    console.log('Login Success. Token obtained.');
    const headers = { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

    // 2. Get Me
    console.log('2. Requesting /auth/me...');
    const meRes = await fetch(`${BASE}/auth/me`, { headers });
    console.log('/auth/me status:', meRes.status);

    // 3. Get Workspaces
    console.log('3. Requesting /workspaces...');
    const wsRes = await fetch(`${BASE}/workspaces`, { headers });
    console.log('/workspaces status:', wsRes.status);
    
    if (!wsRes.ok) return;
    const { data: { items: workspaces } } = await wsRes.json();
    if (workspaces.length === 0) {
        console.log('No workspaces found.');
        return;
    }
    const wsId = workspaces[0].id;
    console.log('Workspace ID:', wsId);

    // 4. Get Projects
    console.log(`4. Requesting /workspaces/${wsId}/projects...`);
    const projRes = await fetch(`${BASE}/workspaces/${wsId}/projects`, { headers });
    console.log('/workspaces/:id/projects status:', projRes.status);

    if (!projRes.ok) {
        console.log('Response:', await projRes.text());
        return;
    }
    const { data: { items: projects } } = await projRes.json();
    if (projects.length === 0) {
        console.log('No projects found.');
        return;
    }
    const projId = projects[0].id;
    console.log('Project ID:', projId);

    // 5. Get Board
    console.log(`5. Requesting /projects/${projId}/board...`);
    const boardRes = await fetch(`${BASE}/projects/${projId}/board`, { headers });
    console.log('/projects/:id/board status:', boardRes.status);
    if (!boardRes.ok) {
        console.log('Response:', await boardRes.text());
    }
}

test().catch(console.error);

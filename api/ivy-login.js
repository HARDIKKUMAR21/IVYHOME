export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ detail: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ detail: 'Email and password are required' });
        }

        const apiKey = process.env.IVY_API_KEY || 'IVY26-ED62B530A404';
        const response = await fetch('https://solve.ivy.homes/auth/login', {
            method: 'POST',
            headers: {
                'X-API-Key': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: String(email).trim(), password: String(password).trim() }),
        });

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = { detail: text || 'Login server returned an invalid response' };
        }

        return res.status(response.status).json(data);
    } catch (error) {
        console.error('Ivy login proxy error:', error);
        return res.status(502).json({ detail: 'Unable to connect to the Ivy Homes authentication server' });
    }
}

// /pages/api/loadBlockchain.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    console.log('Loading blockchain data...');

    if (req.method === 'GET') {
        const filePath = path.resolve('./data', 'blockchain.json');
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Blockchain data not found' });
        }

        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                console.error('Error reading blockchain data:', err);
                return res.status(500).json({ message: 'Failed to load blockchain data' });
            }
            res.status(200).json(JSON.parse(data));
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}


const express = require('express');
const path = require('path');

const app = express();
const port = 8080

app.get('/', (req, res) => res.send('Test server running!'))
app.use('/static', express.static(path.join(__dirname, 'static')))
app.listen(port, () => console.log(`[Test-Server] listening on port ${port}!`));

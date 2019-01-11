const express = require('express');
const path = require('path');

const app = express();
const port = process.env.CYPRESS_TESTSERVER_PORT || 8080

app.get('/', (req, res) => res.send('Test server running!'))
app.use('/static', express.static(path.join(__dirname, 'static')))
app.listen(port, () => console.log(`[Test-Server] listening on port ${port}!`));


const express = require('express');
const app = express();
const router = express.Router(); // No mergeParams
const child = express.Router(); 

// Demonstration of mergeParams issue
// If this script is run, accessing /parent/123/child should show undefined without mergeParams

router.use('/parent/:id/child', child);
child.get('/', (req, res) => {
    console.log('ID:', req.params.id); // undefined if mergeParams false
});

// To test my hypothesis

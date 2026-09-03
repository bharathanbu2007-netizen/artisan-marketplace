// Re-exported for symmetry with the intended structure; order actions live
// under /api/buyer and /api/seller since orders are always scoped to a role.
const express = require('express');
const router = express.Router();
module.exports = router;

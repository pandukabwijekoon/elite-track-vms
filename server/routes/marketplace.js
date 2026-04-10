const express = require('express');
const router = express.Router();
const { getSpareParts, getSparePart, createSparePart, updateSparePart, deleteSparePart, getMyListings } = require('../controllers/marketplaceController');
const { protect } = require('../middleware/auth');

router.get('/', getSpareParts);
router.get('/:id', getSparePart);

router.use(protect);
router.post('/', createSparePart);
router.get('/my/listings', getMyListings);
router.route('/:id').put(updateSparePart).delete(deleteSparePart);

module.exports = router;

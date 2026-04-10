const express = require('express');
const router = express.Router();
const { getModifications, getPublicModifications, createModification, updateModification, deleteModification } = require('../controllers/modificationController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

const uploadFields = upload.fields([
  { name: 'beforeImage', maxCount: 1 },
  { name: 'afterImage', maxCount: 1 }
]);

router.get('/public', getPublicModifications);
router.use(protect);
router.route('/').get(getModifications).post(uploadFields, createModification);
router.route('/:id').put(uploadFields, updateModification).delete(deleteModification);

module.exports = router;

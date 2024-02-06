const router = require("express").Router();
const { createUrl, allUrl, redirectUrl, deleteUrl } = require("../controllers/url");
const { authentication } = require ('../middleware/authontication');

router.post('/createUrl',authentication, createUrl);
router.get('/allUrl/:id',authentication, allUrl);
router.get('/shortUrl/:shortUrl',redirectUrl);
router.delete('/delete/:id',authentication, deleteUrl)

module.exports = router;
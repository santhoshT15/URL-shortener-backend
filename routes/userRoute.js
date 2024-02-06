const router = require("express").Router();
const { signUp, logIn, forgotPassword, resetPassword } = require("../controllers/user");

router.post('/signup',signUp);
router.post('/login',logIn);
router.post('/forgot/password',forgotPassword);
router.post('/reset/password/:token',resetPassword);

module.exports = router;
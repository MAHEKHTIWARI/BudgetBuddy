const express = require('express');
const AuthController = require('./../Controller/AuthController');
const UserController = require('./../Controller/UserController');
const FireBaseController = require('./../Controller/FirebaseController');

const router = express.Router();

router.route('/signUp').post(AuthController.signUp);
router.route('/verifyEmail').post(AuthController.verifyEmail);
router.route('/login').post(AuthController.login);
router.route('/forgottenPassword').post(AuthController.forgottenPassword);
router.route('/resetPassword').patch(AuthController.resetPassword);
// router
//   .route('/uploadImage')
//   .post(
//     FireBaseController.upload.single('fileName'),
//     FireBaseController.uploadImage
//   );
router
  .route('/resendVerificationcode')
  .patch(AuthController.resendVerificationCode);
router.use(AuthController.protectedEndPoint);

router.route('/updatePassword').patch(AuthController.updatePassword);

router
  .route('/')
  .get(UserController.getUser)
  .patch(FireBaseController.upload.single('fileName'), UserController.updateMe);
module.exports = router;

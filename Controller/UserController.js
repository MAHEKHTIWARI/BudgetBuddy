const AppError = require('../utils/AppError');
const GeneralFn = require('./../utils/Generalfn');
const User = require('./../Schema/UsersSchema');
const FireBaseController = require('./FirebaseController');
const errorMessage = (err, statusCode, res, next) => {
  if (process.env.DEV_ENV === 'Development') {
    const response = {
      status: err.status || 'fail',
      message: err.message,
      err,
      errStack: err.stack,
    };
    res.status(statusCode).json(response);
  } else {
    return next(new AppError(err.message, statusCode));
  }
};
const getUser = async (req, res, next) => {
  try {
    const email = req.user.email;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError('No user exists for this token', 401));
    }
    console.log(user);
    const response = {
      status: 'success',
      data: {
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        Id: user._id,
        Image: user.Image,
      },
    };

    res.status(201).json(response);
  } catch (err) {
    errorMessage(err, 400, res, next);
  }
};

const updateMe = async (req, res, next) => {
  try {
    // console.log(req);
    const { name, mobileNumber } = req.body;
    const Image = req.file;
    // console.log(name, mobileNumber, Image);

    let downloadUrl;
    if (Image) {
      Image.buffer = await GeneralFn.resizeUserPhoto(Image.buffer);
      downloadUrl = await FireBaseController.uploadImageTofirebase(Image, next);
    }

    if (!name && !mobileNumber && !Image) {
      return next(new AppError('please enter atleast one parameter', 400));
    }

    const data = await User.findOneAndUpdate(
      { email: req.user.email },
      {
        name,
        mobileNumber,
        Image: downloadUrl,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    console.log(data);
    const response = {
      status: 'success',
      data: {
        data,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    errorMessage(err, 400, res, next);
  }
};
module.exports = {
  getUser,
  updateMe,
};

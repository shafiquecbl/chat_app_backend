const { check } = require('express-validator');
const User = require('../models/user');

module.exports = {

    checkUserValdiaors: [
        check('email', 'Email is required').isEmail().withMessage('Email is invalid'),
    ],

    signupValidators: [
        check('email', 'Email is required').isEmail().withMessage('Email is invalid'),
        check('email').custom(value => {
            return User.findOne({ email: value }).then(user => {
                if (user) {
                    return Promise.reject('Email already in use');
                }
            }).catch(error => {
                return Promise.reject(error);
            });
        }),
        check('password', 'Password is required').notEmpty().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        check('name', 'Name is required').notEmpty(),
        check('gender', 'Gender is required').notEmpty(),
        check('dob', 'Date of birth is required').notEmpty(),
        check('country', 'Country is required').notEmpty(),
        check('city', 'City is required').notEmpty(),
        check('interests', 'Interests are required').notEmpty(),
    ],

    updateValidators: [
        check('email', 'Email is required').notEmpty(),
        check('name', 'Name is required').notEmpty(),
        check('gender', 'Gender is required').notEmpty(),
        check('dob', 'Date of birth is required').notEmpty(),
        check('country', 'Country is required').notEmpty(),
        check('city', 'City is required').notEmpty(),
        check('interests', 'Interests are required').notEmpty(),
        check('infoVisibility', 'Info visibility is required').notEmpty(),
    ],

    updatePasswordValidators: [
        check('email', 'Email is required').notEmpty(),
        check('password', 'Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],

    updateImageValidators: [
        check('email', 'Email is required').exists(),
    ],


}
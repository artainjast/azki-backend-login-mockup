const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const cors = require('cors')
const app = express();
const PORT = 3000;

// اجازه دادن به برنامه برای پردازش بدنه درخواست‌ها با JSON و فرم داده‌ها
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// ولیدیشن شماره موبایل
const validateMobileNumber = body('mobileNumber').matches(/^09\d{9}$/).withMessage('فرمت شماره موبایل اشتباه است.');

// ولیدیشن نام و نام خانوادگی با الفبای فارسی
const validatePersianName = (fieldName) => body(fieldName).matches(/^[\u0600-\u06FF\s]+$/).withMessage(`فیلد ${fieldName} باید فقط شامل حروف فارسی باشد.`);

// مسیر برای لاگین
app.post('/login', validateMobileNumber, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // در اینجا اطلاعات مورد نیاز برای لاگین دریافت شده است
    const { mobileNumber } = req.body;

    // اینجا می‌توانید از کاربر درخواست نام و نام خانوادگی بکنید
    res.send({ status : 200 , mobileNumber , message: 'لطفاً نام و نام خانوادگی را وارد کنید.'});
});

// اندپوینت برای دریافت نام و نام خانوادگی و پسورد
app.post('/login/details', [
    validatePersianName('name'),
    validatePersianName('familyName'),
    body('password').isLength({ min: 4 }).withMessage('طول پسورد باید حداقل ۴ کاراکتر باشد.')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // در اینجا اطلاعات مورد نیاز برای لاگین دریافت شده است
    const { name, familyName, password } = req.body;

    // اینجا می‌توانید کاربر را وارد سیستم کنید یا عملیات دیگری انجام دهید
    res.send({
        status: 200,
        message: 'عملیات با موفقیت انجام شد.',
        data: name
    });
});

app.listen(PORT, () => {
    console.log(`سرور در حال اجرا در پورت ${PORT}`);
});

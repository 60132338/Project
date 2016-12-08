var express = require('express'),
    Post = require('../models/Post'),
    User = require('../models/User'),
    Reserve = require('../models/Reserve');
var router = express.Router();

function needAuth(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.flash('danger', '로그인이 필요합니다.');
      res.redirect('/signin');
    }
}

function validateForm(form) {
    var people = form.people || "";
    var checkin = form.checkin || "";
    var checkout = form.checkout || "";

    if(!people){
        return '숙박인원을 입력해주세요.';
    }
    if (!checkin) {
        return 'Check-In 날짜를 선택해주세요.';
    }
    if(!checkout){
        return 'Check-Out 날짜를 선택해주세요.';
    }

    return null;
}


router.get('/:id', needAuth, function (req, res, next) {
    User.findById(req.user, function (err, user) {
        if (err) {
            return next(err);
        }
        Post.findById(req.params.id, function (err, post) {
            if (err) {
                return next(err);
            }
            if (post.reservation === '예약중' || post.reservation === '예약완료') {
                req.flash('danger', '예약중입니다.');
                res.redirect('back');
            }
            res.render('reserves/new', { user: user, post: post });
        });
    });
});

router.post('/:id', function (req, res, next) {
    var err = validateForm(req.body);
    if (err) {
        req.flash('danger', err);
        return res.redirect('back');
    }
    Post.findById(req.params.id, function (err, post) {
        if (err) {
            return next(err);
        }
        
        post.reservation="예약중";
        post.save(function(err){
            if(err){
                return next(err);
            }
        });
        
        var NewReserve = new Reserve({
            useremail: req.session.user.email,
            hostemail: post.email,
            name: req.session.user.name,
            title: post.title,
            people: req.body.people,
            address: post.address,
            fromDate: req.body.checkin,
            toDate: req.body.checkout,
            content: req.body.content
        });

        NewReserve.save(function (err) {
            if (err) {
                return next(err);
            } else {
                // req.flash('success', '게시물 등록이 완료되었습니다.');
                res.redirect('/posts/#{post.id}');
            }
        });

    });
});


module.exports = router;
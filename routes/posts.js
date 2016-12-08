var express = require('express'),
    User = require('../models/User'),
    Post = require('../models/Post');
var router = express.Router();

function needAuth(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.flash('danger', '로그인이 필요합니다.');
      res.redirect('/signin');
    }
}

//function needAuth(req, res, next) {
 //   if (req.session.user.email === post.email) {
 //       next();
 //   } else {
//        req.flash('danger', '권한이 없습니다.');
//        res.redirect('back');
//    }
//}
/** form 안에 필수로 작성되야할 부분이 데이터가 있는지 확인. */
function validateForm(form) {
    var title = form.title || "";
    var city = form.city || "";
    var address = form.address || "";

    title = title.trim();
    city = city.trim();
    address = address.trim();

    if (!title) {
        return '이름을 입력해주세요.';
    }
    if(!city){
        return '도시를 입력해주세요.';
    }
    if(!address){
        return '주소를 입력해주세요.';
    }

    return null;
}

/** 게시판 리스트 */
router.get('/', function (req, res, next) {
    Post.find({}, function (err, posts) {
        if (err) {
            return next(err);
        }
        res.render('posts/index', { posts: posts });
    });
});

router.post('/search',function(req,res,next){
    Post.find({city:req.body.search},function(err,posts){
        if(err){
            return next(err);
        }
        res.render('posts/index',{posts:posts});
    });
});

/** 게시물 생성 */
router.get('/new',needAuth ,function (req, res, next) {
    Post.find({}, function (err, post) {
        if (err) {
            return next(err);
        }
        res.render('posts/edit', { post: post });
    });
});
router.post('/', function (req, res, next) {
    var err = validateForm(req.body);
    if (err) {
        req.flash('danger', err);
        return res.redirect('back');
    }
    Post.find({}, function (err, post) {
        if (err) {
            return next(err);
        }
        var createPost = new Post({
            title: req.body.title,
            email: req.session.user.email,
            city: req.body.city,
            address: req.body.address,
            fee: req.body.fee,
            convenient: req.body.convenient,
            rule: req.body.rule,
            content: req.body.content
        });

        createPost.save(function (err) {
            if (err) {
                return next(err);
            } else {
               // req.flash('success', '게시물 등록이 완료되었습니다.');
                res.redirect('/posts');
            }
        });
    });
});

/** 게시물 수정 */
router.get('/:id/edit', needAuth ,function (req, res, next) {
    Post.findById(req.params.id, function (err, post) {
        if (err) {
            return next(err);
        }
        res.render('posts/edit', { post: post });
    });
});

router.put('/:id', function (req, res, next) {
    var err = validateForm(req.body);
    if (err) {
        //req.flash('danger', err);
        return res.redirect('back');
    }
    Post.findById({ _id: req.params.id }, function (err, post) {
        if (err) {
            return next(err);
        }
        // 게시물이 존재하지 않으면 이전페이지로
        if (!post) {
            return res.redirect('back');
        }
        
        post.title = req.body.title;
        post.content = req.body.content;
        post.city = req.body.city;
        post.address = req.body.address;
        post.fee = req.body.fee;
        post.convenient = req.body.convenient;
        post.rule = req.body.rule;
        post.people = req.body.people;

        post.save(function (err) {
            if (err) {
                return next(err);
            }
            //req.flash('success', '게시물 수정이 완료되었습니다.');
            res.redirect('/posts');
        });
    });
});

/** 게시물 삭제 */
router.delete('/:id', needAuth, function (req, res, next) {
    Post.findOneAndRemove({ _id: req.params.id }, function (err) {
        if (err) {
            return next(err);
        }
        //res.flash('success', '게시물이 삭제되었습니다.');
        res.redirect('back');
    });
});

/** 게시물 상세보기 */
router.get('/:id', function (req, res, next) {
    Post.findById(req.params.id, function (err, post) {
        if (err) {
            return next(err);
        }
        /** 게시물 조회수 증가 */
        post.read += 1;
        post.save(function (err) {
            if (err) {
                return next(err);
            }
        });
        res.render('posts/show', { post: post });
    });
});
module.exports = router;
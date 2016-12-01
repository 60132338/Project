var express = require('express'),
    Post = require('../models/Post');
var router = express.Router();

/** form 안에 필수로 작성되야할 부분이 데이터가 있는지 확인. */
function validateForm(form) {
    var email = form.email || "";
    var title = form.title || "";
    email = email.trim();
    title = title.trim();

    if (!title) {
        return '이름을 입력해주세요.';
    }

    if (!email) {
        return '이메일을 입력해주세요.';
    }

    if (!form.password) {
        return '비밀번호를 입력해주세요.';
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

/** 게시물 생성 */
router.get('/new', function (req, res, next) {
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
        //req.flash('danger',err);
        return res.redirect('back');
    }
    Post.find({}, function (err, post) {
        if (err) {
            return next(err);
        }
        var createPost = new Post({
            title: req.body.title,
            email: req.body.email,
            content: req.body.content
        });
        createPost.password = req.body.password;

        createPost.save(function (err) {
            if (err) {
                return next(err);
            } else {
                // req.flash('success','게시물 등록이 완료되었습니다.')
                res.redirect('/posts');
            }
        });
    });
});

/** 게시물 수정 */
router.get('/:id/edit', function (req, res, next) {
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
        //req.flash('danger',err);
        return res.redirect('back');
    }
    Post.findById({ _id: req.params.id }, function (err, post) {
        if (err) {
            return next(err);
        }
        // 게시물이 존재하지 않으면 이전페이지로
        if(!post){
            return res.redirect('back');
        }
        // 수정시 원래 작성한 비밀번호와 다를시 수정이 되지 않음.
        if (post.password !== req.body.password) {
            return res.redirect('back');
        }
        post.email = req.body.email;
        post.title = req.body.title;
        if (req.body.password) {
            post.password = req.body.password;
        }
        post.content = req.body.content;

        post.save(function (err) {
            if (err) {
                return next(err);
            }
            //req.flash('success','게시물 수정이 완료되었습니다.');
            res.redirect('/posts');
        });
    });
});

/** 게시물 삭제 */
router.delete('/:id', function (req, res, next) {
    Post.findOneAndRemove({ _id: req.params.id }, function (err) {
        if (err) {
            return next(err);
        }
        // res.flash('success', '게시물이 삭제되었습니다.');
        res.redirect('/posts');
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
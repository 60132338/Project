var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    email: {type: String, required: true, index:true, trim: true}, // 이메일
    password: {type: String}, // 비밀번호
    title: {type: String, required: true, trim: true}, // 글제목
    content: {type: String, required: true}, // 글내용
    read: {type: Number, default: 0}, // 조회수
    createdAt: {type: Date, default: Date.now} // 작성시간
}, {
    toJSON: { virtuals: true},
    toObject: {virtuals: true}
});

var Post = mongoose.model('Post',schema);

module.exports = Post;
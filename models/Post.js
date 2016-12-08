var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    email: {type: String, required: true, index:true, trim: true}, // 이메일
    
    title: {type: String, required: true, trim: true}, //제목
    city: {type: String, required:true, trim: true}, //도시
    address: {type: String, required:true, trim: true}, //주소
    fee: {type: Number, required:true, default: 0}, //숙소요금
    convenient: {type: String, required: true, trim: true},//편의시설
    reservation: {type:String, default:"예약가능"},
    content: {type: String, required: true}, // 간단한 설명
    rule: {type: String, required: true}, //이용규칙
    read: {type: Number, default: 0}, // 조회수
    createdAt: {type: Date, default: Date.now} // 작성시간
}, {
    toJSON: { virtuals: true},
    toObject: {virtuals: true}
});

var Post = mongoose.model('Post',schema);

module.exports = Post;
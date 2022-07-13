//获取应用实例
Page({
    data: {
        src: '',
        width: 250, //宽度
        height: 250, //高度
        max_width: 428,
        max_height: 428,
        disable_rotate: true, //是否禁用旋转
        disable_ratio: false, //锁定比例
        limit_move: true, //是否限制移动
    },
    onLoad: function (options) {
        var that = this;
        var sbimg = wx.getStorageSync('sbimg');
        this.cropper = this.selectComponent("#image-cropper");
        this.setData({
            src: sbimg
        });
        },
        cropperload(e) {
            console.log('cropper加载完成');
        },
        loadimage(e) {
            wx.hideLoading();
            console.log('图片');
            this.cropper.imgReset();
        },
        clickcut(e) {
            console.log(e.detail);
            //图片预览
            wx.previewImage({
                current: e.detail.url, // 当前显示图片的http链接
                urls: [e.detail.url] // 需要预览的图片http链接列表
            })
        },
        setWidth(e) {
            this.setData({
                width: e.detail.value < 10 ? 10 : e.detail.value
            });
            this.setData({
                cut_left: this.cropper.data.cut_left
            });
        },
        setHeight(e) {
            this.setData({
                height: e.detail.value < 10 ? 10 : e.detail.value
            });
            this.setData({
                cut_top: this.cropper.data.cut_top
            });
        },
        setCutTop(e) {
            this.setData({
                cut_top: e.detail.value
            });
            this.setData({
                cut_top: this.cropper.data.cut_top
            });
        },
        setCutLeft(e) {
            this.setData({
                cut_left: e.detail.value
            });
            this.setData({
                cut_left: this.cropper.data.cut_left
            });
        },
        // this.cropper.setLimitMove(e.detail.value);
        submit() {
            this.cropper.getImg((obj) => {
                wx.setStorage({
                    key: "sbimgs",
                    data: obj.url
                });
                wx.navigateBack({
                    delta: 1
                });
            });
        },
        rotate() {
            //在用户旋转的基础上旋转90°
            this.cropper.setAngle(this.cropper.data.angle += 90);
        },
        top() {
            this.data.top = setInterval(() => {
                this.cropper.setTransform({
                    y: -3
                });
            }, 1000 / 60)
        },
        bottom() {
            this.data.bottom = setInterval(() => {
                this.cropper.setTransform({
                    y: 3
                });
            }, 1000 / 60)
        },
        left() {
            this.data.left = setInterval(() => {
                this.cropper.setTransform({
                    x: -3
                });
            }, 1000 / 60)
        },
        right() {
            this.data.right = setInterval(() => {
                this.cropper.setTransform({
                    x: 3
                });
            }, 1000 / 60)
        },
        narrow() {
            this.data.narrow = setInterval(() => {
                this.cropper.setTransform({
                    scale: -0.02
                });
            }, 1000 / 60)
        },
        enlarge() {
            this.data.enlarge = setInterval(() => {
                this.cropper.setTransform({
                    scale: 0.02
                });
            }, 1000 / 60)
        },
        end(e) {
            clearInterval(this.data[e.currentTarget.dataset.type]);
        },
})
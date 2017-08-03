function ScaleImg(option, offsetX, offsetY) {
    this.scale = 1;

    this.offsetX = offsetX || 0;
    this.offsetY = offsetY || 0;

    this.img = option;
    this.imgWidth = option.width();
    this.imgHeight = option.height();

    this.scaleObj = {
        '1300': 1.0,
        '1200': 0.8,
        '992': 0.6,
    };

    this.isScale = {
        '1300': true,
        '1200': true,
        '992': true,
    };

    this.body = $('body');
    this.window = $(window);
    this.imgWrap = $('.main-img');
}
ScaleImg.prototype = {
    _setTrueIsScale: function (width) {
        for (var i in this.isScale) {
            this.isScale[i] = true;

            if (width == i)
                this.isScale[i] = false
        }
    },
    _returnWidthScale: function () {
        for (var i in this.isScale) {
            if (!this.isScale[i]) {
                return i
            }
        }
    },
    changePosition: function () {
        var img = this.img,
            bodyWidth = this.body.width(),
            imgWidth = this.img.width();

        offset =  ((bodyWidth - imgWidth) / 2) - this.offsetX ;
        img.css({
            left: offset,
            top: this.offsetY
        });
    },
    changeImgSize: function (width) {
        var img = this.img,
            imgWidth = this.imgWidth,
            imgHeight = this.imgHeight,
            imgWrap = this.imgWrap,
            scale = this.scale;

        if (!this.isScale[width]) return;

        img.css({
            width: imgWidth * scale,
            height: imgHeight * scale
        });

        imgWrap.css({
            minHeight: imgHeight * scale
        });
    },
    installSettings: function (width) {
        var width = width;

        if (width > 1200) {
            this.scale = this.scaleObj['1300'];
        } else if (width < 1200 && width > 992) {
            this.scale = this.scaleObj['1200'];
        } else if (width < 992 && this.isScale['992']) {
            this.scale = this.scaleObj['992'];
        }
    },
    setScale: function (width) {
        var width = width;

        if (width > 1200 && this.isScale['1300']) {
            this.scale = this.scaleObj['1300'];
            this.changeImgSize(1300);
            this._setTrueIsScale(1300);
        } else if ((width < 1200 && width > 992) && this.isScale['1200']) {
            this.scale = this.scaleObj['1200'];
            this.changeImgSize(1200);
            this._setTrueIsScale(1200);
        } else if (width < 992 && this.isScale['992']) {
            this.scale = this.scaleObj['992'];
            this.changeImgSize(992);
            this._setTrueIsScale(992);
        }
    },
    getScale: function () {
        return this.scale;
    },
    listenResize: function (e) {
        this.setScale(e.target.innerWidth);
        this.changePosition();
    },
    bindMethod: function () {
        window.addEventListener('resize', this.listenResize.bind(this));
    },
    init: function () {
        this.bindMethod();
        this.installSettings(this.window.width());
        this.setScale(this.window.width());
        this.changePosition();
    }
};

//наследование
SubScaleImg.prototype = Object.create(ScaleImg.prototype);
SubScaleImg.prototype.constructor = SubScaleImg;

//запускаем конструктор родителя
function SubScaleImg(option) {
    ScaleImg.apply(this, arguments);

    this.imgPosition = {
        top: this.img.position().top,
        left: this.img.position().left
    };
    this.wrapSize = {
        width: this.imgWrap.width(),
        height: this.imgWrap.height()
    }

}
SubScaleImg.prototype = {
    changePosition: function () {

    },
    setScale: function () {
        ScaleImg.prototype.setScale.apply(this, arguments);
    },
    changeImgSize: function (width) {
        var img = this.img,
            imgWidth = this.imgWidth,
            imgHeight = this.imgHeight,
            scale = this.scale;

        if (!this.isScale[width]) return;

        img.css({
            width: imgWidth * scale,
            height: imgHeight * scale
        });

    },
    installSettings: function () {
        ScaleImg.prototype.installSettings.apply(this, arguments);
    },
    _setTrueIsScale: function () {
        ScaleImg.prototype._setTrueIsScale.apply(this, arguments);
    },
    bindMethod: function () {
        ScaleImg.prototype.bindMethod.apply(this, arguments);
    },
    listenResize: function () {
        ScaleImg.prototype.listenResize.apply(this, arguments);
    },
    init: function () {
        //var window = this.window.width();
        console.log(this);
        ScaleImg.prototype.init.apply(this, arguments);
    }
};


$(document).ready(function () {
    var manImg = $('.main-img__img_type_man-grey').length > 0 ? $('.main-img__img_type_man-grey') : false,
        bgImg = $('.main-img__img_type_back').length > 0 ? $('.main-img__img_type_back') : false,
        imgWrap = $('.main-img').length > 0 ? $('.main-img') : false,
        body = $('body'),

        //images
        cs_go_img = $('.main-img__sub-img_type_cs-go'),
        dota_img = $('.main-img__sub-img_type_dota'),
        shield_img = $('.main-img__sub-img_type_shield'),
        auto_img = $('.main-img__sub-img_type_auto'),

        //init images
        man = new ScaleImg(manImg, 28, 10),
        bg = new ScaleImg(bgImg, 28, 10),

        csGoImg = new SubScaleImg(cs_go_img),
        dotaImg = new SubScaleImg(dota_img),
        shieldImg = new SubScaleImg(shield_img),
        autoImg = new SubScaleImg(auto_img),

        hoverLinks = $('.main-img__sub-img, .cases');

    //init main image class
    man.init();
    bg.init();

    csGoImg.init();
    dotaImg.init();
    shieldImg.init();
    autoImg.init();

    hoverLinks.hover(function(){
        $(this).closest('a').toggleClass('hover');
    });
});

function ScaleImg(option, offsetX, offsetY) {
    this.debug = true;

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

    this.koefForImg = {
        '1300': {'x': 0, 'y': 0},
        '1200': {'x': -5, 'y': 3},
        '992': {'x': -10, 'y': 3},
    };

    this.body = $('body');
    this.window = $(window);
    this.imgWrap = $('.main-img');
    this.subImgWrap = $('.main-img__wrapper');
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

        offset = ((bodyWidth - imgWidth) / 2) - this.offsetX;
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

        this.subImgWrap.css({
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
        var img = this.img,
            bodyWidth = this.body.width(),
            imgWidth = this.img.width(),
            w = this._returnWidthScale();

        offset = (bodyWidth - imgWidth) / 2 - this.offsetX * this.scale;

        img.css({
            left: offset + this.koefForImg[w]['x'],
            top: this.offsetY * this.scale + this.koefForImg[w]['y']
        });
    },
    setScale: function () {
        ScaleImg.prototype.setScale.apply(this, arguments);
    },
    changeImgSize: function (width) {
        var imgWrap = this.img,
            img = this.img.find('img').first(),
            imgWidth = this.imgWidth,
            imgHeight = this.imgHeight,
            scale = this.scale;

        if (!this.isScale[width]) return;

        imgWrap.css({
            width: imgWidth * scale,
            height: imgHeight * scale
        });

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
    _returnWidthScale: function () {
        return ScaleImg.prototype._returnWidthScale.apply(this, arguments);
    },
    bindMethod: function () {
        ScaleImg.prototype.bindMethod.apply(this, arguments);
    },
    listenResize: function () {
        ScaleImg.prototype.listenResize.apply(this, arguments);
    },
    init: function () {


        this.debug ? console.log(this) : '';
        ScaleImg.prototype.init.apply(this, arguments);
    }
};


$(document).ready(function () {
    if($('.page_type_main-img').length > 0){

    var manImg = $('.main-img__img_type_man-grey'),
        bgImg = $('.main-img__img_type_back').length,
        imgWrap = $('.main-img'),
        body = $('body'),

        //images
        cs_go_img = $('.main-img__link_type_cs-go'),
        dota_img = $('.main-img__link_type_dota'),
        shield_img = $('.main-img__link_type_shield'),
        auto_img = $('.main-img__link_type_auto'),

        //patter_img
        patter_img = $('.pattern'),

        //init images
        man = new ScaleImg(manImg, 28, 10),
        bg = new ScaleImg(bgImg, 28, 10),

        //sub images
        csGoImg = new SubScaleImg(cs_go_img, -408, 438),
        dotaImg = new SubScaleImg(dota_img, 278, 482),
        shieldImg = new SubScaleImg(shield_img, 144, 202),
        autoImg = new SubScaleImg(auto_img, -129, 137),

        //pattern
        patternImg = new SubScaleImg(patter_img, -160, 355),

        hoverLinks = $('.main-img__sub-img, .cases');

        //init main image
        man.init();
        bg.init();

        //init sub image
        csGoImg.init();
        dotaImg.init();
        shieldImg.init();
        autoImg.init();

        //init pattern
        patternImg.init();

        hoverLinks.hover(function () {
            $(this).closest('a').toggleClass('hover');
        });

        var animationArray = $('.main-img__sub-img_type_shield')
                .add('.main-img__sub-img_type_cs-go')
                .add('.main-img__sub-img_type_dota')
                .add('.main-img__sub-img_type_auto')
                .add('.main-img__img_type_man-grey'),
            delay = 1500;

        function animate(options) {

            var start = performance.now();

            requestAnimationFrame(function animate(time) {
                // timeFraction от 0 до 1
                var timeFraction = (time - start) / options.duration;
                if (timeFraction > 1) timeFraction = 1;

                // текущее состояние анимации
                var progress = options.timing(timeFraction)

                options.draw(progress);

                if (timeFraction < 1) {
                    requestAnimationFrame(animate);
                }

            });
        }

        var timerId = setTimeout(function tick() {
            startAnimation(animationArray, delay);
            timerId = setTimeout(tick, delay)
        }, delay);

        function startAnimation(animationArray, delay) {
            var element = animationArray.eq(Math.round(Math.random() * 4));

            if(element.closest('a').length > 0){
                element.closest('a').addClass('hover');
            }else{
                element.addClass('hover')
            }

            animate({
                duration: 1000,
                timing: function(timeFraction) {
                    return timeFraction;
                },
                draw: function(progress) {
                    if(progress == 1){
                        if(element.closest('a').length > 0){
                            element.closest('a').removeClass('hover')
                        }else{
                            element.removeClass('hover')
                        }
                    }
                }
            });
        }
    }


    $('.logo').on('click', function (e) {
        if (window.innerWidth < 768) {
            e.preventDefault();
            var mobileMenu = $('<div class="mobile-menu" id="mobile-menu"><i class="fa fa-close mobile-menu__close"></i></div>'),
                close = $('<i class="fa fa-close mobile-menu__close"></i>'),
                menu = $('.nav.navbar-nav').clone();

            mobileMenu.append(close, menu);
            $('body').append(mobileMenu);
            mobileMenu.toggle();

            close.on('click', function () {
                mobileMenu.remove();
            });

        }
    });

    if($("#slider").length > 0){
        $("#slider").ionRangeSlider({
            type: "double",
            min: 0,
            max: 10000,
            grid: true,
            grid_num: 10
        });
    }
});

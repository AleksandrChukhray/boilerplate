function ScaleImg(option){
    this.scale = 1;

    this.img = option;
    this.imgWidth = this.img.width();
    this.imgHeight = this.img.height();

    this.scaleObj = {
        '1300' : 1.0,
        '1200' : 0.8,
        '992' : 0.6,
    };

    this.isScale = {
        '1300' : true,
        '1200' : true,
        '992' : true,
    };

    this.body = $('body');
    this.window = $(window);
    this.imgWrap = $('.main-img');
}

ScaleImg.prototype = {
    _setTrueIsScale : function(width){
        for(var i in this.isScale){
            this.isScale[i] = true;

            if(width == i)
                this.isScale[i] = false
        }
    },
    _returnWidthScale: function(){
        for(var i in this.isScale){
            if(!this.isScale[i]){
                return i
            }
        }
    },
    changePosition: function(){
        var img = this.img,
            bodyWidth = this.body.width(),
            imgWidth = this.img.width();

        offset = (bodyWidth - imgWidth)/2;
        img.css({
            left : offset
        });
    },
    changeImgSize: function(width) {
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
            minHeight: imgHeight*scale
        });
    },
    installSettings: function(width){
      var width = width;

        if(width > 1200){
            this.scale = this.scaleObj['1300'];
        }else if(width < 1200 && width > 992){
            this.scale = this.scaleObj['1200'];
        }else if(width < 992 && this.isScale['992']){
            this.scale = this.scaleObj['992'];
        }
    },
    setScale : function(width){
        var width = width;

        if(width > 1200 && this.isScale['1300']){
            this.scale = this.scaleObj['1300'];
            this.changeImgSize(1300);
            this._setTrueIsScale(1300);
        }else if((width < 1200 && width > 992) && this.isScale['1200']){
            this.scale = this.scaleObj['1200'];
            this.changeImgSize(1200);
            this._setTrueIsScale(1200);
        }else if(width < 992 && this.isScale['992']){
            this.scale = this.scaleObj['992'];
            this.changeImgSize(992);
            this._setTrueIsScale(992);
        }
    },
    getScale : function(){
      return this.scale;
    },
    listenResize: function(e){
        this.setScale(e.target.innerWidth);
        this.changePosition();
    },
    bindMethod : function(){
        window.addEventListener('resize', this.listenResize.bind(this));
    },
    init: function(){
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
function SubScaleImg(option){
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
    changePosition: function(){
        // var img = this.img;
        //
        // offsetY = this.imgWrap.height() - this.wrapSize.height;
        // offsetX = this.imgWrap.width() - this.wrapSize.width;
        //
        // cssTop = parseInt(img.css('top').replace('px', ''));
        // cssLeft = parseInt(img.css('left').replace('px', ''));
        //
        // img.css({
        //     'top': cssTop + offsetY,
        //     'left': cssLeft + offsetX
        // });

        //ScaleImg.prototype.changePosition.apply(this, arguments);
    },
    setScale : function(){
        ScaleImg.prototype.setScale.apply(this, arguments);
    },
    changeImgSize: function(width){
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
    installSettings : function(){
        ScaleImg.prototype.installSettings.apply(this, arguments);
    },
    _setTrueIsScale: function(){
        ScaleImg.prototype._setTrueIsScale.apply(this, arguments);
    },
    bindMethod: function(){
        ScaleImg.prototype.bindMethod.apply(this, arguments);
    },
    listenResize: function(){
        ScaleImg.prototype.listenResize.apply(this, arguments);
    },
    init: function(){
        //var window = this.window.width();
        console.log(this);
        ScaleImg.prototype.init.apply(this, arguments);

        //this.changePosition();
    }
};


$(document).ready(function(){
   var img = $('.main-img__img').length > 0 ? $('.main-img__img') : false,
       imgWrap = $('.main-img').length > 0 ? $('.main-img') : false,
       body = $('body'),

       //images
       cs_go_img = $('.main-img__sub-img_type_cs-go'),
       dota_img = $('.main-img__sub-img_type_dota'),
       shield_img = $('.main-img__sub-img_type_shield'),
       auto_img = $('.main-img__sub-img_type_auto'),

       //init images
       mainImg = new ScaleImg(img),
       csGoImg = new SubScaleImg(cs_go_img),
       dotaImg = new SubScaleImg(dota_img),
       shieldImg = new SubScaleImg(shield_img),
       autoImg = new SubScaleImg(auto_img);

    //init main image class
    mainImg.init();

    csGoImg.init();
    dotaImg.init();
    shieldImg.init();
    autoImg.init();

});

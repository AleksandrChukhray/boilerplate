$(document).ready(function(){
   var img = $('.main-img__img').length > 0 ? $('.main-img__img') : false,
       imgWrap = $('.main-img').length > 0 ? $('.main-img') : false,
       body = $('body'),
       isScaled_1200 = false;

    $(window).resize(function(){
        changePosition();
        changeImgSize();
    });

    function changePosition (){
        if (!img) return;

        var bodyWidth = body.width(),
            imgWidth = img.width();
            offset = (bodyWidth - imgWidth)/2;

        img.css({
            left : offset
        });
    }
    changePosition();

    function changeImgSize(){
        if (!img) return;

        var bodyWidth = body.width(),
            imgWidth = img.width();
            imgHeight = img.height();
            scale = 0.8;

            if(bodyWidth < 1200 && !isScaled_1200){
                img.css({
                    width: imgWidth*scale,
                    height: imgHeight*scale
                });

                imgWrap.css({
                    minHeight: imgHeight*scale
                });

                isScaled_1200 = true
            }

        changePosition();
    }
    changeImgSize();

});

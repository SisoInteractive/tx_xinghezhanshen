// Created by sam mok 2015(Siso brand interactive team).

"use strict";

//  limit browser drag move
document.addEventListener('touchmove', function (e) {
    e.preventDefault();
},true);

var app = {
    preload: function () {
        var that = this;

        var imgArr = document.getElementsByTagName('img');
        var imgAmounts = 0;
        var loadedAmounts = 0;
        var isLoaded = false;

        //  get img amounts
        for (var i = 0; i < imgArr.length; i++) {
            if (imgArr[i].hasAttribute('lazy-src')) {
                imgAmounts++;
            }
        }

        //  load each img
        for (var i = 0; i < imgArr.length; i++) {
            var curImg = imgArr[i];

            if (curImg.hasAttribute('lazy-src')) {
                var img = new Image();
                img.src = curImg.getAttribute('lazy-src');
                img.index = i;

                img.onload = function () {
                    loadedAmounts++;
                    imgArr[this.index].src = this.src;
                    /* check img load progress */
                    if (checkIsAllMainImagesLoaded() && isLoaded == false) {
                        goMainProcess();
                    }
                };

                img.onerror = function (error) {
                    imgAmounts -= 1;

                    /* check img load progress */
                    if (checkIsAllMainImagesLoaded() && isLoaded == false) {
                        goMainProcess();
                    }
                };
            }
        }

        //  dot animation
        var dotAmount = 0;
        var dot = ['', '.', '..', '...'];

        var dotAnimation = setInterval(function () {
            $('.loading .dot').text(dot[dotAmount]);
            (dotAmount + 1) > 3 ? dotAmount = 0 : dotAmount++;
        }, 500);

        function checkIsAllMainImagesLoaded () {
            if (isLoaded == false) {
                var loadedRate = 0.80;
                return loadedAmounts / imgAmounts >= loadedRate;
            }
        }

        function goMainProcess () {
            clearInterval(dotAnimation);
            app.start();

            setTimeout(function () {
                $('.loading').addClass('leave');

                setTimeout(function () {
                    $('.loading').addClass('leaved');
                    $('.scene').addClass('loaded');
                }, 1200);
            }, 1500);
        }
    },


    create: function (){
        app.mySwiper = new Swiper ('.swiper-container', {
            direction: 'vertical',

            // init
            onInit: function () {
            },

            onTransitionStart: function (swiper) {
            },

            onTransitionEnd: function (swiper) {
            }
        });

        app.mySwiper.lockSwipes();

        //  play video when click play button
        $('.scene .triangle').each(function (index) {
            var that = $(this);
            var scene = that.parents('.scene');
            var video = scene.find('video');

            ////  remove video controls
            //if (video[0].hasAttribute("controls")) {
            //    video[0].removeAttribute("controls")
            //} else {
            //    video[0].setAttribute("controls","controls")
            //}

            var canPlay = true;

            //  bind play video
            that.on('touchend', function () {
                if (canPlay == true) {
                    var scene = that.parents('.scene');
                    scene.addClass('active');
                    $('.bottom').removeClass('bottom01 bottom02 bottom03').addClass('bottom0' + (index+1));

                    //  delay play not working on android, must manual control
                    setTimeout(function () {
                        scene.addClass('played');
                        $('.bottom').addClass('played');

                        scene.find('video')[0].play();
                    }, 1100);

                    canPlay = false;
                }
            });

            //  when play end, checkout to next scene
            video.on('ended', videoPlayEndHandler);

            function videoPlayEndHandler () {
                var scene = that.parents('.scene');
                var video = scene.find('video');
                var videoTemp = video[0].outerHTML;

                //  remove video target
                video.remove();

                //  jump to next scene, restore video target
                setTimeout(function () {
                    scene.removeClass('active played').addClass('leave');
                    $('.bottom').removeClass('played');

                    setTimeout(function () {
                        app.mySwiper.unlockSwipes();
                        app.mySwiper.slideTo(index+1, 1000, false);
                        app.mySwiper.lockSwipes();

                        if (index == 2) { $('.bottom').fadeOut(); }

                        setTimeout(function () {
                            canPlay = true;
                            scene.find('main').append($(videoTemp));

                            //  bind play end hanler again
                            that.parents('.scene').find('video').on('ended', videoPlayEndHandler);

                        }, 1100);
                    }, 2300);
                }, 400);
            }
        });
    },

    start: function (){
        this.create();
    }
};

$(function (){
    // init app
    app.preload();
    app.start();
    console.log('app started success...');

    //setTimeout(function () {
    //    $('.scene01').addClass('active');
    //    setTimeout(function () {
    //        $('.scene01').addClass('played');
    //    }, 1300);
    //}, 2500);
});
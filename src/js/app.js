"use strict";


$(function () {


    // detect webP support
    function testWebP(callback) {
        let webP = new Image();
        webP.onload = webP.onerror = function () {
            callback(webP.height == 2);
        };
        webP.src =
            "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }

    testWebP(function (support) {
        if (support == true) {
            $("body").addClass("webp");
        } else {
            $("body").addClass("no-webp");
        }
    });

    const isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (
                isMobile.Android() ||
                isMobile.BlackBerry() ||
                isMobile.iOS() ||
                isMobile.Opera() ||
                isMobile.Windows()
            );
        },
    };

    function getNavigator() {
        if (isMobile.any() || window.innerWidth < 992) {
            $("body").removeClass("_pc").addClass("_touch");
        } else {
            $("body").removeClass("_touch").addClass("_pc");
        }
    }

    getNavigator();

    $(window).on("resize", () => getNavigator());


    // click handler
    $(document).on('click', function (e) {

        let $target = $(e.target);


        // menu
        if ($target.hasClass('icon-menu')) {
            $(".header").toggleClass("open-menu");
            $("body").toggleClass("lock-menu");
        }

        if ($target.is('.menu')) {
            $(".header").removeClass("open-menu");
            $("body").removeClass("lock-menu");
        }

        // submenu
        if ($target.is('.menu__link') && $('body').hasClass('_touch')) {

            let $submenu = $target.next('.submenu');
            if ($submenu.length > 0) {
                e.preventDefault();
            }

            if ($target.hasClass('open-submenu')) {

                $target.removeClass('open-submenu');
                $submenu.removeClass('active');

            } else {

                $('.menu__link').removeClass('open-submenu');
                $('.submenu').removeClass('active');

                $target.addClass('open-submenu');
                $submenu.addClass('active');
            }
        }

        if ($('.submenu').hasClass('active') && !$target[0].closest('.menu')) {

            $('.submenu').removeClass('active').prev('.menu__link').removeClass('open-submenu');
        }

        // popup forms
        if ($target.closest('.popup__btn').length && !$target.closest('.popup__btn').is('a')) {

            $('.popup__back').removeClass('hidden');
            $('.popup__main').addClass('hidden');
            $('.popup__form').eq($target.closest('.popup__list-item').index()).addClass('active');
        }

        if ($target.is('.popup__back')) {
            $('.popup__back').addClass('hidden');
            $('.popup__main').removeClass('hidden');
            $('.popup__form').removeClass('active');
        }

        if ($target[0].closest('.gallery')) {
            if ($target.is('.gallery__prev') || $target.is('.gallery__next')) return;
            let galleryWrapper = $target.closest('.gallery');
            let gallerySlider = galleryWrapper.find('.gallery__items').slick('getSlick');
            gallerySlider.next()


        }

    });


    // fancybox settings

    $('[data-fancybox]').fancybox({
        touch: false,
        beforeShow: function (instance, current) {
            $('.popup__form').removeClass('active');
            var currentId = current.opts.$orig.data('current');
            if (currentId) {
                $('#' + currentId).addClass('active');
                $('.popup__back').removeClass('hidden');
                $('.popup__main').addClass('hidden');
            }
        },
        afterClose: function (instance, current) {
            $('.popup__back').addClass('hidden');
            $('.popup__main').removeClass('hidden');
            $('.popup__form').removeClass('active');
        },

    });


    // sliders

    if ($('.gallery__items').length > 0) {
        $('.gallery__items').slick({
            infinite: true,
            slidesToShow: 1,
            prevArrow: '.gallery__prev',
            nextArrow: '.gallery__next',
            fade: true,
        });
    }

    if ($('.works__slider').length > 0) {
        $('.works__slider').slick({
            infinite: true,
            slidesToShow: 2,
            arrows: false,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        centerMode: true,
                        centerPadding: '20px',
                    }
                }
            ]
        });
    }



    // header height

    getHeaderHeight();

    function getHeaderHeight() {
        const headerHeight = $('.header').outerHeight();
        $("body").css('--header-height', headerHeight + "px");
        return headerHeight;
    }

    window.addEventListener('resize', () => getHeaderHeight());



    // inputmask
    const phoneMask = "+7 (999) 999-99-99";

    $('input[type="tel"]').each(function () {
        $(this).inputmask({
            mask: phoneMask,
            showMaskOnHover: false,
            clearIncomplete: true,
        });
    });




    // animation

    gsap.registerPlugin(ScrollTrigger);

    // hero block parallax

    if ($('.hero__image').length > 0) {

        gsap.to('.hero__image img', {
            y: "-15%",
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: `${-1 * getHeaderHeight()}px top`,
                end: 'bottom top',
                scrub: true
            },
        });
    }


    // video block

    if ($('.idea').length > 0) {
        gsap.to('.idea__video', {
            maxWidth: "100vw",
            ease: 'none',
            scrollTrigger: {
                trigger: '.idea__video',
                start: 'top bottom',
                end: `bottom top`,
                scrub: true,
            }
        });
    }


    // cursor animation
    if ($('.video-block').length > 0) {
        $('.video-block').each(function () {
            const $videoBlock = $(this);
            const $customCursor = $videoBlock.find('.video-block__cursor');

            $videoBlock.css('cursor', 'none');

            $videoBlock.on('mousemove', function (e) {
                const offset = $videoBlock.offset();
                const x = e.pageX - offset.left;
                const y = e.pageY - offset.top;

                $customCursor.css({
                    top: `${y}px`,
                    left: `${x}px`,
                    position: 'absolute',
                    transform: 'translate(-50%, -50%)',
                });
            });

            $videoBlock.on('mouseenter', function () {
                $customCursor.show();
            });

            $videoBlock.on('mouseleave', function () {
                $customCursor.hide();
            });
        });
    }


    // project block parallax
    if ($('.project__image').length > 0) {

        gsap.to('.project__image img', {
            y: "-20%",
            ease: 'none',
            scrollTrigger: {
                trigger: '.project',
                start: `${-1 * getHeaderHeight()}px top`,
                end: 'bottom top',
                scrub: true,
            },
        });
    }

    if ($('.video__block').length > 0) {

        gsap.to('.video__block img', {
            y: "-20%",
            ease: 'none',
            scrollTrigger: {
                trigger: '.video',
                start: `${-1 * getHeaderHeight()}px top`,
                end: 'bottom top',
                scrub: true,
            },
        });
    }


    // parallax images
    const $images = $('[data-parallax]');

    if ($images.length > 0) {
        $images.each(function () {
            const $image = $(this);
            const yOffset = $image.data('parallax') || "-15";

            gsap.to($image[0], {
                y: `${yOffset}vh`,
                ease: "none",
                scrollTrigger: {
                    trigger: $image[0],
                    start: `top bottom`,
                    end: `+200% bottom`,
                    scrub: true,
                },
            });
        });
    }





});

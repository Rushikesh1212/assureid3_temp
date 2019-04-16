(function ($) {
	'use strict';

    $('.nav-link').on('click', function () {
        $('.navbar-collapse').collapse('hide');
    });

	function a(e) {
		k.removeClass("active"), e.addClass("active")
	}
	var b = $(".owl-features"),
		k = $(".feature-link");
	b.owlCarousel({
			loop: !0,
			responsiveClass: !0,
			margin: 20,
			autoplay: !0,
			items: 1,
			nav: !1,
			dots: !1,
			animateOut: "bounceOutRight",
			animateIn: "bounceInLeft"
		}),
		b.on("changed.owl.carousel", function (e) {
			var o = e.item.index + 1 - e.relatedTarget._clones.length / 2,
				n = e.item.count;
			(o > n || 0 == o) && (o = n - o % n), o--;
			var t = $(".feature-link:nth(" + o + ")");
			a(t)
		}),
		k.on("click", function () {
			var e = $(this).data("owl-item");
			b.trigger("to.owl.carousel", e), a($(this))
		});

	$(".welcome_slides").owlCarousel({
		loop: !0,
		responsiveClass: !0,
		items: 1,
		nav: !1,
		dots: !0,
		autoplay: !0,
		margin: 20,
		animateOut: "bounceOutRight",
		animateIn: "bounceInLeft"
	});

	$(".owl-news, .owl-teams").owlCarousel({
		loop: !0,
		responsiveClass: !0,
		dots: !0,
		margin: 20,
		nav: !1,
		stagePadding: 10,
		responsive: {
			0: {
				items: 1,
				margin: 300
			},
			500: {
				items: 2
			},
			992: {
				items: 3
			}
		}
	});

	$(".app_screenshots_slides").owlCarousel({
		items: 1,
		loop: true,
		autoplay: true,
		smartSpeed: 800,
		margin: 30,
		center: true,
		dots: true,
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 3
			},
			992: {
				items: 5
			}
		}
	});

	// venobox
	$('.venobox_video').venobox({
		autoplay: true,
	});

	// :: 2.0 Slick Active Code
	$('.slider-for').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		speed: 500,
		arrows: false,
		fade: true,
		asNavFor: '.slider-nav'
	});

	$('.slider-nav').slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		speed: 500,
		asNavFor: '.slider-for',
		dots: true,
		centerMode: true,
		focusOnSelect: true,
		slide: 'div',
		autoplay: true,
		centerMode: true,
		centerPadding: '30px',
		mobileFirst: true,
		prevArrow: '<i class="fa fa-angle-left"></i>',
		nextArrow: '<i class="fa fa-angle-right"></i>'
	});

	// :: 3.0 Footer Reveal Active Code
	if ($.fn.footerReveal) {
		$('footer').footerReveal({
			shadow: true,
			shadowOpacity: 0.3,
			zIndex: -101
		});
	}

	// :: 4.0 ScrollUp Active Code
	if ($.fn.scrollUp) {
		$.scrollUp({
			scrollSpeed: 1500,
			scrollText: '<i class="fa fa-chevron-up" aria-hidden="true"></i>'
		});
	}

	// :: 5.0 CounterUp Active Code
	if ($.fn.counterUp) {
		$('.counter').counterUp({
			delay: 10,
			time: 2000
		});
	}

	// :: 6.0 onePageNav Active Code
	if ($.fn.onePageNav) {
		$('#nav').onePageNav({
			currentClass: 'active',
			scrollSpeed: 2000,
			easing: 'easeOutQuad',			
			scrollOffset: 0,
			scrollThreshold: 0.2
		});
	}

	$(window).on('scroll', function (event) {
		if ($(window).scrollTop()) {
			$('.header_area').addClass('sticky');
		} else {
			$('.header_area').removeClass('sticky');
		}
	});


	// Create the carousel.
	$('.kc-wrap').KillerCarousel({
		width: 460,
		spacing3d: 60,
		spacing2d: 120,
		showReflection: true,
		infiniteLoop: true,
		autoScale: 100
	});
    //wow js
    var wow = new WOW(
        {
            boxClass:     'wow',      // animated element css class (default is wow)
            animateClass: 'animated', // animation css class (default is animated)
            offset:       0,          // distance to the element when triggering the animation (default is 0)
            mobile:       true,       // trigger animations on mobile devices (default is true)
            live:         true,       // act on asynchronously loaded content (default is true)
            callback:     function(box) {
                // the callback is fired every time an animation is started
                // the argument that is passed in is the DOM node being animated
            },
            scrollContainer: null,    // optional scroll container selector, otherwise use window,
            resetAnimation: true,     // reset animation on end (default is true)
        }
    );
    wow.init();

    var blog_modal = $('#blogModal');
    blog_modal.on('show.bs.modal', function () {
        $(this).find('.modal-dialog').attr('class', 'modal-dialog  ' + 'fadeIn' + '  animated');
    });
    blog_modal.on('hide.bs.modal', function () {
        $(this).find('.modal-dialog').attr('class', 'modal-dialog  ' + 'fadeOut' + '  animated');
    });
    var wHeight = $(window).height();
    var slide = $('.slide-fullscreen');
    slide.height(wHeight);
    $(window).on('resize', function () {
        wHeight = $(window).height();
        slide.height(wHeight);
    });


})(jQuery);

/*

Designer: Mamunur Rashid
Website: http://developermamun.com
Email: developermamunurrashid@gmail.com

*/

/*
 * Photo Gallery Component for MkDocs Material
 * Auto-initializes Swiper (Cards) + LightGallery from .photo-gallery elements
 *
 * Usage in Markdown:
 *   <div class="photo-gallery">
 *     <img src="/path/to/1.jpg" alt="Photo caption">
 *     <img src="/path/to/2.jpg" alt="Photo caption">
 *   </div>
 *
 * Optional data attributes:
 *   data-effect="cards"        Swiper effect (cards | coverflow | slide)
 *   data-autoplay="3000"       Autoplay delay in ms (false to disable)
 *   data-height="500"          Fixed height in px
 */

(function () {
    'use strict';

    /**
     * Initialize a single photo gallery
     */
    function initGallery(container) {
        const images = container.querySelectorAll('img');
        if (images.length === 0) return;

        // Build slides HTML for Swiper
        const slides = Array.from(images).map(function (img, i) {
            var src = img.getAttribute('src');
            var alt = img.getAttribute('alt') || '';
            return '<div class="swiper-slide" data-src="' + src + '" data-sub-html="' + escapeHtml(alt) + '">'
                + '<img src="' + src + '" alt="' + escapeAttr(alt) + '">'
                + '</div>';
        });

        // Read config from data attributes
        var effect = container.getAttribute('data-effect') || 'cards';
        var autoplayDelay = container.getAttribute('data-autoplay');
        var fixedHeight = container.getAttribute('data-height');

        // Create Swiper structure
        var html = '<div class="swiper"><div class="swiper-wrapper">'
            + slides.join('')
            + '</div>'
            + '<div class="swiper-button-prev"></div>'
            + '<div class="swiper-button-next"></div>'
            + '<div class="swiper-pagination"></div>'
            + '</div>'
            + '<div class="gallery-caption"></div>'
            + '<div class="gallery-counter"></div>';

        container.innerHTML = html;

        var swiperEl = container.querySelector('.swiper');
        var captionEl = container.querySelector('.gallery-caption');
        var counterEl = container.querySelector('.gallery-counter');

        // Swiper config
        var swiperConfig = {
            effect: effect,
            loop: images.length > 2,
            speed: 500,
            touchRatio: 0.4,
            threshold: 10,
            navigation: {
                nextEl: container.querySelector('.swiper-button-next'),
                prevEl: container.querySelector('.swiper-button-prev'),
            },
            pagination: {
                el: container.querySelector('.swiper-pagination'),
                clickable: true,
                dynamicBullets: images.length > 6,
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
            grabCursor: true,
            watchSlidesProgress: true,
            on: {
                init: function () {
                    updateCaptionAndCounter(this, images, captionEl, counterEl);
                },
                slideChange: function () {
                    updateCaptionAndCounter(this, images, captionEl, counterEl);
                },
            },
        };

        // Cards effect specific config
        if (effect === 'cards') {
            swiperConfig.cardsEffect = {
                perSlideOffset: 6,
                perSlideRotate: 4,
                rotate: true,
                slideShadows: true,
            };
        }

        // Fixed height
        if (fixedHeight) {
            swiperEl.style.height = fixedHeight + 'px';
        }

        // Autoplay (disabled by default for photo galleries)
        if (autoplayDelay && autoplayDelay !== 'false') {
            swiperConfig.autoplay = {
                delay: parseInt(autoplayDelay, 10) || 3000,
                disableOnInteraction: true,
            };
        }

        // Initialize Swiper
        var swiper = new Swiper(swiperEl, swiperConfig);

        // Initialize LightGallery: click to open fullscreen
        var lgImages = Array.from(images).map(function (img) {
            return {
                src: img.getAttribute('src'),
                subHtml: img.getAttribute('alt') || '',
            };
        });

        // Bind click on slides
        var slideEls = container.querySelectorAll('.swiper-slide');
        slideEls.forEach(function (slide, index) {
            slide.addEventListener('click', function () {
                // Create dynamic LightGallery instance
                var dynamicEl = document.createElement('div');
                dynamicEl.style.display = 'none';
                document.body.appendChild(dynamicEl);

                var items = lgImages.map(function (item) {
                    return '<a href="' + item.src + '" data-sub-html="' + escapeHtml(item.subHtml) + '">'
                        + '<img src="' + item.src + '" />'
                        + '</a>';
                });
                dynamicEl.innerHTML = items.join('');

                lightGallery(dynamicEl, {
                    dynamic: false,
                    download: false,
                    startAnimationDuration: 300,
                    index: index,
                    plugins: [lgZoom, lgThumbnail, lgFullscreen, lgAutoplay, lgPager],
                    mobileSettings: {
                        showCloseIcon: true,
                        controls: true,
                    },
                });

                // Trigger click on the correct item, then clean up
                setTimeout(function () {
                    dynamicEl.querySelectorAll('a')[index].click();
                }, 100);

                // Cleanup after close
                dynamicEl.addEventListener('lgAfterClose', function () {
                    setTimeout(function () {
                        if (dynamicEl.parentNode) {
                            dynamicEl.parentNode.removeChild(dynamicEl);
                        }
                    }, 300);
                });
            });
        });
    }

    /**
     * Update caption and counter display
     */
    function updateCaptionAndCounter(swiper, images, captionEl, counterEl) {
        var realIndex = swiper.realIndex;
        if (realIndex >= 0 && realIndex < images.length) {
            var alt = images[realIndex].getAttribute('alt') || '';
            captionEl.textContent = alt;
            counterEl.textContent = (realIndex + 1) + ' / ' + images.length;
        }
    }

    /**
     * Escape HTML for safe insertion
     */
    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    /**
     * Escape attribute value
     */
    function escapeAttr(str) {
        return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    /**
     * Initialize all galleries on the page
     */
    function initAllGalleries() {
        var galleries = document.querySelectorAll('.photo-gallery');
        galleries.forEach(function (gallery) {
            initGallery(gallery);
        });
    }

    // Auto-init: wait for DOM + external scripts (Swiper, LightGallery)
    function waitForDeps(callback, retries) {
        retries = retries || 0;
        if (typeof Swiper !== 'undefined' && typeof lightGallery !== 'undefined') {
            callback();
        } else if (retries < 50) {
            setTimeout(function () {
                waitForDeps(callback, retries + 1);
            }, 200);
        } else {
            console.warn('[Gallery] Swiper or LightGallery not loaded after 10s. Giving up.');
        }
    }

    // Also support MkDocs Material instant loading (page transitions)
    if (document.querySelector('.photo-gallery')) {
        waitForDeps(initAllGalleries);
    }

    // Re-init on MkDocs Material page transitions
    document.addEventListener('DOMContentLoaded', function () {
        if (document.querySelector('.photo-gallery')) {
            waitForDeps(initAllGalleries);
        }
    });

    // Listen for Material for MkDocs instant navigation
    if (typeof document$ !== 'undefined') {
        document$.subscribe(function () {
            // Small delay to let DOM settle after navigation
            setTimeout(function () {
                if (document.querySelector('.photo-gallery')) {
                    waitForDeps(initAllGalleries);
                }
            }, 150);
        });
    }

})();

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

        // Create structure: arrows + pagination in a single control bar
        var html = '<div class="swiper"><div class="swiper-wrapper">'
            + slides.join('')
            + '</div>'
            + '</div>'
            + '<div class="gallery-controls">'
            + '<button class="gallery-arrow gallery-arrow-prev" type="button" aria-label="上一张">&lsaquo;</button>'
            + '<div class="swiper-pagination"></div>'
            + '<button class="gallery-arrow gallery-arrow-next" type="button" aria-label="下一张">&rsaquo;</button>'
            + '</div>'
            + '<div class="gallery-counter"></div>'
            + '<div class="gallery-caption"></div>';

        container.innerHTML = html;

        var swiperEl = container.querySelector('.swiper');
        var prevBtn = container.querySelector('.gallery-arrow-prev');
        var nextBtn = container.querySelector('.gallery-arrow-next');
        var captionEl = container.querySelector('.gallery-caption');
        var counterEl = container.querySelector('.gallery-counter');

        // Swiper config — NO loop with cards (loop causes visual glitches + index mismatch)
        var swiperConfig = {
            effect: effect,
            loop: false,
            speed: 400,
            touchRatio: 0.45,
            threshold: 10,
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

        // Cards effect: wider offset for more visible stacking
        if (effect === 'cards') {
            swiperConfig.cardsEffect = {
                perSlideOffset: 12,
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

        // Custom arrows — bypass Swiper navigation (unreliable with Cards effect)
        prevBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (!swiper.isBeginning) swiper.slidePrev();
            else swiper.slideTo(images.length - 1);
        });
        nextBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (!swiper.isEnd) swiper.slideNext();
            else swiper.slideTo(0);
        });

        // Initialize LightGallery: click to open fullscreen
        var lgImages = Array.from(images).map(function (img) {
            return {
                src: img.getAttribute('src'),
                subHtml: img.getAttribute('alt') || '',
            };
        });

        // Bind click on slides — use data-src to match correct image
        var slideEls = container.querySelectorAll('.swiper-slide');
        slideEls.forEach(function (slide) {
            slide.addEventListener('click', function () {
                var src = slide.getAttribute('data-src');
                // Find matching index in lgImages
                var realIndex = 0;
                for (var i = 0; i < lgImages.length; i++) {
                    if (lgImages[i].src === src) { realIndex = i; break; }
                }
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
                    index: realIndex,
                    plugins: [lgZoom, lgThumbnail, lgFullscreen, lgAutoplay, lgPager],
                    mobileSettings: {
                        showCloseIcon: true,
                        controls: true,
                    },
                });

                // Trigger click on the correct item, then clean up
                setTimeout(function () {
                    dynamicEl.querySelectorAll('a')[realIndex].click();
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

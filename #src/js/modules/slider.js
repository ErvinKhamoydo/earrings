const sliders = (slides, prev, next, navSlides) => {
    let slideIndex = 1;
    let paused = false;

    const items = document.querySelectorAll(slides);
    const navSlide = document.querySelectorAll(navSlides);

    function showSlides(n) {
        if (n > items.length) {
            slideIndex = 1;
        }

        if (n < 1) {
            slideIndex = items.length;
        }

        items.forEach(item => {
            item.classList.add('animated');
            item.style.display = 'none';
        });

        items[slideIndex - 1].style.display = 'block';
        navSlide[slideIndex - 1].classList.add('navslides__active');
    }

    showSlides(slideIndex);

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    try {
        const prevBtn = document.querySelector(prev);
        const nextBtn = document.querySelector(next);

        prevBtn.addEventListener('click', () => {
            plusSlides(-1);
            items[slideIndex - 1].classList.remove('slideInLeft');
            items[slideIndex - 1].classList.add('slideInRight');

            navSlide.forEach(item => {
                item.classList.remove('navslides__active');
            })
            navSlide[slideIndex - 1].classList.add('navslides__active');
        });

        nextBtn.addEventListener('click', () => {
            plusSlides(1);
            items[slideIndex - 1].classList.add('slideInLeft');
            items[slideIndex - 1].classList.remove('slideInRight');

            navSlide.forEach(item => {
                item.classList.remove('navslides__active');
            })
            navSlide[slideIndex - 1].classList.add('navslides__active');
        });

        navSlide.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                console.log(e.target);
                console.log(index);

                if (e.target.tagName == 'IMG') {
                    navSlide.forEach(item => {
                        item.classList.remove('navslides__active');
                    })
                    e.target.parentNode.parentNode.classList.add('navslides__active');

                    slideIndex = index + 1;
                    showSlides(slideIndex);
                }

            });
        })
    } catch (error) {}
};

export default sliders;
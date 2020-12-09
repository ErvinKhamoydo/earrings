import TestWebP from "./modules/testWebp";
import sliders from "./modules/slider";
import timer from "./modules/timer";

window.addEventListener('DOMContentLoaded', () => {
    TestWebP(function (support) {
        if (support == true) {
            document.querySelector('body').classList.add('webp');
        } else {
            document.querySelector('body').classList.add('no-webp');
        }
    });

    sliders('.main-home-slider-body-slides-item', '.slider-body-btns-item-prev', '.slider-body-btns-item-next', '.slider-body-navslides-item');

    timer('.main-home-info-timer-wrapper-timer', '2020-12-31');
});
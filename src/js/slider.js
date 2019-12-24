const slider = () => {
  const setPaginationButtonsState = swiper => {
    swiper.isBeginning
      ? backElement.classList.add(`reviews__back--disable`)
      : backElement.classList.remove(`reviews__back--disable`);

    swiper.isEnd
      ? nextElement.classList.add(`reviews__forward--disable`)
      : nextElement.classList.remove(`reviews__forward--disable`);
  };

  const swiper = new Swiper(".swiper-container", {
    autoHeight: true,
    watchOverflow: true,
    grabCursor: true,
    navigation: {
      prevEl: ".reviews__back",
      nextEl: ".reviews__forward"
    }
  });

  const reviewsElement = document.querySelector(`.reviews`);
  if (!reviewsElement) {
    return;
  }
  const backElement = reviewsElement.querySelector(`.reviews__back`);
  const nextElement = reviewsElement.querySelector(`.reviews__forward`);

  setPaginationButtonsState(swiper);

  swiper.on(`slideChange`, () => {
    setPaginationButtonsState(swiper);
  });
};

export default slider;

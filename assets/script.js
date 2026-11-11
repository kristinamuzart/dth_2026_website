// here we state global variables

const articles = Array.from(document.getElementsByClassName("carouselArt"));
const btnLeft = document.getElementById("carouselBtnLeft");
const btnRight = document.getElementById("carouselBtnRight");

let artInFocus;

articles.forEach((art) => {
  if (!art.classList.contains("outOfFocusArt")) {
    return (artInFocus = art.dataset.artid);
  }
});


const featureArt = (i) => {
  articles.forEach((art) => {
    if (art.dataset.artid == i) {
      art.classList.remove("outOfFocusArt");
      art.classList.add("inFocusArt");
    } else {
      art.classList.add("outOfFocusArt");
      art.classList.remove("inFocusArt");
    }
  });

  // Move the selected article to the center
  const carousel = document.getElementById("carouselMain");
  const selectedIndex = articles.findIndex(
    (art) => art.dataset.artid == i
  );

  const leftArticle = articles[(selectedIndex + 2) % 3];
  const centerArticle = articles[selectedIndex];
  const rightArticle = articles[(selectedIndex + 1) % 3];

    carousel.append(leftArticle, centerArticle, rightArticle);
};


const moveCarousel = (e, direction) => {
  const currentIndex = articles.findIndex(
    (art) => art.dataset.artid == artInFocus
  );

  if (currentIndex === -1) return;

  let nextIndex;

  if (direction === "next") {
    nextIndex = (currentIndex + 1) % articles.length;
  } else {
    nextIndex = (currentIndex - 1 + articles.length) % articles.length;
  }

  artInFocus = articles[nextIndex].dataset.artid;
  featureArt(artInFocus);
};
if (btnLeft && btnRight) {
  btnLeft.addEventListener("click", (e) => moveCarousel(e, "prev"));
  btnRight.addEventListener("click", (e) => moveCarousel(e, "next"));
}

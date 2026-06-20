const images = [
  'alice.png', 'bg.png', 'byog_bg.png', 'cave_sunset.png',
  'doraemon.png', 'mypage_bg.png', 'su.png', 'time_rate.png',
  'time_rate_gemini.png'
];

const gallery = document.getElementById('gallery');
let currentIndex = 0;
let isAnimating = false;
let touchStartX = 0;
let touchStartY = 0;

images.forEach(src => {
  const slide = document.createElement('div');
  slide.className = 'slide';
  const img = document.createElement('img');
  img.src = 'images/' + src;
  img.alt = src.replace(/\.\w+$/, '');
  img.draggable = false;
  slide.appendChild(img);
  gallery.appendChild(slide);
});

const slides = gallery.querySelectorAll('.slide');
slides[0].classList.add('active');
slides[0].style.opacity = '1';

function isHorizontal() {
  return window.innerWidth >= 1024 && window.innerHeight < window.innerWidth;
}

function goTo(index) {
  if (isAnimating) return;
  if (index < 0 || index >= slides.length || index === currentIndex) return;
  isAnimating = true;

  var direction = index > currentIndex ? 1 : -1;
  var current = slides[currentIndex];
  var target = slides[index];
  var horizontal = isHorizontal();
  var axis = horizontal ? 'X' : 'Y';

  var enterOffset = (direction * 100) + '%';
  var exitOffset = (-direction * 100) + '%';

  target.style.transition = 'none';
  target.style.transform = axis === 'X' ? 'translateX(' + enterOffset + ')' : 'translateY(' + enterOffset + ')';
  target.style.opacity = '0';
  target.classList.add('active');

  void target.offsetWidth;

  current.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
  current.style.transform = axis === 'X' ? 'translateX(' + exitOffset + ')' : 'translateY(' + exitOffset + ')';
  current.style.opacity = '0';

  target.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
  target.style.transform = 'translate(0, 0)';
  target.style.opacity = '1';

  function onDone() {
    current.classList.remove('active');
    current.style.transition = 'none';
    current.style.transform = '';
    current.style.opacity = '0';

    currentIndex = index;
    isAnimating = false;
  }

  setTimeout(onDone, 500);
}

gallery.addEventListener('click', function (e) {
  if (!isHorizontal()) return;
  var rect = gallery.getBoundingClientRect();
  var x = e.clientX - rect.left;
  goTo(currentIndex + (x > rect.width / 2 ? 1 : -1));
});

gallery.addEventListener('touchstart', function (e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

gallery.addEventListener('touchend', function (e) {
  var dx = e.changedTouches[0].clientX - touchStartX;
  var dy = e.changedTouches[0].clientY - touchStartY;
  var horizontal = isHorizontal();
  var threshold = 50;

  if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;

  if (horizontal && Math.abs(dx) > Math.abs(dy)) {
    goTo(currentIndex + (dx < 0 ? 1 : -1));
  } else if (!horizontal && Math.abs(dy) > Math.abs(dx)) {
    goTo(currentIndex + (dy < 0 ? 1 : -1));
  }
}, { passive: true });

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    goTo(currentIndex + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    goTo(currentIndex - 1);
  }
});

/**
 * UMBRA-GRID.BLOG - CORE SCRIPT 2026
 * Содержит: Three.js, Mobile Menu, Scroll Reveal, Accordion, Contact Form, Cookies
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Инициализация иконок Lucide
  if (window.lucide) lucide.createIcons();

  // 2. Мобильное меню
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  const body = document.body;

  if (menuToggle) {
      menuToggle.addEventListener('click', () => {
          nav.classList.toggle('active');
          body.classList.toggle('body-lock');

          // Смена иконки
          const icon = menuToggle.querySelector('i');
          if (nav.classList.contains('active')) {
              icon.setAttribute('data-lucide', 'x');
          } else {
              icon.setAttribute('data-lucide', 'menu');
          }
          lucide.createIcons();
      });
  }

  // Закрытие меню при клике на ссылку
  document.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
          nav.classList.remove('active');
          body.classList.remove('body-lock');
          const icon = menuToggle.querySelector('i');
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
      });
  });

  // 3. Эффект скролла хедера
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
          header.classList.add('header--scrolled');
      } else {
          header.classList.remove('header--scrolled');
      }
  });

  // 4. Intersection Observer (Scroll Reveal)
  const observerOptions = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('active');
          }
      });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // 5. Аккордеон (Инновации)
  const accordionItems = document.querySelectorAll('.accordion__item');
  accordionItems.forEach(item => {
      const headerBtn = item.querySelector('.accordion__header');
      const content = item.querySelector('.accordion__content');

      headerBtn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');

          // Сброс остальных
          accordionItems.forEach(i => {
              i.classList.remove('active');
              i.querySelector('.accordion__content').style.maxHeight = null;
          });

          if (!isActive) {
              item.classList.add('active');
              content.style.maxHeight = content.scrollHeight + "px";
          }
      });
  });

  // 6. Форма контактов
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
      // Генерация капчи
      const captchaLabel = document.getElementById('captchaQuestion');
      const n1 = Math.floor(Math.random() * 10) + 1;
      const n2 = Math.floor(Math.random() * 10) + 1;
      const correctSum = n1 + n2;
      if (captchaLabel) captchaLabel.innerText = `${n1} + ${n2}`;

      // Валидация телефона (только цифры)
      const phoneInput = document.getElementById('phone');
      phoneInput.addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/[^\d+]/g, '');
      });

      contactForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const captchaInput = document.getElementById('captchaInput').value;

          if (parseInt(captchaInput) !== correctSum) {
              alert('Ошибка капчи. Пожалуйста, решите пример правильно.');
              return;
          }

          const btn = contactForm.querySelector('button');
          btn.disabled = true;
          btn.innerText = 'Отправка...';

          setTimeout(() => {
              contactForm.style.display = 'none';
              document.getElementById('formSuccess').style.display = 'block';
              lucide.createIcons();
          }, 1500);
      });
  }

  // 7. Cookie Popup logic
  const cookiePopup = document.getElementById('cookiePopup');
  const acceptBtn = document.getElementById('acceptCookies');

  if (!localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => {
          cookiePopup.classList.add('active');
      }, 2000);
  }

  acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookiePopup.classList.remove('active');
  });

  // 8. Параллакс для картинок блога (на десктопе)
  if (window.innerWidth > 1024) {
      window.addEventListener('scroll', () => {
          document.querySelectorAll('.blog-card__image img').forEach(img => {
              const rect = img.parentElement.getBoundingClientRect();
              if (rect.top < window.innerHeight && rect.bottom > 0) {
                  const shift = (window.innerHeight - rect.top) * 0.05;
                  img.style.transform = `scale(1.1) translateY(${shift - 20}px)`;
              }
          });
      });
  }
});

/**
* THREE.JS HERO ANIMATION
*/
function initThreeHero() {
  const container = document.getElementById('hero-canvas');
  if (!container || !window.THREE) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0F172A, 1, 1000);

  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 1, 2000);
  camera.position.set(0, 150, 400);
  camera.rotation.x = -0.8;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const geometry = new THREE.PlaneBufferGeometry(2000, 2000, 60, 60);
  const material = new THREE.MeshBasicMaterial({
      color: 0x4F46E5,
      wireframe: true,
      transparent: true,
      opacity: 0.3
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);

  let time = 0;
  function animate() {
      requestAnimationFrame(animate);
      time += 0.005;
      const pos = geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          const z = Math.sin(x * 0.005 + time) * 30 + Math.cos(y * 0.005 + time) * 20;
          pos.setZ(i, z);
      }
      pos.needsUpdate = true;
      mesh.rotation.z += 0.001;
      renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
  });

  animate();
}

// Запуск Three.js после всех проверок
window.addEventListener('load', initThreeHero);
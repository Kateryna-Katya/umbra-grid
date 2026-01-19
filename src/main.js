// Инициализация иконок Lucide
lucide.createIcons();

// Обработка скролла для хедера
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.padding = '10px 0';
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    } else {
        header.style.padding = '0';
        header.style.background = 'rgba(255, 255, 255, 0.8)';
    }
});

// Плавная навигация (уже поддерживается CSS, но добавим JS для контроля)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
    // ... (Предыдущий код script.js оставим в начале файла)

/* =========================================
   THREE.JS HERO ANIMATION (Только для этой секции)
   ========================================= */
function initThreeJsHero() {
  const container = document.getElementById('hero-canvas');
  if (!container) return;

  let scene, camera, renderer, mesh;
  let terrainGeometry;

  function init() {
      // 1. Сцена и Камера
      scene = new THREE.Scene();
      // Туман для глубины, цвет совпадает с фоном секции
      scene.fog = new THREE.Fog(0x0F172A, 1, 1000);

      camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 1, 2000);
      // Позиция камеры: чуть выше и смотрим вниз под углом
      camera.position.z = 400;
      camera.position.y = 150;
      camera.rotation.x = -0.8;

      // 2. Рендерер с прозрачностью
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1); // Оптимизация для ретины
      container.appendChild(renderer.domElement);

      // 3. Геометрия Сетки (Плоскость с множеством сегментов)
      const width = 2000;
      const height = 2000;
      const widthSegments = 60; // Количество линий сетки по ширине
      const heightSegments = 60; // Количество линий сетки по высоте

      terrainGeometry = new THREE.PlaneBufferGeometry(width, height, widthSegments, heightSegments);

      // 4. Материал (Wireframe - проволочный каркас)
      const material = new THREE.MeshBasicMaterial({
          color: 0x818CF8, // Цвет индиго, как в дизайне
          wireframe: true,
          transparent: true,
          opacity: 0.4
      });

      // 5. Создание Меша и добавление на сцену
      mesh = new THREE.Mesh(terrainGeometry, material);
      // Поворачиваем плоскость, чтобы она лежала "на полу"
      mesh.rotation.x = -Math.PI / 2;
      scene.add(mesh);

      window.addEventListener('resize', onWindowResize, false);
  }

  // Анимация волн
  let time = 0;
  function animate() {
      requestAnimationFrame(animate);
      time += 0.005;

      // Получаем доступ к вершинам (точкам) геометрии
      const positionAttribute = terrainGeometry.attributes.position;
      const vertices = positionAttribute.array;

      // Проходимся по всем вершинам и меняем их Z-координату (высоту)
      // Используем синусы и косинусы для создания плавных волн
      for (let i = 0; i < vertices.length; i += 3) {
          const x = vertices[i];
          const y = vertices[i + 1];

          // Формула для "ландшафта"
          vertices[i + 2] = Math.sin(x * 0.005 + time) * 30 + Math.cos(y * 0.005 + time) * 20;
      }

      // Сообщаем Three.js, что вершины изменились
      positionAttribute.needsUpdate = true;

      // Медленное вращение всей сетки
      mesh.rotation.z += 0.001;

      renderer.render(scene, camera);
  }

  function onWindowResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
  }

  init();
  animate();
}

// Запускаем Three.js только если мы на странице (на всякий случай)
if (document.getElementById('hero-canvas')) {
  // Небольшая задержка, чтобы все прогрузилось
  setTimeout(initThreeJsHero, 100);
}
});
window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("hero-canvas");
  const context = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const frameCount = 131;
  const currentFrame = (index) =>
    `./expertise-img/img-${(index + 1).toString()}.jpg`;

  const images = [];
  let loadedCount = 0;

  // Preload ảnh và đợi tất cả load xong
  function preloadImages(callback) {
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          callback();
        }
      };
      images[i] = img;
    }
  }

  // Hàm vẽ ảnh vào canvas với "cover + center"
  function scaleImage(img, ctx) {
    const canvas = ctx.canvas;
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio); // cover
    const centerShiftX = (canvas.width - img.width * ratio) / 2;
    const centerShiftY = (canvas.height - img.height * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShiftX,
      centerShiftY,
      img.width * ratio,
      img.height * ratio
    );
  }

  function render(index) {
    const img = images[index];
    if (img && img.complete) {
      scaleImage(img, context);
    }
  }

  // Gọi preload trước khi setup animation
  preloadImages(() => {
    const obj = { frame: 0 };

    // Vẽ frame đầu tiên
    render(0);

    // Khởi động scroll animation sau khi preload xong
    gsap.to(obj, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: ".intro",
        start: "top top",
        end: "+=200%",
        scrub: true,
        pin: true,
        markers: false,
      },
      onUpdate: function () {
        render(obj.frame);
      },
    });

    // Resize canvas khi thay đổi kích thước cửa sổ
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render(obj.frame);
    });
  });
});

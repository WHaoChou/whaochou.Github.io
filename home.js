document.addEventListener("DOMContentLoaded", () => {
    const homeContent = document.querySelector(".home-content");

    function adjustToSquare() {
        const height = homeContent.offsetHeight; // 获取当前高度
        homeContent.style.width = `${height}px`; // 设置宽度等于高度
    }

    // 初始化宽高
    adjustToSquare();

    // 监听窗口变化动态调整
    window.addEventListener("resize", adjustToSquare);
});



document.addEventListener('mousemove', (e) => {
    // 获取两个眼睛的元素
    const eyes = document.querySelectorAll('.eye');
    const pupils = document.querySelectorAll('.pupil');
    // 获取鼠标的位置
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // 遍历眼睛，为每个眼睛计算角度
    eyes.forEach((eye, index) => {
        // 获取眼睛的位置和大小
        const rect = eye.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        // 计算角度
        const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);

        // 限制瞳孔的移动范围，瞳孔最大移动范围为 10px
        const pupil = pupils[index];
        const offsetX = Math.cos(angle) * 10;
        const offsetY = Math.sin(angle) * 10;

        // 更新瞳孔的位置
        pupil.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
});

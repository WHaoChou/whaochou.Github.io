(async function () {
    // 加载 SVG 路径文件
    const response = await fetch('paths.svg');
    const svgText = await response.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

    // 获取 SVG 的 viewBox 属性
    const svgElement = svgDoc.querySelector('svg');
    const viewBox = svgElement.getAttribute('viewBox').split(' ').map(Number); // [x, y, width, height]
    const [viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight] = viewBox;

    // 存储路径
    const paths = {};
    svgDoc.querySelectorAll('path').forEach(path => {
        paths[path.id] = path;
    });

    // 用于记录箭头的最后角度
    const lastAngles = {};

    document.addEventListener('scroll', () => {
        const viewportWidth = window.innerWidth; // 当前页面的宽度
        const viewportHeight = window.innerHeight; // 当前页面的高度

        // 遍历每个页面
        const pageWrappers = document.querySelectorAll('.page-wrapper');
        pageWrappers.forEach((wrapper, index) => {
            // 跳过第一个没有箭头的页面
            if (index === 0) return;

            const page = wrapper.querySelector('.page');
            const arrow = wrapper.querySelector('.bg-element'); // 改为箭头的 class
            if (!arrow) return; // 如果没有箭头，跳过

            const pathId = arrow.dataset.path;
            const path = paths[pathId];
            if (!path) return; // 如果没有对应路径，跳过

            // 获取页面的顶部和底部相对视口的位置
            const pageRect = page.getBoundingClientRect();
            const pageTop = pageRect.top;
            const pageBottom = pageRect.bottom;

            // 计算页面运动进度
            let progress = 0;
            const start = viewportHeight * 0.5; // 页面顶部到达视口 50%
            const end = index === pageWrappers.length - 1
                ? viewportHeight // 最后一页，底部到视口底部
                : viewportHeight * 0.5; // 其他页面，底部到视口 50%

            if (pageTop <= start && pageBottom >= end) {
                progress = (start - pageTop) / (pageBottom - pageTop);
            }

            // 确保进度在 0~1 范围
            progress = Math.max(0, Math.min(1, progress));

            // 计算箭头位置
            const pathLength = path.getTotalLength();
            const point = path.getPointAtLength(progress * pathLength);

            // 将路径点按比例缩放到页面尺寸
            const scaledX = ((point.x - viewBoxX) / viewBoxWidth) * viewportWidth; // 缩放到页面宽度
            const scaledY = ((point.y - viewBoxY) / viewBoxHeight) * viewportHeight; // 缩放到页面高度

            // 获取路径上的下一个点（确保步长足够小以跟随路径）
            const nextLength = Math.min((progress * pathLength) + 5, pathLength); // 增加一个小步长（单位：像素）
            const nextPoint = path.getPointAtLength(nextLength);
            const nextScaledX = ((nextPoint.x - viewBoxX) / viewBoxWidth) * viewportWidth;
            const nextScaledY = ((nextPoint.y - viewBoxY) / viewBoxHeight) * viewportHeight;

            // 计算箭头的角度
            const angle = Math.atan2(nextScaledY - scaledY, nextScaledX - scaledX) * (180 / Math.PI); // 转为角度

            // 更新箭头的位置和方向
            arrow.style.left = `${scaledX}px`;
            arrow.style.top = `${scaledY}px`;
            arrow.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

            // 记录最后的角度
            lastAngles[pathId] = angle;
        });
    });

    // 当滚动停止时，保持最后的箭头角度
    let scrollTimeout;
    document.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout); // 重置定时器
        scrollTimeout = setTimeout(() => {
            const pageWrappers = document.querySelectorAll('.page-wrapper');
            pageWrappers.forEach((wrapper, index) => {
                if (index === 0) return;

                const arrow = wrapper.querySelector('.bg-element'); // 改为箭头的 class
                if (!arrow) return;

                const pathId = arrow.dataset.path;
                if (lastAngles[pathId] !== undefined) {
                    // 保持最后记录的角度
                    arrow.style.transform = `translate(-50%, -50%) rotate(${lastAngles[pathId]}deg)`;
                }
            });
        }, 150); // 滚动停止后 150ms 执行
    });
})();

document.addEventListener("DOMContentLoaded", () => {
    const projectGroups = document.querySelectorAll(".project-group");

    projectGroups.forEach(group => {
        const slideshowContainer = group.querySelector(".slideshow-container");
        const slides = Array.from(slideshowContainer.querySelectorAll(".slide"));
        const prevBtn = group.querySelector(".prev-btn");
        const nextBtn = group.querySelector(".next-btn");
        let currentIndex = 0;
        let autoPlayInterval;

        // 显示当前图片
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove("active"); // 隐藏所有图片
                if (i === index) {
                    slide.classList.add("active"); // 显示当前图片
                }
            });
        }

        // 切换到下一张图片
        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }

        // 切换到上一张图片
        function prevSlide() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        }

        // 动态调整图片大小
        function adjustImageSize() {
            const containerHeight = slideshowContainer.offsetHeight;
            const containerWidth = slideshowContainer.offsetWidth;

            slides.forEach(slide => {
                const imageRatio = slide.naturalWidth / slide.naturalHeight;
                const containerRatio = containerWidth / containerHeight;

                if (imageRatio > containerRatio) {
                    // 图片更宽，高度适配
                    slide.style.height = `${containerHeight}px`;
                    slide.style.width = "auto";
                } else {
                    // 图片更高，宽度适配
                    slide.style.width = `${containerWidth}px`;
                    slide.style.height = "auto";
                }
            });
        }

        // 自动播放图片
        function startAutoPlay() {
            stopAutoPlay(); // 确保没有重复的定时器
            autoPlayInterval = setInterval(nextSlide, 3000); // 每 3 秒切换
        }

        // 停止自动播放
        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        // 监听 active 状态变化
        const observer = new MutationObserver(() => {
            if (group.classList.contains("active")) {
                // 初始化
                adjustImageSize();
                showSlide(currentIndex);
                startAutoPlay();

                // 鼠标事件
                slideshowContainer.addEventListener("mouseenter", stopAutoPlay);
                slideshowContainer.addEventListener("mouseleave", startAutoPlay);

                // 按钮事件
                prevBtn.addEventListener("click", prevSlide);
                nextBtn.addEventListener("click", nextSlide);

                // 监听窗口大小变化
                window.addEventListener("resize", adjustImageSize);
            } else {
                // 停止自动播放
                stopAutoPlay();

                // 移除鼠标事件
                slideshowContainer.removeEventListener("mouseenter", stopAutoPlay);
                slideshowContainer.removeEventListener("mouseleave", startAutoPlay);

                // 移除按钮事件
                prevBtn.removeEventListener("click", prevSlide);
                nextBtn.removeEventListener("click", nextSlide);

                // 移除窗口大小监听
                window.removeEventListener("resize", adjustImageSize);
            }
        });

        observer.observe(group, { attributes: true, attributeFilter: ["class"] });
    });
});





//循环聚焦展示
document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".project-gallery");
    const items = Array.from(document.querySelectorAll(".project-group"));
    const containerPadding = parseInt(getComputedStyle(container).paddingTop) +
        parseInt(getComputedStyle(container).paddingBottom); // 容器上下 padding
    const itemMargin = parseInt(getComputedStyle(items[0]).marginTop) +
        parseInt(getComputedStyle(items[0]).marginBottom); // 每个项目的上下 margin
    const containerHeight = container.offsetHeight; // 容器总高度
    const smallHeight = (containerHeight - 100) * 0.2; // 缩小状态高度
    const activeHeight = (containerHeight - 100) * 0.6; // 展开状态高度
    const totalItems = items.length; // 总项目数
    let currentIndex = 0; // 当前聚焦的索引
    let isScrolling = false; // 防止滚动过程中多次触发
    let autoPlayInterval_group = null; // 自动播放计时器
    const autoPlayDelay = 6000; // 自动播放间隔

    // 克隆首尾节点
    const firstClones = items.slice(0,3).map((item) => item.cloneNode(true));
    const lastClones = items.slice(-3).map((item) => item.cloneNode(true));

    // 添加克隆节点到容器
    lastClones.forEach((clone) => container.insertBefore(clone, items[0]));
    firstClones.forEach((clone) => container.appendChild(clone));

    // 动态计算滚动距离
    function calculateScrollTop() {
        const containerHeight = container.offsetHeight; // 容器总高度
        const smallHeight = (containerHeight - 100) * 0.2; // 缩小状态高度
        const activeHeight = (containerHeight - 100) * 0.6; // 展开状态高度
        let scrollTop = containerPadding / 2; // 从容器 padding 开始

        // 累加所有项目的高度
        for (let i = 0; i < currentIndex + 3; i++) {
            scrollTop += itemMargin;
            scrollTop += smallHeight;
        }

        // 调整以确保聚焦元素居中
        scrollTop += itemMargin / 2 + activeHeight / 2;
        scrollTop -= containerHeight/2;

        return scrollTop;
    }

    // 滚动到新聚焦元素的位置
    function scrollToCenter() {
        container.scrollTo({
            top: calculateScrollTop(),
            behavior: "smooth",
        });
    }


    // 更新聚焦状态
    function updateActiveGroup() {
        const allItems = Array.from(container.querySelectorAll(".project-group"));

        allItems.forEach((item, index) => {
            item.classList.remove("active", "nearby", "hidden");

            if (index === currentIndex + 3) {
                item.classList.add("active");
            } else if (
                index === currentIndex +3 - 1 ||
                index === currentIndex +3 + 1 ||
                index === currentIndex +3 +totalItems -1||
                index === currentIndex +3 +totalItems +1||
                index === currentIndex +3 -totalItems -1||
                index === currentIndex +3 -totalItems +1
            ) {
                item.classList.add("nearby");
            } else {
                item.classList.add("hidden");
            }
        });
    }

    // 无缝循环逻辑
    function handleSeamlessLoop() {
        const allItems = Array.from(container.querySelectorAll(".project-group"));
        if (currentIndex >= totalItems) {
            currentIndex = -1;
            const targetItem = allItems[2]; // 选择第一个项目组
            const borderBottom = targetItem.querySelector(".before-project-group");
            targetItem.style.transition = 'none'; // 关闭过渡
            borderBottom.style.transition = 'none';
            targetItem.classList.remove("active","hidden","nearby")
            targetItem.classList.add("active");
            setTimeout(() => {
                targetItem.style.transition = ''; // 恢复到 CSS 默认的过渡
                borderBottom.style.transition = '';
            }, 0); // 延迟 0ms 以确保样式应用完成后恢复过渡
            container.scrollTop = calculateScrollTop(); // 跳转到实际第一个的前一个位置
            currentIndex = 0;
        }
        else if (currentIndex < 0) {
            currentIndex = totalItems;
            const targetItem = allItems[3+totalItems]; // 选择第一个项目组
            const targetItem2 = allItems[3];
            const borderBottom1 = targetItem.querySelector(".before-project-group");
            const borderBottom2 = targetItem.querySelector(".before-project-group");
            targetItem.style.transition = 'none';
            borderBottom1.style.transition = 'none';
            borderBottom2.style.transition = 'none';
            targetItem2.style.transition = 'none'; // 关闭过渡
            targetItem.classList.remove("active","hidden","nearby")
            targetItem.classList.add("active");
            targetItem2.classList.remove("active","hidden","nearby")
            targetItem2.classList.add("hidden");
            setTimeout(() => {
                targetItem.style.transition = ''; // 恢复到 CSS 默认的过渡
                targetItem2.style.transition = ''; 
                borderBottom1.style.transition = '';
                borderBottom2.style.transition = '';
            }, 0); // 延迟 0ms 以确保样式应用完成后恢复过渡
            container.scrollTop = calculateScrollTop(); // 跳转到最后一个的后一个位置
            currentIndex = totalItems - 1;
        }
    }

    // 自动播放逻辑
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval_group = setInterval(() => {
            currentIndex++;
            handleSeamlessLoop();
            scrollToCenter();
            setTimeout(() => {
                updateActiveGroup();
            }, 100);
        }, autoPlayDelay);
    }

    // 停止自动播放
    function stopAutoPlay() {
        clearInterval(autoPlayInterval_group);
    }

    // 滚轮事件监听
    container.addEventListener("wheel", (event) => {
        stopAutoPlay();
        if (isScrolling) return;
        event.preventDefault();

        isScrolling = true;

        if (event.deltaY > 0) {
            // 向下滚动
            currentIndex++;
        } else {
            // 向上滚动
            currentIndex--;
        }
        handleSeamlessLoop();
        
        scrollToCenter();
        setTimeout(() => {
            updateActiveGroup();
            isScrolling = false;
        }, 100); // 滚动动画时间
        startAutoPlay();
    });

    // 点击事件监听
    container.addEventListener("click", (event) => {
        stopAutoPlay();

        const target = event.target.closest(".project-group");
        if (!target) return;

        const allItems = Array.from(container.querySelectorAll(".project-group"));
        const index = allItems.indexOf(target);

        if (index === -1) return;

        currentIndex = index - 3;
        handleSeamlessLoop();
        scrollToCenter();
        setTimeout(() => {
            updateActiveGroup();
            isScrolling = false;
        }, 100); // 滚动动画时间
        startAutoPlay();
    });

    // 初始化
    scrollToCenter();
    updateActiveGroup();
    startAutoPlay();
});


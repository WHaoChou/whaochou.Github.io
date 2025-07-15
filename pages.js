document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll(".Menu li");
    const pages = document.querySelectorAll(".page");

    // 添加点击事件监听器
    menuItems.forEach((item) => {
        item.addEventListener("click", () => {
            // 获取对应的页面 ID
            const sectionId = item.getAttribute("data-section");

            // 滚动到对应页面
            document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });

            // 高亮当前菜单项
            menuItems.forEach((el) => el.classList.remove("active"));
            item.classList.add("active");
        });
    });


    //高亮选项
    window.addEventListener("scroll", () => {
        let maxVisibleArea = 0; // 最大可见面积
        let currentPageId = null; // 当前选中页面的 ID
    
        pages.forEach((page) => {
            const rect = page.getBoundingClientRect();
    
            // 计算可见区域的高度
            const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
            const visibleArea = Math.max(0, visibleHeight * rect.width); // 可见面积
    
            // 更新占据面积最大的页面
            if (visibleArea > maxVisibleArea) {
                maxVisibleArea = visibleArea;
                currentPageId = page.getAttribute("id");
            }
        });
    
        // 更新菜单高亮
        if (currentPageId) {
            menuItems.forEach((item) => {
                item.classList.remove("active");
                if (item.getAttribute("data-section") === currentPageId) {
                    item.classList.add("active");
                }
            });
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const projectGallery = document.querySelector(".project-gallery");
    const projectGroups = document.querySelectorAll(".project-group");
    let activeGallery = false; // 是否允许 project-gallery 滑动
    let scrollPosition = 0; // 记录激活时的滚动位置


    // 禁用滚动的函数
    const disableScroll = () => {
        window.scrollTo(0, scrollPosition); // 锁定页面位置
    };

    // 阻止默认滚轮行为
    const preventScroll = (event) => {
        if (activeGallery) {
            event.preventDefault();
            event.stopPropagation();
        }
    };

    // 添加点击事件监听器
    document.addEventListener("click", (event) => {
        const target = event.target.closest(".project-group");

        if (target) {
            // 点击在 project-group 上
            activeGallery = true;
            scrollPosition = window.scrollY; // 记录当前滚动位置
            window.addEventListener("scroll", disableScroll);
            window.addEventListener("wheel", preventScroll, { passive: false });
            const rect = projectGallery.getBoundingClientRect();
            const x = event.clientX - rect.left; // 鼠标相对容器的 X 位置
            const y = event.clientY - rect.top; // 鼠标相对容器的 Y 位置

            // 设置伪元素位置变量
            projectGallery.style.setProperty("--wave-x", `${x}px`);
            projectGallery.style.setProperty("--wave-y", `${y}px`);

            projectGallery.classList.add("active"); // 可视化效果
        } else {
            // 点击在非 project-group 区域
            activeGallery = false;
            window.removeEventListener("scroll", disableScroll);
            window.removeEventListener("wheel", preventScroll);
            projectGallery.classList.remove("active"); // 移除可视化效果
        }
    });


    // 滚轮事件监听
    document.addEventListener("wheel", (event) => {
        const pageHeight = window.innerHeight;
        const scrollPosition = window.scrollY;

        // 当前页面索引
        let currentIndex = Math.round(scrollPosition / pageHeight);

        if(!activeGallery){
            // 页面切换
            const pages = document.querySelectorAll(".page");

            if (event.deltaY > 0 && currentIndex < pages.length - 1) {
                // 向下滚动
                currentIndex++;
            } else if (event.deltaY < 0 && currentIndex > 0) {
                // 向上滚动
                currentIndex--;
            }

            // 平滑滚动到目标页面
            window.scrollTo({
                top: currentIndex * pageHeight + 1,
                behavior: "smooth"
            });
        }
    });

    
});

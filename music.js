document.addEventListener("DOMContentLoaded", () => {
    const musicControl = document.getElementById("music-control");
    const musicButton = document.getElementById("music-button");
    const backgroundMusic = document.getElementById("background-music");
    let isPlaying = true; // 默认播放
    backgroundMusic.play();

    // 用户交互后解除静音
    const enableSound = () => {
        backgroundMusic.muted = false; // 解除静音
        backgroundMusic.play(); // 确保播放
        document.removeEventListener("click", enableSound); // 移除事件监听
    };

    // 监听用户的交互事件
    document.addEventListener("click", enableSound);
    
    // 自动播放音乐
    musicButton.classList.add("rotating"); // 添加旋转类

    // 点击切换播放状态
    musicControl.addEventListener("click", () => {
        if (isPlaying) {
            backgroundMusic.pause();
            musicButton.src = "./images2/音乐_暂停.png"; // 切换为暂停图标
            musicButton.classList.remove("rotating"); // 移除旋转类
        } else {
            backgroundMusic.play();
            musicButton.src = "./images2/音乐.png"; // 切换为播放图标
            musicButton.classList.add("rotating"); // 添加旋转类
        }
        isPlaying = !isPlaying; // 切换播放状态
    });
});

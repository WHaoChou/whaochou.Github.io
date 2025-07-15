document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.share-container');
    const boxes = document.querySelectorAll('.share-box');
  
    
    function adjustShrinkingBoxSizes() {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
    
        // 获取当前的列和行比例
        const columnFractions = container.style.gridTemplateColumns.split(' ').map(f => parseFloat(f));
        const rowFractions = container.style.gridTemplateRows.split(' ').map(f => parseFloat(f));
    
        // 计算每个单元格的宽高
        const cellWidths = columnFractions.map(f => (f / columnFractions.reduce((a, b) => a + b, 0)) * containerWidth);
        const cellHeights = rowFractions.map(f => (f / rowFractions.reduce((a, b) => a + b, 0)) * containerHeight);
    
        // 动态设置每个 shrinking box 的尺寸
        boxes.forEach((box, index) => {
          if (box.classList.contains('shrinking')) {
            const colIndex = index % 2; // 列索引
            const rowIndex = Math.floor(index / 2); // 行索引
    
            // 取单元格宽高中较小的值作为正方形边长
            const size = Math.min(cellWidths[colIndex], cellHeights[rowIndex]);
    
            box.style.width = `${size*0.7}px`;
            box.style.height = `${size*0.7}px`;
          } else {
            // 非 shrinking 状态时恢复默认
            box.style.width = '';
            box.style.height = '';
          }
        });
    }

    boxes.forEach(box => {
      box.addEventListener('click', function () {
        // 如果当前 box 已经是 clicked，忽略点击
        if (this.classList.contains('clicked')) return;
  
        // 清除所有 box 的状态
        boxes.forEach(b => {
          b.classList.remove('clicked', 'shrinking');
          b.style.width = ''; // 清除动态设置的宽度
          b.style.height = ''; // 清除动态设置的高度
        });
  
        // 为当前点击的 box 添加 clicked 类
        this.classList.add('clicked');
        // 动态调整 share-container 的布局
        const boxIndex = Array.from(boxes).indexOf(this);
        console.log(boxIndex);
        if (boxIndex === 0) {
        container.style.gridTemplateColumns = '10fr 1fr';
        container.style.gridTemplateRows = '10fr 1fr';
        } else if (boxIndex === 1) {
        container.style.gridTemplateColumns = '1fr 10fr';
        container.style.gridTemplateRows = '10fr 1fr';
        } else if (boxIndex === 2) {
        container.style.gridTemplateColumns = '10fr 1fr';
        container.style.gridTemplateRows = '1fr 10fr';
        } else if (boxIndex === 3) {
        container.style.gridTemplateColumns = '1fr 10fr';
        container.style.gridTemplateRows = '1fr 10fr';
        }
  
        boxes.forEach(b => {
          if (b !== this) {
            b.classList.add('shrinking'); // 让未选中的单元格缩小
          }
        });
        adjustShrinkingBoxSizes();
      });
    });
  
    // 点击容器外部时重置所有状态
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.share-box')) {
        boxes.forEach(box => {
          box.classList.remove('clicked', 'shrinking');
          box.style.width = ''; // 清除动态设置的宽度
          box.style.height = ''; // 清除动态设置的高度
        });
        container.style.gridTemplateColumns = '1fr 1fr'; // 恢复初始列宽
        container.style.gridTemplateRows = '1fr 1fr'; // 恢复初始行高
      }
    });
  });
  
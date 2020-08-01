// worker.js
class RandomColorPainter {
    // 可以获取的css属性，先写在这里
    // 我这里定义宽高和间隔，从css获取
    static get inputProperties() {
        return ['--w', '--h', '--spacing'];
      }
      /**
       * 绘制函数paint，最主要部分
       * @param {PaintRenderingContext2D} ctx 类似canvas的ctx
       * @param {PaintSize} PaintSize 绘制范围大小(px) { width, height }
       * @param {StylePropertyMapReadOnly} props 前面inputProperties列举的属性，用get获取
       */
    paint(ctx, PaintSize, props) {
        const w = props.get('--w') && +props.get('--w')[0].trim() || 30;
        const h = props.get('--h') && +props.get('--h')[0].trim() || 30;
        const spacing = +props.get('--spacing')[0].trim() || 10;
        
        for (let x = 0; x < PaintSize.width / w; x++) {
            for (let y = 0; y < PaintSize.height / h; y++) {
                let rgb = Math.random().toString(16).slice(2, 8)
                ctx.fillStyle = `#${rgb}`
                ctx.beginPath();
                ctx.rect(x * (w + spacing), y * (h + spacing), w, h);
                ctx.fill();
            }
        }
    }
}

registerPaint('randomcolor', RandomColorPainter);

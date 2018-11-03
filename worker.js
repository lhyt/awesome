class CheckerboardPainter {
    static get inputProperties() {
        return ['--size', '--spacing'];
      }
    paint(ctx, PaintSize, props) {
        const size = +props.get('--size')[0].trim() || 30;
        const spacing = +props.get('--spacing')[0].trim() || 10;
        console.log(ctx, PaintSize)
        for (let y = 0; y < PaintSize.height / size; y++) {
            for (let x = 0; x < PaintSize.width / size; x++) {
                ctx.fillStyle = `#${Math.random().toString(16).slice(2, 8)}`
                ctx.beginPath();
                ctx.rect(x * (size + spacing), y * (size + spacing), size, size);
                ctx.fill();
            }
        }
    }
}
// 3. 定义 Paint Worklet 'checkerboard'
registerPaint('checkerboard', CheckerboardPainter);
import React, { useEffect, useRef } from 'react';

const Particles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles: { x: number; y: number; vx: number; vy: number }[] = [];
  const mouse = { x: -9999, y: -9999 };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const getDocSize = () => ({
      w: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth, window.innerWidth),
      h: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight, window.innerHeight),
    });

    const resize = () => {
      const { w, h } = getDocSize();
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
    };
    resize();

    const createParticles = () => {
      particles.length = 0;
      const { w, h } = getDocSize();
      const count = Math.floor((w * h) / 16000) * 3; // 粒子数量增加三倍
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
        });
      }
    };
    createParticles();

    const onMove = (e: MouseEvent) => {
      mouse.x = (window.scrollX + e.clientX) * DPR;
      mouse.y = (window.scrollY + e.clientY) * DPR;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';

      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = Math.max(0, 100 - dist) / 100 * 0.6; // 增加吸引力强度，让粒子更快跟随鼠标
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;

        p.vx *= 0.99; // 减少阻尼，让粒子移动更流畅
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // 更大的节点
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // 链式连接：更粗的线段、范围更大，随机增强形成“链段”
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          const maxD = 120 * DPR;
          if (d2 < maxD * maxD) {
            const alpha = 1 - d2 / (maxD * maxD);
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1.2;
            // 偶尔增强，模拟“链段”
            if (Math.random() < 0.005) ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.lineWidth = 1;
          }
        }
      }

      requestAnimationFrame(draw);
    };

    const onResize = () => { resize(); createParticles(); };
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove);

    draw();
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <canvas id="particles-canvas" ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />;
};

export default Particles;
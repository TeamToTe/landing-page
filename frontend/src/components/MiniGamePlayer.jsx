import React, { useEffect, useRef, useState } from 'react';
import { X, RotateCcw, Volume2, VolumeX, Trophy, Gamepad2 } from 'lucide-react';
import { recordGamePlay } from '../services/api';

export default function MiniGamePlayer({ game, onClose }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('tote_high_score') || '0', 10);
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Audio synthesize function using Web Audio API
  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'jump') {
        osc.frequency.setValueAtTime(280, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(620, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'coin') {
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      // AudioContext may be restricted
    }
  };

  // Record play event to backend
  useEffect(() => {
    if (game?.id || game?.slug) {
      recordGamePlay(game.slug || game.id).catch(() => {});
    }
  }, [game]);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let currentScore = 0;
    let gameOver = false;
    let speed = 4.5;
    let frame = 0;

    // Player state (Tote Bot)
    const player = {
      x: 70,
      y: 200,
      w: 36,
      h: 44,
      vy: 0,
      jumpStrength: -10.5,
      gravity: 0.55,
      groundY: 260,
      jumpsLeft: 2,
    };

    // Obstacles
    let obstacles = [];
    let items = [];
    let particles = [];

    const handleJump = () => {
      if (gameOver) {
        restartGame();
        return;
      }
      if (player.jumpsLeft > 0) {
        player.vy = player.jumpStrength;
        player.jumpsLeft--;
        playSound('jump');

        // Spawn jump dust particles
        for (let i = 0; i < 5; i++) {
          particles.push({
            x: player.x + player.w / 2,
            y: player.y + player.h,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.8) * 3,
            radius: Math.random() * 3 + 2,
            color: '#FFB27A',
            life: 20
          });
        }
      }
    };

    const onKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleJump();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    const restartGame = () => {
      currentScore = 0;
      setScore(0);
      gameOver = false;
      setIsGameOver(false);
      speed = 4.5;
      frame = 0;
      player.y = 200;
      player.vy = 0;
      player.jumpsLeft = 2;
      obstacles = [];
      items = [];
      particles = [];
    };

    const loop = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#FFE8D6');
      skyGrad.addColorStop(0.7, '#FFF6ED');
      skyGrad.addColorStop(1, '#F3E5D8');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Distant rolling hills
      ctx.fillStyle = '#FED3B1';
      ctx.beginPath();
      ctx.arc(120 - (frame * 0.4) % 600, 310, 150, Math.PI, 0, false);
      ctx.arc(380 - (frame * 0.4) % 600, 320, 180, Math.PI, 0, false);
      ctx.arc(680 - (frame * 0.4) % 600, 310, 150, Math.PI, 0, false);
      ctx.fill();

      // Ground Line
      ctx.fillStyle = '#E89252';
      ctx.fillRect(0, player.groundY + player.h, canvas.width, canvas.height - (player.groundY + player.h));
      ctx.fillStyle = '#C87232';
      ctx.fillRect(0, player.groundY + player.h, canvas.width, 4);

      if (!gameOver) {
        // Update player physics
        player.vy += player.gravity;
        player.y += player.vy;

        if (player.y >= player.groundY) {
          player.y = player.groundY;
          player.vy = 0;
          player.jumpsLeft = 2;
        }

        // Spawn obstacles
        if (frame % 85 === 0) {
          const height = 30 + Math.random() * 28;
          obstacles.push({
            x: canvas.width + 20,
            y: player.groundY + player.h - height,
            w: 24,
            h: height,
            color: '#E04A26'
          });
        }

        // Spawn bonus energy cores
        if (frame % 130 === 0) {
          items.push({
            x: canvas.width + 40,
            y: player.groundY - 30 - Math.random() * 60,
            w: 18,
            h: 18,
            collected: false
          });
        }

        // Increase score and speed gradually
        if (frame % 8 === 0) {
          currentScore++;
          setScore(currentScore);
          if (currentScore > highScore) {
            setHighScore(currentScore);
            localStorage.setItem('tote_high_score', currentScore.toString());
          }
        }
        if (frame % 300 === 0 && speed < 8) {
          speed += 0.3;
        }
      }

      // Draw Items (Star / Energy Core)
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        if (!gameOver) item.x -= speed;

        // Draw star
        ctx.save();
        ctx.translate(item.x + item.w / 2, item.y + item.h / 2);
        ctx.rotate(frame * 0.05);
        ctx.fillStyle = '#FFB800';
        ctx.beginPath();
        for (let s = 0; s < 5; s++) {
          ctx.lineTo(Math.cos((18 + s * 72) * Math.PI / 180) * 10, -Math.sin((18 + s * 72) * Math.PI / 180) * 10);
          ctx.lineTo(Math.cos((54 + s * 72) * Math.PI / 180) * 5, -Math.sin((54 + s * 72) * Math.PI / 180) * 5);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Check collision with player
        if (
          !gameOver &&
          player.x < item.x + item.w &&
          player.x + player.w > item.x &&
          player.y < item.y + item.h &&
          player.y + player.h > item.y
        ) {
          currentScore += 15;
          setScore(currentScore);
          playSound('coin');
          items.splice(i, 1);
          continue;
        }

        if (item.x < -30) items.splice(i, 1);
      }

      // Draw Obstacles (Laser barriers / spikes)
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        if (!gameOver) obs.x -= speed;

        // Rounded barrier block
        ctx.fillStyle = '#4A3B32';
        ctx.beginPath();
        ctx.roundRect(obs.x, obs.y, obs.w, obs.h, 6);
        ctx.fill();

        // Neon warning stripes
        ctx.fillStyle = '#FF5238';
        ctx.fillRect(obs.x + 3, obs.y + 6, obs.w - 6, 4);
        ctx.fillRect(obs.x + 3, obs.y + obs.h - 10, obs.w - 6, 4);

        // Check collision
        if (
          !gameOver &&
          player.x + player.w - 6 > obs.x &&
          player.x + 6 < obs.x + obs.w &&
          player.y + player.h > obs.y + 4
        ) {
          gameOver = true;
          setIsGameOver(true);
          playSound('hit');
        }

        if (obs.x < -40) obstacles.splice(i, 1);
      }

      // Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        if (p.life <= 0) particles.splice(i, 1);
      }

      // Draw Player: Tote Bot Mascot
      ctx.save();
      ctx.translate(player.x, player.y);

      // Body (White pill shape)
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#433830';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(2, 6, 32, 34, 12);
      ctx.fill();
      ctx.stroke();

      // Screen face (Dark)
      ctx.fillStyle = '#2A2826';
      ctx.beginPath();
      ctx.roundRect(6, 12, 24, 15, 6);
      ctx.fill();

      // Glowing Eyes
      ctx.fillStyle = '#4EF2B8';
      ctx.beginPath();
      ctx.arc(12, 19, 2.5, 0, Math.PI * 2);
      ctx.arc(24, 19, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Orange Headphones
      ctx.fillStyle = '#FF8A3D';
      ctx.beginPath();
      ctx.roundRect(0, 14, 4, 12, 2);
      ctx.roundRect(32, 14, 4, 12, 2);
      ctx.fill();

      // Tote Logo "//" on chest
      ctx.fillStyle = '#FF8A3D';
      ctx.fillRect(13, 30, 3, 7);
      ctx.fillRect(19, 30, 3, 7);

      ctx.restore();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [soundEnabled, highScore]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1A1C22] rounded-[32px] overflow-hidden shadow-2xl border border-orange-200/80 dark:border-zinc-800 flex flex-col">
        {/* Game Modal Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-orange-100 dark:border-zinc-800 bg-[#FBF9F7] dark:bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-950/80 dark:text-orange-400">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-zinc-900 dark:text-white text-base sm:text-lg">
                {game?.title || 'Tố Tề Bot: Space Runner'}
              </h2>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Team Tố Tề Web Arcade — Phát triển trên Canvas WebGL
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-zinc-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Canvas Display Viewport */}
        <div className="relative bg-[#FFE8D6] flex justify-center items-center select-none overflow-hidden">
          <canvas
            ref={canvasRef}
            width={640}
            height={340}
            className="w-full max-w-[640px] h-auto aspect-[640/340] cursor-pointer"
            onClick={() => {
              window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
            }}
          />

          {/* Overlay Score Display */}
          <div className="absolute top-4 left-5 flex items-center gap-4 bg-white/85 dark:bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold shadow-sm pointer-events-none">
            <span className="text-orange-600 dark:text-orange-400">Điểm: {score}</span>
            <div className="flex items-center gap-1 text-amber-500">
              <Trophy className="w-3.5 h-3.5" />
              <span>Kỷ lục: {highScore}</span>
            </div>
          </div>

          {/* Game Over Screen */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white text-center">
              <span className="text-3xl font-extrabold text-orange-400 mb-1">GAME OVER</span>
              <p className="text-zinc-200 text-sm mb-4">Điểm số của bạn: <strong className="text-white text-lg">{score}</strong></p>
              <button
                onClick={() => {
                  window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 font-bold rounded-2xl shadow-lg shadow-orange-500/40 transition-transform active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại (Space)</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer controls hint */}
        <div className="px-6 py-3.5 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-500 dark:text-zinc-400 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 dark:border-zinc-800">
          <span>
            💡 <strong>Hướng dẫn:</strong> Bấm phím <strong>Space / Mũi tên lên</strong> hoặc <strong>Chạm / Click chuột</strong> để Nhảy. Hỗ trợ Nhảy đúp (Double Jump)!
          </span>
          <span className="text-orange-600 dark:text-orange-400 font-medium">
            Tố Tề Arcade Engine v1.0
          </span>
        </div>
      </div>
    </div>
  );
}

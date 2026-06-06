import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene — light background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f0); // warm off-white
    scene.fog = new THREE.FogExp2(0xf0ede8, 0.018);

    // Camera
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    camera.position.z = 35;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // ── Floating particles (dark on light) ──
    const particleCount = 800;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x374151,
      size: 0.18,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Thin connecting lines ──
    for (let i = 0; i < 30; i++) {
      const lGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 40),
        new THREE.Vector3((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 40),
      ]);
      const lMat = new THREE.LineBasicMaterial({ color: 0x9CA3AF, transparent: true, opacity: 0.12 });
      scene.add(new THREE.Line(lGeo, lMat));
    }

    // ── Large subtle circle rings ──
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.RingGeometry(10 + i * 8, 10.2 + i * 8, 64);
      const rMat = new THREE.MeshBasicMaterial({ color: 0xD1D5DB, side: THREE.DoubleSide, transparent: true, opacity: 0.15 });
      const mesh = new THREE.Mesh(ring, rMat);
      mesh.rotation.x = Math.PI / 4 + i * 0.2;
      scene.add(mesh);
    }

    // Mouse
    let mouseX = 0, mouseY = 0;
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    // Animate
    let raf: number;
    let t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.004;
      particles.rotation.y = t * 0.04 + mouseX * 0.06;
      particles.rotation.x = mouseY * 0.04;
      camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.02;
      camera.position.y += (mouseY * 1.5 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);
      pMat.opacity = 0.28 + Math.sin(t) * 0.07;
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }} />;
}

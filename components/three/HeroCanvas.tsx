'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HERO } from '@/lib/three';
import { useUI } from '@/lib/state';

gsap.registerPlugin(ScrollTrigger);

const DEG = Math.PI / 180;

/** A square-section obelisk: a tapered shaft and a pyramidion, 1.2 units tall. */
function useObeliskGeometry() {
  return useMemo(() => {
    const shaft = new THREE.CylinderGeometry(0.115, 0.16, 1.0, 4, 1, false);
    shaft.rotateY(Math.PI / 4);
    shaft.translate(0, -0.1, 0);
    const cap = new THREE.ConeGeometry(0.115, 0.2, 4, 1); // same radius as the shaft top: no seam
    cap.rotateY(Math.PI / 4);
    cap.translate(0, 0.5, 0);
    const merged = new THREE.BufferGeometry();
    const parts = [shaft.toNonIndexed(), cap.toNonIndexed()];
    const pos = parts.flatMap((g) => Array.from(g.getAttribute('position').array as Float32Array));
    merged.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    merged.computeVertexNormals();
    merged.computeBoundingSphere();
    parts.forEach((g) => g.dispose());
    shaft.dispose();
    cap.dispose();
    return merged;
  }, []);
}

interface SceneProps {
  progress: RefObject<number>;
  pointer: RefObject<{ x: number; y: number }>;
  copy: HTMLElement | null;
}

function Obelisk({ progress, pointer, copy }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const smooth = useRef({ x: 0, y: 0 });
  const idleYaw = useRef(0);
  const geometry = useObeliskGeometry();
  const { camera, viewport } = useThree();
  const setQuality = useUI((s) => s.setQuality);
  const fps = useRef({ frames: 0, start: 0 });

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const p = progress.current ?? 0;

    // Pointer parallax, damped (lerp 0.06).
    const target = pointer.current ?? { x: 0, y: 0 };
    smooth.current.x += (target.x - smooth.current.x) * HERO.lerp;
    smooth.current.y += (target.y - smooth.current.y) * HERO.lerp;
    const px = smooth.current.x * HERO.parallaxPx;
    const py = smooth.current.y * HERO.parallaxPx;
    // Base placement matches the poster (object centred at ~71% across, ~47% down, ~60% of height).
    g.position.x = 1.44 + px / viewport.factor;
    g.position.y = 0.13 - py / viewport.factor;

    // Idle rotation (0.06 rad/s) plus scroll-time rotation (38deg over the pinned 200vh);
    // pointer tilt up to ±2.5deg.
    idleYaw.current += HERO.rotationSpeed * delta;
    g.rotation.y = idleYaw.current + p * HERO.scrollRotateDeg * DEG;
    g.rotation.x = smooth.current.y * HERO.parallaxDeg * DEG;
    g.rotation.z = -smooth.current.x * HERO.parallaxDeg * DEG;

    // Scroll-time camera dolly 8 → 4.5.
    camera.position.z = HERO.cameraStart + (HERO.cameraEnd - HERO.cameraStart) * p;

    // Foreground type moves at 40% of the object's parallax (CSS reads --px/--py).
    copy?.style.setProperty('--px', px.toFixed(2));
    copy?.style.setProperty('--py', py.toFixed(2));

    // Quality tier: below 50fps for 2 seconds → drop postprocessing and set DPR to 1.
    const f = fps.current;
    const now = state.clock.elapsedTime * 1000;
    if (!f.start) f.start = now;
    f.frames += 1;
    if (now - f.start >= HERO.fpsWindowMs) {
      const rate = (f.frames * 1000) / (now - f.start);
      if (rate < HERO.fpsStop) setQuality('off');
      else if (rate < HERO.fpsFloor) setQuality('low');
      f.frames = 0;
      f.start = now;
    }
  });

  return (
    <group ref={group} scale={2.1}>
      <mesh geometry={geometry} castShadow={false}>
        <meshPhysicalMaterial
          color={HERO.material.color}
          metalness={HERO.material.metalness}
          roughness={HERO.material.roughness}
          clearcoat={HERO.material.clearcoat}
          clearcoatRoughness={0.35}
          envMapIntensity={HERO.material.envMapIntensity}
        />
      </mesh>
    </group>
  );
}

/**
 * Self-hosted studio lighting: loads /env/studio.hdr from this origin and prefilters it
 * (PMREM) as the scene environment. No preset, no CDN. Replaces drei's <Environment>,
 * which pulled far more code into the 3D chunk than this one file needs.
 */
function StudioEnvironment() {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    let env: THREE.Texture | null = null;
    let disposed = false;
    new RGBELoader().load(HERO.envFile, (tex) => {
      if (disposed) return tex.dispose();
      env = pmrem.fromEquirectangular(tex).texture;
      tex.dispose();
      scene.environment = env;
      invalidate();
    });
    return () => {
      disposed = true;
      scene.environment = null;
      env?.dispose();
      pmrem.dispose();
    };
  }, [gl, scene, invalidate]);
  return null;
}

/**
 * Warm key at 3/4 (intensity 2.2, #FFE9C9). A directional light rather than a RectAreaLight:
 * the rect-area lookup tables would add ~10KB to the 3D chunk, and the HDR already carries a
 * warm softbox key strip that gives the metal its long highlight.
 */
function KeyLight() {
  const ref = useRef<THREE.DirectionalLight>(null);
  useEffect(() => {
    ref.current?.target.position.set(1.44, 0.13, 0);
    ref.current?.target.updateMatrixWorld();
  }, []);
  return <directionalLight ref={ref} color={HERO.keyLight.color} intensity={HERO.keyLight.intensity} position={[-2.6, 1.8, 3.2]} />;
}

/** Switches between continuous rendering (visible, tab active) and on-demand (idle). */
function FrameloopController({ visible }: { visible: boolean }) {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => setFrameloop(visible ? 'always' : 'demand'), [visible, setFrameloop]);
  return null;
}

export default function HeroCanvas({ sectionId }: { sectionId: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const quality = useUI((s) => s.quality);
  const [visible, setVisible] = useState(true);
  const [copy, setCopy] = useState<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);

  // Pointer, normalised to -1..1.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  // Visibility → frameloop; tab hidden → idle.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting && document.visibilityState === 'visible'));
    io.observe(el);
    const onVis = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  // Scroll-time camera: pin the hero for one viewport, scrub over 200vh, cross-dissolve to Section 02.
  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section || !wrap.current) return;
    setCopy(section.querySelector<HTMLElement>('.hero-copy'));
    const canvasWrap = wrap.current;
    const poster = section.querySelector<HTMLElement>('.hero-poster');
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top+=64',
      end: () => `+=${window.innerHeight * 2}`,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progress.current = self.progress;
        const fade = self.progress < 0.75 ? 1 : 1 - (self.progress - 0.75) / 0.25;
        canvasWrap.style.opacity = String(Math.max(0, fade));
      },
    });
    return () => {
      st.kill();
      if (poster) poster.style.opacity = '';
    };
  }, [sectionId]);

  // Hide the poster once the first frame is drawn (the poster matches it).
  useEffect(() => {
    if (!ready) return;
    const poster = document.getElementById(sectionId)?.querySelector<HTMLElement>('.hero-poster');
    if (poster) {
      poster.style.transition = 'opacity 900ms cubic-bezier(0.16, 1, 0.3, 1)';
      poster.style.opacity = '0';
    }
  }, [ready, sectionId]);

  const low = quality === 'low';

  // Too slow to render well: bring the poster back and stop the scene entirely.
  useEffect(() => {
    if (quality !== 'off') return;
    const poster = document.getElementById(sectionId)?.querySelector<HTMLElement>('.hero-poster');
    if (poster) poster.style.opacity = '1';
  }, [quality, sectionId]);
  if (quality === 'off') return null;

  return (
    <div ref={wrap} className="hero-canvas" aria-hidden="true">
      <Canvas
        dpr={low ? 1 : [1, 1.75]}
        gl={{ antialias: !low, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, HERO.cameraStart], fov: HERO.fov }}
        frameloop="demand"
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.9;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          requestAnimationFrame(() => setReady(true));
        }}
      >
        <FrameloopController visible={visible} />
        <Suspense fallback={null}>
          <StudioEnvironment />
          <KeyLight />
          <Obelisk progress={progress} pointer={pointer} copy={copy} />
          {low ? null : (
            <EffectComposer multisampling={0}>
              <Bloom intensity={0.22} luminanceThreshold={0.85} mipmapBlur />
              <Vignette offset={0.28} darkness={0.6} />
              <Noise opacity={0.035} blendFunction={BlendFunction.OVERLAY} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}

'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

export type SkylineDay = { index: number; count: number; date: string; repo: string | null };

type SceneProps = {
  counts: number[];
  accent: string;
  idle: string;
  base: string;
  dark: boolean;
  reducedMotion: boolean;
  running: boolean;
  onHover: (day: number | null, x: number, y: number) => void;
};

const CELL = 1;
const GAP = 0.24;
const PITCH = CELL + GAP;
const MAX_HEIGHT = 7.5;

/** sqrt keeps the quiet days visible next to 40-commit spikes. */
function heightFor(count: number, max: number) {
  if (count === 0) return 0.12;
  return 0.45 + Math.sqrt(count / max) * MAX_HEIGHT;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

function Bars({ counts, accent, idle, dark, reducedMotion, onHover }: Omit<SceneProps, 'running' | 'base'>) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const hovered = useRef<number | null>(null);
  const startedAt = useRef<number | null>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const weeks = Math.ceil(counts.length / 7);
  const max = Math.max(1, ...counts);

  const geometry = useMemo(() => {
    const g = new THREE.BoxGeometry(CELL, 1, CELL);
    g.translate(0, 0.5, 0); // grow from the floor up
    return g;
  }, []);

  const colors = useMemo(() => {
    const low = new THREE.Color(accent).lerp(new THREE.Color(dark ? '#0a0e13' : '#ffffff'), 0.62);
    const high = new THREE.Color(accent);
    const glow = new THREE.Color(accent).lerp(new THREE.Color('#ffffff'), 0.35);
    const none = new THREE.Color(idle);
    return counts.map((count) => {
      if (count === 0) return none.clone();
      const t = Math.sqrt(count / max);
      return t > 0.85 ? high.clone().lerp(glow, (t - 0.85) / 0.15) : low.clone().lerp(high, t / 0.85);
    });
  }, [counts, accent, idle, dark, max]);

  const hoverColor = useMemo(() => new THREE.Color('#ffffff'), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    colors.forEach((color, i) => mesh.setColorAt(i, color));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [colors]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const now = clock.getElapsedTime();
    if (startedAt.current === null) startedAt.current = now;
    const elapsed = now - startedAt.current;

    // A slow scan line sweeps across the weeks, lifting bars as it passes.
    const scan = ((elapsed * 9) % (weeks + 30)) - 15;

    for (let i = 0; i < counts.length; i++) {
      const week = Math.floor(i / 7);
      const day = i % 7;
      // Rise-in wave: left to right, ~1.6s total.
      const rise = reducedMotion ? 1 : easeOut(Math.min(1, Math.max(0, (elapsed - week * 0.025 - day * 0.03) / 0.9)));
      const wave = reducedMotion ? 0 : Math.max(0, 1 - Math.abs(week - scan) / 3) * 0.18;
      const isHover = hovered.current === i;
      const h = heightFor(counts[i], max) * rise * (1 + wave) + (isHover ? 0.6 : 0);

      dummy.position.set((week - (weeks - 1) / 2) * PITCH, 0, (day - 3) * PITCH);
      dummy.scale.set(isHover ? 1.08 : 1, Math.max(0.001, h), isHover ? 1.08 : 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  const setHover = (id: number | null, event?: ThreeEvent<PointerEvent>) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    if (hovered.current !== null && hovered.current !== id) {
      mesh.setColorAt(hovered.current, colors[hovered.current]);
    }
    if (id !== null) mesh.setColorAt(id, hoverColor);
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    hovered.current = id;
    onHover(id, event?.nativeEvent.clientX ?? 0, event?.nativeEvent.clientY ?? 0);
  };

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, counts.length]}
      onPointerMove={(event) => {
        event.stopPropagation();
        setHover(event.instanceId ?? null, event);
      }}
      onPointerOut={() => setHover(null)}
    >
      <meshStandardMaterial roughness={0.35} metalness={0.15} toneMapped={false} />
    </instancedMesh>
  );
}

/**
 * Pulls the camera back on narrow canvases so the ~65-unit slab always fits,
 * keeping the same three-quarter view angle.
 */
function CameraFit() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const distance = THREE.MathUtils.clamp(104 / Math.pow(aspect, 0.8), 60, 160);
    const dir = new THREE.Vector3(0, 0.5, 1).normalize();
    camera.position.copy(dir.multiplyScalar(distance));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

/** Drag-to-rotate with inertia, falling back to a slow idle sway. */
function Rig({ children, reducedMotion }: { children: React.ReactNode; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { gl } = useThree();
  const state = useRef({ dragging: false, lastX: 0, lastY: 0, yaw: 0, pitch: 0, vYaw: 0, idle: 0 });

  useEffect(() => {
    const el = gl.domElement;
    const s = state.current;
    const down = (e: PointerEvent) => {
      s.dragging = true;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      el.style.cursor = 'grabbing';
    };
    const move = (e: PointerEvent) => {
      if (!s.dragging) return;
      const dx = e.clientX - s.lastX;
      const dy = e.clientY - s.lastY;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      s.vYaw = dx * 0.006;
      s.yaw += s.vYaw;
      s.pitch = THREE.MathUtils.clamp(s.pitch + dy * 0.003, -0.25, 0.35);
    };
    const up = () => {
      s.dragging = false;
      el.style.cursor = '';
    };
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const s = state.current;
    if (!s.dragging) {
      s.yaw += s.vYaw;
      s.vYaw *= 0.94;
      if (!reducedMotion) s.idle += delta;
    }
    const sway = reducedMotion ? 0 : Math.sin(s.idle * 0.25) * 0.12;
    g.rotation.y = -0.85 + s.yaw + sway;
    g.rotation.x = s.pitch;
  });

  return <group ref={group}>{children}</group>;
}

export default function SkylineScene(props: SceneProps) {
  const { counts, base, accent, running, reducedMotion } = props;
  const weeks = Math.ceil(counts.length / 7);
  const width = weeks * PITCH + 1.2;
  const depth = 7 * PITCH + 1.2;
  const plinth = useMemo(() => new THREE.BoxGeometry(width, 0.6, depth), [width, depth]);

  return (
    <Canvas
      frameloop={running ? 'always' : 'never'}
      dpr={[1, 2]}
      camera={{ position: [0, 30, 58], fov: 30, near: 1, far: 500 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: 'pan-y' }}
      onPointerMissed={() => props.onHover(null, 0, 0)}
    >
      <CameraFit />
      <ambientLight intensity={props.dark ? 0.55 : 1.1} />
      <directionalLight position={[-20, 40, 25]} intensity={props.dark ? 1.6 : 1.4} />
      <pointLight position={[18, 12, 10]} intensity={props.dark ? 260 : 120} color={accent} distance={60} />
      <Rig reducedMotion={reducedMotion}>
        <group position={[0, -1.5, 0]}>
          <Bars {...props} />
          {/* Plinth */}
          <mesh position={[0, -0.3, 0]} geometry={plinth}>
            <meshStandardMaterial color={base} roughness={0.8} />
          </mesh>
          <lineSegments position={[0, -0.3, 0]}>
            <edgesGeometry args={[plinth]} />
            <lineBasicMaterial color={accent} transparent opacity={0.35} />
          </lineSegments>
        </group>
      </Rig>
    </Canvas>
  );
}

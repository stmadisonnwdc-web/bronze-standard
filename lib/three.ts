/** 3D constants shared by the hero scene and its poster. */
export const HERO = {
  rotationSpeed: 0.06, // rad/s
  parallaxPx: 18,
  parallaxDeg: 2.5,
  lerp: 0.06,
  cameraStart: 8,
  cameraEnd: 4.5,
  scrollRotateDeg: 38,
  fov: 30,
  fpsFloor: 50,
  fpsStop: 20, // below this the device cannot render the scene: stop it and keep the poster
  fpsWindowMs: 2000,
  envFile: '/env/studio.hdr',
  material: { color: '#B08D57', metalness: 1, roughness: 0.28, clearcoat: 0.4, envMapIntensity: 0.9 },
  keyLight: { intensity: 2.2, color: '#FFE9C9' },
} as const;

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

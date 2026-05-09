"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { TextGeometry, type TextGeometryParameters } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

type AsteroidMesh = THREE.Mesh<THREE.IcosahedronGeometry, THREE.MeshStandardMaterial> & {
  userData: {
    rotSpeed: { x: number; y: number };
    floatOffset: number;
    floatSpeed: number;
    floatAmp: number;
  };
};

type ObjectWithRenderableParts = THREE.Object3D & {
  geometry?: THREE.BufferGeometry;
  material?: THREE.Material | THREE.Material[];
};

type SpaceIntroProps = {
  children?: ReactNode;
};

type ScrollState = {
  progress: number;
  sceneOpacity: number;
  heroOpacity: number;
  cameraZoom: number;
};

const textureKeys = [
  "map",
  "alphaMap",
  "aoMap",
  "bumpMap",
  "displacementMap",
  "emissiveMap",
  "envMap",
  "lightMap",
  "metalnessMap",
  "normalMap",
  "roughnessMap",
] as const;

function disposeMaterial(material: THREE.Material) {
  const textureMap = material as unknown as Record<string, THREE.Texture | null | undefined>;

  textureKeys.forEach((key) => {
    textureMap[key]?.dispose();
  });

  material.dispose();
}

export function SpaceIntro({ children }: SpaceIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const scrollStateRef = useRef<ScrollState>({
    progress: 0,
    sceneOpacity: 1,
    heroOpacity: 0,
    cameraZoom: 0,
  });
  const [loadProgress, setLoadProgress] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    const container = sceneRef.current;
    const pinContainer = containerRef.current;

    if (!container || !pinContainer) {
      return;
    }

    let disposed = false;
    let frameId = 0;
    let readyTimer: number | null = null;
    let loadProgressValue = 0;

    const updateLoad = (value: number) => {
      if (disposed) {
        return;
      }

      loadProgressValue = Math.max(loadProgressValue, value);
      setLoadProgress(loadProgressValue);

      if (loadProgressValue >= 100 && readyTimer === null) {
        readyTimer = window.setTimeout(() => {
          if (!disposed) {
            setSceneReady(true);
          }
        }, 550);
      }
    };

    setSceneReady(false);
    setLoadProgress(0);
    scrollStateRef.current.progress = 0;
    scrollStateRef.current.sceneOpacity = 1;
    scrollStateRef.current.heroOpacity = 0;
    scrollStateRef.current.cameraZoom = 0;

    let width = Math.max(container.clientWidth, 1);
    let height = Math.max(container.clientHeight, 1);

    const getPixelRatio = () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      return Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 2);
    };

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020210, 0.012);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
    camera.position.set(0, 2, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(getPixelRatio());
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.zIndex = "0";
    container.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(height, width),
      0.55,
      0.35,
      0.65
    );
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const updatePointer = (clientX: number, clientY: number) => {
      mouse.tx = (clientX / width) * 2 - 1;
      mouse.ty = -(clientY / height) * 2 + 1;
    };

    const handleMouseMove = (event: MouseEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];

      if (touch) {
        updatePointer(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    const ambientLight = new THREE.AmbientLight(0x101030, 0.4);
    ambientLight.name = "Ambient_Light";
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0x8899ff, 1.8);
    sunLight.name = "Sun_Light";
    sunLight.position.set(10, 8, 15);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 60;
    sunLight.shadow.camera.left = -20;
    sunLight.shadow.camera.right = 20;
    sunLight.shadow.camera.top = 20;
    sunLight.shadow.camera.bottom = -20;
    sunLight.shadow.bias = -0.001;
    sunLight.shadow.normalBias = 0.02;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x6633cc, 0.8);
    rimLight.name = "Rim_Light";
    rimLight.position.set(-8, 4, -10);
    scene.add(rimLight);

    const pointLight1 = new THREE.PointLight(0x00ccff, 2, 40);
    pointLight1.name = "Point_Cyan";
    pointLight1.position.set(-15, 5, -20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8833ff, 1.5, 35);
    pointLight2.name = "Point_Purple";
    pointLight2.position.set(15, -3, -15);
    scene.add(pointLight2);

    const Rocket = new THREE.Group();
    Rocket.name = "Rocket";

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xddeeff,
      metalness: 0.85,
      roughness: 0.18,
    });

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.9,
      roughness: 0.25,
    });

    const fuselageGeo = new THREE.CylinderGeometry(0.32, 0.45, 2.8, 24, 1);
    const fuselage = new THREE.Mesh(fuselageGeo, bodyMat);
    fuselage.name = "Rocket_Fuselage";
    fuselage.castShadow = true;
    Rocket.add(fuselage);

    const noseGeo = new THREE.ConeGeometry(0.32, 1.1, 24);
    const nose = new THREE.Mesh(noseGeo, bodyMat);
    nose.name = "Rocket_Nose";
    nose.position.y = 1.95;
    nose.castShadow = true;
    Rocket.add(nose);

    const noseTipGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const noseTipMat = new THREE.MeshStandardMaterial({
      color: 0x00ddff,
      emissive: 0x00ddff,
      emissiveIntensity: 3,
    });
    const noseTip = new THREE.Mesh(noseTipGeo, noseTipMat);
    noseTip.name = "Rocket_NoseTip";
    noseTip.position.y = 2.55;
    Rocket.add(noseTip);

    for (let i = 0; i < 3; i += 1) {
      const bandGeo = new THREE.CylinderGeometry(0.46 - i * 0.04, 0.46 - i * 0.04, 0.05, 24);
      const band = new THREE.Mesh(bandGeo, darkMat);
      band.name = `Rocket_Band_${i}`;
      band.position.y = 0.6 - i * 0.8;
      Rocket.add(band);
    }

    const windowGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0x00ccff,
      emissive: 0x0088cc,
      emissiveIntensity: 2,
      metalness: 0.1,
      roughness: 0.05,
      transparent: true,
      opacity: 0.9,
    });
    const windowMesh = new THREE.Mesh(windowGeo, windowMat);
    windowMesh.name = "Rocket_Window";
    windowMesh.position.set(0, 0.9, 0.4);
    windowMesh.scale.set(1, 1, 0.5);
    Rocket.add(windowMesh);

    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.6, -0.3);
    finShape.lineTo(0.15, -1);
    finShape.lineTo(0, -0.7);
    finShape.closePath();

    const finGeo = new THREE.ExtrudeGeometry(finShape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 2,
    });

    const finMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a4e,
      metalness: 0.9,
      roughness: 0.2,
    });

    for (let i = 0; i < 4; i += 1) {
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.name = `Rocket_Fin_${i}`;
      fin.rotation.y = (Math.PI / 2) * i;
      fin.position.y = -1;
      fin.castShadow = true;
      Rocket.add(fin);
    }

    const nozzleGeo = new THREE.CylinderGeometry(0.25, 0.35, 0.4, 20, 1, true);
    const nozzleMat = new THREE.MeshStandardMaterial({
      color: 0x333355,
      metalness: 0.95,
      roughness: 0.15,
      side: THREE.DoubleSide,
    });
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzle.name = "Rocket_Nozzle";
    nozzle.position.y = -1.6;
    Rocket.add(nozzle);

    const engineGlowGeo = new THREE.ConeGeometry(0.28, 1.8, 16, 1, true);
    const engineGlowMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPos;
        void main(){
          vUv = uv;
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vPos;
        uniform float uTime;
        void main(){
          float t = vUv.y;
          float flicker = sin(uTime * 12.0 + vPos.x * 30.0) * 0.15 + 0.85;
          float flicker2 = sin(uTime * 18.0 + vPos.z * 25.0) * 0.1 + 0.9;
          float alpha = pow(t, 1.5) * flicker * flicker2;
          vec3 col = mix(vec3(0.0, 0.6, 1.0), vec3(0.5, 0.8, 1.0), t);
          col = mix(col, vec3(1.0, 1.0, 1.0), pow(t, 3.0));
          gl_FragColor = vec4(col, alpha * 0.85);
        }
      `,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const engineGlow = new THREE.Mesh(engineGlowGeo, engineGlowMat);
    engineGlow.name = "Rocket_Engine";
    engineGlow.rotation.x = Math.PI;
    engineGlow.position.y = -2.5;
    Rocket.add(engineGlow);

    const engineLight = new THREE.PointLight(0x00ccff, 4, 8);
    engineLight.name = "Rocket_EngineLight";
    engineLight.position.y = -2;
    Rocket.add(engineLight);

    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleOffsets = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i += 1) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 0.5;
      particlePositions[i * 3 + 1] = -Math.random() * 3;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      particleSpeeds[i] = Math.random() * 0.04 + 0.02;
      particleOffsets[i] = Math.random() * Math.PI * 2;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x44ccff,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const engineParticles = new THREE.Points(particleGeo, particleMat);
    engineParticles.name = "Rocket_Particles";
    engineParticles.position.y = -1.8;
    Rocket.add(engineParticles);

    const startPos = new THREE.Vector3(-3, 0.5, 5);
    const endPos = new THREE.Vector3(10, -1, -28);
    const autoPos = new THREE.Vector3();
    const cameraStartPos = new THREE.Vector3(0, 2, 18);
    const cameraEndPos = new THREE.Vector3(8.5, -0.5, -14);
    const cameraAutoPos = new THREE.Vector3();
    const lookTarget = new THREE.Vector3();

    Rocket.rotation.x = 0.15;
    Rocket.rotation.z = -0.08;
    Rocket.position.copy(startPos);
    scene.add(Rocket);

    updateLoad(25);

    const Planet = new THREE.Group();
    Planet.name = "Planet";
    Planet.position.set(12, -2, -35);

    const planetGeo = new THREE.SphereGeometry(8, 96, 96);
    const planetMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        void main(){
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelMatrix * vec4(position,1.0)).xyz;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uLightDir;

        vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
        vec4 mod289(vec4 x){ return x - floor(x*(1.0/289.0))*289.0; }
        vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v){
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0+1.0;
          vec4 s1 = floor(b1)*2.0+1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
        }

        void main(){
          vec3 n = normalize(vNormal);
          float diff = max(dot(n, normalize(uLightDir)), 0.0);
          vec3 noisePos = vPosition * 0.15 + vec3(uTime * 0.01);
          float terrain = snoise(noisePos) * 0.5 + 0.5;
          float detail = snoise(vPosition * 0.4) * 0.3;
          vec3 deepColor = vec3(0.05, 0.08, 0.25);
          vec3 midColor = vec3(0.1, 0.2, 0.5);
          vec3 highColor = vec3(0.2, 0.5, 0.8);
          vec3 cityColor = vec3(0.0, 0.9, 1.0);
          vec3 surfaceColor = mix(deepColor, midColor, terrain);
          surfaceColor = mix(surfaceColor, highColor, smoothstep(0.6, 0.8, terrain + detail));
          float cityNoise = snoise(vPosition * 0.8) * 0.5 + 0.5;
          float cityMask = smoothstep(0.62, 0.68, cityNoise) * (1.0 - smoothstep(0.0, 0.3, diff));
          surfaceColor += cityColor * cityMask * 1.5;
          vec3 finalColor = surfaceColor * (diff * 0.7 + 0.3);
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - max(dot(viewDir, n), 0.0), 3.0);
          finalColor += vec3(0.15, 0.35, 0.8) * fresnel * 0.8;
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uLightDir: { value: new THREE.Vector3(1, 0.5, 1).normalize() },
      },
    });

    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    planetMesh.name = "Planet_Surface";
    planetMesh.castShadow = true;
    planetMesh.receiveShadow = true;
    Planet.add(planetMesh);

    const atmosGeo = new THREE.SphereGeometry(8.3, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main(){
          vNormal = normalize(normalMatrix * normal);
          vWorldPos = (modelMatrix * vec4(position,1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        uniform float uTime;
        void main(){
          vec3 viewDir = normalize(cameraPosition - vWorldPos);
          float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
          float intensity = pow(rim, 2.5);
          vec3 col = mix(vec3(0.1, 0.3, 0.8), vec3(0.3, 0.1, 0.6), rim);
          float pulse = sin(uTime * 0.8) * 0.1 + 0.9;
          gl_FragColor = vec4(col, intensity * 0.6 * pulse);
        }
      `,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    atmosMesh.name = "Planet_Glow";
    Planet.add(atmosMesh);

    const outerGlowGeo = new THREE.SphereGeometry(9, 32, 32);
    const outerGlowMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main(){
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main(){
          float intensity = pow(0.45 - dot(vNormal, vec3(0,0,1)), 4.0);
          gl_FragColor = vec4(0.15, 0.25, 0.7, 1.0) * intensity * 0.25;
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const outerGlow = new THREE.Mesh(outerGlowGeo, outerGlowMat);
    outerGlow.name = "Planet_OuterGlow";
    Planet.add(outerGlow);

    const planetLight = new THREE.PointLight(0x4488ff, 5, 60);
    planetLight.name = "Planet_Light";
    planetLight.position.set(0, 0, 10);
    Planet.add(planetLight);

    scene.add(Planet);
    updateLoad(45);

    const starsGeo = new THREE.BufferGeometry();
    const starCount = width < 768 ? 6000 : 12000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i += 1) {
      const r = 200 + Math.random() * 800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      const color = new THREE.Color();
      color.setHSL(0.55 + Math.random() * 0.15, 0.4 + Math.random() * 0.3, 0.7 + Math.random() * 0.3);
      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;
    }

    starsGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starsGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starsMat = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const Stars = new THREE.Points(starsGeo, starsMat);
    Stars.name = "Stars";
    scene.add(Stars);

    const Asteroids = new THREE.Group();
    Asteroids.name = "Asteroids";

    const asteroidMat = new THREE.MeshStandardMaterial({
      color: 0x444466,
      metalness: 0.6,
      roughness: 0.55,
    });

    const asteroidCount = width < 768 ? 18 : 30;

    for (let i = 0; i < asteroidCount; i += 1) {
      const asteroidSize = Math.random() * 0.3 + 0.08;
      const geo = new THREE.IcosahedronGeometry(asteroidSize, Math.floor(Math.random() * 2));
      const positions = geo.attributes.position;

      for (let j = 0; j < positions.count; j += 1) {
        positions.setXYZ(
          j,
          positions.getX(j) + (Math.random() - 0.5) * asteroidSize * 0.5,
          positions.getY(j) + (Math.random() - 0.5) * asteroidSize * 0.5,
          positions.getZ(j) + (Math.random() - 0.5) * asteroidSize * 0.5,
        );
      }

      geo.computeVertexNormals();

      const asteroid = new THREE.Mesh(geo, asteroidMat) as AsteroidMesh;
      asteroid.name = `Asteroid_${i}`;
      asteroid.position.set((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 30, -Math.random() * 50 - 5);
      asteroid.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      asteroid.userData.rotSpeed = {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
      };
      asteroid.userData.floatOffset = Math.random() * Math.PI * 2;
      asteroid.userData.floatSpeed = Math.random() * 0.3 + 0.1;
      asteroid.userData.floatAmp = Math.random() * 0.3 + 0.1;
      asteroid.castShadow = true;
      Asteroids.add(asteroid);
    }

    scene.add(Asteroids);
    updateLoad(55);

    const Nebula = new THREE.Group();
    Nebula.name = "Nebula";

    const createNebulaPlane = (color: THREE.Color, size: number, pos: THREE.Vector3, rot: THREE.Euler, opacity: number) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return null;
      }

      const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      gradient.addColorStop(0, `rgba(${Math.floor(color.r * 255)},${Math.floor(color.g * 255)},${Math.floor(color.b * 255)},${opacity})`);
      gradient.addColorStop(
        0.4,
        `rgba(${Math.floor(color.r * 200)},${Math.floor(color.g * 200)},${Math.floor(color.b * 200)},${opacity * 0.4})`,
      );
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
        opacity: 1,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), material);
      mesh.position.copy(pos);
      mesh.rotation.set(rot.x, rot.y, rot.z);
      return mesh;
    };

    const nebulaColors = [
      new THREE.Color(0.1, 0.15, 0.5),
      new THREE.Color(0.2, 0.05, 0.4),
      new THREE.Color(0.05, 0.2, 0.5),
      new THREE.Color(0.15, 0.1, 0.35),
    ];

    const nebulaCount = width < 768 ? 10 : 15;

    for (let i = 0; i < nebulaCount; i += 1) {
      const color = nebulaColors[i % nebulaColors.length];
      const size = 30 + Math.random() * 50;
      const pos = new THREE.Vector3((Math.random() - 0.5) * 120, (Math.random() - 0.5) * 60, -40 - Math.random() * 80);
      const rot = new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const nebulaCloud = createNebulaPlane(color, size, pos, rot, 0.15 + Math.random() * 0.1);

      if (nebulaCloud) {
        nebulaCloud.name = `Nebula_Cloud_${i}`;
        Nebula.add(nebulaCloud);
      }
    }

    scene.add(Nebula);

    const Particles = new THREE.Group();
    Particles.name = "Particles";

    const ambientParticleCount = width < 768 ? 260 : 500;
    const ambientParticleGeo = new THREE.BufferGeometry();
    const ambientParticlePos = new Float32Array(ambientParticleCount * 3);

    for (let i = 0; i < ambientParticleCount; i += 1) {
      ambientParticlePos[i * 3] = (Math.random() - 0.5) * 80;
      ambientParticlePos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      ambientParticlePos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;
    }

    ambientParticleGeo.setAttribute("position", new THREE.BufferAttribute(ambientParticlePos, 3));

    const ambientParticleMat = new THREE.PointsMaterial({
      color: 0x6688cc,
      size: 0.08,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const ambientParticles = new THREE.Points(ambientParticleGeo, ambientParticleMat);
    ambientParticles.name = "Ambient_Particles";
    Particles.add(ambientParticles);
    scene.add(Particles);

    updateLoad(70);

    const Ahmed_Name = new THREE.Group();
    Ahmed_Name.name = "Ahmed_Name";
    Ahmed_Name.position.set(2, 3.5, 0);
    scene.add(Ahmed_Name);

    const fontLoader = new FontLoader();

    fontLoader.load(
      "/fonts/helvetiker_regular.typeface.json",
      (font) => {
        if (disposed) {
          return;
        }

        const isMobileText = width < 768;
        const textOptions: TextGeometryParameters = {
          font,
          size: isMobileText ? 0.48 : 0.65,
          depth: 0.12,
          curveSegments: 20,
          bevelEnabled: true,
          bevelThickness: 0.015,
          bevelSize: 0.01,
          bevelSegments: 5,
        };

        const nameGeo = new TextGeometry("Ahmed Wael Alkaliby", textOptions);
        nameGeo.computeBoundingBox();
        nameGeo.center();

        const nameMat = new THREE.MeshStandardMaterial({
          color: 0xdff8ff,
          emissive: 0x0099ff,
          emissiveIntensity: 0.25,
          metalness: 0.2,
          roughness: 0.25,
        });

        const nameMesh = new THREE.Mesh(nameGeo, nameMat);
        nameMesh.name = "Ahmed_Name_Text";
        Ahmed_Name.add(nameMesh);

        const subOptions: TextGeometryParameters = {
          ...textOptions,
          size: isMobileText ? 0.13 : 0.18,
          depth: 0.02,
          bevelThickness: 0.005,
          bevelSize: 0.003,
        };
        const subGeo = new TextGeometry("Full Stack Developer / Creative Engineer", subOptions);
        subGeo.computeBoundingBox();
        subGeo.center();
        const subMat = new THREE.MeshBasicMaterial({
          color: 0x9edfff,
          transparent: true,
          opacity: 0.95,
        });
        const subMesh = new THREE.Mesh(subGeo, subMat);
        subMesh.name = "Ahmed_Name_Sub";
        subMesh.position.y = -0.7;
        Ahmed_Name.add(subMesh);

        const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-4, 0, 0), new THREE.Vector3(4, 0, 0)]);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0x0088ff,
          transparent: true,
          opacity: 0.3,
          blending: THREE.AdditiveBlending,
        });

        const topLine = new THREE.Line(lineGeo, lineMat);
        topLine.name = "Ahmed_Name_TopLine";
        topLine.position.y = 0.5;
        Ahmed_Name.add(topLine);

        const bottomLine = new THREE.Line(lineGeo.clone(), lineMat.clone());
        bottomLine.name = "Ahmed_Name_BottomLine";
        bottomLine.position.y = -1.1;
        Ahmed_Name.add(bottomLine);

        const bracketGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0.3, 0),
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0.3, 0, 0),
        ]);
        const bracketMat = new THREE.LineBasicMaterial({
          color: 0x00ccff,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
        });

        [
          { x: -4.5, y: 0.7, sx: 1, sy: 1 },
          { x: 4.5, y: 0.7, sx: -1, sy: 1 },
          { x: -4.5, y: -1.3, sx: 1, sy: -1 },
          { x: 4.5, y: -1.3, sx: -1, sy: -1 },
        ].forEach((position, index) => {
          const bracket = new THREE.Line(bracketGeo.clone(), bracketMat.clone());
          bracket.name = `Ahmed_Name_Bracket_${index}`;
          bracket.position.set(position.x, position.y, 0);
          bracket.scale.set(position.sx, position.sy, 1);
          Ahmed_Name.add(bracket);
        });

        updateLoad(100);
      },
      undefined,
      () => {
        updateLoad(100);
      }
    );

    const timeUpdateMaterials: THREE.ShaderMaterial[] = [];
    const mouseUpdateMaterials: THREE.ShaderMaterial[] = [];

    const cacheMaterials = (group: THREE.Group) => {
      group.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((m) => {
            if ("uniforms" in m) {
              const uniforms = (m as THREE.ShaderMaterial).uniforms;
              if (uniforms.uTime) timeUpdateMaterials.push(m as THREE.ShaderMaterial);
              if (uniforms.uMouse) mouseUpdateMaterials.push(m as THREE.ShaderMaterial);
            }
          });
        }
      });
    };

    cacheMaterials(Ahmed_Name);

    updateLoad(92);

    const Camera_Target = new THREE.Object3D();
    Camera_Target.name = "Camera_Target";
    Camera_Target.position.copy(camera.position);
    scene.add(Camera_Target);

    let basePlanetX = 12;
    let basePlanetY = -2;
    let basePlanetScale = 1;
    let baseNameX = 2;
    let baseNameY = 3.5;

    const applyResponsiveLayout = () => {
      const isMobile = width < 768;

      basePlanetX = isMobile ? 8.2 : 12;
      basePlanetY = isMobile ? -3.1 : -2;
      basePlanetScale = isMobile ? 0.82 : 1;
      baseNameX = isMobile ? 0 : 2;
      baseNameY = isMobile ? 3.2 : 3.5;

      camera.fov = isMobile ? 68 : 60;
      camera.position.z = isMobile ? 21 : 18;
      camera.updateProjectionMatrix();

      Rocket.scale.setScalar(isMobile ? 0.76 : 1);
      Planet.scale.setScalar(basePlanetScale);
      Ahmed_Name.scale.setScalar(isMobile ? 0.72 : 1);
      Ahmed_Name.position.x = baseNameX;
    };

    const handleResize = () => {
      width = Math.max(container.clientWidth, 1);
      height = Math.max(container.clientHeight, 1);
      camera.aspect = width / height;
      renderer.setPixelRatio(getPixelRatio());
      renderer.setSize(width, height);
      composer.setSize(width, height);
      bloomPass.setSize(width, height);
      applyResponsiveLayout();
    };

    window.addEventListener("resize", handleResize);
    applyResponsiveLayout();

    gsap.registerPlugin(ScrollTrigger);

    const scrollState = scrollStateRef.current;
    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: pinContainer,
        start: "top top",
        end: "+=400%",
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    timeline
      .to(scrollState, { progress: 1, cameraZoom: 1, duration: 1 }, 0)
      .to(scrollState, { sceneOpacity: 0, duration: 0.22 }, 0.78)
      .to(scrollState, { heroOpacity: 1, duration: 0.24 }, 0.76);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    let time = 0;
    const timer = new THREE.Timer();

    const lastState = {
      sceneOpacity: -1,
      heroOpacity: -1,
      pointerEvents: "",
    };

    const animate = () => {
      if (disposed) {
        return;
      }

      frameId = window.requestAnimationFrame(animate);
      timer.update();
      const delta = timer.getDelta();
      time += delta;

      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      const progress = THREE.MathUtils.clamp(scrollState.progress, 0, 1);
      const cameraZoom = THREE.MathUtils.clamp(scrollState.cameraZoom, 0, 1);

      if (sceneRef.current && lastState.sceneOpacity !== scrollState.sceneOpacity) {
        sceneRef.current.style.opacity = String(scrollState.sceneOpacity);
        lastState.sceneOpacity = scrollState.sceneOpacity;
      }

      if (heroRef.current) {
        if (lastState.heroOpacity !== scrollState.heroOpacity) {
          heroRef.current.style.opacity = String(scrollState.heroOpacity);
          lastState.heroOpacity = scrollState.heroOpacity;
        }
        const nextPointerEvents = scrollState.heroOpacity > 0.95 ? "auto" : "none";
        if (lastState.pointerEvents !== nextPointerEvents) {
          heroRef.current.style.pointerEvents = nextPointerEvents;
          lastState.pointerEvents = nextPointerEvents;
        }
      }

      autoPos.copy(startPos).lerp(endPos, progress);

      const controlStrength = 1 - progress * 0.85;
      const targetX = mouse.x * 4;
      const targetY = mouse.y * 2.5;
      const mouseOffsetX = targetX * controlStrength;
      const mouseOffsetY = targetY * controlStrength;

      Rocket.position.x += (autoPos.x + mouseOffsetX - Rocket.position.x) * 0.06;
      Rocket.position.y += (autoPos.y + mouseOffsetY - Rocket.position.y) * 0.06;
      Rocket.position.z += (autoPos.z - Rocket.position.z) * 0.04;

      const rocketTarget = new THREE.Vector3(Planet.position.x, Planet.position.y, Planet.position.z);

      const direction = new THREE.Vector3()
        .subVectors(rocketTarget, Rocket.position)
        .normalize();

      if (direction.lengthSq() > 0.0001) {
        const localNoseAxis = new THREE.Vector3(0, 1, 0); // rocket nose direction
        const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
          localNoseAxis,
          direction
        );

        const uprightQuaternion = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(0.15, 0, -0.08)
        );

        const rotateStart = 0.12;
        const rotateEnd = 0.35;

        const rotateMix = THREE.MathUtils.smoothstep(
          progress,
          rotateStart,
          rotateEnd
        );

        const finalQuaternion = uprightQuaternion.clone().slerp(
          targetQuaternion,
          rotateMix
        );

        const mouseStrength = 1 - progress * 0.8;

        const bank = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            mouse.y * 0.12 * mouseStrength,
            0,
            -mouse.x * 0.25 * mouseStrength
          )
        );

        finalQuaternion.multiply(bank);

        Rocket.quaternion.slerp(finalQuaternion, 0.08);
      }

      cameraAutoPos.copy(cameraStartPos).lerp(cameraEndPos, cameraZoom);
      camera.position.x += (cameraAutoPos.x + mouse.x * 0.35 * (1 - progress) - camera.position.x) * 0.06;
      camera.position.y += (cameraAutoPos.y + mouse.y * 0.2 * (1 - progress) - camera.position.y) * 0.06;
      camera.position.z += (cameraAutoPos.z - camera.position.z) * 0.06;

      lookTarget.copy(Rocket.position).lerp(Planet.position, progress * 0.78);
      lookTarget.z -= 8 * (1 - progress);
      Camera_Target.position.copy(lookTarget);
      camera.lookAt(Camera_Target.position);

      engineGlowMat.uniforms.uTime.value = time;
      const engineScale = 0.85 + Math.sin(time * 6) * 0.15;
      engineGlow.scale.set(engineScale, 1 + Math.sin(time * 8) * 0.1, engineScale);
      engineLight.intensity = 3 + Math.sin(time * 5) * 1.5;

      const engineParticlePositions = engineParticles.geometry.getAttribute("position") as THREE.BufferAttribute;

      for (let i = 0; i < particleCount; i += 1) {
        let y = engineParticlePositions.getY(i) - particleSpeeds[i];

        if (y < -3) {
          y = 0;
          engineParticlePositions.setX(i, (Math.random() - 0.5) * 0.4);
          engineParticlePositions.setZ(i, (Math.random() - 0.5) * 0.4);
        }

        engineParticlePositions.setX(i, engineParticlePositions.getX(i) + Math.sin(time * 10 + particleOffsets[i]) * 0.002);
        engineParticlePositions.setY(i, y);
      }

      engineParticlePositions.needsUpdate = true;

      planetMesh.rotation.y += 0.001;
      planetMat.uniforms.uTime.value = time;
      atmosMat.uniforms.uTime.value = time;

      Planet.position.x = basePlanetX + mouse.x * 0.5 * (1 - progress);
      Planet.position.y = basePlanetY + mouse.y * 0.3 * (1 - progress);
      Planet.scale.setScalar(basePlanetScale * (0.82 + progress * 1.25));

      Asteroids.children.forEach((child) => {
        const asteroid = child as AsteroidMesh;
        asteroid.rotation.x += asteroid.userData.rotSpeed.x;
        asteroid.rotation.y += asteroid.userData.rotSpeed.y;
        asteroid.position.y += Math.sin(time * asteroid.userData.floatSpeed + asteroid.userData.floatOffset) * 0.002 * asteroid.userData.floatAmp;
      });

      Stars.rotation.y = mouse.x * 0.02;
      Stars.rotation.x = mouse.y * 0.01;
      starsMat.opacity = 0.7 + Math.sin(time * 1.5) * 0.15;

      Nebula.position.x = mouse.x * 1.5;
      Nebula.position.y = mouse.y * 0.8;

      const ambientPositions = ambientParticles.geometry.getAttribute("position") as THREE.BufferAttribute;

      for (let i = 0; i < ambientParticleCount; i += 1) {
        ambientPositions.setY(i, ambientPositions.getY(i) + Math.sin(time * 0.5 + i) * 0.003);
        ambientPositions.setX(i, ambientPositions.getX(i) + Math.cos(time * 0.3 + i * 0.5) * 0.002);
      }

      ambientPositions.needsUpdate = true;

      Ahmed_Name.position.y = baseNameY + Math.sin(time * 0.6) * 0.15;
      Ahmed_Name.rotation.y = Math.sin(time * 0.3) * 0.03 + mouse.x * 0.05;

      timeUpdateMaterials.forEach((material) => {
        material.uniforms.uTime.value = time;
      });

      mouseUpdateMaterials.forEach((material) => {
        material.uniforms.uMouse.value.set(mouse.x, mouse.y);
      });

      composer.render();
    };

    animate();

    return () => {
      disposed = true;

      if (readyTimer !== null) {
        window.clearTimeout(readyTimer);
      }

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      timeline.scrollTrigger?.kill();
      timeline.kill();

      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();

      scene.traverse((object) => {
        const renderable = object as ObjectWithRenderableParts;

        if (renderable.geometry) {
          geometries.add(renderable.geometry);
        }

        if (renderable.material) {
          if (Array.isArray(renderable.material)) {
            renderable.material.forEach((material) => materials.add(material));
          } else {
            materials.add(renderable.material);
          }
        }
      });

      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach(disposeMaterial);
      composer.dispose();
      renderer.renderLists.dispose();
      renderer.dispose();
      renderer.forceContextLoss();

      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative z-10 h-screen w-full cursor-crosshair overflow-hidden bg-black"
      aria-label="Interactive space intro"
    >
      <div ref={sceneRef} data-space-intro-scene className="absolute inset-0 h-full w-full">
        <div
          className={`pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-black transition-[opacity,visibility] duration-1000 ${sceneReady ? "invisible opacity-0" : "visible opacity-100"
            }`}
        >
          <div className="text-center text-[11px] font-light uppercase tracking-[0.55em] text-brand-200/80 sm:text-xs">
            Initializing Journey
          </div>
          <div className="mt-5 h-px w-52 overflow-hidden bg-brand-300/15 shadow-[0_0_24px_rgba(34,211,238,0.22)]">
            <div
              className="h-full bg-brand-200 shadow-[0_0_18px_rgba(103,232,249,0.9)] transition-transform duration-300 origin-left"
              style={{ transform: `scaleX(${loadProgress / 100})` }}
            />
          </div>
        </div>



        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-4 px-4 text-[10px] font-light uppercase tracking-[0.3em] text-brand-200/50 sm:gap-5 sm:text-[11px]">
          <span >Explore</span>
          <span className="h-px w-5 bg-brand-200/20" />
          <span>My</span>
          <span className="h-px w-5 bg-brand-200/20" />
          <span>World</span>
        </div>
      </div>

      <div ref={heroRef} data-space-intro-hero className="pointer-events-none absolute inset-0 z-30 opacity-0">
        {children}
      </div>
    </section>
  );
}

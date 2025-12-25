
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CompanionState } from '../types';

interface AuraAvatarProps {
  state: CompanionState;
  isThinking: boolean;
  isTalking: boolean;
}

const AuraAvatar: React.FC<AuraAvatarProps> = ({ state, isThinking, isTalking }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- SETUP ---
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    
    // Camera positioned for portrait bust view
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    // --- LIGHTING (Cinematic) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0x6366f1, 2, 20); // Indigo main
    mainLight.position.set(2, 2, 5);
    scene.add(mainLight);

    const fillLight = new THREE.PointLight(0xf472b6, 2, 20); // Pink fill
    fillLight.position.set(-3, 0, 4);
    scene.add(fillLight);

    const rimLight = new THREE.SpotLight(0xa5b4fc, 5);
    rimLight.position.set(0, 5, -5);
    rimLight.lookAt(0, 0, 0);
    scene.add(rimLight);

    // --- OBJECTS GROUP ---
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    // --- PROCEDURAL GENERATION HELPERS ---
    const createProceduralAvatar = () => {
      setUsingFallback(true);
      
      // 1. HEAD (Glassy Iridescent)
      const headGeo = new THREE.SphereGeometry(1, 64, 64);
      const headMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.6, // Glass-like
        thickness: 1,
        iridescence: 1,
        iridescenceIOR: 1.3,
        clearcoat: 1,
      });
      const head = new THREE.Mesh(headGeo, headMat);
      avatarGroup.add(head);

      // 2. FACE (Glowing Eyes)
      const eyeGeo = new THREE.CapsuleGeometry(0.12, 0.1, 4, 8);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x6366f1 });
      
      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-0.35, 0.1, 0.85);
      leftEye.rotation.z = Math.PI / 2;
      head.add(leftEye);

      const rightEye = new THREE.Mesh(eyeGeo, eyeMat.clone());
      rightEye.position.set(0.35, 0.1, 0.85);
      rightEye.rotation.z = Math.PI / 2;
      head.add(rightEye);

      // Mouth (Small capsule)
      const mouthGeo = new THREE.CapsuleGeometry(0.05, 0.1, 4, 8);
      const mouthMat = new THREE.MeshBasicMaterial({ color: 0xf472b6 });
      const mouth = new THREE.Mesh(mouthGeo, mouthMat);
      mouth.position.set(0, -0.25, 0.9);
      mouth.rotation.z = Math.PI / 2;
      head.add(mouth);

      // 3. BUTTERFLY CROWN (Floating Crystals)
      const crownGroup = new THREE.Group();
      const gemGeo = new THREE.OctahedronGeometry(0.15, 0);
      const gemMat = new THREE.MeshStandardMaterial({ 
        color: 0xa5b4fc, 
        emissive: 0x6366f1, 
        emissiveIntensity: 2,
        roughness: 0 
      });

      for (let i = 0; i < 5; i++) {
        const gem = new THREE.Mesh(gemGeo, gemMat);
        const angle = (i / 5) * Math.PI * 2; // Semicircle layout
        gem.position.set(Math.cos(angle) * 0.6, 0.2 + Math.sin(angle)*0.2, Math.sin(angle) * 0.6);
        crownGroup.add(gem);
      }
      crownGroup.position.y = 1.2;
      avatarGroup.add(crownGroup);

      // 4. WINGS (Glowing Planes)
      const wingGeo = new THREE.CircleGeometry(1.2, 32, 0, Math.PI * 1.5);
      const wingMat = new THREE.MeshStandardMaterial({
        color: 0xf0abfc,
        emissive: 0xd946ef,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        roughness: 0,
        metalness: 0.8
      });

      const wingL1 = new THREE.Mesh(wingGeo, wingMat);
      wingL1.position.set(-0.8, 0, -0.5);
      wingL1.rotation.y = -Math.PI / 6;
      wingL1.scale.set(1, 1.5, 1);
      avatarGroup.add(wingL1);

      const wingR1 = new THREE.Mesh(wingGeo, wingMat);
      wingR1.position.set(0.8, 0, -0.5);
      wingR1.rotation.y = Math.PI / 6;
      wingR1.rotation.z = Math.PI; // Flip
      wingR1.scale.set(1, 1.5, 1);
      avatarGroup.add(wingR1);

      return { head, leftEye, rightEye, mouth, crownGroup, wings: [wingL1, wingR1] };
    };

    let parts: any = null;

    // --- LOAD MODEL OR FALLBACK ---
    const loader = new GLTFLoader();
    loader.load(
      '/avatar.glb',
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.5, 1.5, 1.5);
        model.position.y = -2;
        avatarGroup.add(model);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.log("Using Holographic Fallback");
        parts = createProceduralAvatar();
        setLoading(false);
      }
    );

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();
    let mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      const t = clock.getElapsedTime();
      requestAnimationFrame(animate);

      if (avatarGroup) {
        // Floating Idle
        avatarGroup.position.y = Math.sin(t * 1) * 0.1 - (usingFallback ? 0 : 2);
        
        // Look at Mouse (Subtle)
        const targetRotX = mouse.y * 0.2;
        const targetRotY = mouse.x * 0.2;
        avatarGroup.rotation.x += (targetRotX - avatarGroup.rotation.x) * 0.1;
        avatarGroup.rotation.y += (targetRotY - avatarGroup.rotation.y) * 0.1;
      }

      if (parts) {
        // Blink Logic
        if (Math.random() > 0.99) {
          parts.leftEye.scale.y = 0.1;
          parts.rightEye.scale.y = 0.1;
        } else {
          parts.leftEye.scale.y += (1 - parts.leftEye.scale.y) * 0.2;
          parts.rightEye.scale.y += (1 - parts.rightEye.scale.y) * 0.2;
        }

        // Talking Logic (Mouth movement)
        const targetMouthScale = isTalking ? 0.5 + Math.sin(t * 20) * 0.5 : 0.1;
        parts.mouth.scale.x += (targetMouthScale - parts.mouth.scale.x) * 0.2;

        // Wing Flap
        const flapSpeed = isThinking ? 10 : 2;
        parts.wings[0].rotation.y = -Math.PI/6 + Math.sin(t * flapSpeed) * 0.2;
        parts.wings[1].rotation.y = Math.PI/6 - Math.sin(t * flapSpeed) * 0.2;

        // Crown Spin
        parts.crownGroup.rotation.y = t * 0.2;
        parts.crownGroup.position.y = 1.2 + Math.sin(t * 2) * 0.05;

        // Color/Emotion Reactivity
        const eyeColor = new THREE.Color();
        if (state === CompanionState.WARNING) eyeColor.set(0xef4444);
        else if (state === CompanionState.HAPPY) eyeColor.set(0xf472b6);
        else if (state === CompanionState.PROCESSING) eyeColor.set(0xf59e0b);
        else eyeColor.set(0x6366f1);
        
        parts.leftEye.material.color.lerp(eyeColor, 0.1);
        parts.rightEye.material.color.lerp(eyeColor, 0.1);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [state, isThinking, isTalking]);

  return (
    <div className="relative w-[500px] h-[500px] flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* HUD Overlay */}
      <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
        <div className={`text-[10px] font-mono tracking-[0.3em] ${
          state === CompanionState.WARNING ? 'text-red-400' : 'text-indigo-300'
        } opacity-80`}>
          AURA SYSTEM: {loading ? 'INITIALIZING...' : 'ONLINE'}
        </div>
        {usingFallback && !loading && (
           <div className="text-[8px] text-indigo-500/50 mt-1 tracking-widest">HOLOGRAPHIC PROJECTION MODE</div>
        )}
      </div>
    </div>
  );
};

export default AuraAvatar;

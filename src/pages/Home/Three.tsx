import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
// import DefaultImage from "../../assets/images/kandinsky.jpeg";

import { Center, Decal, OrbitControls, RoundedBox } from "@react-three/drei";
import styled from "styled-components/macro";
import { ControlsPanel, useControls } from "components/controls";
import { Environment, useTexture, Sparkles, Float } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { a, useSpring } from "@react-spring/three";
import { easeExpInOut } from "d3-ease";
// import "./styles.css";

const roundedSquareVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const roundedSquareFragmentShader = `
uniform sampler2D map;
varying vec2 vUv;
void main() {
  float borderSize = 0.02;
  float radius = 0.1;
  vec2 uv = vUv * 2.0 - vec2(1.0);
  float squaredRadius = radius * radius;
  float dist = dot(uv, uv);
  if (dist > squaredRadius) {
    discard;
  }
  gl_FragColor = texture2D(map, vUv);
}
`;

function Sticker({ url, ...props }) {
  const emoji = useTexture(url);
  return (
    <Decal {...props}>
      <meshPhysicalMaterial
        transparent
        polygonOffset
        polygonOffsetFactor={-10}
        map={emoji}
        map-flipY={false}
        map-anisotropy={16}
        iridescence={1}
        iridescenceIOR={1}
        iridescenceThicknessRange={[0, 1400]}
        roughness={1}
        clearcoat={0.5}
        metalness={0.75}
        toneMapped={false}
      />
    </Decal>
  );
}

function TradingCard(props) {
  const ref = useRef();

  const map = useTexture("1.png");
  const nMap = useTexture("foil-normal3.jpeg");

  const aMap = useTexture("alpha2.jpeg");

  // const { ...material } = useControls({
  //   color: "#fff",
  //   emissive: "#ffefe7",
  //   roughness: { value: 0.34, min: 0, max: 1 },
  //   metalness: { value: 0.99, min: 0, max: 1 },
  //   transmission: { value: 0.08, min: 0, max: 1 },
  //   thickness: { value: 0 },
  //   normalScale: { value: -0.0, min: -1, max: 1, step: 0.01 },
  //   envMapIntensity: { value: 0.6, min: 0, max: 2 },

  //   iridescence: { value: 1, min: 0, max: 1 },
  //   iridescenceIOR: { value: 3, min: 0, max: 3 },
  // });
  const { ...material } = {
    color: "#fff",
    emissive: "#ffefe7",
    roughness: 0.34,
    metalness: 0.99,
    transmission: 0.08,
    thickness: 0,
    normalScale: -0.0,
    envMapIntensity: 0.6,

    iridescence: 1,
    iridescenceIOR: 3,
  };

  const geometry = new THREE.BoxGeometry(2.5, 4, 0.02);

  // const

  const material2 = new THREE.ShaderMaterial({
    uniforms: {
      map: { value: map },
    },
    vertexShader: roundedSquareVertexShader,
    fragmentShader: roundedSquareFragmentShader,
    side: THREE.DoubleSide,
  });

  const uvs = geometry.attributes.uv.array;
  for (let i = 0; i < uvs.length; i += 2) {
    uvs[i] *= 1; // scale horizontally
    uvs[i + 1] *= 1.1; // scale vertically
  }

  return (
    <group ref={ref} {...props}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          {...material}
          // {...material2}
          map={map}
          normalMap={nMap}
          normalMap-encoding={THREE.LinearEncoding}
          normalMap-wrapT={THREE.RepeatWrapping}
          normalMap-wrapS={THREE.MirroredRepeatWrapping}
          normalMap-repeat={1}
          side={THREE.DoubleSide}
        />
        <Sticker
          url="/android-chrome-512x512.png"
          position={[-0, -0.15, 0.1]}
          rotation={0}
          scale={1}
        />
        {/* <primitive object={material2} attach="material" /> */}
      </mesh>
    </group>
  );
}
function Effects() {
  // const bloomProps = useControls(
  //   "post.bloom",
  //   {
  //     enable: {
  //       value: true,
  //     },
  //     luminanceThreshold: {
  //       value: 0.76,
  //       min: 0,
  //       max: 1,
  //       label: "threshold",
  //     },
  //     luminanceSmoothing: {
  //       value: 0.65,
  //       min: 0,
  //       max: 1,
  //       label: "smoothing",
  //     },
  //     mipmapBlur: true,
  //     intensity: { value: 6, min: 0, max: 10 },
  //     radius: { value: 0.54, min: 0, max: 1 },
  //     levels: { value: 7, min: 0, max: 8, step: 1 },
  //   },
  //   { collapsed: true }
  // );
  const bloomProps = {
    enable: true,
    luminanceThreshold: 0.76,
    luminanceSmoothing: 0.65,
    mipmapBlur: true,
    intensity: 6,
    radius: 0.54,
    levels: 7,
  };

  return (
    <EffectComposer>
      <Bloom {...bloomProps} />
    </EffectComposer>
  );
}

function Scene() {
  // const controls = useControls({ autoRotate: false });
  const controls = { autoRotate: false };
  const props = useSpring({
    from: {
      "rotation-y": Math.PI * 0.1,
    },
    to: [
      {
        "rotation-y": Math.PI * -1.1,
      },
      {
        "rotation-y": Math.PI * -2.1,
      },
    ],
    config: { duration: 2000, easing: easeExpInOut },
    delay: 1000,
    loop: true,
    pause: !controls.autoRotate,
  });

  return (
    <>
      <Float speed={1} rotationIntensity={2} floatIntensity={1}>
        <Center>
          <a.group {...props} rotation-x={-Math.PI * 0.1}>
            <TradingCard />
          </a.group>
        </Center>
      </Float>
      {/* <Sparkles scale={[3.5, 5, 0.5]} color="turquoise" /> */}
    </>
  );
}

const CanvasContent = ({}: {}) => {
  const ref = useRef<any>();
  return (
    <>
      {/* <color attach="background" args={["#fff"]} /> */}
      <Scene />
      <OrbitControls />
      <Environment preset="dawn" /* files="42ND_STREET-1024.hdr"*/ />
      {/* <spotLight intensity={0} position={[5, 15, 5]} /> */}
      {/* <ambientLight /> */}
      <Effects />
    </>
  );
};

const CanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: #fff;
`;

const CanvasMain = ({}: {}) => {
  return (
    <CanvasWrapper>
      <ControlsPanel hidden></ControlsPanel>
      <Canvas gl={{ antialias: false, alpha: false }}>
        <Suspense fallback={null}>
          <CanvasContent />
        </Suspense>
      </Canvas>
    </CanvasWrapper>
  );
};

export default CanvasMain;

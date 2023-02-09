import { memo, useEffect, useMemo, useRef } from "react";
import { RGBELoader } from "three-stdlib";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  Instances,
  Instance,
  AccumulativeShadows,
  RandomizedLight,
  OrbitControls,
  Text3D,
  Center,
  useFBO,
} from "@react-three/drei";
import { proxy, useSnapshot } from "valtio";
import styled from "styled-components/macro";
import { MathUtils } from "three";

const RGBToHSB = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const v = Math.max(r, g, b),
    n = v - Math.min(r, g, b);
  const h =
    n === 0
      ? 0
      : n && v === r
      ? (g - b) / n
      : v === g
      ? 2 + (b - r) / n
      : 4 + (r - g) / n;
  return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
};

export interface RGBADatapoint {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface HSBDatapoint {
  h: number;
  s: number;
  b: number;
}

interface Dot {
  size: number;
  colorHex: string;
  hue: number;
  saturation: number;
  brightness: number;
}

export const settingsStore = proxy({
  maxColors: 8,
  ignoreColor: undefined as string | undefined,
  hueWeight: 1,
  saturationWeight: 1,
  brightnessWeight: 1,
});

export const canvasStore = proxy({
  rgbaDatas: [] as RGBADatapoint[],
  hsbDatas: [] as HSBDatapoint[],
  dots: [] as Dot[],
});

// the purpose of this component is to update the dots in the scene based on rgba data
// rgba data should be reduced to a set of colors that are used to create the dots
// first we convert each rgba datapoint from rgba to hsb
// the clusters are then calculated based on the hsb values
// we create clusters based on the hue, saturation, and brightness values (hue*hueWeight + saturation*saturationWeight + brightness*brightnessWeight)
// these clusters are then used to create the dots

const DotsUpdater = ({}: {}) => {
  const { rgbaDatas } = useSnapshot(canvasStore);
  //   first we convert each rgba datapoint from rgba to hsb
  useEffect(() => {
    const hsbDatas = rgbaDatas.map((rgbaData) => {
      const { r, g, b: blue } = rgbaData;
      const [h, s, b] = RGBToHSB(r, g, blue);
      return { h, s, b };
    });
    canvasStore.hsbDatas = hsbDatas;
  }, [rgbaDatas]);

  //   the clusters are then calculated based on the hsb values
  //   we create clusters based on the hue, saturation, and brightness values (hue*hueWeight + saturation*saturationWeight + brightness*brightnessWeight)

  const { hsbDatas } = useSnapshot(canvasStore);
  const {
    maxColors,
    ignoreColor,
    hueWeight,
    saturationWeight,
    brightnessWeight,
  } = useSnapshot(settingsStore);
  useEffect(() => {
    const clusters = hsbDatas.reduce((clusters, hsbData) => {
      const { h, s, b } = hsbData;
      const hue = h * hueWeight;
      const saturation = s * saturationWeight;
      const brightness = b * brightnessWeight;
      const cluster = hue + saturation + brightness;
      if (clusters[cluster]) {
        clusters[cluster].push(hsbData);
      } else {
        clusters[cluster] = [hsbData];
      }
      return clusters;
    }, {} as Record<string, HSBDatapoint[]>);
    const sortedClusters = Object.entries(clusters)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, maxColors);
    const dots = sortedClusters.map((cluster) => {
      const { h, s, b } = cluster[1].reduce(
        (acc, hsbData) => {
          acc.h += hsbData.h;
          acc.s += hsbData.s;
          acc.b += hsbData.b;
          return acc;
        },
        { h: 0, s: 0, b: 0 }
      );
      const size = cluster[1].length;
      const colorHex = `hsl(${h / size}, ${s / size}%, ${b / size}%)`;
      return {
        size,
        colorHex,
        hue: h / size,
        saturation: s / size,
        brightness: b / size,
      };
    });
    canvasStore.dots = dots;
    console.log(dots);
  }, [
    hsbDatas,
    maxColors,
    ignoreColor,
    hueWeight,
    saturationWeight,
    brightnessWeight,
  ]);
  return <></>;
};

const CanvasWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -1;
  overflow: hidden;
`;

export const ThreeCanvas = ({}) => {
  const { dots } = useSnapshot(canvasStore);

  //   console.log("dotsCopy", dotsCopy);
  return (
    <CanvasWrapper>
      <CanvasMain dots={[...dots]} />
      <DotsUpdater />
    </CanvasWrapper>
  );
};

const CanvasMain = ({ dots }: { dots: Dot[] }) => {
  console.log("dots", dots);
  const testDots = [
    {
      size: 1,
      colorHex: "hsl(0, 0%, 0%)",
      hue: 0,
      saturation: 0,
      brightness: 0,
    },
  ];
  return (
    <Canvas shadows camera={{ fov: 30, position: [5, 17, 17] }}>
      <color attach="background" args={["#f2f2f5"]} />
      <fog attach="fog" args={["#f2f2f5", 35, 60]} />
      <group position={[0, -1, 0]}>
        <Grid />
        <Shadows />
        <Dots dots={testDots} />
      </group>
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.1}
        enablePan={false}
        enableZoom={false}
        dampingFactor={0.05}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
};

function Dots({ dots }: { dots: Dot[] }) {
  const ref = useRef<any>();
  useFrame((state, delta) => {
    if (ref?.current) {
      void (ref.current.rotation.y = MathUtils.damp(
        ref.current.rotation.y,
        (-state.mouse.x * Math.PI) / 6,
        2.75,
        delta
      ));
    }
  });
  return (
    <Instances ref={ref} castShadow receiveShadow position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial roughness={0} color="#f0f0f0" />
      {dots.map((dot, i) => (
        <Dot key={i} dot={dot} />
      ))}
    </Instances>
  );
}

function Dot({ dot }: { dot: Dot }) {
  const ref = useRef<any>();
  useFrame((state) => {
    if (ref?.current) {
      //   const t = factor + state.clock.elapsedTime * (speed / 2);
      if (ref.current.scale) {
        ref.current.scale.setScalar(1, 1, 1);
      }
      ref.current.position.set(0, 0, -10);
      console.log("ref.current", ref.current);
    }
  });
  return <Instance ref={ref} />;
}

const Grid = ({ number = 23, lineWidth = 0.026, height = 0.5 }) => {
  return (
    <Instances castShadow receiveShadow position={[0, -1, 0]}>
      <planeGeometry args={[lineWidth, height]} />
      <meshBasicMaterial color="#999" />
      {Array.from({ length: number }, (_, y) =>
        Array.from({ length: number }, (_, x) => (
          <group
            position={[
              x * 2 - Math.floor(number / 2) * 2,
              -0.01,
              y * 2 - Math.floor(number / 2) * 2,
            ]}
          >
            <Instance key={1} rotation={[-Math.PI / 2, 0, 0]} />
            <Instance key={2} rotation={[-Math.PI / 2, 0, Math.PI / 2]} />
          </group>
        ))
      )}
      <gridHelper args={[100, 100, "#bbb", "#bbb"]} position={[0, -0.01, 0]} />
    </Instances>
  );
};

const Shadows = memo(() => (
  <AccumulativeShadows
    temporal
    frames={100}
    color="lightblue"
    colorBlend={1}
    toneMapped={true}
    alphaTest={0.9}
    opacity={1}
    scale={15}
    position={[0, 0, 0]}
  >
    <RandomizedLight
      amount={8}
      radius={15}
      ambient={0.5}
      intensity={1}
      position={[-5, 10, 0]}
      bias={0.001}
    />
  </AccumulativeShadows>
));

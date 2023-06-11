import React from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Sky, Plane } from "@react-three/drei";
import "./App.css";
import * as THREE from "three";
import Model from "./components/Model";
import { GUIProvider } from "./contexts/GUIContext";
import CameraMarkers from "./components/CameraMarkers";
import { UI } from "./components/UI";
import Axes from "./components/Axes";
import ObjectPicking from "./components/ObjectPicking";

function Scene() {
  // const { camera } = useThree();

  // useEffect(() => {
  //   // You can adjust the following values to fit your needs
  //   camera.position.z = 10; // Move the camera away from the origin along the Z axis
  //   camera.fov = 75; // Increase field of view
  //   camera.aspect = window.innerWidth / window.innerHeight; // Adjust the aspect ratio
  //   camera.updateProjectionMatrix(); // Always call this after changing parameters
  // }, [camera]);

  return (
    <React.Fragment>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <Stars color="red" />
      <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0}
        azimuth={0.25}
      />
      <Plane
        args={[2, 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[10, 10, 1]}
        material={
          new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: "green",
          })
        }
      />
      <Model url={`${process.env.PUBLIC_URL}/Joyful Jump.fbx`} />
      <CameraMarkers />
      <Axes />
      <ObjectPicking />
    </React.Fragment>
  );
}

function App() {
  return (
    <GUIProvider>
      <UI />
      <Canvas camera={{ position: [0, 0, 10] }} resize={false}>
        <Scene />
      </Canvas>
    </GUIProvider>
  );
}

export default App;

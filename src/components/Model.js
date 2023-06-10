import { useRef, useEffect } from "react";
import { AnimationMixer } from "three";
import { useLoader, useFrame, useThree } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { useGUI } from "../contexts/GUIContext";

const Model = ({ url }) => {
  const { scene } = useThree();
  const fbx = useLoader(FBXLoader, url);
  const mixerRef = useRef();
  const actionRef = useRef();
  const { parameters } = useGUI(); 

  useEffect(() => {
    if (fbx) {
      // Add the fbx model to the scene
      scene.add(fbx);

      // Apply parameters
      fbx.scale.set(parameters.scale, parameters.scale, parameters.scale);
      fbx.rotation.y = parameters.rotation;

      // Initialize AnimationMixer with the fbx model instead of the scene
      mixerRef.current = new AnimationMixer(fbx);
      mixerRef.current.timeScale = 0; // Prevent the mixer from auto-updating

      if (fbx.animations[0]) {
        actionRef.current = mixerRef.current.clipAction(fbx.animations[0]);
        actionRef.current.play();
      }
    }
  }, [fbx, scene, parameters, fbx.animations]);

  // Update animation time
  useEffect(() => {
    if (actionRef.current) {
      actionRef.current.time = parameters.animationTime;
    }
  }, [parameters.animationTime]);

  useEffect(() => {
    return () => mixerRef.current?.stopAllAction();
  }, []);

  useFrame(() => {
    // Manual update of the animation mixer
    mixerRef.current?.update(0);
  });

  return null;
};

export default Model;

import { useEffect, useState, useCallback } from "react";
import { useThree } from "@react-three/fiber";
import { useGUI } from "../contexts/GUIContext";
import * as THREE from "three";

const CameraMarkers = () => {
  const { scene } = useThree();
  const { parameters, removeMarkerFunctionRef, addMarkerFunctionRef} =
    useGUI();
  const { numCameras, cameraHeight, radius } = parameters;
  const [isVisible, setIsVisible] = useState(false);

  const [spheres, setSpheres] = useState([]);

  const removeSpheres = useCallback(() => {
    spheres.forEach((sphere) => {
      scene.remove(sphere); // remove each sphere from the scene
    });
    setSpheres([]); // Clear the spheres from the state
  }, [setSpheres, spheres, scene]);

  const addSpheres = useCallback(() => {
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
    const spheres = []; // Temporary array to store spheres
    for (let i = 0; i < numCameras; i++) {
      const angle = (i * (Math.PI * 2)) / numCameras;
      const modifiedRadius = radius * 0.8;
      const position = [
        modifiedRadius * Math.cos(angle),
        cameraHeight,
        modifiedRadius * Math.sin(angle),
      ];

      // Create a sphere for each camera position
      const sphereGeometry = new THREE.SphereGeometry(0.2); // Adjust size as needed
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.fromArray(position);
      sphere.userData.name = "Custom Sphere"
      spheres.push(sphere); // Push sphere to the temporary array
      scene.add(sphere);
    }

    setSpheres((prevSpheres) => [...prevSpheres, ...spheres]); // Save spheres to the state
  }, [scene, numCameras, setSpheres, cameraHeight, radius]);

  removeMarkerFunctionRef.current = removeSpheres;
  addMarkerFunctionRef.current = addSpheres;

  useEffect(()=> {
    addSpheres();
  }, [])

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(!isVisible);
    };

    const handleKeyDown = (event) => {
      if (event.altKey && (event.key === "q" || event.keyCode === 81)) {
        toggleVisibility();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, setIsVisible]);

  return null;
};

export default CameraMarkers;

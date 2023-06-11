import { useEffect, useCallback } from "react";
import { Raycaster, Vector2 } from "three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const ObjectPicking = () => {
  const { scene, camera } = useThree();

  // The handleClick function for object picking
  const handleClick = useCallback(
    (event) => {
      const raycaster = new Raycaster();
      const mouse = new Vector2();
      event.preventDefault();

      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(scene.children, true);

      let worldPosition = new THREE.Vector3();
      intersects[0].object.getWorldPosition(worldPosition);
      console.log("Clicked object world position:", worldPosition);
      console.log("Object: ", intersects[0].object); // Log the actual object clicked
    },
    [scene, camera]
  );

  useEffect(() => {
    window.addEventListener("click", handleClick);

    // Don't forget to clean up on unmount
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [camera, scene, handleClick]);
};

export default ObjectPicking;

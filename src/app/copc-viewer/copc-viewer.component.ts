import { Component, OnInit } from '@angular/core';
import { Scene, PerspectiveCamera, WebGLRenderer, Color } from 'three';
import { Potree, PointCloudOctree } from '@pnext/three-loader'; // Make sure you have this installed.
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Import OrbitControls

@Component({
  selector: 'app-copc-viewer',
  templateUrl: './copc-viewer.component.html',
  styleUrls: ['./copc-viewer.component.scss']
})
export class CopcViewerComponent implements OnInit {
  scene!: Scene;
  camera!: PerspectiveCamera;
  renderer!: WebGLRenderer;
  potree!: Potree;
  controls!: OrbitControls; // Declare controls

  constructor() { }

  ngOnInit(): void {
    this.initializeScene();
    this.loadPointCloudData();
  }

  // Initialize the 3D scene
  initializeScene() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 10;
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement); // Attach renderer to the DOM
    this.scene.background = new Color(0xaaaaaa);

    // Initialize OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    this.animate();
  }

  // Load the point cloud data from the external URL
  loadPointCloudData() {
    const baseUrl = 'https://raw.githubusercontent.com/potree/potree/develop/pointclouds/lion_takanawa/';
    const pointCloudUrl = 'cloud.js'; // External URL

    // Initialize Potree and load the point cloud
    this.potree = new Potree();
    this.potree.pointBudget = 2_000_000; // Show at most 2 million points
    const pointClouds: PointCloudOctree[] = [];

    this.potree.loadPointCloud(
      pointCloudUrl,
      (relativeUrl) => `${baseUrl}${relativeUrl}`
    ).then((pointCloud: PointCloudOctree) => {
      pointClouds.push(pointCloud);
      this.scene.add(pointCloud); // Add the loaded point cloud to the scene

      // Customize the point cloud material
      pointCloud.material.size = 1.0;

      // Update camera settings
      this.camera.position.set(0, 0, 10);
      this.camera.lookAt(0, 0, 0);

      // Start the animation loop
      this.animate();
    }).catch(error => {
      console.error('Error loading point cloud:', error);
    });

    // Update function to manage point clouds
    const update = () => {
      this.potree.updatePointClouds(pointClouds, this.camera, this.renderer);

      // Render the scene
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
    };

    // Call update function in the animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      update();
    };

    animate();
  }

  // Animation loop to render the scene
  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update(); // Update controls
    this.renderer.render(this.scene, this.camera);
  }
}

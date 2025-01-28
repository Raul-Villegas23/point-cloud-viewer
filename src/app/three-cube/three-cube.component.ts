import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, Vector2 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


@Component({
  selector: 'app-three-cube',
  standalone: true,
  imports: [],
  templateUrl: './three-cube.component.html',
  styleUrls: ['./three-cube.component.scss']
})
export class ThreeCubeComponent implements AfterViewInit, OnDestroy {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private cube!: Mesh;
  private controls!: OrbitControls; // Declare controls

  constructor() {
    // Initialize Three.js scene, camera, and renderer
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new WebGLRenderer();
  }

  ngAfterViewInit(): void {
    // Set the size of the canvas and append it to the DOM
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('three-container')?.appendChild(this.renderer.domElement);

    // Create a rotating cube and add it to the scene
    this.cube = this.createCube();
    this.scene.add(this.cube);

    // Set the camera position
    this.camera.position.z = 5;

    // Initialize OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;  // Smooth movement
    this.controls.dampingFactor = 0.25; // Control smoothness
    this.controls.screenSpacePanning = false;  // Restrict panning to screen space

    // Start the animation loop
    this.animate();

    // Update camera and renderer on window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private createCube(): Mesh {
    // Create a cube with basic geometry and wireframe material
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    return new Mesh(geometry, material);
  }

  private animate(): void {
    // Recursively call animate and rotate the cube for animation
    requestAnimationFrame(() => this.animate());

    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;

    // Update the controls (important for OrbitControls to work)
    this.controls.update(); // Only required if controls.enableDamping = true, or if controls.auto-rotation is enabled

    // Render the scene from the perspective of the camera
    this.renderer.render(this.scene, this.camera);
  }

  // Update camera and renderer size when window is resized
  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  ngOnDestroy(): void {
    // Clean up event listener when the component is destroyed
    window.removeEventListener('resize', this.onWindowResize);
  }
}

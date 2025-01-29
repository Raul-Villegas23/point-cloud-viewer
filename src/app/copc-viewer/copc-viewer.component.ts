import { Component, OnInit, HostListener } from '@angular/core';
import { Scene, PerspectiveCamera, WebGLRenderer, Color, Vector3 } from 'three';
import { Potree, PointCloudOctree, ClipMode } from '@pnext/three-loader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
  controls!: OrbitControls;

  constructor() { }

  ngOnInit(): void {
    this.initializeScene();
    this.loadPointCloudData();
  }

  initializeScene() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 10;
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.scene.background = new Color(0xaaaaaa);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 10;
    this.controls.zoomSpeed = 1.2;

    this.animate();
  }

  loadPointCloudData() {
    const baseUrl = 'https://raw.githubusercontent.com/potree/potree/develop/pointclouds/lion_takanawa/';
    const pointCloudUrl = 'cloud.js';

    this.potree = new Potree();
    this.potree.pointBudget = 2_000_000;
    const pointClouds: PointCloudOctree[] = [];

    this.potree.loadPointCloud(
      pointCloudUrl,
      (relativeUrl) => `${baseUrl}${relativeUrl}`
    ).then((pointCloud: PointCloudOctree) => {
      pointClouds.push(pointCloud);
      this.scene.add(pointCloud);

      pointCloud.material.clipMode = ClipMode.CLIP_HORIZONTALLY;
      pointCloud.material.clipExtent = [0.0, 0.0, 1.0, 1.0];
      pointCloud.material.size = 1.0;
      pointCloud.material.pointSizeType = 0;
      // Calculate center of point cloud and set camera position
      const boundingBox = pointCloud.boundingBox;
      const center = boundingBox.getCenter(new Vector3());

      pointCloud.position.set(-center.x, -center.y, -center.z);

      

      this.camera.position.set(0, 0, 10);
      this.camera.lookAt(0, 0, 0);

      this.animate();
    }).catch(error => {
      console.error('Error loading point cloud:', error);
    });

    const update = () => {
      this.potree.updatePointClouds(pointClouds, this.camera, this.renderer);
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      update();
    };

    animate();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

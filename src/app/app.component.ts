import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { ThreeCubeComponent } from './three-cube/three-cube.component';  // Import the ThreeCubeComponent
import { CopcViewerComponent } from './copc-viewer/copc-viewer.component';


@Component({
  selector: 'app-root',
  standalone: true,  // Make this component standalone
  imports: [RouterModule, ThreeCubeComponent, CopcViewerComponent],  // Import RouterModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'point-cloud-viewer';
}

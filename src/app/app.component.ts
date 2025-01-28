import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { ThreeCubeComponent } from './three-cube/three-cube.component';  // Import the ThreeCubeComponent

@Component({
  selector: 'app-root',
  standalone: true,  // Make this component standalone
  imports: [RouterModule, ThreeCubeComponent],  // Import RouterModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'point-cloud-viewer';
}

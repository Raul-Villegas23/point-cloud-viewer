import { Component, OnInit } from '@angular/core';
// Import Copc library
import { Copc } from 'copc';

@Component({
  selector: 'app-copc-viewer',
  standalone: true,
  templateUrl: './copc-viewer.component.html',
  styleUrls: ['./copc-viewer.component.scss']
})
export class CopcViewerComponent implements OnInit {
  filename: string = 'https://s3.amazonaws.com/hobu-lidar/autzen-classified.copc.laz'; // URL to COPC file
  copcData: any;  // Variable to hold COPC data

  constructor() { }

  ngOnInit(): void {
    this.loadCOPCData();  // Load COPC data on component initialization
  }

  // Method to load COPC data and print it to the console
  async loadCOPCData() {
    try {
      // Load COPC data using Copc library
      const copc = await Copc.create(this.filename);
      this.copcData = copc;  // Assign the COPC object to the variable
      console.log(copc);  // Print the COPC object to the console

      // Traverse the hierarchy and read point data
      const { nodes, pages } = await Copc.loadHierarchyPage(
        this.filename,
        copc.info.rootHierarchyPage
      );

      const root = nodes['0-0-0-0']!;
      const view = await Copc.loadPointDataView(this.filename, copc, root);
      console.log('Dimensions:', view.dimensions);

      // Get point data for a specific index (0 in this case)
      const getters = ['X', 'Y', 'Z', 'Intensity'].map(dim => view.getter(dim) as (index: number) => number);
      function getXyzi(index: number) {
        return getters.map(get => get(index));
      }
      const point = getXyzi(0);
      console.log('Point:', point);  // Print the point data for the first index (0)

    } catch (error) {
      console.error('Error loading COPC data:', error);
    }
  }
}

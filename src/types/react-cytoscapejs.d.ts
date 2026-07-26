declare module 'react-cytoscapejs' {
  import { Component } from 'react';
  import cytoscape from 'cytoscape';

  export interface CytoscapeComponentProps {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    elements: any[];
    stylesheet?: cytoscape.Stylesheet[] | any;
    layout?: any;
    cy?: (cy: cytoscape.Core) => void;
    zoom?: number;
    pan?: { x: number; y: number };
    minZoom?: number;
    maxZoom?: number;
    zoomingEnabled?: boolean;
    userZoomingEnabled?: boolean;
    panningEnabled?: boolean;
    userPanningEnabled?: boolean;
    boxSelectionEnabled?: boolean;
    autounselectify?: boolean;
    autoungrabify?: boolean;
    autolock?: boolean;
  }

  export default class CytoscapeComponent extends Component<CytoscapeComponentProps> {}
}

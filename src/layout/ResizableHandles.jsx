import React from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import "./ResizableHandles.css";
import Div_1 from "../components/div_1/Div1";

const ReactGridLayout = WidthProvider(RGL);

export default class ResizableHandles extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    items: 3,
    rowHeight: 80,
    onLayoutChange: () => {},
    cols: 4,
  };

  constructor(props) {
    super(props);

    // Initialize state with layout and maximum width
    this.state = {
      layout: this.generateLayout(), // Generate initial layout
      maxWidth: window.innerWidth, // Set maximum width to window width
    };
  }

  componentDidMount() {
    // Add event listener for window resize
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    // Remove event listener on component unmount
    window.removeEventListener("resize", this.handleResize);
  }

  // Handle window resize event
  handleResize = () => {
    this.setState({ maxWidth: window.innerWidth }); // Update maximum width
  };

  // Generate initial layout for the grid
  generateLayout() {
    const { cols } = this.props;
    const totalCols = cols;
    const availableHandles = ["s", "w", "e", "n", "sw", "nw", "se", "ne"];

    const itemWidth = totalCols / 2;

    const layouts = [
      {
        i: "0",
        x: 0,
        y: 0,
        w: itemWidth,
        h: 3,
        resizeHandles: availableHandles,
      },
      {
        i: "1",
        x: itemWidth,
        y: 0,
        w: itemWidth,
        h: 3,
        resizeHandles: availableHandles,
      },
      {
        i: "2",
        x: 0,
        y: 3,
        w: totalCols,
        h: 3,
        resizeHandles: availableHandles,
      },
    ];

    return layouts;
  }

  // Handle layout change event
  onLayoutChange = (layout) => {
    this.setState({ layout }); // Update state with new layout
    this.props.onLayoutChange(layout); // Invoke callback with new layout
  };

  // Handle resize stop event
  onResizeStop = (layout, oldItem, newItem) => {
    const { items, cols } = this.props;
    const totalCols = cols;

    // Calculate total width of all items in layout
    let totalWidth = 0;
    layout.forEach((item) => {
      totalWidth += item.w;
    });

    // Calculate width for each item based on total width and number of items
    const itemWidth = Math.min(this.state.maxWidth / items, totalWidth / items);

    // Update layout to adjust widths of neighboring components
    const updatedLayout = layout.map((item, index) => {
      if (index === 0 || index === 1) {
        // Adjust width of neighboring components
        return {
          ...item,
          w: itemWidth,
        };
      } else if (index === 2) {
        // Adjust width of last component to fill remaining space
        return {
          ...item,
          w: totalCols - itemWidth,
        };
      } else {
        return item;
      }
    });

    // Update layout
    this.onLayoutChange(updatedLayout);
  };

  render() {
    const { className, rowHeight } = this.props;
    return (
      <ReactGridLayout
        className={className}
        layout={this.state.layout}
        onLayoutChange={this.onLayoutChange}
        cols={this.props.cols}
        rowHeight={rowHeight}
        onResizeStop={this.onResizeStop}
        draggableHandle=".draggable-handle"
      >
        <div key="0" className="div_1 draggable-handle">
          <Div_1 />
        </div>
        <div key="1" className="div_2 draggable-handle">
          <span>Content for Div 2</span>
        </div>
        <div key="2" className="div-3 draggable-handle">
          <span>Content for Div 3</span>
        </div>
      </ReactGridLayout>
    );
  }
}

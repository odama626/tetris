import * as React from 'react';
import CanvasController from './CanvasController';

export default class Canvas extends React.Component<any, {}> {
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    const {
      setController,
      mountController,
      width,
      height,
      style,
      scale = 20,
      ...rest
    } = this.props;
    return (
      <canvas
        ref={canvas => {
          if (!canvas) return;
          let controller;
          if (!mountController) {
            controller = new CanvasController(canvas);
            controller.init(width, height, scale);
          } else {
            controller = mountController;
            controller.mountCanvas(canvas);
          }
          controller.setStyle(style);
          setController(controller);
        }}
        width={width}
        height={height}
        {...rest}
      />
    );
  }
}

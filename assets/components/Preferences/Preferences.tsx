import * as React from 'react';
import { connect } from 'react-redux';
import { COLORTABLE, PreviewMatrix, arraysAreEqual } from '../Canvas/Tetriminos';
import Canvas from '../Canvas/Canvas';
import * as style from './Preferences.scss';

class Preferences extends React.Component<any, {}> {
  drawCanvas(colorProfile, i, selected) {
    const { canvasStyle } = this.props;
    return (
      <div
        // onClick={() => dispatch()}
        className={
          style.previewContainer +
          ' ' +
          (arraysAreEqual(selected, COLORTABLE[colorProfile]) ? style.selected : '')
        }
        key={i}
      >
        <Canvas
          className={style.canvas}
          width={80}
          height={140}
          style={{ ...canvasStyle, colorTable: COLORTABLE[colorProfile] }}
          setController={controller => {
            controller.clear();
            controller.draw(PreviewMatrix);
          }}
        />
        <span>{colorProfile}</span>
      </div>
    );
  }

  render() {
    let keys = Object.keys(COLORTABLE);
    console.log(this.props);
    const { colorTable } = this.props.canvasStyle;

    console.log(style.previewContainer);
    return (
      <div className={style.container}>
        {keys.map((key, i) => this.drawCanvas(key, i, colorTable))}
      </div>
    );
  }
}

export default connect(state => ({ canvasStyle: state.GameBoard.style }))(Preferences);

import * as React from 'react';
import { connect } from 'react-redux';
import { COLORTABLE, PreviewMatrix, arraysAreEqual } from '../Canvas/Tetriminos';
import Canvas from '../Canvas/Canvas';
import * as style from './Preferences.scss';
import { Actions } from './Reducer';

class Preferences extends React.Component<any, {}> {
  drawCanvas(colorProfile, i, selectedColorProfile) {
    const { canvasStyle, dispatch } = this.props;
    const selected = arraysAreEqual(selectedColorProfile, COLORTABLE[colorProfile]);
    if (selected) {
      console.log(colorProfile);
    }
    return (
      <div
        onClick={() => dispatch(Actions.setColorTable(COLORTABLE[colorProfile]))}
        className={`${style.previewContainer} ${selected ? style.selected : ''}`}
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
    const { dispatch } = this.props;
    const { colorTable, drawShadow } = this.props.canvasStyle;

    return (
      <div className={style.container}>
        <h2>Tetrimino Colors</h2>
        <div className={style.optionContainer}>
          {keys.map((key, i) => this.drawCanvas(key, i, colorTable))}
        </div>
        <label>Show Shadow</label>
        <input
          type="checkbox"
          checked={drawShadow}
          onChange={e => dispatch(Actions.drawShadow(e.target.checked))}
        />
      </div>
    );
  }
}

export default connect(state => ({ ...state.Preferences }))(Preferences);

import { COLORTABLE } from '../Canvas/Tetriminos';

export class Actions {
  public static SET_COLOR_TABLE = 'PREFERENCES_SET_COLOR_TABLE';
  public static DRAW_SHADOW = 'PREFERENCES_SET_DRAW_SHADOW';

  public static setColorTable(colorTable: (string | null)[]) {
    return {
      type: Actions.SET_COLOR_TABLE,
      colorTable,
      saveLocally: ['Preferences', 'canvasStyle', 'colorTable']
    };
  }

  public static drawShadow(drawShadow: boolean) {
    return {
      type: Actions.DRAW_SHADOW,
      drawShadow,
      saveLocally: ['Preferences', 'canvasStyle', 'drawShadow']
    };
  }
}

const initialState = {
  canvasStyle: {
    drawShadow: false,
    colorTable: COLORTABLE['tigrana'],
    clearColor: '#000',
    canvas: { shadowBlur: '1', shadowColor: 'black' }
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_COLOR_TABLE:
      return {
        ...state,
        canvasStyle: {
          ...state.canvasStyle,
          colorTable: action.colorTable
        }
      };
    case Actions.DRAW_SHADOW:
      return {
        ...state,
        canvasStyle: {
          ...state.canvasStyle,
          drawShadow: action.drawShadow
        }
      };
  }
  return state;
};

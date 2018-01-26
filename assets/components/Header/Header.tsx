import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// import { Container, Image, Button } from 'web-components';

// import DropDown from './HeaderDropDown';

import * as style from './Header.scss';
import { Actions } from './Reducer';

// const links = [
//   ['Browse', '/browse'],
//   ['Locations', '/locations'],
//   ['Blog', '/blog'],
//   ['About', '/about'],
//   ['Shop', '/shop'],
//   ['Contact', '/contact']
// ]

class Header extends React.Component<any, {}> {
  // renderMobilePanel() {
  //   const { trayOpen } = this.props;
  //   return (
  //     <div className={`${style.leftContainer} ${trayOpen? style.leftOpen : style.leftClosed}`}>
  //       { links.map(([text, link], i) => <Link key={i} to={link} className={style.navItem}>{text.toUpperCase()}</Link>)}
  //     </div>
  //   )
  // }

  render(): JSX.Element | null {
    const {
      trayOpen,
      bounds,
      dispatch,
      hideMobile = false,
      hideLinks = false,
      score
    } = this.props;

    if (bounds.mobile && hideMobile) {
      return null;
    }
    let scoreDisplay = '';
    if (score.current < score.best) {
      scoreDisplay = `Score ${score.current} Best ${score.best}`;
    } else {
      scoreDisplay = `Best ${score.current}`;
    }

    return (
      <div>
        <div id="headerContainer" className={style.container}>
          <div className={style.leftContainer}>
            <div>{scoreDisplay}</div>
          </div>
          <div className={style.rightContainer}>
            <Link className={style.navItem} to="/preferences">
              Preferences
            </Link>
          </div>
        </div>

        <div className={style.spacer} />
      </div>
    );
  }
}

export default connect(state => ({
  ...state.Header,
  bounds: state.bounds,
  score: state.GameBoard.score
}))(Header);

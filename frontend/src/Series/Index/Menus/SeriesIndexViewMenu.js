import PropTypes from 'prop-types';
import React from 'react';
import { align } from 'Helpers/Props';
import ViewMenu from 'Components/Menu/ViewMenu';
import MenuContent from 'Components/Menu/MenuContent';
import ViewMenuItem from 'Components/Menu/ViewMenuItem';
import styles from './SeriesIndexViewMenu.css';

function SeriesIndexViewMenu(props) {
  const {
    view,
    onViewSelect
  } = props;

  return (
    <ViewMenu className={styles.viewMenu}>
      <MenuContent alignMenu={align.RIGHT}>
        <ViewMenuItem
          name="table"
          selectedView={view}
          onPress={onViewSelect}
        >
          Table
        </ViewMenuItem>

        <ViewMenuItem
          name="posters"
          selectedView={view}
          onPress={onViewSelect}
        >
          Posters
        </ViewMenuItem>
      </MenuContent>
    </ViewMenu>
  );
}

SeriesIndexViewMenu.propTypes = {
  view: PropTypes.string.isRequired,
  onViewSelect: PropTypes.func.isRequired
};

export default SeriesIndexViewMenu;

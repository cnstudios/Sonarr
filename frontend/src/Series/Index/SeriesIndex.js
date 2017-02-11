import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import hasDifferentItems from 'Utilities/Object/hasDifferentItems';
import { align, icons, sortDirections } from 'Helpers/Props';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageJumpBar from 'Components/Page/PageJumpBar';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarSeparator from 'Components/Page/Toolbar/PageToolbarSeparator';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import NoSeries from 'Series/NoSeries';
import SeriesIndexTableConnector from './Table/SeriesIndexTableConnector';
import SeriesIndexPosterOptionsModal from './Posters/Options/SeriesIndexPosterOptionsModal';
import SeriesIndexPostersConnector from './Posters/SeriesIndexPostersConnector';
import SeriesIndexFooter from './SeriesIndexFooter';
import SeriesIndexFilterMenu from './Menus/SeriesIndexFilterMenu';
import SeriesIndexSortMenu from './Menus/SeriesIndexSortMenu';
import SeriesIndexViewMenu from './Menus/SeriesIndexViewMenu';
import styles from './SeriesIndex.css';

function getViewComponent(view) {
  if (view === 'posters') {
    return SeriesIndexPostersConnector;
  }

  return SeriesIndexTableConnector;
}

class SeriesIndex extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this._viewComponent = null;

    this.state = {
      contentBody: null,
      jumpBarItems: [],
      isPosterOptionsModalOpen: false
    };
  }

  componentDidMount() {
    this.setJumpBarItems();
  }

  componentDidUpdate(prevProps) {
    const {
      items,
      sortKey,
      sortDirection
    } = this.props;

    if (
      hasDifferentItems(prevProps.items, items) ||
      sortKey !== prevProps.sortKey ||
      sortDirection !== prevProps.sortDirection
    ) {
      this.setJumpBarItems();
    }
  }

  //
  // Control

  setContentBodyRef = (ref) => {
    this.setState({ contentBody: ref });
  }

  setViewComponentRef = (ref) => {
    this._viewComponent = ref;
  }

  setJumpBarItems() {
    const {
      items,
      sortKey,
      sortDirection
    } = this.props;

    // Reset if not sorting by sortTitle
    if (sortKey !== 'sortTitle') {
      this.setState({ jumpBarItems: [] });
    }

    const characters = _.reduce(items, (acc, item) => {
      const firstCharacter = item.sortTitle.charAt(0);

      if (isNaN(firstCharacter)) {
        acc.push(firstCharacter);
      } else {
        acc.push('#');
      }

      return acc;
    }, []).sort();

    // Reverse if sorting descending
    if (sortDirection === sortDirections.DESCENDING) {
      characters.reverse();
    }

    this.setState({ jumpBarItems: _.sortedUniq(characters) });
  }

  //
  // Listeners

  onPosterOptionsPress = () => {
    this.setState({ isPosterOptionsModalOpen: true });
  }

  onPosterOptionsModalClose = () => {
    this.setState({ isPosterOptionsModalOpen: false });
  }

  onJumpBarItemPress = (item) => {
    const viewComponent = this._viewComponent.getWrappedInstance();
    viewComponent.scrollToFirstCharacter(item);
  }

  //
  // Render

  render() {
    const {
      isFetching,
      isPopulated,
      error,
      items,
      filterKey,
      filterValue,
      sortKey,
      sortDirection,
      view,
      isRefreshingSeries,
      isRssSyncExecuting,
      onSortSelect,
      onFilterSelect,
      onViewSelect,
      onRefreshSeriesPress,
      onRssSyncPress,
      ...otherProps
    } = this.props;

    const {
      contentBody,
      jumpBarItems,
      isPosterOptionsModalOpen
    } = this.state;

    const ViewComponent = getViewComponent(view);
    const isLoaded = !error && isPopulated && !!items.length && contentBody;

    return (
      <PageContent>
        <PageToolbar>
          <PageToolbarSection>
            <PageToolbarButton
              iconName={icons.REFRESH}
              spinningName={icons.REFRESH}
              title="Update all series"
              isSpinning={isRefreshingSeries}
              onPress={onRefreshSeriesPress}
            />

            <PageToolbarButton
              iconName={icons.RSS}
              title="Start RSS Sync"
              isSpinning={isRssSyncExecuting}
              onPress={onRssSyncPress}
            />

          </PageToolbarSection>

          <PageToolbarSection alignContent={align.RIGHT}>

            {
              view === 'posters' &&
                <PageToolbarButton
                  iconName={icons.POSTER}
                  title="Poster Options"
                  onPress={this.onPosterOptionsPress}
                />
            }

            {
              view === 'posters' &&
                <PageToolbarSeparator />
            }

            <SeriesIndexViewMenu
              view={view}
              onViewSelect={onViewSelect}
            />

            <SeriesIndexSortMenu
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSortSelect={onSortSelect}
            />

            <SeriesIndexFilterMenu
              filterKey={filterKey}
              filterValue={filterValue}
              onFilterSelect={onFilterSelect}
            />
          </PageToolbarSection>
        </PageToolbar>

        <div className={styles.pageContentBodyWrapper}>
          <PageContentBody
            ref={this.setContentBodyRef}
            className={styles.contentBody}
            innerClassName={styles[`${view}InnerContentBody`]}
          >
            {
              isFetching && !isPopulated &&
                <LoadingIndicator />
            }

            {
              !isFetching && !!error &&
                <div>Unable to load series</div>
            }

            {
              isLoaded &&
                <div>
                  <ViewComponent
                    ref={this.setViewComponentRef}
                    contentBody={contentBody}
                    {...otherProps}
                  />

                  <SeriesIndexFooter
                    series={items}
                  />
                </div>
            }

            {
              !error && isPopulated && !items.length &&
                <NoSeries />
            }
          </PageContentBody>

          {
            isLoaded && !!jumpBarItems.length &&
              <PageJumpBar
                items={jumpBarItems}
                onItemPress={this.onJumpBarItemPress}
              />
          }
        </div>

        <SeriesIndexPosterOptionsModal
          isOpen={isPosterOptionsModalOpen}
          onModalClose={this.onPosterOptionsModalClose}
        />
      </PageContent>
    );
  }
}

SeriesIndex.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isPopulated: PropTypes.bool.isRequired,
  error: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filterKey: PropTypes.string,
  filterValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
  sortKey: PropTypes.string,
  sortDirection: PropTypes.oneOf(sortDirections.all),
  view: PropTypes.string.isRequired,
  isRefreshingSeries: PropTypes.bool.isRequired,
  isRssSyncExecuting: PropTypes.bool.isRequired,
  onSortSelect: PropTypes.func.isRequired,
  onFilterSelect: PropTypes.func.isRequired,
  onViewSelect: PropTypes.func.isRequired,
  onRefreshSeriesPress: PropTypes.func.isRequired,
  onRssSyncPress: PropTypes.func.isRequired
};

export default SeriesIndex;

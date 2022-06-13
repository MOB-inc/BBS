import React from 'react';
// import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Box from '@material-ui/core/Box'; // eslint-disable-line import/no-extraneous-dependencies
import { useTranslation } from 'react-i18next';

// import Button from '@material-ui/core/Button';
// import Typography from '@material-ui/core/Typography';
// import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { ReactComponent as ArrowDown } from '../../icons/down-arrow-top-mini-card.svg';
import { ReactComponent as ArrowUp } from '../../icons/up-arrow-top-mini-card.svg';
import './index.scss';
import config from '../../../OEMConfig';

const index = (props) => {
  const { t } = useTranslation(['top']);

  const onClickCard = (id) => {
    props.changeSelectedTab(id);
  };

  const selectedTilesBackgroundColor = {
    borderRadius: '16px',
    backgroundColor: config().side_menu_color,
  };

  const withoutSelectedTilesBackgroundColor = {
    borderRadius: '16px',
  };

  const activeCardFontColor = {
    color: '#ffffff',
  };

  const notActiveCardFontColor = {
    color: config().side_menu_color,
  };

  const nestedCondition = (condition, then, otherwise) =>
    condition ? then : otherwise;
  return (
    <Box
      className="card-parent-div"
      onClick={() => {
        onClickCard(props.id);
      }}
    >
      <Card
        style={
          props.id === props.selectedTab
            ? selectedTilesBackgroundColor
            : withoutSelectedTilesBackgroundColor
        }
        // className={props.id === props.selectedTab ? 'card-active' : ''}
        sx={{ minWidth: 275 }}
      >
        <CardContent>
          <Box
            className="number-count-card"
            style={
              props.id === props.selectedTab
                ? activeCardFontColor
                : notActiveCardFontColor
            }
            sx={{ fontSize: 14 }}
            color="text.secondary"
            gutterBottom
          >
            {props.numberCount}
          </Box>
          <Box
            className="second-header-text"
            style={
              props.id === props.selectedTab
                ? activeCardFontColor
                : notActiveCardFontColor
            }
            sx={{ fontSize: 14 }}
            color="text.secondary"
            gutterBottom
          >
            {props.secondHeader}
          </Box>
          <Box sx={{ fontSize: 14 }}>
            {props.isUpCount === 'true' ? (
              <ArrowUp
                className={
                  props.id === props.selectedTab
                    ? 'arrow-up-top selected-arrow-color'
                    : 'arrow-up-top'
                }
              />
            ) : (
              <ArrowDown
                className={
                  props.id === props.selectedTab
                    ? 'arrow-down-top selected-arrow-color'
                    : 'arrow-down-top'
                }
              />
            )}
            &nbsp;
            <span
              className={
                /* eslint no-nested-ternary: "error" */
                props.isUpCount === 'true'
                  ? nestedCondition(
                      props.id === props.selectedTab,
                      'actve-color-up-down-count',
                      'up-arrow-font-color',
                    )
                  : nestedCondition(
                      props.id === props.selectedTab,
                      'actve-color-up-down-count',
                      'down-arrow-font-color',
                    )
              }
            >
              {props.incDcrCount}
            </span>
            &nbsp;
            <span
              className={
                props.id === props.selectedTab
                  ? 'active-card-font-color'
                  : 'not-active-class-font-color-small-title'
              }
            >
              {' '}
              {t('top:INSTAPAGE.VS')} {props.lastTimeString}
            </span>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

index.propTypes = {
  id: PropTypes.string,
  selectedTab: PropTypes.string,
  numberCount: PropTypes.string,
  secondHeader: PropTypes.string,
  isUpCount: PropTypes.bool,
  lastTimeString: PropTypes.string,
  changeSelectedTab: PropTypes.func,
};

export default index;

/**
 *
 * HistoryPage
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ResizeObserver from 'react-resize-observer';

// Import Components
import Copyright from 'components/Copyright';

// Import Material-UI
import { withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import {
  PagingState,
  IntegratedPaging,
  DataTypeProvider,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableColumnVisibility,
  PagingPanel,
  ColumnChooser,
  Toolbar,
} from '@devexpress/dx-react-grid-material-ui';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { generateRows, globalSalesValues } from './demo-data/generator';

import makeSelectHistoryPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

const styles = theme => ({
  root: {
    minHeight: '320px!important',
    fontFamily: 'Lato',
    color: 'red',
  },
  center: {
    textAlign: 'center',
    maxWidth: 1100,
    margin: '0 auto',
  },
  elevation: {
    boxShadow: 'none',
    [theme.breakpoints.down('md')]: {
      paddingTop: 0,
    },
    [theme.breakpoints.up('md')]: {
      paddingTop: 30,
    },
  },
  percent: {
    color: 'red',
  },
});

const PercentFormatter = ({ value }) => (
  <span className="percent">
    {value} <FormattedMessage {...messages.currency} />
  </span>
);

const PercentTypeProvider = props => (
  <DataTypeProvider formatterComponent={PercentFormatter} {...props} />
);

const HeaderCellBase = ({ classes, className, ...restProps }) => (
  <TableHeaderRow.Cell
    {...restProps}
    className={`${classes.text} ${className}`}
  />
);

const headerCellStyles = theme => ({
  text: {
    fontSize: 16,
    color: '#0029ab',
    fontFamily: 'Lato',
  },
});

const HeaderCell = withStyles(headerCellStyles, { name: 'HeaderCellBase' })(
  HeaderCellBase,
);

const TableCellBase = ({ classes, className, ...restProps }) => (
  <Table.Cell {...restProps} className={`${classes.text} ${className}`} />
);

const tableCellStyles = theme => ({
  text: {
    fontSize: 14.5,
    fontFamily: 'Lato',
  },
});

const tableCell = withStyles(tableCellStyles, { name: 'TableCellBase' })(
  TableCellBase,
);

class HistoryPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'region', title: 'Date' },
        { name: 'sector', title: 'Sender' },
        { name: 'customer', title: 'Recipient' },
        { name: 'product', title: 'Transfer title' },
        { name: 'amount', title: 'Amount of money' },
      ],
      rows: generateRows({ columnValues: globalSalesValues, length: 20 }),
      defaultHiddenColumnNames: [],
      percentColumns: ['amount'],
    };

    this.hiddenColumnNamesChange = defaultHiddenColumnNames => {
      this.setState({ defaultHiddenColumnNames });
    };
  }

  render() {
    const {
      rows,
      columns,
      defaultHiddenColumnNames,
      percentColumns,
      hiddenColumnNames,
    } = this.state;
    const { classes } = this.props;

    return (
      <Fragment>
        <FormattedMessage {...messages.helmetHistoryTitle}>
          {title => <Helmet title={title} />}
        </FormattedMessage>

        <div className={classes.center}>
          <Paper
            classes={{
              elevation2: classes.elevation,
            }}
          >
            <Grid rows={rows} columns={columns}>
              <PagingState defaultCurrentPage={0} pageSize={12} />
              <IntegratedPaging />
              <PercentTypeProvider for={percentColumns} />
              <Table
                cellComponent={tableCell}
                classes={{ root: classes.root }}
              />
              <TableHeaderRow cellComponent={HeaderCell} />
              <PagingPanel />
              <TableColumnVisibility
                hiddenColumnNames={hiddenColumnNames}
                onHiddenColumnNamesChange={this.hiddenColumnNamesChange}
              />
              <Toolbar />
              <ColumnChooser />
            </Grid>
          </Paper>
        </div>
        <Copyright />
      </Fragment>
    );
  }
}

HistoryPage.propTypes = {};

const mapStateToProps = createStructuredSelector({
  historyPage: makeSelectHistoryPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'historyPage', reducer });
const withSaga = injectSaga({ key: 'historyPage', saga });

export default compose(
  withStyles(styles, { withTheme: true }),
  withReducer,
  withSaga,
  withConnect,
)(HistoryPage);

import React from 'react'
import DataTable from 'react-data-table-component';

class Table extends React.Component {
  // Use the state and functions returned from useTable to build your UI
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      columns: [
        // {
        //     name: 'Stock Name',
        //     selector: row => row.topic.toUpperCase(),
        // },
        {
            name: 'Close',
            selector: row => row.Close.toFixed(5),
        },
        {
            name: 'Open',
            selector: row => row.Open.toFixed(5),
        },
        {
            name: 'High',
            selector: row => row.High.toFixed(5),
        },
        {
            name: 'Low',
            selector: row => row.Low.toFixed(5),
        },
        {
            name: 'Volume',
            selector: row => row.Volume,
        },
      ],
      data: props.data
    } 
  }

  render(){
    //  Internally, customStyles will deep merges your customStyles with the default styling.
  const customStyles = {
    rows: {
        style: {
            minHeight: '72px', // override the row height
            '&:not(:last-of-type)': {
              borderBottomStyle: 'solid',
              borderBottomWidth: '1px',
            },
        },
    },
    headCells: {
        style: {
            paddingLeft: '8px', // override the cell padding for head cells
            paddingRight: '8px',
        },
    },
    head: {
      style: {
        fontSize: '24px',
        fontWeight: 1,
      },
    },
    cells: {
        style: {
            paddingLeft: '8px', // override the cell padding for data cells
            paddingRight: '8px',
        },
    },
  };
      return (
        <DataTable
            columns={this.state.columns}
            data={this.props.data}
            customStyles={customStyles}
        />
      )
  }
}

export default Table;
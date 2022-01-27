import React, { useState, useEffect } from 'react';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import { Table } from '../shared/components/Table';
//import { CustomIconButton } from '../shared/ui-toolkit/IconButton';

export default {
  title: 'Custom Table Component',
};

const data = [
  {
    type: 'Sung Noen',
    date: '2/24/2021',
    text: 'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.',
    groupingLevelValue: 'Aquamarine',
  },
  {
    type: 'Gibbons',
    date: '2/3/2021',
    text: 'Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.',
    groupingLevelValue: 'Purple',
  },
  {
    type: 'Ikar',
    date: '8/31/2021',
    text: 'In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.',
    groupingLevelValue: 'Blue',
  },
  {
    type: 'Tostado',
    date: '7/5/2021',
    text: 'Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.',
    groupingLevelValue: 'Pink',
  },
  {
    type: 'Young',
    date: '9/11/2021',
    text: 'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.',
    groupingLevelValue: 'Green',
  },
];

const columns = [
  { title: 'Type', name: 'type', field: 'type' },
  {
    title: 'Date',
    name: 'dateFrom',
    field: 'date',
  },
  { title: 'Text', name: 'text', field: 'text' },
  { title: 'Report Level', name: 'groupingLevelValue', field: 'groupingLevelValue' },
];

export const TableWithData = () => {
  return <Table columns={columns} title={'Table with Data'} data={data} />;
};

export const TableWithNoData = () => {
  return <Table columns={[]} title={'Table with Empty Data'} data={[]} />;
};

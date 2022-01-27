import React, { useState, useEffect } from 'react';
import { Table } from '../shared/components/Table';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Grid, Dialog, AppBar, Toolbar, IconButton, Typography, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFirestore } from 'react-redux-firebase';
import { yieldTableColumns } from '../data/yieldTableData';
import { AddNoteForm } from './AddNoteForm';
import { AddYieldForm } from './AddYieldNoteForm';
import { CustomSelect } from '../shared/components/Dropdown';
import { farmOptions, siteOptions } from '../data/sampleData';
import { styled as muiStyled } from '@mui/material/styles';
import styled from 'styled-components';
import Paper from '@mui/material/Paper';
import { getDateFromTimeStamp } from '../utils/share';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TypographyWrapper = styled(Typography).attrs((props) => ({
  variant: props.variant ? props.variant : '',
  component: props.component ? props.component : 'span',
}))`
  margin: 0 16px;
`;

const Item = muiStyled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const NoteTable = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const firestore = useFirestore();
  const [yieldData, setYieldData] = useState([]);
  const [form, setForm] = useState({
    noteForm: false,
    yieldForm: false,
  });
  const [tableFilters, setTableFilters] = useState({
    groupingLevel: '',
    groupingLevelValue: '',
  });

  const [clearFilter, setClearFilter] = useState(false);

  const [selectedRowData, setSelectedRowData] = useState();
  useEffect(() => {
    const unsubscribe = firestore.collection('notes').onSnapshot((snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setYieldData(data);
    });
    return () => unsubscribe();
  }, []);

  const handleDeleteDocument = (data) => {
    const { id } = data;
    try {
      firestore.collection('notes').doc(id).delete();
    } catch (err) {
      console.log('Error removing document:', err);
    }
  };

  const onGroupLevelFilterChange = (e) => {
    const { value } = e.target;
    setTableFilters({ ...tableFilters, groupingLevel: value });
    try {
      firestore
        .collection('notes')
        .where('groupingLevel', '==', value)
        .onSnapshot((snap) => {
          const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setYieldData(data);
        });
    } catch (err) {
      console.log('Error Finding document:', err);
    }
  };

  const onGroupLevelValueChange = (e) => {
    const { value } = e.target;
    setTableFilters({ ...tableFilters, groupingLevelValue: value });
    setClearFilter(true)
    try {
      firestore
        .collection('notes')
        .where('groupingLevel', '==', tableFilters.groupingLevel)
        .where('groupingLevelValue', '==', value)
        .onSnapshot((snap) => {
          const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setYieldData(data);
        });
    } catch (err) {
      console.log('Error Finding document:', err);
    }
  };

  const onResetFilter = () =>{
    setTableFilters({
      groupingLevel: '',
      groupingLevelValue: '',
    })
    setClearFilter(false)
  }

  return (
    <Grid padding={5} container spacing={2}>
      {form.noteForm && <AddNoteForm />}
      {form.yieldForm && <AddYieldForm />}
      <hr />
      <Grid item xs={12}>
        <Button
          sx={{ mr: '1rem' }}
          onClick={() => setForm({ noteForm: !form.noteForm, yieldForm: false })}
          variant={'contained'}
        >
          Add Note
          {/* {form.noteForm ? 'Hide Note Form' : 'Show Note Form'} */}
        </Button>
        <Button
          sx={{ mr: '1rem', mt: '1rem' }}
          sm={{ mt: '0rem' }}
          onClick={() => setForm({ yieldForm: !form.yieldForm, noteForm: false })}
          variant={'contained'}
        >
          Add Yield Note
          {/* {form.yieldForm ? 'Hide Yield Form' : 'Show Yield Form'} */}
        </Button>
      </Grid>
      <Grid item sm={6} xs={12}>
        <CustomSelect
          options={[
            { label: 'Farm', value: 'Farm' },
            { label: 'Site', value: 'Site' },
          ]}
          onSelectChange={onGroupLevelFilterChange}
          label={'Group Level'}
          selectedValue={tableFilters.groupingLevel}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <CustomSelect
          options={tableFilters.groupingLevel === 'Site' ? siteOptions : farmOptions}
          onSelectChange={onGroupLevelValueChange}
          label={'Group Level Value'}
          disabled={!tableFilters.groupingLevel}
          selectedValue={tableFilters.groupingLevelValue}
        />
      </Grid>
      <Grid>
          {clearFilter?<Button onClick={onResetFilter}>Clear filters</Button>: null}
      </Grid>
      <Grid item xs={12}>
        <Table
          title={'Yield Note Data from Firebase'}
          columns={yieldTableColumns}
          data={yieldData}
          actions={[
            {
              icon: DeleteIcon,
              tooltip: 'Delete',
              onClick: (event, rowData) => {
                handleDeleteDocument(rowData);
              },
            },
          ]}
          onRowClick={(evt, selectedRow) => {
            handleClickOpen();
            setSelectedRowData(selectedRow);
            // console.log(selectedRow)
          }}
        />
      </Grid>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Yield Table Data
            </Typography>
            <Button autoFocus color="inherit">
              Delete
            </Button>
          </Toolbar>
        </AppBar>

        <TypographyWrapper variant="h6">Type</TypographyWrapper>
        <TypographyWrapper>{selectedRowData?.type}</TypographyWrapper>

        <TypographyWrapper variant="h6">Grouping Level</TypographyWrapper>
        <TypographyWrapper>{selectedRowData?.groupingLevel}</TypographyWrapper>

        <TypographyWrapper variant="h6">Grouping Level Value</TypographyWrapper>
        <TypographyWrapper>{selectedRowData?.groupingLevelValue}</TypographyWrapper>

        <TypographyWrapper variant="h6">Text</TypographyWrapper>
        <TypographyWrapper>{selectedRowData?.text}</TypographyWrapper>

        <TypographyWrapper variant="h6">Date From</TypographyWrapper>
        <TypographyWrapper>{getDateFromTimeStamp(selectedRowData?.noteDateFrom.seconds)}</TypographyWrapper>

        <TypographyWrapper variant="h6">Date To</TypographyWrapper>
        <TypographyWrapper>{getDateFromTimeStamp(selectedRowData?.noteDateTo.seconds)}</TypographyWrapper>

        {selectedRowData?.yields?.crop && (
          <>
            <TypographyWrapper variant="h6">Yields</TypographyWrapper>
            <TypographyWrapper>{selectedRowData?.yields?.crop}</TypographyWrapper>
          </>
        )}
        {selectedRowData?.yields?.tags && (
          <>
            <TypographyWrapper variant="h6">Tags</TypographyWrapper>
            {selectedRowData?.yields?.tags.map((tag, i) => {
              return <TypographyWrapper key={i}>{tag}</TypographyWrapper>;
            })}
          </>
        )}
        <TypographyWrapper variant="h6">Yield Amount</TypographyWrapper>
        <TypographyWrapper>{selectedRowData?.yields?.yieldAmount}</TypographyWrapper>
        {selectedRowData?.yields?.unit && (
          <>
            <TypographyWrapper variant="h6">Unit</TypographyWrapper>
            <TypographyWrapper>{selectedRowData?.yields?.unit}</TypographyWrapper>
          </>
        )}

        <Grid container spacing={3}>
          {selectedRowData?.photos.map((photo, index) => (
            <Grid item xs={12} md={4} sm={6} key={index}>
              <Item style={{ marginTop: '10px', marginLeft: '10px' }}>
                <img
                  style={{ width: '100%', height: '200px' }}
                  src={`${photo}`}
                  alt={selectedRowData?.type}
                />
              </Item>
            </Grid>
          ))}
        </Grid>
      </Dialog>
    </Grid>
  );
};

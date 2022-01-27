import React, { useState } from 'react';
import { useFirestore } from 'react-redux-firebase';
import { CustomSelect } from '../shared/components/Dropdown';
import { DateRangeFilter } from '../shared/components/DateRange';
import { TextareaAutosize, Button, Grid, CircularProgress } from '@mui/material';
import { farmOptions, siteOptions } from '../data/sampleData';
import { putImagetoStorage } from '../utils/share';

export const AddNoteForm = () => {
  const firestore = useFirestore();
  const [noteFormFilters, setNoteFormFilters] = useState({
    selectedFilter: 'Site',
    selectedValue: '',
    text: '',
    noteDateFrom: '',
    noteDateTo: '',
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const onGroupLevelChange = (e) => {
    const { value } = e.target;
    setNoteFormFilters({ ...noteFormFilters, selectedValue: value });
  };

  const onFilterChange = (e) => {
    const { value } = e.target;
    setNoteFormFilters({ ...noteFormFilters, selectedFilter: value });
  };

  const onTextAreaChange = (e) => {
    const { value } = e.target;
    setNoteFormFilters({ ...noteFormFilters, text: value });
  };

  const onDateFilterChange = ({ startDate, endDate }) => {
    setNoteFormFilters({ ...noteFormFilters, noteDateFrom: startDate, noteDateTo: endDate });
  };

  const handlePhotoChange = (e) => {
    const file = Array.from(e.target.files);
    setPhotos(file);
    
  };

  const addNotesData = (e) => {
    e.preventDefault();
    const imgPath = 'noteImages/';
    setLoading(true);
    try {
      Promise.all(photos.map((img) => putImagetoStorage({ img, imgPath }))).then((url) => {
        firestore.collection('notes').add({
          type: 'note',
          dateCreated: new Date(),
          noteDateFrom: noteFormFilters.noteDateFrom,
          noteDateTo: noteFormFilters.noteDateTo,
          groupingLevel: noteFormFilters.selectedFilter,
          groupingLevelValue: noteFormFilters.selectedValue,
          text: noteFormFilters.text,
          photos: url,
        });
        setLoading(false);
        setNoteFormFilters({
          selectedFilter: 'Site',
          selectedValue: '',
          text: '',
          noteDateFrom: '',
          noteDateTo: '',
        });
        
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form style={{ padding: '20px' }} onSubmit={addNotesData}>
      <Grid container spacing={2}>
        <Grid item sm={6} xs={12}>
          <CustomSelect
            options={[
              { label: 'Device', value: 'Device' },
              { label: 'Site', value: 'Site' },
            ]}
            onSelectChange={onFilterChange}
            label={'Group Level'}
            selectedValue={noteFormFilters.selectedFilter}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <CustomSelect
            options={noteFormFilters.selectedFilter === 'Site' ? siteOptions : farmOptions}
            onSelectChange={onGroupLevelChange}
            label={'Group Level Value'}
            selectedValue={noteFormFilters.selectedValue}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <DateRangeFilter onFilterChanged={onDateFilterChange} />
        </Grid>
        <Grid item xs={12}>
          <TextareaAutosize
            aria-label="minimum height"
            value={noteFormFilters.text}
            minRows={3}
            placeholder="Note..."
            style={{ width: '100%', margin: '0px' }}
            onChange={onTextAreaChange}
          />
        </Grid>
        <Grid item xs={12}>
          <input accept="image/*" onChange={handlePhotoChange} name="upload-photo" type="file" multiple />
        </Grid>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button type={'submit'} variant={'contained'}>
            Submit Note
          </Button>
        )}
      </Grid>
    </form>
  );
};

import React, { useState } from 'react';
import { useFirestore } from 'react-redux-firebase';
import {
  TextField,
  TextareaAutosize,
  Button,
  Chip,
  IconButton,
  // Box,
  Grid,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CustomSelect } from '../shared/components/Dropdown';
import { DateRangeFilter } from '../shared/components/DateRange';
import { farmOptions, siteOptions } from '../data/sampleData';
import { putImagetoStorage } from '../utils/share'; // import { storage } from '../firebase';
export const AddYieldForm = () => {
  const firestore = useFirestore();
  const [yieldNoteFormValues, setYieldNoteFormValues] = useState({
    groupLevel: '',
    groupLevelValue: '',
    text: '',
    noteDateFrom: '',
    noteDateTo: '',
    yieldAmount: null,
    unit: '',
    crop: '',
    tags: [], //optional
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState('');
  const onGroupLevelChange = (e) => {
    const { value } = e.target;
    setYieldNoteFormValues({ ...yieldNoteFormValues, groupLevelValue: value });
  };

  const onFilterChange = (e) => {
    const { value } = e.target;
    setYieldNoteFormValues({ ...yieldNoteFormValues, groupLevel: value });
  };

  const onTextAreaChange = (e) => {
    const { value } = e.target;
    setYieldNoteFormValues({ ...yieldNoteFormValues, text: value });
  };

  const onDateFilterChange = ({ startDate, endDate }) => {
    setYieldNoteFormValues({ ...yieldNoteFormValues, noteDateFrom: startDate, noteDateTo: endDate });
  };

  const onUnitChange = (e) => {
    const { value } = e.target;
    setYieldNoteFormValues({ ...yieldNoteFormValues, unit: value });
  };

  const onCropChange = (e) => {
    const { value } = e.target;
    setYieldNoteFormValues({ ...yieldNoteFormValues, crop: value });
  };

  const onAmountChange = (e) => {
    const { value } = e.target;
    setYieldNoteFormValues({ ...yieldNoteFormValues, yieldAmount: value });
  };

  const addTag = () => {
    let tag = document.getElementById('tag').value;
    if (tag !== '') {
      setYieldNoteFormValues({ ...yieldNoteFormValues, tags: [...yieldNoteFormValues.tags, tag] });
    }
    document.getElementById('tag').value = '';
  };

  const deleteTag = (comingChip) => {
    const filteredTags = yieldNoteFormValues.tags.filter((chip) => chip !== comingChip);
    setYieldNoteFormValues({ ...yieldNoteFormValues, tags: filteredTags });
  };
  const addYieldNote = (e) => {
    const imgBucketPath = 'yieldNoteImages/';
    e.preventDefault();
    setLoading(true);

    //e.target.reset();
    try {
      Promise.all(photos.map((img) => putImagetoStorage({ img, imgBucketPath }))).then((url) => {
        firestore.collection('notes').add({
          type: 'yieldNote',
          dateCreated: new Date(),
          noteDateFrom: yieldNoteFormValues.noteDateFrom,
          noteDateTo: yieldNoteFormValues.noteDateTo,
          groupingLevel: yieldNoteFormValues.groupLevel,
          groupingLevelValue: yieldNoteFormValues.groupLevelValue,
          text: yieldNoteFormValues.text,
          photos: url,
          yields: {
            yieldAmount: yieldNoteFormValues.yieldAmount,
            unit: yieldNoteFormValues.unit,
            crop: yieldNoteFormValues.crop,
            tags: yieldNoteFormValues.tags, //optional
          },
        });
        setLoading(false);
        setYieldNoteFormValues({
          groupLevel: '',
          groupLevelValue: '',
          text: '',
          noteDateFrom: null,
          noteDateTo: '',
          yieldAmount: '',
          unit: '',
          crop: '',
          tags: [], //optional
        });
        setPhotos([]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handlePhotoChange = (e) => {
    const file = Array.from(e.target.files);
    setPhotos(file);
  };

  return (
    <form style={{ padding: '20px' }} onSubmit={addYieldNote}>
      <Grid container spacing={2}>
        <Grid item sm={6} xs={12}>
          <CustomSelect
            options={[
              { label: 'Farm', value: 'Farm' },
              { label: 'Site', value: 'Site' },
            ]}
            onSelectChange={onFilterChange}
            label={'Group Level'}
            selectedValue={yieldNoteFormValues.groupLevel}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <CustomSelect
            options={yieldNoteFormValues.groupLevel === 'Site' ? siteOptions : farmOptions}
            onSelectChange={onGroupLevelChange}
            label={'Group Level Value'}
            disabled={!yieldNoteFormValues.groupLevel}
            selectedValue={yieldNoteFormValues.groupLevelValue}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <CustomSelect
            options={[
              { label: 'kg', value: 'kg' },
              { label: ' tonnes per hectare', value: ' tonnes per hectare' },
            ]}
            onSelectChange={onUnitChange}
            selectedValue={yieldNoteFormValues.unit}
            label={'Unit'}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <DateRangeFilter onFilterChanged={onDateFilterChange} />
        </Grid>
        <Grid fxFlex fxLayout="column" item sm={6} xs={12}>
          <div style={{ display: 'flex', alignItems: 'center center', marginBottom: '15px' }}>
            <TextField
              data-testid="tag-input"
              id="tag"
              label="Add Tag"
              variant="outlined"
              style={{ flexGrow: 1 }}
            />
            <IconButton color="primary" onClick={addTag}>
              <AddIcon />
            </IconButton>
          </div>
          {yieldNoteFormValues.tags?.map((data) => (
            <Chip label={data} onDelete={() => deleteTag(data)} variant="filled" />
          ))}
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            value={yieldNoteFormValues.crop}
            onChange={onCropChange}
            label="Crop"
            variant="outlined"
            style={{ flexGrow: 1 }}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            type="number"
            value={yieldNoteFormValues.yieldAmount}
            onChange={onAmountChange}
            label="Yield Amount"
            variant="outlined"
            style={{ flexGrow: 1 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextareaAutosize
            data-testid="textarea"
            aria-label="minimum height"
            value={yieldNoteFormValues.text}
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
            Submit Yield Note
          </Button>
        )}
      </Grid>
    </form>
  );
};

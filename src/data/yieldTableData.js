import { getDateFromTimeStamp } from '../utils/share';

export const yieldTableColumns = [
  { title: 'Type', name: 'type', field: 'type' },
  {
    title: 'Date',
    name: 'dateFrom',
    filtering: false,
    field: 'noteDateFrom.seconds',
    render: ({ noteDateFrom, noteDateTo }) => (
      <span>
        {getDateFromTimeStamp(noteDateFrom.seconds)}-{getDateFromTimeStamp(noteDateTo.seconds)}
      </span>
    ),
  },
  { title: 'Text', name: 'text', field: 'text' },
  { title: 'Report Level', name: 'groupingLevelValue', field: 'groupingLevelValue' },
];

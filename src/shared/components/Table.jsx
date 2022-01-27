import React from 'react';
import MaterialTable from '@material-table/core';

export const Table = ({ title, columns, data, actions = [], onRowClick=() => null }) => {
  return (
    <div style={{ maxWidth: '100%' }}>
      <MaterialTable
        columns={columns}
        data={data}
        title={title}
        actions={actions}
        options={{
          search: false,
          paging: true,
          filtering: true,
          hideFilterIcons: true,
          actionsColumnIndex: -1,
          emptyRowsWhenPaging: false,
          actionsCellStyle: {
            maxWidth: 'none',
          },
        }}
        onRowClick={onRowClick}
      />
    </div>
  );
};

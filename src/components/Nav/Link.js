import { Link as RouterLink } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    fontSize: 'medium',
  },
  subheader: {
    fontSize: 'medium',
  },
}));

export default function Link({
  path,
  text,
  bold = false,
  padding = '0 0 0 0',
  backgroundColor,
  border,
  borderRadius,
  disabled,
}) {
  const classes = useStyles();
  return (
    <ListItem
      // classes={{
      //   // root: classes.root, // class name, e.g. `classes-nesting-root-x`
      //   title: classes.title, // class name, e.g. `classes-nesting-label-x`
      //   subheader: classes.subheader, // class name, e.g. `classes-nesting-label-x`
      // }}
      // selected={false}
      button
      component={RouterLink}
      to={path}
      style={{
        padding,
        backgroundColor,
        fontWeight: bold ? 'bold' : 'normal',
        // fontSize: '14px',
        borderRadius,
        border,
      }}
      disabled={disabled}
      // focusVisibleClassName={'none'}
    >
      {text}
    </ListItem>
  );
}

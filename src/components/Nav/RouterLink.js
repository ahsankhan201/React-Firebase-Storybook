import Link from '@material-ui/core/Link';
import { Link as RouterDomLink } from 'react-router-dom';
import React from 'react';

export default function RouterLink({ to, text = 'View', style }) {
  return (
    <Link style={style} component={RouterDomLink} to={to}>
      {text}
    </Link>
  );
}

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from './Link';
import React from 'react';

export default function BreadcrumbNav({ breadcrumbs }) {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      {breadcrumbs.map((breadcrumb, index) => {
        if (breadcrumbs.length - 1 === index) {
          return <EndBreadcrumb key={index} breadcrumb={breadcrumb} />;
        }
        return <Link key={index} path={breadcrumb.path} text={breadcrumb.text} />;
      })}
    </Breadcrumbs>
  );
}

function EndBreadcrumb({ breadcrumb }) {
  return <Link path={breadcrumb.path} text={breadcrumb.text} bold={true} />;
}

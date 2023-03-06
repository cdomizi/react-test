import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { logDOM } from '@testing-library/react';

import NavItem from './NavItem';

function Thing({ id, title, icon, url }) {
  return (
    <ul>
      <li>title: {title}</li>
      <li>icon: {icon}</li>
      <li>url: {url}</li>
    </ul>
  );
};

function NavGroup(props) {
  const groups = props.groups.groups;
  const groupItems = groups.map((group) => group.children);
  const str = JSON.stringify(groups, null, 2);
  return (
    <div>
      {groups.forEach(group => <Thing {...group.children}/>)}
      <pre>
        <code>
        {console.clear()}
        {groups.forEach(group => console.log(...group.children))}
        <br />
        {str}
        </code>
      </pre>
    </div>
  );
};

/*
function NavGroup(props) {
  const groups = props.items;
  const groupItems = groups.map((group) =>
    <NavItem group={group}/>
  );
  return (
    <List disablePadding>
      {groupItems}
    </List>
  );
};
*/

export default NavGroup;
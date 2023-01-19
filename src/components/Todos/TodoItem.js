import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';

function TodoItem(props) {
  return (
    <ListItem>
      <ListItemIcon>
        <CircleIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary={props.text} />
    </ListItem>
  );
}

export default TodoItem;

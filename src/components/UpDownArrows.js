// mui import
import { Stack, IconButton } from "@mui/material";
import { ArrowDropUp as ArrowDropUpIcon } from "@mui/icons-material";
import { ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material";

const UpDownArrows = ({ position, onMoveUp, onMoveDown, disabled }) => {
  const [first, last] = position;
  return (
    <Stack direction="column" spacing={-1}>
      <IconButton
        size="small"
        onClick={onMoveUp}
        sx={{ p: 0, m: 0, mt: 0.3 }}
        disabled={disabled || first}
      >
        <ArrowDropUpIcon />
      </IconButton>
      <IconButton
        size="small"
        onClick={onMoveDown}
        sx={{ p: 0, m: 0 }}
        disabled={disabled || last}
      >
        <ArrowDropDownIcon />
      </IconButton>
    </Stack>
  );
};

export default UpDownArrows;

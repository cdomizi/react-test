import { Stack, IconButton } from "@mui/material";
import { ArrowDropUp as ArrowDropUpIcon } from "@mui/icons-material";
import { ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material";

const UpDownArrows = ({ position, moveUp, disabled }) => {
  const [first, last] = position;

  return (
    <Stack direction="column" spacing={-1}>
      <IconButton
        onClick={() => moveUp(true)}
        sx={{ p: 0, m: 0, mt: 0.3 }}
        disabled={disabled || first}
      >
        <ArrowDropUpIcon />
      </IconButton>
      <IconButton
        onClick={() => moveUp(false)}
        sx={{ p: 0, m: 0 }}
        disabled={disabled || last}
      >
        <ArrowDropDownIcon />
      </IconButton>
    </Stack>
  );
};

export default UpDownArrows;

import PropTypes from "prop-types";
import { Divider, useMediaQuery, useTheme } from "@mui/material";

const CustomDivider = (props) => {
  const bp = props?.breakpoint ?? "md";
  const theme = useTheme();

  return (
    <Divider
      sx={{ py: { xs: 1, md: 0 } }}
      {...props}
      orientation={
        // Make the divider horizontal up to a certain breakpoint (default: `md`),
        // then make it vertical
        useMediaQuery(theme.breakpoints.down(bp)) ? "horizontal" : "vertical"
      }
      flexItem={true}
    />
  );
};

export default CustomDivider;

CustomDivider.propTypes = {
  breakpoint: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
};

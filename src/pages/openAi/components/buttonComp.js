import "./buttonComp.less";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
export default function ButtonCustom(props) {
  return (
    <Button variant="contained" onClick={props.onClick}>
      {props.children}
    </Button>
  );
}

export const DangerButton = styled(Button)({
  backgroundColor: "red",
  "&:hover": {
    backgroundColor: "mediumvioletred",
  },
});

import React from 'react';
import './index.scss';

import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

// checkbox
import { withStyles ,makeStyles} from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

// radio
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

// switch
import Switch from '@material-ui/core/Switch';

// import FormLabel from '@material-ui/core/FormLabel';
// import FormControl from '@material-ui/core/FormControl';
// import FormGroup from '@material-ui/core/FormGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
// import Switch from '@material-ui/core/Switch';

// progress
// import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import PropTypes from 'prop-types';
// import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

// =======================================================================================

// checkbox
const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);
// checkbox end
// progress
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
	},
}));

// ----
type Props = {
  value: "";
}
function LinearProgressWithLabel(props: Props) {
	const { value } = props;
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

const useStyles2 = makeStyles({
  root: {
    width: '100%',
  },
});

// progress end

// =======================================================================================

const Components = () =>  {
	// toggle 
	const [alignment, setAlignment] = React.useState('left');
  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
	// toggle end
	// checkbox
	const [checked2, setChecked2] = React.useState(true);
  const handleChange2 = (event) => {
    setChecked2(event.target.checked2);
  };

	const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
    checkedF: true,
    checkedG: true,
  });
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
	// checkbox end
	// radio
	const [value, setValue] = React.useState('female');
  const handleChange3 = (event) => {
    setValue(event.target.value);
  };
	// radio end
	// switch
	const [state4, setState4] = React.useState({
    checkedA: true,
    checkedB: true,
  });
  const handleChange4 = (event) => {
    setState4({ ...state4, [event.target.name]: event.target.checked });
  };

	const [state5, setState5] = React.useState({
    gilad: true,
    jason: false,
    antoine: true,
  });
  const handleChange5 = (event) => {
    setState5({ ...state5, [event.target.name]: event.target.checked });
  };
	// switch end
// progress
const classes = useStyles();
// --
const classes2 = useStyles2();
const [progress, setProgress] = React.useState(10);

React.useEffect(() => {
	const timer = setInterval(() => {
		setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
	}, 800);
	return () => {
		clearInterval(timer);
	};
}, []);
// progress end
// ===============================================================================================
    return (
        <>
          <div className="c-box">
						<Button>Primary</Button>
						<Button disabled>Disabled</Button>
						<Button href="#text-buttons">Link</Button>
					</div>
          <div className="c-box">					
						<Button variant="contained">Contained</Button>
						<Button variant="contained" disabled>
							Disabled
						</Button>
						<Button variant="contained" href="#contained-buttons">
							Link
						</Button>
					</div>
					<div className="c-box">
						<Button variant="outlined" startIcon={<DeleteIcon />}>
							Delete
						</Button>
						<Button variant="contained" endIcon={<SendIcon />}>
							Send
						</Button>
					</div>
					<div className="c-box">
					<ToggleButtonGroup
						value={alignment}
						exclusive
						onChange={handleAlignment}
						aria-label="text alignment"
					>
						<ToggleButton value="left" aria-label="left aligned">
							基本情報
						</ToggleButton>
						<ToggleButton value="center" aria-label="centered">
							サービス
						</ToggleButton>
						<ToggleButton value="right" aria-label="right aligned">
							写真
						</ToggleButton>
						<ToggleButton value="justify" aria-label="justified">
							一括編集
						</ToggleButton>
					</ToggleButtonGroup>
					</div>
					<div className="c-box">
						<Checkbox
							checked={checked2}
							onChange={handleChange2}
							inputProps={{ 'aria-label': 'primary checkbox' }}
						/>
						<Checkbox
							defaultChecked
							color="primary"
							inputProps={{ 'aria-label': 'secondary checkbox' }}
						/>
						<Checkbox inputProps={{ 'aria-label': 'uncontrolled-checkbox' }} />
						<Checkbox disabled inputProps={{ 'aria-label': 'disabled checkbox' }} />
						<Checkbox disabled checked inputProps={{ 'aria-label': 'disabled checked checkbox' }} />
						<Checkbox
							defaultChecked
							indeterminate
							inputProps={{ 'aria-label': 'indeterminate checkbox' }}
						/>
						<Checkbox
							defaultChecked
							color="default"
							inputProps={{ 'aria-label': 'checkbox with default color' }}
						/>
						<Checkbox
							defaultChecked
							size="small"
							inputProps={{ 'aria-label': 'checkbox with small size' }}
						/>
					</div>
					<div className="c-box">
						<FormGroup row>
							<FormControlLabel
								control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
								label="Secondary"
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={state.checkedB}
										onChange={handleChange}
										name="checkedB"
										color="primary"
									/>
								}
								label="Primary"
							/>
							<FormControlLabel control={<Checkbox name="checkedC" />} label="Uncontrolled" />
							<FormControlLabel disabled control={<Checkbox name="checkedD" />} label="Disabled" />
							<FormControlLabel disabled control={<Checkbox checked name="checkedE" />} label="Disabled" />
							<FormControlLabel
								control={
									<Checkbox
										checked={state.checkedF}
										onChange={handleChange}
										name="checkedF"
										indeterminate
									/>
								}
								label="Indeterminate"
							/>
							<FormControlLabel
								control={<GreenCheckbox checked={state.checkedG} onChange={handleChange} name="checkedG" />}
								label="Custom color"
							/>
							<FormControlLabel
								control={<Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} name="checkedH" />}
								label="Custom icon"
							/>
							<FormControlLabel
								control={
									<Checkbox
										icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
										checkedIcon={<CheckBoxIcon fontSize="small" />}
										name="checkedI"
									/>
								}
								label="Custom size"
							/>
						</FormGroup>
					</div>
					<div className="c-box">
						<FormControl component="fieldset">
							<FormLabel component="legend">Gender</FormLabel>
							<RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange3}>
								<FormControlLabel value="female" control={<Radio />} label="Female" />
								<FormControlLabel value="male" control={<Radio />} label="Male" />
								<FormControlLabel value="other" control={<Radio />} label="Other" />
								<FormControlLabel value="disabled" disabled control={<Radio />} label="(Disabled option)" />
							</RadioGroup>
						</FormControl>
					</div>
					<div className="c-box">
						<Switch
							checked={state4.checkedA}
							onChange={handleChange4}
							name="checkedA"
							inputProps={{ 'aria-label': 'secondary checkbox' }}
						/>
						<Switch
							checked={state4.checkedB}
							onChange={handleChange4}
							color="primary"
							name="checkedB"
							inputProps={{ 'aria-label': 'primary checkbox' }}
						/>
						<Switch inputProps={{ 'aria-label': 'primary checkbox' }} />
						<Switch disabled inputProps={{ 'aria-label': 'disabled checkbox' }} />
						<Switch disabled checked inputProps={{ 'aria-label': 'primary checkbox' }} />
						<Switch
							defaultChecked
							color="default"
							inputProps={{ 'aria-label': 'checkbox with default color' }}
						/>
					</div>
					<div className="c-box">
						<FormControl component="fieldset">
							<FormLabel component="legend">Assign responsibility</FormLabel>
								<FormGroup>
									<FormControlLabel
										control={<Switch checked={state5.gilad} onChange={handleChange5} name="gilad" />}
										label="Gilad Gray"
									/>
									<FormControlLabel
										control={<Switch checked={state5.jason} onChange={handleChange5} name="jason" />}
										label="Jason Killian"
									/>
									<FormControlLabel
										control={<Switch checked={state5.antoine} onChange={handleChange5} name="antoine" />}
										label="Antoine Llorca"
									/>
								</FormGroup>
							<FormHelperText>Be careful</FormHelperText>
						</FormControl>
					</div>
					<div className="c-box">
								progress
								<div className={classes.root}>
									<CircularProgress color="secondary" />
								</div>
								<div className={classes2.root}>
									<LinearProgressWithLabel value={progress} />
								</div>
					</div>
					<div className="c-box">
								tooltips
					</div>
				</>
    );
}
export default Components;
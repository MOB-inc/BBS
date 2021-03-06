import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import './index.scss';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';

type Props = {
	variant: string;
	value: string;
};
const Modal = (props: Props) => {
  const {variant,value} = props;
	const { t } = useTranslation(['location']);
	const [val, setVal] = useState("");
	const valHandle = (event) => {
		setVal(event.target.value);
	}
	
	const modalClose = () => {
		const elem = document.getElementById(variant);
		setTimeout(function(){ 
			elem.style.display = "none"; 
		}, 500);
		elem.style.opacity = 0; 
	}
	const submit = () =>{
		const elem2 = document.getElementById("result");
		elem2.value = val;
		modalClose();
	}
	return (
		<>
			<div id={variant} className="modal">
					<input type="button" className="modalBack" onClick={modalClose} />
					<div className="modalBody">
						<TextField
							id="textArea"
							className="textArea"
							multiline
							rows={4}
							defaultValue={value}
							variant="outlined"
							onChange={valHandle}
						/>
						<div className="flex">
							<Button className="back" variant="outlined" size="large" onClick={modalClose}>
								{t('location:PHRASE.RETURN')}
							</Button>
							<Button className="submit" variant="contained" size="large" onClick = {submit}>
								{t('location:PHRASE.REGISTER')}
							</Button>
						</div>
					</div>
				</div>
		</>
	)

}
export default Modal;
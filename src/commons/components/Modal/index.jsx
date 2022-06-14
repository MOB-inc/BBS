import React from 'react';
import Button from '@material-ui/core/Button';

type Props = {
	active: boolean;
	variant: string;
	value: string;
};
const Modal = (props: Props) => {
  const {active,variant,value} = props;
	return (
		<>
				<div id={variant} className="modal">
					<div className="modalBack"/>
					<div className="modalBody">
						{/* <textarea value={value}/> */}
						<div>
							<Button className="back" variant="outlined" size="large">
								Large
							</Button>
							<Button className="submit" variant="contained" size="large">
								Large
							</Button>
							{console.log(value,active)}
						</div>
					</div>
				</div>
			
		</>
	)

}
export default Modal;
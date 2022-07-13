import React from 'react';
import { ReactComponent as Cross } from '../../icons/cross.svg';
import './index.scss';

type Props = {
	onClick: string;
};
const ModalCross = (props:Props) => {
	const {onClick} = props;
	return (
			<div className="ModalCross">
				<Cross onClick={onClick}/>
			</div>
	)
}
export default ModalCross;
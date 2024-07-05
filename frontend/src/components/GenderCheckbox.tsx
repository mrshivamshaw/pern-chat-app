const GenderCheckbox = ({onChangeCheckBox, selectGender} : {onChangeCheckBox : (gender : string) => void, selectGender : string}) => {
	return (
		<div className='flex'>
			<div className='form-control'>
				<label className={`label gap-2 cursor-pointer`} htmlFor="gender">
					<span className='label-text'>Male</span>
					<input id="gender" type='checkbox' className='checkbox border-slate-900'
					checked={selectGender === 'male'}
					onChange={() => onChangeCheckBox('male')}
					/>
				</label>
			</div>
			<div className='form-control'>
				<label className={`label gap-2 cursor-pointer`} htmlFor="gender">
					<span className='label-text'>Female</span>
					<input id='gender' type='checkbox' className='checkbox border-slate-900'
					checked={selectGender === 'female'}
					onChange={() => onChangeCheckBox('female')}
					/>
				</label>
			</div>
		</div>
	);
};
export default GenderCheckbox;

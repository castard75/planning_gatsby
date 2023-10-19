import { gsap } from 'gsap';
import React, { memo, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLieux, deleteLieux, updateLieux } from '../context/slicers/lieux';

import Button from '../components/Button';
import Popup from '../components/Popup';
import PopupMessage from '../components/PopupMessage';
import Spinner from '../components/Spinner';
import PageLayout from '../layouts/Page';

import Grid from '../components/grid/Grid';
import { SimpleCompEtiquette } from '../components/StatComponents';

import { selectAnimations, selectLieux } from '../context/selectors';

const seoParams = {
	title: 'Lieux',
};

const LieuxPage = () => {
	/* ******************************************************** */
	/* *********************** PAGE *************************** */
	/* ******************************************************** */

	const animationParent = useRef();
	const gridRef = useRef();

	/* ********************************************************* */
	/* *********************** GRID *************************** */
	/* ********************************************************* */

	/* *** SELECTORS *** */

	const lieux = useSelector(selectLieux);
	const animations = useSelector(selectAnimations);
	const { loading, hasErrors } = useSelector(state => state.lieux);

	/* *** VALUE DELETE *** */

	const dispatch = useDispatch(); // Global dispatch function

	const [deleteArray, setDeleteArray] = useState([]);
	const setDeleteArrayFunction = useCallback(
		rows => {
			const filtered = rows.filter(
				row => searchByField(animations, row.data.id, 'id_lieu', 'id') === ''
			);
			setDeleteArray(filtered);
		},
		[animations]
	);

	/* *** UTILITY *** */

	const [isDeletingLieux, setDeletingLieux] = useState(false);
	const [estimatedTime, setEstimatedTime] = useState(0);

	const searchByField = (elements, searchedValue, fieldSearch, fieldToReturn) => {
		const filter =
			elements !== undefined ? elements.filter(element => element[fieldSearch] === searchedValue) : [];
		return filter.length > 0 ? filter[0][fieldToReturn] : '';
	};

	const columnTab = useMemo(
		() => [
			{
				sort: 'asc',
				headerName: 'Nom',
				field: 'nom',
				valueSetter: params => {
					if (!params.data) return false;
					dispatch(updateLieux(params.data.id, { nom: params.newValue }));
					return params.newValue;
				},
				filter: 'agTextColumnFilter',
				cellRenderer: memo(params => <SimpleCompEtiquette value={params.value} />),
				headerCheckboxSelection: true,
				headerCheckboxSelectionFilteredOnly: true,
				checkboxSelection: params =>
					searchByField(animations, params.data.id, 'id_lieu', 'id') === '' ? true : false,
			},
			{
				headerName: 'Zone',
				field: 'zone',
				valueSetter: params => {
					if (!params.data) return false;
					dispatch(updateLieux(params.data.id, { zone: params.newValue }));
					return params.newValue;
				},
				filter: 'agTextColumnFilter',
				cellEditor: 'agSelectCellEditor',
				cellEditorParams: {
					values: ['Ouest', 'Nord', 'Est', 'Sud'],
				},
			},
			{
				headerName: 'Adresse',
				field: 'adresse',
				valueSetter: params => {
					if (!params.data) return false;
					dispatch(updateLieux(params.data.id, { adresse: params.newValue }));
					return params.newValue;
				},
				cellEditor: 'agLargeTextCellEditor',
				filter: 'agTextColumnFilter',
				cellEditorPopup: true,
			},
			{
				cellRenderer: memo(params =>
					!params.data ? (
						''
					) : searchByField(animations, params.data.id, 'id_lieu', 'id') === '' ? (
						<Button
							className='border'
							type='delete'
							onClick={() => dispatch(deleteLieux(params.data.id))}
						/>
					) : (
						''
					)
				),
				width: 102,
				resizable: false,
				pinned: 'right',
				lockPinned: true,
				editable: false,
				sortable: false,
				floatingFilter: false,
				filter: false,
				headerClass: 'dontShowWhenPrint',
				cellClass: 'dontShowWhenPrint',
			},
		],
		[animations, dispatch]
	);

	/* ********************************************************* */
	/* *********************** RENDER ************************** */
	/* ********************************************************* */

	const DeletePopup = memo(() => (
		<div
			style={{
				textAlign: 'center',
				paddingBottom: '20px',
			}}>
			<h3
				style={{
					marginBottom: '20px',
				}}>
				Suppression des lieux
				<br />
				Temps estimé : {estimatedTime} secondes
			</h3>
			<Spinner color='purple' />
		</div>
	));

	// ANIMATIONS
	useLayoutEffect(() => {
		let ctx = gsap.context(() => {
			gsap.from('header, .ag-theme-alpine', {
				duration: 0.8,
				ease: 'power3.inOut',
				y: 20,
				opacity: 0,
				stagger: 0.1,
			});
		}, animationParent);

		return () => ctx.revert();
	}, []);

	return (
		<PageLayout seo={seoParams} ref={animationParent}>
			<PopupMessage
				message={
					typeof hasErrors === 'object'
						? hasErrors.status
							? hasErrors.error.payload
								? hasErrors.error.payload
								: 'Une erreur est survenue'
							: false
						: hasErrors !== false
						? 'Une erreur est survenue'
						: false
				}
			/>

			<Popup
				isOpen={isDeletingLieux}
				preventClosing={isDeletingLieux}
				closeIsOpen={() => setDeletingLieux(false)}>
				<DeletePopup />
			</Popup>

			<header>
				<h3 style={{ marginBottom: 0 }}>
					{loading && 'Actualisation'} {loading && <Spinner color='purple' />}
				</h3>
				<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
					<div style={{ marginRight: 20 }}>
						<Button
							className='dontShowWhenPrint'
							type='add'
							text='Ajouter un lieu'
							onClick={() => dispatch(addLieux({ nom: '' }))}
						/>
					</div>
					<Button
						className={
							deleteArray.length > 0
								? 'delete border dontShowWhenPrint'
								: 'delete border dontShowWhenPrint disabled'
						}
						type='delete'
						text={
							deleteArray.length > 1
								? 'Supprimer les ' + deleteArray.length + ' lieux'
								: 'Supprimer le lieux'
						}
						onClick={() => {
							if (window.confirm('Voulez-vous vraiment supprimer la sélection ?')) {
								const estimatedTimeCal = (deleteArray.length * 200) / 1000;
								if (estimatedTimeCal >= 1) setDeletingLieux(true);
								setEstimatedTime(estimatedTimeCal);

								let i = deleteArray.length;

								deleteArray.forEach(row => {
									i--;
									dispatch(deleteLieux(row.data.id, i === 0 ? true : false));
								});

								setTimeout(() => {
									setEstimatedTime(0);
									setDeletingLieux(false);
								}, estimatedTimeCal * 1000);
							}
						}}
					/>
				</div>
			</header>

			<Grid
				ref={gridRef}
				onSelectionChanged={setDeleteArrayFunction}
				rowData={lieux !== undefined ? lieux.filter(lieu => lieu.id !== 0) : []}
				columnDefs={columnTab}
			/>
		</PageLayout>
	);
};

export default LieuxPage;

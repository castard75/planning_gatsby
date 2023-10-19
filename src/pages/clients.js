import { gsap } from 'gsap';
import React, { memo, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addClients, deleteClients, updateClients } from '../context/slicers/clients';

import Button from '../components/Button';
import Popup from '../components/Popup';
import PopupMessage from '../components/PopupMessage';
import Spinner from '../components/Spinner';
import PageLayout from '../layouts/Page';

import { SimpleCompEtiquette } from '../components/StatComponents';
import { NumericPicker } from '../components/grid/Filters';
import Grid from '../components/grid/Grid';

import { selectAnimations, selectClients } from '../context/selectors';

const seoParams = {
	title: 'Clients',
};

const ClientsPage = () => {
	/* ******************************************************** */
	/* *********************** PAGE *************************** */
	/* ******************************************************** */

	const animationParent = useRef();
	const gridRef = useRef();

	/* ********************************************************* */
	/* *********************** GRID *************************** */
	/* ********************************************************* */

	/* *** SELECTORS *** */

	const clients = useSelector(selectClients);
	const animations = useSelector(selectAnimations);
	const { loading, hasErrors } = useSelector(state => state.clients);

	/* *** VALUE DELETE *** */

	const dispatch = useDispatch(); // Global dispatch function

	const [deleteArray, setDeleteArray] = useState([]);
	const setDeleteArrayFunction = useCallback(
		rows => {
			const filtered = rows.filter(
				row => searchByField(animations, row.data.id, 'id_client', 'id') === ''
			);
			setDeleteArray(filtered);
		},
		[animations]
	);

	/* *** UTILITY *** */

	const [isDeletingClient, setDeletingClient] = useState(false);
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
				headerName: 'Société',
				field: 'societe',
				valueSetter: params => {
					if (!params.data) return false;
					dispatch(updateClients(params.data.id, { societe: params.newValue }));
					return params.newValue;
				},
				filter: 'agTextColumnFilter',
				cellRenderer: memo(params => <SimpleCompEtiquette value={params.value} />),
				headerCheckboxSelection: true,
				headerCheckboxSelectionFilteredOnly: true,
				checkboxSelection: params =>
					searchByField(animations, params.data.id, 'id_client', 'id') === '' ? true : false,
			},
			{
				headerName: 'Interlocuteur',
				field: 'interlocuteur',
				valueSetter: params => {
					if (!params.data) return false;
					dispatch(updateClients(params.data.id, { interlocuteur: params.newValue }));
					return params.newValue;
				},
				filter: 'agTextColumnFilter',
			},
			{
				headerName: 'Téléphone',
				field: 'telephone',
				valueSetter: params => {
					if (!params.data) return false;
					dispatch(updateClients(params.data.id, { telephone: params.newValue }));
					return params.newValue;
				},
				filter: 'agTextColumnFilter',
				cellEditor: NumericPicker,
			},
			{
				headerName: 'Mail',
				field: 'mail',
				valueSetter: params => {
					if (!params.data) return false;
					dispatch(updateClients(params.data.id, { mail: params.newValue }));
					return params.newValue;
				},
				filter: 'agTextColumnFilter',
			},
			{
				cellRenderer: memo(params =>
					!params.data ? (
						''
					) : searchByField(animations, params.data.id, 'id_client', 'id') === '' ? (
						<Button
							className='border'
							type='delete'
							onClick={() => dispatch(deleteClients(params.data.id))}
						/>
					) : (
						''
					)
				),
				pinned: 'right',
				width: 102,
				resizable: false,
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
				Suppression des clients
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
				isOpen={isDeletingClient}
				preventClosing={isDeletingClient}
				closeIsOpen={() => setDeletingClient(false)}>
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
							text='Ajouter un client'
							onClick={() => dispatch(addClients({ societe: '' }))}
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
								? 'Supprimer les ' + deleteArray.length + ' clients'
								: 'Supprimer le client'
						}
						onClick={() => {
							if (window.confirm('Voulez-vous vraiment supprimer la sélection ?')) {
								const estimatedTimeCal = (deleteArray.length * 200) / 1000;
								if (estimatedTimeCal >= 1) setDeletingClient(true);
								setEstimatedTime(estimatedTimeCal);

								let i = deleteArray.length;

								deleteArray.forEach(row => {
									i--;
									dispatch(deleteClients(row.data.id, i === 0 ? true : false));
								});

								setTimeout(() => {
									setEstimatedTime(0);
									setDeletingClient(false);
								}, estimatedTimeCal * 1000);
							}
						}}
					/>
				</div>
			</header>

			<Grid
				ref={gridRef}
				onSelectionChanged={setDeleteArrayFunction}
				rowData={clients}
				columnDefs={columnTab}
			/>
		</PageLayout>
	);
};

export default ClientsPage;

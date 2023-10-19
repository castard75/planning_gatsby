import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Button from '../components/Button';
import {
	ColorComp,
	ContratComp,
	DateComp,
	EtatComp,
	HoraireComp,
	LieuComp,
	SimpleCompEtiquette,
	SimpleCompEtiquetteWY,
	YesNoComp,
} from '../components/StatComponents';
import { deleteAnimations, updateAnimations } from '../context/slicers/animations';
import closeIcon from '../images/icons/addIcon.svg';
import Input, { Select } from './Input';

const StyledContainer = styled.div`
	max-width: 530px;
	position: fixed;
	overflow: auto;
	z-index: ${({ isOpen }) => (isOpen ? '9999' : '-1')};
	top: 0;
	right: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
	bottom: 0;
	border-radius: 30px 0 0 30px;
	padding: 35px;
	background: ${({ theme }) => theme.blue};
	box-shadow: 0 0 40px rgba(0, 38, 66, 0.3);
	pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
	transition: right 0.2s ease;

	h2 {
		font-family: 'Lato', sans-serif;
		font-size: ${({ theme }) => theme.texteLarge};
		color: ${({ theme }) => theme.white};
		margin: 0;
		margin-right: 40px;
	}

	h3 {
		font-family: 'Lato', sans-serif;
		font-size: ${({ theme }) => theme.texteMedium};
		color: ${({ theme }) => theme.white};

		span {
			margin-top: -10px;
			display: block;
			font-size: ${({ theme }) => theme.texteNormal};
		}
	}

	#closeIcon {
		position: absolute;
		top: 20px;
		right: 20px;
		transform: rotate(45deg);

		img {
			width: 34px;
			height: 34px;
			transition: transform 0.2s ease;

			&:hover {
				cursor: pointer;
				transform: scale(1.1);
			}

			&:active {
				transform: scale(0.98);
			}
		}
	}

	.deleteAnim {
		margin-top: 60px;
	}

	&:before {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: ${({ isOpen }) => (isOpen ? 0.3 : 0)};
		pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
		z-index: -1;
		background: ${({ theme }) => theme.blue};
		transition: opacity 0.2s ease;
	}
`;

const Row = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	margin: 25px 0;
`;

const formatDate = date => {
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;
	return [year, month, day].join('-');
};

const sortTable = element =>
	element.sort((a, b) =>
		a.label.toLowerCase() < b.label.toLowerCase()
			? -1
			: a.label.toLowerCase() > b.label.toLowerCase()
			? 1
			: 0
	);

const AnimationDetails = props => {
	/* *** SELECTORS *** */

	const animateurs = useSelector(state => state.animateurs.data?.results);
	const clients = useSelector(state => state.clients.data?.results);
	const lieux = useSelector(state => state.lieux.data?.results);

	const dispatch = useDispatch();
	const deleteAnimationsAction = useCallback(id => dispatch(deleteAnimations(id)), [dispatch]);

	const animateursTab =
		animateurs !== undefined
			? animateurs.map(animateur => {
					return { value: animateur.id, label: animateur.nom };
			  })
			: [];
	const clientsTab =
		clients !== undefined
			? clients.map(client => {
					return { value: client.id, label: client.societe };
			  })
			: [];
	const lieuxTab =
		lieux !== undefined
			? lieux.map(lieu => {
					return { value: lieu.id, label: lieu.nom };
			  })
			: [];

	if (props.data?.tab && props.data?.id) {
		const filter = props.data.tab.filter(animation => animation.id === props.data.id);
		const { id } = props.data;

		if (filter.length > 0) {
			const tab = filter[0];

			/* *** CELL RENDER *** */

			const AnimateursCellRender = props => {
				const dispatch = useDispatch();
				const updateAnimationsAction = useCallback(
					(id, data) => dispatch(updateAnimations(id, data)),
					[dispatch]
				);
				const [edit, setEdit] = useState(false);

				const handleChange = useCallback(
					e => {
						setEdit(false);
						updateAnimationsAction(props.editable, { id_animateur: e.target.value });
					},
					[props.editable, updateAnimationsAction]
				);

				if (edit) {
					return (
						<Select
							onChange={handleChange}
							options={sortTable(animateursTab)}
							defaultValue={props.value}
							isDetailBoard
						/>
					);
				} else {
					if (props.value === 0)
						return (
							<SimpleCompEtiquette
								isEditable={props.editable}
								onDoubleClick={() => props.editable && setEdit(true)}
							/>
						);
					else
						return (
							<ColorComp
								isEditable={props.editable}
								value={searchIndex(animateurs, props.value, 'nom')}
								initialValue={props.color}
								onDoubleClick={() => props.editable && setEdit(true)}
							/>
						);
				}
			};

			const LieuxCellRender = props => {
				const dispatch = useDispatch();
				const updateAnimationsAction = useCallback(
					(id, data) => dispatch(updateAnimations(id, data)),
					[dispatch]
				);
				const [edit, setEdit] = useState(false);

				const handleChange = useCallback(
					e => {
						setEdit(false);
						updateAnimationsAction(props.editable, { id_lieu: e.target.value });
					},
					[props.editable, updateAnimationsAction]
				);

				if (edit) {
					return (
						<Select
							onChange={handleChange}
							options={sortTable(lieuxTab)}
							defaultValue={props.value}
							isDetailBoard
						/>
					);
				} else {
					return (
						<LieuComp
							isEditable={props.editable}
							value={searchIndex(lieux, props.value, 'nom')}
							onDoubleClick={() => props.editable && setEdit(true)}
						/>
					);
				}
			};

			const ClientsCellRender = props => {
				const dispatch = useDispatch();
				const updateAnimationsAction = useCallback(
					(id, data) => dispatch(updateAnimations(id, data)),
					[dispatch]
				);
				const [edit, setEdit] = useState(false);

				const handleChange = useCallback(
					e => {
						setEdit(false);
						updateAnimationsAction(props.editable, { id_client: e.target.value });
					},
					[props.editable, updateAnimationsAction]
				);

				if (edit) {
					return (
						<Select
							onChange={handleChange}
							options={sortTable(clientsTab)}
							defaultValue={props.value}
							isDetailBoard
						/>
					);
				} else {
					return (
						<SimpleCompEtiquette
							isEditable={props.editable}
							onDoubleClick={() => props.editable && setEdit(true)}
							value={searchIndex(clients, props.value, 'societe')}
						/>
					);
				}
			};

			const YesNoCellRender = props => {
				const dispatch = useDispatch();
				const updateAnimationsAction = useCallback(
					(id, data) => dispatch(updateAnimations(id, data)),
					[dispatch]
				);
				const [edit, setEdit] = useState(false);

				const handleChange = useCallback(
					e => {
						setEdit(false);
						updateAnimationsAction(props.editable, { [props.state]: e.target.value });
					},
					[props.editable, updateAnimationsAction, props.state]
				);

				if (edit) {
					return (
						<Select
							onChange={handleChange}
							options={[
								{ label: 'Oui', value: 1 },
								{ label: 'Non', value: 0 },
							]}
							defaultValue={props.value}
							isDetailBoard
						/>
					);
				} else {
					return (
						<YesNoComp
							isEditable={props.editable}
							onDoubleClick={() => props.editable && setEdit(true)}
							value={props.value}
						/>
					);
				}
			};

			const TextCellRender = props => {
				const dispatch = useDispatch();
				const updateAnimationsAction = useCallback(
					(id, data) => dispatch(updateAnimations(id, data)),
					[dispatch]
				);
				const [edit, setEdit] = useState(false);

				const handleChange = useCallback(
					e => {
						setEdit(false);
						updateAnimationsAction(props.editable, { [props.state]: e.target.value });
					},
					[props.editable, updateAnimationsAction, props.state]
				);

				if (edit) {
					return (
						<Input
							type='text'
							onChange={handleChange}
							initialValue={props.initialValue}
							isDetailBoard
						/>
					);
				} else {
					return (
						<SimpleCompEtiquette
							isEditable={props.editable}
							onDoubleClick={() => props.editable && setEdit(true)}
							value={props.value}
						/>
					);
				}
			};

			const TextCellRenderWY = props => {
				const dispatch = useDispatch();
				const updateAnimationsAction = useCallback(
					(id, data) => dispatch(updateAnimations(id, data)),
					[dispatch]
				);
				const [edit, setEdit] = useState(false);

				const handleChange = useCallback(
					e => {
						setEdit(false);
						updateAnimationsAction(props.editable, { [props.state]: e.target.value });
					},
					[props.editable, updateAnimationsAction, props.state]
				);

				if (edit) {
					return (
						<Input
							type={props.state !== 'commentaire' ? 'text' : 'textarea'}
							onChange={handleChange}
							initialValue={props.initialValue}
							isDetailBoard
						/>
					);
				} else {
					return (
						<SimpleCompEtiquetteWY
							isEditable={props.editable}
							onDoubleClick={() => props.editable && setEdit(true)}
							white
							noEtiquette={props.noEtiquette}
							value={props.value}
						/>
					);
				}
			};

			const DateCellRender = props => {
				const dispatch = useDispatch();
				const updateAnimationsAction = useCallback(
					(id, data) => dispatch(updateAnimations(id, data)),
					[dispatch]
				);
				const [edit, setEdit] = useState(false);

				const handleChange = useCallback(
					e => {
						setEdit(false);
						updateAnimationsAction(props.editable, { date: e.target.value });
					},
					[props.editable, updateAnimationsAction]
				);

				if (edit) {
					return (
						<Input
							type='date'
							onChange={handleChange}
							initialValue={formatDate(props.initialValue)}
							isDetailBoard
						/>
					);
				} else {
					return (
						<DateComp
							isEditable={props.editable}
							onDoubleClick={() => props.editable && setEdit(true)}
							value={props.value}
						/>
					);
				}
			};

			const HoraireCellRender = props => {
				const dispatch = useDispatch();
				const updateAnimationsAction = useCallback(
					(id, data) => dispatch(updateAnimations(id, data)),
					[dispatch]
				);
				const [edit, setEdit] = useState(false);

				const handleChange = useCallback(
					e => {
						setEdit(false);
						updateAnimationsAction(props.editable, { horaires: e.target.value });
					},
					[props.editable, updateAnimationsAction]
				);

				if (edit) {
					return (
						<Input
							type='text'
							onChange={handleChange}
							initialValue={props.initialValue}
							isDetailBoard
						/>
					);
				} else {
					return (
						<HoraireComp
							isEditable={props.editable}
							onDoubleClick={() => props.editable && setEdit(true)}
							value={props.value}
						/>
					);
				}
			};

			const ContratCellRender = props => {
				const dispatch = useDispatch();
				const updateAnimationsAction = useCallback(
					(id, data) => dispatch(updateAnimations(id, data)),
					[dispatch]
				);
				const [edit, setEdit] = useState(false);

				const handleChange = useCallback(
					e => {
						setEdit(false);
						updateAnimationsAction(props.editable, { contrat: e.target.value });
					},
					[props.editable, updateAnimationsAction]
				);

				if (edit) {
					return (
						<Select
							onChange={handleChange}
							options={[
								{ label: 'A faire', value: 'A faire' },
								{ label: 'Envoyé par mail', value: 'Envoyé par mail' },
								{ label: 'Imprimé', value: 'Imprimé' },
							]}
							defaultValue={props.value}
							isDetailBoard
						/>
					);
				} else {
					return (
						<ContratComp
							isEditable={props.editable}
							onDoubleClick={() => props.editable && setEdit(true)}
							value={props.value}
						/>
					);
				}
			};

			const ZonesCellRender = props => (
				<SimpleCompEtiquette>{searchIndex(lieux, props.value, 'zone')}</SimpleCompEtiquette>
			);

			const searchByField = (elements, searchedValue, fieldSearch, fieldToReturn) => {
				const filter =
					elements !== undefined
						? elements.filter(element => element[fieldSearch] === searchedValue)
						: [];
				return filter.length > 0 ? filter[0][fieldToReturn] : '';
			};
			const searchIndex = (elements, id, field) => searchByField(elements, id, 'id', field);

			return (
				<StyledContainer isOpen={props.isOpen}>
					<a
						id='closeIcon'
						href='#closeAnim'
						onClick={e => {
							e.preventDefault();
							props.closePopup();
						}}>
						<img src={closeIcon} alt='Close icon' />
					</a>

					<Row style={{ marginTop: 25 }}>
						<h2>Animation</h2>
						<EtatComp editable={tab.export ? false : id} value={tab.etat} isDetailBoard />
					</Row>

					<Row>
						<div style={{ marginRight: 35 }}>
							<h3>Animateur</h3>
							<AnimateursCellRender
								editable={tab.export ? false : id}
								value={tab.id_animateur}
								color={tab.color_animateur}
							/>
						</div>

						<div style={{ marginRight: 35 }}>
							<h3>Client</h3>
							<ClientsCellRender editable={tab.export ? false : id} value={tab.id_client} />
						</div>

						<div>
							<h3>Zone</h3>
							<ZonesCellRender value={tab.id_lieu} />
						</div>
					</Row>

					<Row>
						<div style={{ marginRight: 35 }}>
							<h3>Produit</h3>
							<TextCellRender
								editable={tab.export ? false : id}
								value={tab.produit}
								initialValue={tab.produit}
								state='produit'
							/>
						</div>

						<div style={{ marginRight: 35 }}>
							<h3>Lieu</h3>
							<LieuxCellRender editable={tab.export ? false : id} value={tab.id_lieu} />
						</div>

						<div>
							<h3>Date</h3>
							<DateCellRender
								editable={tab.export ? false : id}
								value={tab.date}
								initialValue={tab.date}
							/>
						</div>
					</Row>

					<Row>
						<div style={{ marginRight: 35 }}>
							<h3>Horaires</h3>
							<HoraireCellRender
								editable={tab.export ? false : id}
								value={tab.horaires}
								initialValue={tab.horaires}
							/>
						</div>

						<div style={{ marginRight: 35 }}>
							<h3>Brief</h3>
							<TextCellRender
								editable={tab.export ? false : id}
								value={tab.brief}
								initialValue={tab.brief}
								state='brief'
							/>
						</div>

						<div>
							<h3>Contrat</h3>
							<ContratCellRender
								editable={tab.export ? false : id}
								value={tab.contrat}
								initialValue={tab.contrat}
							/>
						</div>
					</Row>

					<Row>
						<div style={{ marginRight: 35 }}>
							<h3>DUE</h3>
							<YesNoCellRender
								editable={tab.export ? false : id}
								value={tab.due}
								initialValue={tab.due}
								state='due'
							/>
						</div>

						<div style={{ marginRight: 35 }}>
							<h3>Frais de repas</h3>
							<TextCellRenderWY
								editable={tab.export ? false : id}
								value={tab.frais_repas}
								initialValue={tab.frais_repas}
								state='frais_repas'
								noEtiquette={true}
							/>
						</div>

						<div>
							<h3>Frais KM</h3>
							<TextCellRenderWY
								editable={tab.export ? false : id}
								value={tab.frais_km}
								initialValue={tab.frais_km}
								state='frais_km'
								noEtiquette={true}
							/>
						</div>
					</Row>

					<Row>
						<div style={{ marginRight: 35 }}>
							<h3>Export</h3>
							<YesNoCellRender
								editable={id}
								value={tab.export}
								initialValue={tab.export}
								state='export'
							/>
						</div>

						<div style={{ marginRight: 35 }}>
							<h3>
								Reporting <span>Animateur</span>
							</h3>
							<YesNoCellRender
								editable={tab.export ? false : id}
								value={tab.reporting_animateur}
								initialValue={tab.reporting_animateur}
								state='reporting_animateur'
							/>
						</div>

						<div>
							<h3>
								Reporting <span>Client</span>
							</h3>
							<YesNoCellRender
								editable={tab.export ? false : id}
								value={tab.reporting_client}
								initialValue={tab.reporting_client}
								state='reporting_client'
							/>
						</div>
					</Row>

					<Row>
						<div style={{ marginRight: 35 }}>
							<h3>Materiels</h3>
							<TextCellRender
								editable={tab.export ? false : id}
								value={tab.materiels}
								initialValue={tab.materiels}
								state='materiels'
							/>
						</div>

						<div style={{ marginRight: 35 }}>
							<h3>Commentaire</h3>
							<TextCellRenderWY
								editable={tab.export ? false : id}
								value={tab.commentaire}
								initialValue={tab.commentaire}
								state='commentaire'
							/>
						</div>
					</Row>

					<Button
						className='delete deleteAnim'
						type='delete'
						text="Supprimer l'animation"
						onClick={() => {
							if (window.confirm('Voulez-vous vraiment supprimer cette animation ?')) {
								props.closePopup();
								deleteAnimationsAction(id);
							}
						}}
					/>
				</StyledContainer>
			);
		} else return null;
	} else return null;
};

export default AnimationDetails;

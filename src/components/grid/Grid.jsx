import { AgGridReact } from 'ag-grid-react';
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

/* Translate in french */
const AG_GRID_LOCALE_FR = {
	// Set Filter
	selectAll: '(Tous sélectionner)',
	selectAllSearchResults: '(Sélectionner tous les résultats de la recherche)',
	searchOoo: 'Recherche...',
	blanks: '(Vide)',
	noMatches: 'Aucun résultat',

	// Number Filter & Text Filter
	filterOoo: 'Filtrer...',
	equals: 'Égal à',
	notEqual: 'Différent de',
	blank: 'Vide',
	notBlank: 'Non vide',
	empty: 'Choisir une option',

	// Number Filter
	lessThan: 'Inférieur à',
	greaterThan: 'Supérieur à',
	lessThanOrEqual: 'Inférieur ou égal à',
	greaterThanOrEqual: 'Supérieur ou égal à',
	inRange: 'Dans la plage',
	inRangeStart: 'Dans la plage de début',
	inRangeEnd: 'Dans la plage de fin',

	// Text Filter
	contains: 'Contient',
	notContains: 'Ne contient pas',
	startsWith: 'Commence par',
	endsWith: 'Finit par',

	// Date Filter
	dateFormatOoo: 'dd-mm-yyyy',

	// Filter Conditions
	andCondition: 'ET',
	orCondition: 'OU',

	// Filter Buttons
	applyFilter: 'Appliquer le filtre',
	resetFilter: 'Réinitialiser le filtre',
	clearFilter: 'Effacer le filtre',
	cancelFilter: 'Annuler le filtre',

	// Filter Titles
	textFilter: 'Filtre de texte',
	numberFilter: 'Filtre de nombre',
	dateFilter: 'Filtre de date',
	setFilter: 'Définir le filtre',

	// Side Bar
	columns: 'Colonnes',
	filters: 'Filtres',

	// columns tool panel
	pivotMode: 'Mode Pivot',
	groups: 'Groupes',
	rowGroupColumnsEmptyMessage: 'Glisser une colonne ici pour grouper',
	values: 'Valeurs',
	valueColumnsEmptyMessage: 'Glisser une colonne ici pour agrémenter',
	pivots: 'Nom des colonnes',
	pivotColumnsEmptyMessage: 'Glisser ici pour définir le nom des colonnes',

	// Row Drag
	rowDragRows: 'Ligne(s)',

	// Other
	loadingOoo: 'Chargement...',
	noRowsToShow: 'Aucune ligne à afficher',
	enabled: 'Activé',

	// Menu
	pinColumn: 'Épingler la colonne',
	pinLeft: 'Épingler à gauche',
	pinRight: 'Épingler à droite',
	noPin: 'Ne pas épingler',
	valueAggregation: 'Agrégation de valeurs',
	autosizeThiscolumn: 'Ajuster automatiquement cette colonne',
	autosizeAllColumns: 'Ajuster automatiquement toutes les colonnes',
	groupBy: 'Grouper par',
	ungroupBy: 'Dégrouper par',
	addToValues: 'Ajouter ${variable} aux valeurs',
	removeFromValues: 'Supprimer ${variable} des valeurs',
	addToLabels: 'Ajouter ${variable} aux étiquettes',
	removeFromLabels: 'Supprimer ${variable} aux étiquettes',
	resetColumns: 'Réinitialiser les colonnes',
	expandAll: 'Développer tout',
	collapseAll: 'Réduire tout',
	copy: 'Copier',
	ctrlC: 'Ctrl + C',
	copyWithHeaders: 'Copier avec les en-têtes',
	copyWithHeaderGroups: "Copier avec les groupes d'en-têtes",
	paste: 'Coller',
	ctrlV: 'Ctrl + V',
	export: 'Exporter',
	csvExport: 'Exporter au format CSV',
	excelExport: 'Exporter au format Excel',

	// Enterprise Menu Aggregation and Status Bar
	sum: 'Somme',
	min: 'Minimum',
	max: 'Maximum',
	none: 'Aucun',
	count: 'Nombre',
	avg: 'Moyenne',
	filteredRows: 'Lignes filtrées',
	selectedRows: 'Lignes sélectionnées',
	totalRows: 'Total des lignes',
	totalAndFilteredRows: 'Total des lignes et lignes filtrées',
	more: 'Plus',
	to: 'à',
	of: 'de',
	page: 'Page',
	nextPage: 'Page suivante',
	lastPage: 'Dernière page',
	firstPage: 'Première page',
	previousPage: 'Page précédente',

	// Charts
	pivotChartTitle: 'Graphique en mode Pivot',
	rangeChartTitle: 'Graphique en mode Plage',
	settings: 'Paramètres',
	data: 'Données',
	format: 'Format',
	categories: 'Catégories',
	defaultCategory: '(aucune catégorie)',
	series: 'Séries',
	xyValues: 'Valeurs X et Y',
	paired: 'Paired Mode',
	axis: 'Axe',
	navigator: 'Navigateur',
	color: 'Couleur',
	thickness: 'Épaisseur',
	xType: 'Type X',
	automatic: 'Automatique',
	category: 'Catégorie',
	number: 'Nombre',
	time: 'Temps',
	xRotation: 'Rotation X',
	yRotation: 'Rotation Y',
	ticks: 'Graduations',
	width: 'Largeur',
	height: 'Hauteur',
	length: 'Longueur',
	padding: 'Espacement interne',
	spacing: 'Espacement externe',
	chart: 'Graphique',
	title: 'Titre',
	titlePlaceholder: "Titre de l'onglet - double-cliquez pour éditer",
	background: 'Arrière-plan',
	font: 'Police',
	top: 'Haut',
	right: 'Droite',
	bottom: 'Bas',
	left: 'Gauche',
	labels: 'Étiquettes',
	size: 'Taille',
	minSize: 'Taille minimale',
	maxSize: 'Taille maximale',
	legend: 'Légende',
	position: 'Position',
	markerSize: 'Taille du marqueur',
	markerStroke: 'Contour du marqueur',
	markerPadding: 'Espacement du marqueur',
	itemSpacing: 'Espacement des éléments',
	itemPaddingX: 'Espacement interne horizontal des éléments',
	itemPaddingY: 'Espacement interne vertical des éléments',
	layoutHorizontalSpacing: 'Espacement horizontal du layout',
	layoutVerticalSpacing: 'Espacement vertical du layout',
	strokeWidth: 'Épaisseur du contour',
	offset: 'Décalage',
	offsets: 'Décalages',
	tooltips: 'Infobulles',
	callout: 'Infobulle',
	markers: 'Marqueurs',
	shadow: 'Ombre',
	blur: 'Flou',
	xOffset: 'Décalage X',
	yOffset: 'Décalage Y',
	lineWidth: 'Épaisseur de la ligne',
	normal: 'Normal',
	bold: 'Gras',
	italic: 'Italique',
	boldItalic: 'Gras Italique',
	predefined: 'Prédéfini',
	fillOpacity: 'Opacité de remplissage',
	strokeOpacity: 'Opacité du contour',
	histogramBinCount: 'Nombre de bins',
	columnGroup: 'Groupe de colonnes',
	barGroup: 'Groupe de barres',
	pieGroup: 'Groupe de camemberts',
	lineGroup: 'Groupe de lignes',
	scatterGroup: 'Groupe de nuages',
	areaGroup: 'Groupe de zones',
	histogramGroup: "Groupe d'histogrammes",
	combinationGroup: 'Groupe de combinaisons',
	groupedColumnTooltip: 'Cliquez pour grouper les colonnes',
	stackedColumnTooltip: 'Cliquez pour mettre en pile les colonnes',
	normalizedColumnTooltip: 'Cliquez pour mettre en normale les colonnes',
	groupedBarTooltip: 'Cliquez pour grouper les barres',
	stackedBarTooltip: 'Cliquez pour mettre en pile les barres',
	normalizedBarTooltip: 'Cliquez pour mettre en normale les barres',
	pieTooltip: 'Cliquez pour mettre en camembert',
	doughnutTooltip: 'Cliquez pour mettre en camembert circulaire',
	lineTooltip: 'Cliquez pour mettre en ligne',
	groupedAreaTooltip: 'Cliquez pour grouper les zones',
	stackedAreaTooltip: 'Cliquez pour mettre en pile les zones',
	normalizedAreaTooltip: 'Cliquez pour mettre en normale les zones',
	scatterTooltip: 'Cliquez pour mettre en nuage',
	bubbleTooltip: 'Cliquez pour mettre en bulle',
	histogramTooltip: 'Cliquez pour mettre en histogramme',
	columnLineComboTooltip: 'Cliquez pour mettre en combinaison de colonnes et lignes',
	areaColumnComboTooltip: 'Cliquez pour mettre en combinaison de zones et colonnes',
	customComboTooltip: 'Cliquez pour mettre en combinaison personnalisée',
	noDataToChart: 'Aucune donnée à afficher',
	pivotChartRequiresPivotMode: 'Le graphique en mode Pivot requiert un modèle de tableau en mode Pivot',
	chartSettingsToolbarTooltip: 'Paramètres du graphique',
	chartLinkToolbarTooltip: 'Lien vers le graphique',
	chartUnlinkToolbarTooltip: 'Délier le graphique',
	chartDownloadToolbarTooltip: 'Télécharger le graphique',
	seriesChartType: 'Type de graphique de la série',
	seriesType: 'Type de série',
	secondaryAxis: 'Axe secondaire',

	// ARIA
	ariaHidden: 'Accessibilité : masqué',
	ariaVisible: 'Accessibilité : visible',
	ariaChecked: 'Accessibilité : coché',
	ariaUnchecked: 'Accessibilité : décoché',
	ariaIndeterminate: 'Accessibilité : indéterminé',
	ariaDefaultListName: 'Liste',
	ariaColumnSelectAll: 'Tout sélectionner',
	ariaInputEditor: 'Éditeur de texte',
	ariaDateFilterInput: 'Saisir une date',
	ariaFilterList: 'Liste de filtre',
	ariaFilterInput: 'Saisir un filtre',
	ariaFilterColumnsInput: 'Saisir une colonne',
	ariaFilterValue: 'Saisir une valeur',
	ariaFilterFromValue: 'Saisir une valeur de début',
	ariaFilterToValue: 'Saisir une valeur de fin',
	ariaFilteringOperator: 'Opérateur de filtrage',
	ariaColumn: 'Colonne',
	ariaColumnList: 'Liste de colonnes',
	ariaColumnGroup: 'Groupe de colonnes',
	ariaRowSelect: 'Appuyer sur ESPACE pour sélectionner la ligne',
	ariaRowDeselect: 'Appuyer sur ESPACE pour déselectionner la ligne',
	ariaRowToggleSelection: 'Appuyer sur ESPACE pour sélectionner/désélectionner la ligne',
	ariaRowSelectAll: 'Appuyer sur ESPACE pour sélectionner toutes les lignes',
	ariaToggleVisibility: 'Appuyer sur ESPACE pour afficher/masquer la colonne',
	ariaSearch: 'Rechercher',
	ariaSearchFilterValues: 'Rechercher une valeur',

	ariaRowGroupDropZonePanelLabel: 'Groupe de lignes',
	ariaValuesDropZonePanelLabel: 'Valeurs',
	ariaPivotDropZonePanelLabel: 'Noms de colonne',
	ariaDropZoneColumnComponentDescription: 'Appuyer sur SUPPRIMER pour supprimer',
	ariaDropZoneColumnValueItemDescription: "Appuyer sur ENTRE pour changer l'ordre",

	// ARIA Labels for Dialogs
	ariaLabelColumnMenu: 'Menu de colonne',
	ariaLabelCellEditor: 'Éditeur de cellule',
	ariaLabelDialog: 'Boîte de dialogue',
	ariaLabelSelectField: 'Sélectionner un champ',
	ariaLabelTooltip: 'Infobulle',
	ariaLabelContextMenu: 'Menu contextuel',
	ariaLabelSubMenu: 'Sous-menu',
	ariaLabelAggregationFunction: "Fonction d'agrégation",

	// Number Format (Status Bar, Pagination Panel)
	thousandSeparator: ',',
	decimalSeparator: '.',
};

const StatuBar = styled.p`
	font-family: Lato, sans-serif;
	font-weight: 600;
	background-color: ${props => props.theme.grey};
	color: ${props => props.theme.purple};
	font-size: 1rem;
	padding-left: 18px;
	padding-top: 10px;
	padding-bottom: 10px;
	margin: 0;
	margin-top: 5px;
	border-radius: 10px;
`;

const GridStyle = styled.div`
	background-color: ${props => props.theme.grey};
	border-radius: 10px;

	.ag-root-wrapper {
		font-family: 'Roboto', sans-serif;
		background-color: ${props => props.theme.grey} !important;
		color: ${props => props.theme.black};
		font-size: ${props => props.theme.texteNormal};
		border: none !important;
		border-radius: 10px;
	}

	.ag-overlay-loading-wrapper {
		background-color: ${props => props.theme.grey} !important;
	}

	.ag-overlay-loading-center {
		color: ${props => props.theme.white} !important;
		background-color: ${props => props.theme.purple} !important;
		border: none !important;
		padding: 10px 20px !important;
		border-radius: 50px !important;
	}

	.ag-header {
		margin-bottom: 10px;
	}

	.ag-header-cell {
		padding-bottom: 0;
	}

	.ag-cell,
	.ag-row {
		font-family: 'Roboto', sans-serif;
		background-color: ${props => props.theme.grey} !important;
		color: ${props => props.theme.black};
		font-size: ${props => props.theme.texteNormal};
		border-color: transparent !important;
		display: flex;
		align-items: center;
	}

	.ag-row:hover {
		background-color: ${props => props.theme.white} !important;

		.ag-cell {
			background-color: ${props => props.theme.white} !important;

			&:last-child {
				border-radius: 0 10px 10px 0 !important;
			}
			&:first-child {
				border-radius: 10px 0 0 10px !important;
			}
		}
	}

	.ag-pinned-right-header {
		border: none !important;

		.ag-header-row::after {
			background-color: transparent !important;
		}
	}

	.ag-pinned-right-cols-container {
		.ag-cell {
			justify-content: right;
		}

		.ag-row:hover {
			background-color: ${props => props.theme.grey} !important;

			.ag-cell {
				background-color: ${props => props.theme.grey} !important;
			}
		}
	}

	.ag-header-group-cell-label,
	.ag-header-cell-label {
		font-family: 'Lato', sans-serif;
		font-weight: ${props => props.theme.normalWeight};
		font-size: ${props => props.theme.texteMedium};
	}

	.ag-header-row-column-filter {
		.ag-header-cell {
			border-top: none !important;
			padding-bottom: 20px;
		}

		.ag-input-field-input {
			border-radius: 5px !important;
			border: none !important;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		}

		button {
			box-shadow: none;
		}
	}

	.ag-body-horizontal-scroll:not(.ag-scrollbar-invisible)
		.ag-horizontal-right-spacer:not(.ag-scroller-corner) {
		border: none !important;
		overflow: hidden;
	}

	@media print {
		overflow: visible !important;

		.ag-pinned-right-cols-container,
		.ag-floating-filter,
		.ag-header-row-column-filter {
			display: none !important;
		}

		.ag-header {
			min-height: 0 !important;
			height: 60px !important;
		}
	}
`;

const Grid = forwardRef((props, ref) => {
	const onSelectionChangedValue = props.onSelectionChanged;
	const gridRef = ref;

	const [numberRow, setNumberRow] = useState(0);
	const countRow = useCallback(() => {
		setNumberRow(gridRef?.current?.api?.getDisplayedRowCount());
	}, [gridRef]);

	const onSelectionChanged = e => {
		var rows = e.api.getSelectedNodes();
		if (onSelectionChangedValue) onSelectionChangedValue(rows);
	};

	const autoResize = useCallback(() => {
		const allColumnIds = [];
		gridRef?.current?.columnApi?.getColumns().forEach(column => {
			allColumnIds.push(column.getId());
		});
		gridRef?.current?.columnApi?.autoSizeColumns(allColumnIds, false);
	}, [gridRef]);

	const defaultColDef = useMemo(() => {
		return {
			editable: true,
			sortable: true,
			suppressMenu: true,
			floatingFilter: true,
			filter: true,
			resizable: true,
		};
	}, []);

	useEffect(() => {
		const timeout = setTimeout(() => {
			countRow();
			autoResize();
		}, 20);
		return () => clearTimeout(timeout);
	}, [props.rowData, props.location, countRow, autoResize]);

	useEffect(() => {
		const timeout = setTimeout(() => autoResize(), 20);
		return () => clearTimeout(timeout);
	}, []);

	return (
		<GridStyle
			className='ag-theme-alpine'
			style={{
				height: props.isAnimations ? `calc(100% - 100px)` : `calc(100% - 100px)`,
				width: '100%',
			}}>
			<AgGridReact
				style={{ height: '100%', width: '100%' }}
				ref={gridRef}
				onModelUpdated={countRow}
				localeText={AG_GRID_LOCALE_FR}
				rowHeight='55'
				suppressDragLeaveHidesColumns={true}
				suppressRowHoverHighlight={false}
				//multiSortKey='ctrl'
				rowSelection='multiple'
				suppressRowClickSelection={true}
				onSelectionChanged={onSelectionChanged}
				onGridReady={autoResize}
				animateRows={true}
				getRowId={params => params.data.id}
				stopEditingWhenCellsLoseFocus={true}
				defaultColDef={defaultColDef}
				maintainColumnOrder={true}
				onRowClicked={props.onRowClicked}
				rowData={props.rowData}
				columnDefs={props.columnDefs}
				debounceVerticalScrollbar={true}
				suppressColumnVirtualisation={true}
				//suppressRowVirtualisation={true}
				rowBuffer={30}></AgGridReact>
			<StatuBar className='dontShowWhenPrint'>
				Total : {numberRow !== undefined ? numberRow : 0}
			</StatuBar>
		</GridStyle>
	);
});

export default Grid;

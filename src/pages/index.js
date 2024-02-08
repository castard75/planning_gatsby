import { gsap } from "gsap";
import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import MonthPicker from "react-simple-month-picker";
import styled from "styled-components";
import {
  addAnimations,
  deleteAnimations,
  updateAnimations,
} from "../context/slicers/animations";
import { setDate } from "../context/slicers/date";

import Button from "../components/Button";
import Input, { Select } from "../components/Input";
import Popup from "../components/Popup";
import PopupMessage from "../components/PopupMessage";
import Spinner from "../components/Spinner";
import PageLayout from "../layouts/Page";

import AnimationDetails from "../components/AnimationDetails";
import {
  ColorComp,
  ContratComp,
  DateComp,
  EtatComp,
  HoraireComp,
  LieuComp,
  SimpleComp,
  YesNoComp,
} from "../components/StatComponents";
import { DatePicker } from "../components/grid/Filters";
import Grid from "../components/grid/Grid";

import {
  selectAnimateurs,
  selectAnimations,
  selectClients,
  selectLieux,
} from "../context/selectors";

const lang = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
const seoParams = {
  title: "Planning",
};

const DatePickerComp = styled.h2`
  width: max-content;
  cursor: pointer;
  margin-bottom: 0px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.08);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const DuplicateStyle = styled.div`
  width: 100px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  p {
    font-size: ${(props) => props.theme.texteNormal};
    margin: 0 !important;
    line-height: 1;
  }
`;

const sortTable = (element) =>
  element.sort((a, b) =>
    a.toLowerCase() < b.toLowerCase()
      ? -1
      : a.toLowerCase() > b.toLowerCase()
      ? 1
      : 0
  );

const PlanningPage = () => {
  /* ******************************************************** */
  /* *********************** PAGE *************************** */
  /* ******************************************************** */

  const gridRef = useRef();
  const printGrid = () => {
    gridRef?.current?.api?.setDomLayout("print");
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        gridRef?.current?.api?.setDomLayout();
      }, 200);
    }, 200);
  };

  /* *** DATE FILTER *** */

  const convertMonth = (month) =>
    new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(month);
  const selectDate = useSelector((state) => state.date);
  const [IsOpenDateFilter, setIsOpenDateFilter] = useState(false);

  const getCurrentDate = useCallback(() => {
    const monthConverted =
      selectDate.month === "janvier"
        ? "01"
        : selectDate.month === "février"
        ? "02"
        : selectDate.month === "mars"
        ? "03"
        : selectDate.month === "avril"
        ? "04"
        : selectDate.month === "mai"
        ? "05"
        : selectDate.month === "juin"
        ? "06"
        : selectDate.month === "juillet"
        ? "07"
        : selectDate.month === "août"
        ? "08"
        : selectDate.month === "septembre"
        ? "09"
        : selectDate.month === "octobre"
        ? "10"
        : selectDate.month === "novembre"
        ? "11"
        : selectDate.month === "décembre"
        ? "12"
        : "01";
    return new Date(monthConverted + "/01/" + selectDate.year + " 12:00:00");
  }, [selectDate.month, selectDate.year]);

  /* *** ANIMATIONS DETAILS *** */

  const animationParent = useRef();
  const [IsOpenAnimationDetails, setIsOpenAnimationDetails] = useState(false);
  const [dataAnimation, setDataAnimation] = useState();

  /* *** FORM ADD *** */

  const [isCreatingAnimation, setCreatingAnimation] = useState(false);
  const [isDeletingAnimation, setDeletingAnimation] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);

  const [IsOpenAdd, setIsOpenAdd] = useState(false);
  const [resetForm, setResetForm] = useState(false);
  const [addForm, setAddForm] = useState({
    id_animateur: 0,
    id_client: "",
    id_lieu: 0,
    produit: "",
    horaires: "",
    contrat: "A faire",
    date: getCurrentDate(),
    etat: "En attente",
  });

  /* ********************************************************* */
  /* *********************** GRID *************************** */
  /* ********************************************************* */

  /* *** UTILITY *** */

  const filterDate = useCallback(
    (data, dateFilter) =>
      data !== undefined
        ? data.filter(
            (anim) =>
              new Date(anim.date).getFullYear() === dateFilter.year &&
              convertMonth(new Date(anim.date)) === dateFilter.month
          )
        : [],
    []
  );

  /* *** SELECTORS *** */

  const animationsInit = useSelector(selectAnimations);
  const [animations, setAnimations] = useState(
    filterDate(animationsInit, selectDate)
  );
  const animateurs = useSelector(selectAnimateurs);
  const clients = useSelector(selectClients);
  const lieux = useSelector(selectLieux);

  const { loading, hasErrors } = useSelector((state) => state.animations);

  /* *** VALUES FILTERS *** */

  const animateursNames = useMemo(
    () =>
      animateurs !== undefined
        ? animateurs.map((animateur) => animateur.nom)
        : [],
    [animateurs]
  );
  const clientsNames = useMemo(
    () =>
      clients !== undefined ? clients.map((client) => client.societe) : [],
    [clients]
  );
  const lieuxNames = useMemo(
    () => (lieux !== undefined ? lieux.map((lieu) => lieu.nom) : []),
    [lieux]
  );

  const animateursTab = useMemo(
    () =>
      animateurs !== undefined
        ? animateurs.map((animateur) => {
            return { value: animateur.id, label: animateur.nom };
          })
        : [],
    [animateurs]
  );
  const clientsTab = useMemo(
    () =>
      clients !== undefined
        ? clients.map((client) => {
            return { value: client.id, label: client.societe };
          })
        : [],
    [clients]
  );

  const searchByField = useCallback(
    (elements, searchedValue, fieldSearch, fieldToReturn) => {
      const filter =
        elements !== undefined
          ? elements.filter((element) => element[fieldSearch] === searchedValue)
          : [];
      return filter.length > 0 ? filter[0][fieldToReturn] : "";
    },
    []
  );

  /* *** VALUE DELETE *** */

  const dispatch = useDispatch(); // Global dispatch function

  const [deleteArray, setDeleteArray] = useState([]);
  const setDeleteArrayFunction = useCallback(
    (rows) => setDeleteArray(rows),
    []
  );

  const columnTab = useMemo(
    () => [
      {
        sort: "asc",
        headerName: "Animateur",
        field: "animateur",
        valueGetter: (params) =>
          !params.data
            ? ""
            : params.data.id_animateur === 0
            ? "A définir"
            : searchByField(animateurs, params.data.id_animateur, "id", "nom"),
        valueSetter: (params) => {
          if (!params.data) return false;
          const newValue = searchByField(
            animateurs,
            params.newValue,
            "nom",
            "id"
          );
          dispatch(
            updateAnimations(params.data.id, { id_animateur: newValue })
          );
          return newValue;
        },
        cellRenderer: memo((props) =>
          !props.value || !props.data ? (
            ""
          ) : props.data.id_animateur === 0 ? (
            <SimpleComp />
          ) : (
            <ColorComp
              value={props.value}
              id={props.data.id}
              initialValue={props.data.color_animateur}
              isEditable={props.data.export}
            />
          )
        ),
        filter: "agTextColumnFilter",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: sortTable(animateursNames),
        },
        editable: (params) => (params.data.export ? false : true),
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
      },
      {
        headerName: "Client",
        field: "id_client",
        valueGetter: (params) =>
          !params.data
            ? ""
            : searchByField(clients, params.data.id_client, "id", "societe"),
        valueSetter: (params) => {
          if (!params.data) return false;
          const newValue = searchByField(
            clients,
            params.newValue,
            "societe",
            "id"
          );
          dispatch(updateAnimations(params.data.id, { id_client: newValue }));
          return newValue;
        },
        filter: "agTextColumnFilter",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: sortTable(clientsNames),
        },
        editable: (params) => (params.data.export ? false : true),
      },
      {
        headerName: "Produit",
        field: "produit",
        valueSetter: (params) => {
          if (!params.data) return false;
          dispatch(
            updateAnimations(params.data.id, { produit: params.newValue })
          );
          return params.newValue;
        },
        filter: "agTextColumnFilter",
        cellRenderer: memo(SimpleComp),
        editable: (params) => (params.data.export ? false : true),
      },
      {
        headerName: "Date",
        field: "date",
        valueSetter: (params) => {
          if (!params.data) return false;
          dispatch(updateAnimations(params.data.id, { date: params.newValue }));
          return params.newValue;
        },
        filter: "agDateColumnFilter",
        filterParams: {
          comparator: (filterLocalDateAtMidnight, cellValue) => {
            if (cellValue === null || cellValue === undefined) return -1;
            const dateAsString = new Date(cellValue)
              .toLocaleDateString()
              .split("/");
            var cellDate = new Date(
              Number(dateAsString[2]),
              Number(dateAsString[1]) - 1,
              Number(dateAsString[0])
            );
            if (filterLocalDateAtMidnight.getTime() === cellDate.getTime())
              return 0;
            if (cellDate < filterLocalDateAtMidnight) return -1;
            if (cellDate > filterLocalDateAtMidnight) return 1;
          },
          browserDatePicker: true,
        },
        cellRenderer: memo((props) =>
          !props.value || !props.data ? (
            ""
          ) : (
            <DateComp
              value={props.value}
              id={props.data.id}
              initialValue={props.data.color_date}
              isEditable={props.data.export}
            />
          )
        ),
        cellEditor: DatePicker,
        cellEditorPopup: true,
        editable: (params) => (params.data.export ? false : true),
      },
      {
        headerName: "Lieu",
        field: "lieu",
        valueGetter: (params) =>
          !params.data
            ? ""
            : searchByField(lieux, params.data.id_lieu, "id", "nom"),
        valueSetter: (params) => {
          if (!params.data) return false;
          const newValue = searchByField(lieux, params.newValue, "nom", "id");
          dispatch(updateAnimations(params.data.id, { id_lieu: newValue }));
          return newValue;
        },
        cellRenderer: memo((props) =>
          !props.value || !props.data ? (
            ""
          ) : props.data.id_lieu === 0 ? (
            <SimpleComp />
          ) : (
            <LieuComp value={props.value} />
          )
        ),
        filter: "agTextColumnFilter",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: sortTable(lieuxNames),
        },
        editable: (params) => (params.data.export ? false : true),
      },
      {
        headerName: "Zone",
        field: "zone",
        valueGetter: (params) =>
          !params.data
            ? ""
            : searchByField(lieux, params.data.id_lieu, "id", "zone"),
        filter: "agTextColumnFilter",
        editable: false,
      },
      {
        headerName: "Horaires",
        field: "horaires",
        valueSetter: (params) => {
          if (!params.data) return false;
          dispatch(
            updateAnimations(params.data.id, { horaires: params.newValue })
          );
          return params.newValue;
        },
        filter: "agTextColumnFilter",
        cellRenderer: memo((props) =>
          !props.data ? (
            ""
          ) : (
            <HoraireComp
              value={props.value}
              id={props.data.id}
              initialValue={props.data.color_horaire}
              isEditable={props.data.export}
            />
          )
        ),
        editable: (params) => (params.data.export ? false : true),
      },
      {
        headerName: "Brief",
        field: "brief",
        valueSetter: (params) => {
          if (!params.data) return false;
          dispatch(
            updateAnimations(params.data.id, { brief: params.newValue })
          );
          return params.newValue;
        },
        filter: "agTextColumnFilter",
        cellRenderer: memo(SimpleComp),
        editable: (params) => (params.data.export ? false : true),
        headerClass: "dontShowWhenPrint",
        cellClass: "dontShowWhenPrint",
      },
      {
        headerName: "Contrat",
        field: "contrat",
        valueSetter: (params) => {
          if (!params.data) return false;
          dispatch(
            updateAnimations(params.data.id, { contrat: params.newValue })
          );
          return params.newValue;
        },
        filter: "agTextColumnFilter",
        cellRenderer: memo(ContratComp),
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: ["A faire", "Envoyé par mail", "Imprimé"],
        },
        editable: (params) => (params.data.export ? false : true),
        headerClass: "dontShowWhenPrint",
        cellClass: "dontShowWhenPrint",
      },
      {
        headerName: "DUE",
        field: "due",
        valueGetter: (params) =>
          !params.data ? "" : params.data.due === 1 ? "Oui" : "Non",
        valueSetter: (params) => {
          if (!params.data) return false;
          const value = params.newValue === "Oui" ? "1" : "0";
          dispatch(updateAnimations(params.data.id, { due: value }));
          return value;
        },
        cellRenderer: memo((params) => (
          <YesNoComp value={params.value === "Oui" ? 1 : 0} />
        )),
        filter: "agTextColumnFilter",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: ["Oui", "Non"],
        },
        editable: (params) => (params.data.export ? false : true),
        headerClass: "dontShowWhenPrint",
        cellClass: "dontShowWhenPrint",
      },
      {
        headerName: "État",
        field: "etat",
        valueSetter: (params) => {
          if (!params.data) return false;
          dispatch(updateAnimations(params.data.id, { etat: params.newValue }));
          return params.newValue;
        },
        filter: "agTextColumnFilter",
        cellRenderer: memo(EtatComp),
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: [
            "Facturé",
            "Terminé",
            "Validé",
            "En attente",
            "Annulé",
            "Malade",
            "Absent",
          ],
        },
        editable: (params) => (params.data.export ? false : true),
        headerClass: "dontShowWhenPrint",
        cellClass: "dontShowWhenPrint",
      },
      {
        cellRenderer: memo(() => (
          <Button
            className="border"
            type="update"
            onClick={() => setIsOpenAnimationDetails(true)}
          />
        )),
        headerName: "",
        field: "id",
        pinned: "right",
        width: 102,
        resizable: false,
        lockPinned: true,
        editable: false,
        sortable: false,
        floatingFilter: false,
        filter: false,
        headerClass: "dontShowWhenPrint",
        cellClass: "dontShowWhenPrint",
      },
    ],
    [
      animateurs,
      clients,
      lieux,
      animateursNames,
      clientsNames,
      lieuxNames,
      dispatch,
      searchByField,
    ]
  );

  /* ************************************************************************** */
  /* ***************************** PART COMPONENT ***************************** */
  /* ************************************************************************** */

  const [duplicateAnim, setDuplicateAnim] = useState(1);
  const DuplicateComp = memo((props) => {
    return (
      <DuplicateStyle>
        <button className="border" onClick={() => props.decrement()}>
          <p className="h4">-</p>
        </button>
        <p className="h4">{duplicateAnim}</p>
        <button className="border" onClick={() => props.increment()}>
          <p className="h4">+</p>
        </button>
      </DuplicateStyle>
    );
  });

  const DeletePopup = memo(() => (
    <div
      style={{
        textAlign: "center",
        paddingBottom: "20px",
      }}
    >
      <h3
        style={{
          marginBottom: "20px",
        }}
      >
        Suppression des animations
        <br />
        Temps estimé : {estimatedTime} secondes
      </h3>
      <Spinner color="purple" />
    </div>
  ));

  const CreatePopup = memo(() => (
    <div
      style={{
        textAlign: "center",
        paddingBottom: "20px",
      }}
    >
      <h3
        style={{
          marginBottom: "20px",
        }}
      >
        Création des nouvelles animations
        <br />
        Temps estimé : {estimatedTime} secondes
      </h3>
      <Spinner color="purple" />
    </div>
  ));

  const HeaderButton = memo(() => (
    <>
      <Button
        type="add"
        text="Ajouter une animation"
        onClick={() => setIsOpenAdd(true)}
        className="dontShowWhenPrint"
      />
      <button
        style={{ marginLeft: 20, marginRight: 40 }}
        className="dontShowWhenPrint noText border"
        onClick={() => printGrid()}
      >
        Imprimer le planning
      </button>
      <Button
        className={
          deleteArray.length > 0
            ? "delete border dontShowWhenPrint"
            : "delete border dontShowWhenPrint disabled"
        }
        type="delete"
        text={
          deleteArray.length > 1
            ? "Supprimer les " + deleteArray.length + " animations"
            : "Supprimer l'animation"
        }
        onClick={() => {
          if (window.confirm("Voulez-vous vraiment supprimer la sélection ?")) {
            const estimatedTimeCal = (deleteArray.length * 200) / 1000;
            if (estimatedTimeCal >= 1) setDeletingAnimation(true);
            setEstimatedTime(estimatedTimeCal);

            let i = deleteArray.length;

            deleteArray.forEach((row) => {
              i--;
              dispatch(deleteAnimations(row.data.id, i === 0 ? true : false));
            });

            setTimeout(() => {
              setEstimatedTime(0);
              setDeletingAnimation(false);
            }, estimatedTimeCal * 1000);
          }
        }}
      />
    </>
  ));

  const DateInfos = useMemo(
    () =>
      selectDate.month.charAt(0).toUpperCase() +
      selectDate.month.slice(1) +
      " " +
      selectDate.year,
    [selectDate.month, selectDate.year]
  );

  /* ********************************************************* */
  /* *********************** RENDER ************************** */
  /* ********************************************************* */

  // ANIMATIONS
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from("header, .ag-theme-alpine", {
        duration: 0.8,
        ease: "power3.inOut",
        y: 20,
        opacity: 0,
        stagger: 0.1,
      });
    }, animationParent);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimations(filterDate(animationsInit, selectDate));
      setDataAnimation((state) => ({ ...state, tab: animationsInit }));
      setAddForm((state) => ({ ...state, date: getCurrentDate() }));
    });
    return () => clearTimeout(timeout);
  }, [animationsInit, selectDate, filterDate, getCurrentDate]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      gridRef?.current?.api?.refreshCells({
        force: true,
        columns: ["animateur", "date", "horaires"],
      });
    });
    return () => clearTimeout(timeout);
  }, [gridRef, animations]);

  return (
    <PageLayout seo={seoParams} ref={animationParent}>
      <PopupMessage
        message={
          typeof hasErrors === "object"
            ? hasErrors.status
              ? hasErrors.error.payload
                ? hasErrors.error.payload
                : "Une erreur est survenue"
              : false
            : hasErrors !== false
            ? "Une erreur est survenue"
            : false
        }
      />
      <Popup
        isOpen={IsOpenDateFilter}
        closeIsOpen={() => setIsOpenDateFilter(false)}
      >
        <MonthPicker
          months={lang}
          onChange={(date) => {
            dispatch(setDate(date.toString()));
            setIsOpenDateFilter(false);
          }}
        />
      </Popup>

      <Popup
        isOpen={isDeletingAnimation}
        preventClosing={isDeletingAnimation}
        closeIsOpen={() => setDeletingAnimation(false)}
      >
        <DeletePopup />
      </Popup>

      <Popup
        isOpen={IsOpenAdd}
        preventClosing={isCreatingAnimation}
        closeIsOpen={() => setIsOpenAdd(false)}
      >
        {isCreatingAnimation && <CreatePopup />}
        {!isCreatingAnimation && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 30,
              }}
            >
              <h2 style={{ marginBottom: 0 }}>
                Ajouter {duplicateAnim}{" "}
                {duplicateAnim !== 1 ? "animations" : "animation"}
              </h2>
              <DuplicateComp
                increment={() => setDuplicateAnim((lastCount) => lastCount + 1)}
                decrement={() => {
                  if (duplicateAnim - 1 > 0)
                    setDuplicateAnim((lastCount) => lastCount - 1);
                }}
              />
            </div>
            <Select
              label="Animateur"
              options={animateursTab}
              value={addForm.id_animateur}
              onChange={(e) =>
                setAddForm({ ...addForm, id_animateur: e.target.value })
              }
            />
            <Select
              required
              label="Client"
              options={clientsTab}
              value={addForm.id_client}
              onChange={(e) =>
                setAddForm({ ...addForm, id_client: e.target.value })
              }
            />
            <Input
              label="Produit"
              type="text"
              name="produit"
              initialValue={addForm.produit}
              directHandle
              reset={resetForm}
              onChange={(e) =>
                setAddForm({ ...addForm, produit: e.target.value })
              }
            />
            <Input
              label="Horaires"
              type="text"
              name="horaires"
              initialValue={addForm.horaires}
              directHandle
              reset={resetForm}
              onChange={(e) =>
                setAddForm({ ...addForm, horaires: e.target.value })
              }
            />
            <Button
              type="add"
              text="Créer l'animation"
              className={!(addForm.id_client !== "") ? "disabled" : null}
              onClick={() => {
                const estimatedTimeCal = (duplicateAnim * 200) / 1000;
                setEstimatedTime(estimatedTimeCal);

                dispatch(addAnimations(addForm, duplicateAnim));
                if (estimatedTimeCal >= 1) setCreatingAnimation(true);

                setTimeout(
                  () => {
                    setIsOpenAdd(false);
                    setCreatingAnimation(false);
                    setAddForm({
                      ...addForm,
                      id_animateur: 0,
                      id_client: "",
                      id_lieu: 0,
                      produit: "",
                      horaires: "",
                      contrat: "A faire",
                      date: getCurrentDate(),
                      etat: "En attente",
                    });
                    setEstimatedTime(0);
                    setDuplicateAnim(1);
                    setResetForm(true);
                    setTimeout(() => {
                      setResetForm(false);
                    }, 200);
                  },
                  estimatedTimeCal >= 1 ? estimatedTimeCal * 1000 : 0
                );
              }}
            />
          </>
        )}
      </Popup>

      <AnimationDetails
        isOpen={IsOpenAnimationDetails}
        closePopup={() => setIsOpenAnimationDetails(false)}
        data={dataAnimation}
      />

      <header>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <DatePickerComp
            className="dontShowWhenPrint"
            onClick={() => setIsOpenDateFilter(true)}
          >
            {DateInfos}
          </DatePickerComp>
          {loading && <Spinner color="purple" />}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <HeaderButton />
        </div>
      </header>

      <Grid
        isAnimations
        ref={gridRef}
        onSelectionChanged={setDeleteArrayFunction}
        onRowClicked={(params) =>
          params.data &&
          setDataAnimation({ tab: animationsInit, id: params.data.id })
        }
        rowData={animationsInit}
        columnDefs={columnTab}
      />
    </PageLayout>
  );
};

export default PlanningPage;

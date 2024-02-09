import { gsap } from "gsap";
import React, {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAnimateurs,
  deleteAnimateurs,
  updateAnimateurs,
} from "../context/slicers/animateurs";

import Button from "../components/Button";
import Popup from "../components/Popup";
import PopupMessage from "../components/PopupMessage";
import Spinner from "../components/Spinner";
import PageLayout from "../layouts/Page";

import { SimpleCompEtiquette } from "../components/StatComponents";
import { NumericPicker, NumericPicker5 } from "../components/grid/Filters";
import Grid from "../components/grid/Grid";
import etoileIcon from "../images/icons/etoileIcon.svg";

import { selectAnimateurs, selectAnimations } from "../context/selectors";

const seoParams = {
  title: "Animateurs",
};

const Etoile = (props) => {
  let etoiles = [];
  for (let i = 0; i < props.value; i++) {
    etoiles.push(
      <img style={{ margin: "0 2px" }} src={etoileIcon} alt="etoile" key={i} />
    );
  }
  return <span>{etoiles}</span>;
};

const AnimateursPage = () => {
  /* ******************************************************** */
  /* *********************** PAGE *************************** */
  /* ******************************************************** */

  const animationParent = useRef();
  const gridRef = useRef();

  /* ********************************************************* */
  /* *********************** GRID *************************** */
  /* ********************************************************* */

  /* *** SELECTORS *** */

  const animateurs = useSelector(selectAnimateurs);
  const animations = useSelector(selectAnimations);
  const { loading, hasErrors } = useSelector((state) => state.animateurs);

  /* *** VALUE DELETE *** */

  const dispatch = useDispatch(); // Global dispatch function

  const [deleteArray, setDeleteArray] = useState([]);
  const setDeleteArrayFunction = useCallback(
    (rows) => {
      const filtered = rows.filter(
        (row) =>
          searchByField(animations, row.data.id, "id_animateur", "id") === ""
      );
      setDeleteArray(filtered);
    },
    [animations]
  );

  console.log("Animateurs");
  /* *** UTILITY *** */

  const [isDeletingAnimateur, setDeletingAnimateur] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);

  const searchByField = (
    elements,
    searchedValue,
    fieldSearch,
    fieldToReturn
  ) => {
    const filter =
      elements !== undefined
        ? elements.filter((element) => element[fieldSearch] === searchedValue)
        : [];
    return filter.length > 0 ? filter[0][fieldToReturn] : "";
  };

  const columnTab = useMemo(
    () => [
      {
        sort: "asc",
        headerName: "Nom",
        field: "nom",
        valueSetter: (params) => {
          if (!params.data) return false;
          dispatch(updateAnimateurs(params.data.id, { nom: params.newValue }));
          return params.newValue;
        },
        filter: "agTextColumnFilter",
        cellRenderer: memo((params) => (
          <SimpleCompEtiquette value={params.value} />
        )),
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: (params) =>
          searchByField(animations, params.data.id, "id_animateur", "id") === ""
            ? true
            : false,
      },
      {
        headerName: "Genre",
        field: "genre",
        valueGetter: (params) =>
          !params.data ? "" : params.data.genre === 1 ? "Homme" : "Femme",
        valueSetter: (params) => {
          if (!params.data) return false;
          dispatch(
            updateAnimateurs(params.data.id, {
              genre: params.newValue === "Homme" ? 1 : 0,
            })
          );
          return params.newValue;
        },
        filter: "agTextColumnFilter",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: ["Homme", "Femme"],
        },
      },
      {
        headerName: "Âge",
        field: "age",
        valueSetter: (params) => {
          if (!params.data) return false;
          dispatch(updateAnimateurs(params.data.id, { age: params.newValue }));
          return params.newValue;
        },
        filter: "agTextColumnFilter",
        cellRenderer: memo((params) =>
          !params.value ? "" : params.value + " ans"
        ),
        cellEditor: NumericPicker,
      },
      {
        headerName: "Secteur",
        field: "secteur",
        valueSetter: (params) => {
          if (!params.data) return false;
          dispatch(
            updateAnimateurs(params.data.id, { secteur: params.newValue })
          );
          return params.newValue;
        },
        filter: "agTextColumnFilter",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: ["Ouest", "Nord", "Est", "Sud"],
        },
      },
      {
        headerName: "Mobilité",
        field: "mobilite",
        valueSetter: (params) => {
          if (!params.data) return false;
          dispatch(
            updateAnimateurs(params.data.id, { mobilite: params.newValue })
          );
          return params.newValue;
        },
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Appréciation",
        field: "appreciation",
        valueSetter: (params) => {
          if (!params.data) return false;
          dispatch(
            updateAnimateurs(params.data.id, { appreciation: params.newValue })
          );
          return params.newValue;
        },
        filter: "agTextColumnFilter",
        cellRenderer: memo(Etoile),
        cellEditor: NumericPicker5,
      },
      {
        headerName: "Commentaire",
        field: "commentaire",
        valueSetter: (params) => {
          if (!params.data) return false;
          dispatch(
            updateAnimateurs(params.data.id, { commentaire: params.newValue })
          );
          return params.newValue;
        },
        cellEditor: "agLargeTextCellEditor",
        filter: "agTextColumnFilter",
        cellEditorPopup: true,
      },
      {
        cellRenderer: memo((params) =>
          !params.data ? (
            ""
          ) : searchByField(
              animations,
              params.data.id,
              "id_animateur",
              "id"
            ) === "" ? (
            <Button
              className="border"
              type="delete"
              onClick={() => dispatch(deleteAnimateurs(params.data.id))}
            />
          ) : (
            ""
          )
        ),
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
    [animations, dispatch]
  );

  /* ********************************************************* */
  /* *********************** RENDER ************************** */
  /* ********************************************************* */

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
        Suppression des animateurs
        <br />
        Temps estimé : {estimatedTime} secondes
      </h3>
      <Spinner color="purple" />
    </div>
  ));

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
        isOpen={isDeletingAnimateur}
        preventClosing={isDeletingAnimateur}
        closeIsOpen={() => setDeletingAnimateur(false)}
      >
        <DeletePopup />
      </Popup>

      <header>
        <h3 style={{ marginBottom: 0 }}>
          {loading && "Actualisation"} {loading && <Spinner color="purple" />}
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div style={{ marginRight: 20 }}>
            <Button
              className="dontShowWhenPrint"
              type="add"
              text="Ajouter un animateur"
              onClick={() =>
                dispatch(
                  addAnimateurs({
                    nom: "",

                    age: 0,
                    secteur: " ",
                    mobilite: " ",
                    appreciation: 0,
                    commentaire: " ",
                  })
                )
              }
            />
          </div>
          <Button
            type="delete"
            className={
              deleteArray.length > 0
                ? "delete border dontShowWhenPrint"
                : "delete border dontShowWhenPrint disabled"
            }
            text={
              deleteArray.length > 1
                ? "Supprimer les " + deleteArray.length + " animateurs"
                : "Supprimer l'animateur"
            }
            onClick={() => {
              if (
                window.confirm("Voulez-vous vraiment supprimer la sélection ?")
              ) {
                const estimatedTimeCal = (deleteArray.length * 200) / 1000;
                if (estimatedTimeCal >= 1) setDeletingAnimateur(true);
                setEstimatedTime(estimatedTimeCal);

                let i = deleteArray.length;

                deleteArray.forEach((row) => {
                  i--;
                  dispatch(
                    deleteAnimateurs(row.data.id, i === 0 ? true : false)
                  );
                });

                setTimeout(() => {
                  setEstimatedTime(0);
                  setDeletingAnimateur(false);
                }, estimatedTimeCal * 1000);
              }
            }}
          />
        </div>
      </header>

      <Grid
        ref={gridRef}
        onSelectionChanged={setDeleteArrayFunction}
        rowData={
          animateurs !== undefined
            ? animateurs.filter((animateur) => animateur.id !== 0)
            : []
        }
        columnDefs={columnTab}
      />
    </PageLayout>
  );
};

export default AnimateursPage;

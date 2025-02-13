/* React */
import React, { useState, useMemo, useRef } from "react";
import { createRoot } from 'react-dom/client';

/* Muuri-react */
import { MuuriComponent, AutoScroller, useData } from "muuri-react";
/* Utils & components */
import { Demo, Documents, BackgroundHome, AboutUs, Featured, Select, Input, Switch, CardContent, Foouter } from "./components";
import { datosBibliotecaDigital, useFilter } from "./utils";
/* Style */
import "./style.css";
/* animate */
import WOW from 'wow.js';
import 'animate.css/animate.min.css';

const wow = new WOW();
wow.init();

const rootElement = document.getElementById('app');
const root = createRoot(rootElement);

// App.
const App = () => {
  // Estado del filtro.
  const [filter, setFilter] = useState({
    name: "",
    type: ""
  });

  const [subcategory, setSubcategory] = useState("");

  // Añadir un nuevo estado para la clasificación
  const [sort, setSort] = useState({
    value: "type",
    options: { descending: true },
  });

  // Objeto que mapee las opciones de categoría a las opciones de subcategoría
  const subcategoryOptions = {
    "planes": datosBibliotecaDigital.subcategoryPlanes,
    "informes": datosBibliotecaDigital.subcategoryPlanes,
    "programas": datosBibliotecaDigital.subcategoryProgramas,
    "guías": datosBibliotecaDigital.subcategoryGuías,
    // Agrega más opciones de categoría según sea necesario
  };

  // Método de filtrado.
  const filterFunction = useFilter(filter.name, filter.type, subcategory);

  // Función para manejar el cambio en la categoría
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setFilter({ ...filter, type: category });
    // Restablecer la subcategoría cuando se cambia la categoría
    setSubcategory("");
  };

  // Restablecer la subcategoría cuando se cambia el filtro de nombre
  const handleNameFilterChange = (e) => {
    setFilter({ ...filter, name: e.target.value });
    setSubcategory("");
  };

  // Restablecer la subcategoría cuando se cambia la clasificación
  const handleClassificationChange = (newClassification) => {
    setSubcategory("");
    // Ajusta el estado de sort según la nueva clasificación
    switch (newClassification.toLowerCase()) {
      case "ordenar por":
        setSort({ value: "type", options: { descending: true } });
        console.log("Clasificación cambiada a Ordenar Por");
        break;
      case "a-z":
        setSort({ value: "name", options: { descending: false } });
        console.log("Clasificación cambiada a A-Z");
        break;
      case "año":
        setSort({ value: "año", options: { descending: true } });
        console.log("Clasificación cambiada a Año");
        break;
      default:
        // Si no se reconoce la clasificación, puedes manejarlo según tus necesidades
        console.warn("Clasificación no reconocida");
        break;
    }
  };

  // Memorice a los children para mejorar su rendimiento.
  const children = useMemo(
    () =>
      datosBibliotecaDigital.cards.map(bookCard => (
        <BookCard
          key={bookCard.booksIndex}
          name={bookCard.name}
          descriptionBook={bookCard.descriptionBook}
          types={bookCard.types}
          subcategory={bookCard.subcategory}
          año={bookCard.año}
          pdfSrc={bookCard.pdfSrc}
          booksIndex={bookCard.booksIndex}
        />
      )),
    []
  );

  // Scroll container ref.
  const scrollElemRef = useRef();

  // Render.
  return (
    <div>
      <BackgroundHome></BackgroundHome>
      <AboutUs></AboutUs>
      <Featured></Featured>
      <Demo>
        {/* Documents */}
        <Documents>
          {/* Name input */}
          {/* <Input onKeyUp={e => setFilter({ ...filter, name: e.target.value })} /> */}
          <Input onKeyUp={handleNameFilterChange} />
          {/* Categoría */}
          <Select
            values={datosBibliotecaDigital.types}
            onChange={handleCategoryChange}
            icon="&#xE164;"
          />
          {/* Subcategoría */}
          <Select
            values={["Subcategorías", ...subcategoryOptions[filter.type] || []]}
            onChange={(e) => setSubcategory(e.target.value)}
            icon="&#xe152;" 
          />
          {/* A-Z, Año */}
          <Select
            values={["Ordenar Por", ...datosBibliotecaDigital.cardInfo]}
            onChange={(e) => {
              const newClassification = e.target.value;
              if (newClassification !== "default") {
                handleClassificationChange(newClassification);
              }
            }}
            icon="&#xe8d5;" 
          />
        </Documents>
        {/* Switch */}
        <Switch ref={scrollElemRef}>
          <MuuriComponent

            // dragEnabled
            dragFixed
            sort={sort.value}
            sortOptions={sort.options}
            filter={filterFunction}
            layoutDuration={300}
            layoutEasing={"ease-out"}
            dragAutoScroll={{
              sortDuringScroll: false,
              targets: [
                {
                  element: scrollElemRef,
                  axis: AutoScroller.AXIS_Y
                }
              ]
            }}
          >
            {children}
          </MuuriComponent>
        </Switch>
      </Demo>
      <Foouter></Foouter>
    </div>
  );
};

const BookCard = props => {
  const { types, año, name, subcategory } = props;
  // Combina los tipos en un solo string (si hay dos tipos)
  const type = `${types[0]} ${types[1] || ""}`;
  // Estos datos se utilizarán para ordenar y filtrar.
  useData({ name, type, subcategory, año });
  // Renderiza el componente `CardContent` y pasa todas las propiedades a este componente hijo
  return <CardContent {...props} />;
};

root.render(<App />);
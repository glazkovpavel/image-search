import React from "react";
import api from "../utils/api";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import {Route} from "react-router-dom";
import Photo from "./Photo";


function App() {
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState();
  const [item, setItem] = React.useState();

  React.useEffect(() =>{
    api.getRandom()
        .then((data) => {
          setData(data)
        })
        .catch(err => console.error(err))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  }

  const onSearch = () => {
    setPage(1);

    api
        .search(query)
        .then((data) => {
          setData(data.results);
          setItem(data);
        })
        .catch(() => {});
  };

  React.useEffect(() => {
    api
        .search(query, page)
        .then((data) => {
          setData(data.results);
          setItem(data);
        })
        .catch(() => {});
  }, [page]);
  return (
      <div className="page">
        <Header />
        <Route path="/image-search/" exact>
          <Main data={data}
                handleSubmit={handleSubmit}
                setQuery={setQuery}
                onSearch={onSearch}
                query={query}/>
        </Route>
        <Route path="/image-search/photos/:id" exact>
          <Photo photos={data} />
        </Route>

        <ul>
          {!!item &&
          new Array(item.total_pages).fill(null).map((_, index) => (
              <button
                  key={index}
                  className={`pagination__item ${
                      index + 1 === page ? "active" : ""
                  }`}
                  onClick={() => {
                    setPage(index + 1);
                  }}
              >
                {index + 1}
              </button>
          ))}
        </ul>
        <Footer />
      </div>
  );
}
export default App;

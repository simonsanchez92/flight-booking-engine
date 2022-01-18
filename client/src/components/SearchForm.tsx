import React, { useState, useEffect, Fragment } from "react";

interface CityCode {
  name: string;
  iataCode: string;
}

const SearchForm = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  // const [options, setOptions] = useState([]);

  const [originCityCodes, setOriginCityCodes] = useState([]);
  const [destinationCityCodes, setDestinationCityCodes] = useState([]);

  const [flightType, setFlightType] = useState("round-trip");

  let autocompleteTimeoutHandle: any = 0;
  const autocomplete = (input: any, originOrDestinyInput: string) => {
    let cityCodes: any = [];

    clearTimeout(autocompleteTimeoutHandle);
    autocompleteTimeoutHandle = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ keyword: input });
        const response = await fetch(
          `http://localhost:4000/api/autocomplete?${params}`
        );
        const data: [] = await response.json();

        console.log(data);

        data.forEach(
          (entry: {
            address: any;
            analytics: any;
            detailedName: any;
            geoCode: any;
            iataCode: any;
            id: any;
            name: any;
            self: any;
            subType: any;
            timeZoneOffset: any;
            type: any;
          }) => {
            const newCityCode: CityCode = {
              name: entry.name.toLowerCase(),
              iataCode: entry.iataCode,
            };
            cityCodes.push(newCityCode);

            console.log(newCityCode);
            // cityCodes[entry.name.toLowerCase()] = entry.iataCode;
          }
        );
        originOrDestinyInput === "origin"
          ? setOriginCityCodes(cityCodes)
          : setDestinationCityCodes(cityCodes);
      } catch (err) {
        console.log(err);
      }
    }, 300);

    // clearTimeout(autocompleteTimeoutHandle);
  };

  const testing = (e: React.FormEvent<HTMLInputElement>): void => {
    if (e.currentTarget.id === "origin-input") {
      setOrigin(e.currentTarget.value);
      autocomplete(e.currentTarget.value, "origin");
    }

    if (e.currentTarget.id === "destination-input") {
      setDestination(e.currentTarget.value);
      autocomplete(e.currentTarget.value, "destiny");
    }
  };

  const selectFlightType = (e: React.FormEvent<HTMLSelectElement>) => {
    setFlightType(e.currentTarget.value);
  };

  const search = async (key: keyof CityCode) => {
    const returns = flightType === "round-trip";
    const params = new URLSearchParams({
      origin: originCityCodes.filter(
        (c: CityCode) => c.name === "barcelona"
      )[0]["name"],
    });
  };

  useEffect(() => {
    console.log(originCityCodes);
  }, [origin, destination, originCityCodes, destinationCityCodes]);

  return (
    <div className="container-sm ">
      <div className="my-2 card">
        <div className="card-body">
          <h5 className="card-title">Locations</h5>
          <div className="row">
            <div className="col-sm">
              <div className="mb-2">
                <label
                  htmlFor="origin-input"
                  id="origin-label"
                  className="form-label"
                >
                  Origin
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-pin-map"></i>
                  </span>
                  <input
                    onChange={(e) => testing(e)}
                    value={origin}
                    type="text"
                    className="form-control"
                    id="origin-input"
                    placeholder="Location"
                    aria-describedby="origin-label"
                    list="origin-options"
                  />
                  <datalist id="origin-options">
                    {originCityCodes.length >= 1 ? (
                      originCityCodes.map(({ name, iataCode }) => {
                        return <option value={name} key={iataCode}></option>;
                      })
                    ) : (
                      <option value="No results found..." />
                    )}
                  </datalist>
                </div>
              </div>
            </div>
            <div className="col-sm">
              <div className="mb-2">
                <label
                  htmlFor="destination-input"
                  id="destination-label"
                  className="form-label"
                >
                  Destination
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi-pin-map-fill"></i>
                  </span>
                  <input
                    onChange={(e) => testing(e)}
                    value={destination}
                    type="text"
                    className="form-control"
                    id="destination-input"
                    placeholder="Location"
                    aria-describedby="destination-label"
                    list="destination-options"
                  />
                  <datalist id="destination-options">
                    {destinationCityCodes.length >= 1 ? (
                      destinationCityCodes.map(({ name, iataCode }) => {
                        return <option value={name} key={iataCode}></option>;
                      })
                    ) : (
                      <option value="No results found..." />
                    )}
                  </datalist>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="mb-2 col">
              <div className="h-100 card">
                <div className="card-body">
                  <h5 className="card-title">Dates</h5>
                  <div className="mb-2">
                    <label
                      htmlFor="flight-type-select"
                      className="form-label"
                      id="flight-type-label"
                    >
                      Flight
                    </label>
                    <select
                      aria-describedby="flight-type-label"
                      id="flight-type-select"
                      className="form-select"
                      onChange={(e) => selectFlightType(e)}
                    >
                      <option value="one-way">One-way</option>
                      <option value="round-trip">Round-trip</option>
                    </select>
                  </div>
                  <div className="mb-2" id="departure-date">
                    <label
                      htmlFor="departure-date-input"
                      className="form-label"
                      id="departure-date-label"
                    >
                      Departure date
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi-calendar"></i>
                      </span>
                      <input
                        type="date"
                        className="form-control"
                        id="departure-date-input"
                        aria-describedby="departure-date-label"
                      />
                    </div>
                  </div>
                  <div className="mb-2" id="return-date">
                    <label
                      htmlFor="return-date-input"
                      className="form-label"
                      id="return-date-label"
                    >
                      Return date
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi-calendar-fill"></i>
                      </span>
                      <input
                        type="date"
                        className="form-control"
                        id="return-date-input"
                        aria-describedby="return-date-label"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-2 col">
              <div className="h-100 card">
                <div className="card-body">
                  <h5 className="card-title">Details</h5>
                  <div className="mb-2">
                    <label
                      htmlFor="travel-class-select"
                      className="form-label"
                      id="travel-class-label"
                    >
                      Travel Class
                    </label>
                    <select
                      aria-describedby="travel-class-select"
                      id="travel-class-select"
                      className="form-select"
                    >
                      <option value="ECONOMY">Economy</option>
                      <option value="PREMIUM_ECONOMY">Premium Economy</option>
                      <option value="BUSINESS">Business</option>
                      <option value="FIRST">First</option>
                    </select>
                  </div>
                  <label className="form-label">Passengers</label>
                  <div className="mb-2">
                    <div className="input-group">
                      <label
                        htmlFor="adults-input"
                        className="input-group-text"
                      >
                        Adults
                      </label>
                      <input
                        type="number"
                        min={0}
                        className="form-control"
                        id="adults-input"
                        aria-describedby="adults-label"
                      />
                    </div>
                    <span className="form-text" id="adults-label">
                      12 years old and older
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="input-group">
                      <label
                        htmlFor="children-input"
                        className="input-group-text"
                      >
                        Children
                      </label>
                      <input
                        type="number"
                        min={0}
                        className="form-control"
                        id="children-input"
                        aria-describedby="children-label"
                      />
                    </div>
                    <span className="form-text" id="children-label">
                      2 to 12 years old
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="input-group">
                      <label
                        htmlFor="infants-input"
                        className="input-group-text"
                      >
                        Infants
                      </label>
                      <input
                        type="number"
                        min={0}
                        className="form-control"
                        id="infants-input"
                        aria-describedby="infants-label"
                      />
                    </div>
                    <span className="form-text" id="infants-label">
                      Up to 2 years old
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button className="w-100 btn btn-primary" id="search-button">
        Search
      </button>
      <div
        className="border-bottom mb-4 pt-4"
        id="search-results-separator"
      ></div>

      <div className="d-flex justify-content-center" id="search-results-loader">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>

      <ul id="search-results" className="list-group mb-4"></ul>
    </div>
  );
};

export default SearchForm;

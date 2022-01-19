import React, { useState, useEffect, Fragment } from "react";

interface CityCode {
  name: string;
  iataCode: string;
}

interface Flight {
  price: { total: Number; currency: string };
  itineraries: [
    {
      segments: [
        { arrival: { iataCode: string }; departure: { iataCode: string } }
      ];
    }
  ];
}

const SearchForm = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const [originCityCodes, setOriginCityCodes] = useState([]);
  const [destinationCityCodes, setDestinationCityCodes] = useState([]);

  const [flightType, setFlightType] = useState("round-trip");

  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [travelClass, setTravelClass] = useState("ECONOMY");

  const [adultPassengers, setAdultPassengers] = useState(1);
  const [childrenPassengers, setChildrenPassengers] = useState(0);
  const [infantPassengers, setInfantPassengers] = useState(0);

  const [searchData, setSearchData] = useState([]);

  let autocompleteTimeoutHandle: any = 0;
  const autocomplete = (input: any, originOrDesInput: string) => {
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
            address: string;
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

            // console.log(newCityCode);
            // cityCodes[entry.name.toLowerCase()] = entry.iataCode;
          }
        );
        originOrDesInput === "origin"
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

  const search = async () => {
    try {
      const returns = flightType === "round-trip";
      const params = new URLSearchParams({
        origin: originCityCodes.filter((c: CityCode) => c.name === origin)[0][
          "iataCode"
        ],
        destination: destinationCityCodes.filter(
          (c: CityCode) => c.name === destination
        )[0]["iataCode"],

        departureDate: departureDate,
        adults: adultPassengers.toString(),
        children: childrenPassengers.toString(),
        infants: infantPassengers.toString(),
        travelClass: travelClass,

        ...(returns ? { returnDate: returnDate } : {}),
      });

      const response = await fetch(
        `http://localhost:4000/api/search?${params}`
      );
      const data = await response.json();

      setSearchData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const formatDate = (date: Date) => {
    const [formattedDate] = date.toISOString().split("T");
    return formattedDate;
  };

  const handleDepartureDateChange = (e: React.FormEvent<HTMLInputElement>) => {
    setDepartureDate(e.currentTarget.value);
  };
  const handleReturnDateChange = (e: React.FormEvent<HTMLInputElement>) => {
    setReturnDate(e.currentTarget.value);
  };

  const handleAdultPassengerChange = (e: React.FormEvent<HTMLInputElement>) => {
    setAdultPassengers(+e.currentTarget.value);
  };

  const handleChildrenPassengerChange = (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    setChildrenPassengers(+e.currentTarget.value);
  };

  const handleInfantPassengerChange = (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    setInfantPassengers(+e.currentTarget.value);
  };

  const handleTravelClassChange = (e: React.FormEvent<HTMLSelectElement>) => {
    setTravelClass(e.currentTarget.value);
  };

  useEffect(() => {
    console.log(searchData);
  }, [origin, destination, originCityCodes, destinationCityCodes, searchData]);

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
                        onChange={(e) => handleDepartureDateChange(e)}
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
                        onChange={(e) => handleReturnDateChange(e)}
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
                      onChange={(e) => handleTravelClassChange(e)}
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
                        value={adultPassengers}
                        onChange={(e) => handleAdultPassengerChange(e)}
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
                        value={childrenPassengers}
                        onChange={(e) => handleChildrenPassengerChange(e)}
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
                        value={infantPassengers}
                        onChange={(e) => handleInfantPassengerChange(e)}
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
      <button
        className="w-100 btn btn-primary"
        id="search-button"
        onClick={() => search()}
      >
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

      <ul id="search-results" className="list-group mb-4">
        {searchData.length === 0 ? (
          <h2>No results</h2>
        ) : (
          searchData.map(({ price, itineraries }: Flight, i) => (
            <li
              key={i}
              className="flex-column flex-sm-row list-group-item d-flex justify-content-between align-items-sm-center"
            >
              {itineraries.map((itinerary, index) => {
                return (
                  <div className="flex-column flex-1 m-2 d-flex">
                    <small className="text-muted">
                      {index === 0 ? "Outbound" : "Return"}
                    </small>

                    {itinerary.segments.map(
                      ({ arrival, departure }, i, segments) => {
                        return i === segments.length - 1 ? (
                          <span className="fw-bold">
                            {[departure.iataCode, arrival.iataCode].join(" → ")}
                          </span>
                        ) : (
                          <span className="fw-bold">
                            {[departure.iataCode].join(" → ")}
                          </span>
                        );
                      }
                    )}
                  </div>
                );
              })}
              <span className="bg-primary rounded-pill m-2 badge fs-6">
                {price.total} {price.currency}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SearchForm;

import {
  user,
  today,
  destinationRepo,
  formatInputDate
} from './scripts'


let plannedDest;
const dashboard = document.querySelector('.dashboard');
const pageInfo = document.getElementById('pageInfo');
const inputValues = {
  name: null,
  start: null,
  end: null,
  travelerAmt: null,
  activities: null,
}

function displayChanges() {
  plannedDest = '';
  switch (event.target.id) {
    case 'myTrips':
      pageInfo.innerText = 'My Trips';
      displayTrips();
      break;
    case 'planTrip':
      pageInfo.innerText = 'Plan a Trip';
      displayTripPlanner();
      break;
    case 'destinations':
      pageInfo.innerText = 'Destinations';
      displayDestinations();
      break;
    case 'admin':
      pageInfo.innerText = 'My Profile';
      displayUserProfile();
      break;
    case 'logo':
      pageInfo.innerText = 'My Trips';
      displayTrips();
      break;
    case 'planTripButton':
      // if (!inputValues.activities) {
      //   inputValues.activities = 'N/A'
      // }
      if (extractInputValues()) {
        displayTripPreview();
      }
      break;
    case 'bookNow':
      pageInfo.innerText = "Plan a Trip";
      plannedDest = (event.target.previousElementSibling.previousElementSibling.innerText);
      displayTripPlanner();
      autoFillDestinationName();
      break;
    case 'cancelTrip':
      displayTripPlanner();
      break
  }
}

function displayUsername() {
  const name = document.getElementById('username');
  const nameButton = document.getElementById('admin')
  name.innerText = user.name
  nameButton.innerText = user.name[0];
}

function displayTrips() {
  dashboard.innerHTML = '';
  user.trips.forEach(trip => {
    let name = trip.destination.name;
    let dates = trip.returnTripDates().join(' - ');
    let activities = trip.suggestedActivities.join(', ');
    let status = trip.status;
    let travelerCount = trip.travelers;
    let image = trip.destination.image;
    let alt = trip.destination.alt;
    let duration = trip.duration;
    let cost = trip.calculateTripCost();
    dashboard.innerHTML += renderTrips(name, dates, activities, status, travelerCount, image, alt, duration, cost)
  })
}

function displayDestinations() {
  dashboard.innerHTML = '';
  destinationRepo.list.forEach(dest => {
    let name = dest.name;
    let image = dest.image;
    let alt = dest.alt;
    let flightCost = dest.estimatedFlightCostPerPerson;
    let lodgingCost = dest.estimatedLodgingCostPerDay;
    dashboard.innerHTML += renderDestinations(name, image, alt, flightCost, lodgingCost)
  })
}

function displayTripPlanner() {
  dashboard.innerHTML = '';
  dashboard.innerHTML = renderTripPlanner();
}

function autoFillDestinationName() {
  if (plannedDest) {
    document.getElementById('planDestination').value = plannedDest;
  }
}

function extractInputValues() {
  const inputs = {
    name: document.getElementById('planDestination'),
    start: document.getElementById('planStartDate'),
    end: document.getElementById('planEndDate'),
    travelerAmt: document.getElementById('planTravelers'),
    activities: document.getElementById('planActivities')
  };
  const inputKeys = Object.keys(inputs);
  if (!inputs.activities.value) {
    inputs.activities.value = 'N/A';
  }
  if (inputKeys.every(key => inputs[key].value)) {
    inputKeys.forEach(key => {
      inputValues[key] = inputs[key].value;
    })
    return true;
  } else {
    inputs.activities.value = null;
    return false;
  }
}

function displayTripPreview() {
  dashboard.innerHTML = '';
  dashboard.innerHTML = renderTripPreview();
}

function displayUserProfile() {
  dashboard.innerHTML = '';
  dashboard.innerHTML = renderUserProfile();
}

function displayLogin() {
  dashboard.innerHTML = '';
  dashboard.innerHTML = renderLogin()
}

function renderTrips(name, dates, activities, status, travelerCount, image, alt, duration, cost) {
  return `
  <div class="card-wrapper">
        <div class="card-image-wrapper">
          <img
            src="${image}"
            alt="${alt}">
          <div class="card-image-overlay caps">
            <div class="day-counter-wrapper">
              <p class="days">Days</p>
              <p class="day-count">${duration}</p>
            </div>
          </div>
        </div>
        <div class="card-info-wrapper">
          <div>
            <h2 class="destination-name">${name}</h2>
            <p class="trip-dates">${dates}</p>
          </div>
          <div class="cost-wrapper">
            <p>Trip Price</p>
            <p class="card-cost">$${cost}</p>
          </div>
          <div class="trip-status-wrapper">
            <h3 class="caps smaller-font">Status:</h3>
            <p class="lighter">${status}</p>
          </div>
          <div class="traveler-wrapper">
            <h4 class="caps smaller-font">Travelers:</h4>
            <p class="traveler-count lighter">${travelerCount}</p>
          </div>
        </div>
      </div>
  `
}

function renderDestinations(name, image, alt, flightCost, lodgingCost) {
  return `<div class="card-wrapper">
        <div class="card-image-wrapper">
          <img
            src="${image}"
            alt="${alt}">
        </div>
        <div class="card-info-wrapper">
          <h2 class="destination-name">${name}</h2>
          <div class="cost-wrapper">
            <p>Flight:</p>
            <p class="card-cost">$${flightCost}/person</p>
            <p>Lodging:</p>
            <p class="card-cost">$${lodgingCost}/day</p>
          </div>
          <button id="bookNow" class="book-now">Book Now!</button>
        </div>
      </div> 
      `
}

function renderTripPlanner() {
  return `
    <form class="plan-trip" id="tripPlanner">
      <input placeholder="Destination" type="text" name="destination" id="planDestination" required>
      <label for="planStartDate">Start Date</label>
      <input type="date" id="planStartDate" name="start-date" value="${today}"
       min="${today}">
      <label for="planEndDate">End Date</label>
      <input type="date" id="planEndDate" name="end-date">
      <input placeholder="Number of Travelers" type="number" min="1" name="travelers" id="planTravelers" required>
      <input placeholder="Activities (optional)" type="text" name="activities" id="planActivities">
      <button type="button" id="planTripButton">Plan Trip</button>
    </form>
  `
}

function renderTripPreview() {
  return `<section class="trip-preview">
      <div class="card-wrapper">
        <div class="card-image-wrapper">
          <img
            src="${destinationRepo.list.find(dest => dest.name === inputValues.name).image}"
            alt="Trip Picture">
        </div>
        <div class="card-info-wrapper">
          <div>
            <h2 class="destination-name">${inputValues.name}</h2>
            <p class="trip-dates">${formatInputDate(inputValues.start)} - ${formatInputDate(inputValues.end)}</p>
          </div>
          <p>Activities</p>
          <p class="card-cost">${inputValues.activities}</p>
          <div class="trip-status-wrapper">
            <h3 class="caps smaller-font">Status:</h3>
            <p class="lighter">Pending</p>
          </div>
          <div class="traveler-wrapper">
            <h4 class="caps smaller-font">Travelers:</h4>
            <p class="traveler-count lighter">${inputValues.travelerAmt}</p>
          </div>
        </div>
      </div>
      <article class="trip-cost">
        After TravelTracker agent fees, the total cost of your trip will be $100.
      </article>
      <form class="plan-trip" id="planTripTwo">
        <button type="button" id="finalizeTrip">Plan Trip</button>
        <button type="button" class="bad-button" id="cancelTrip">Cancel</button>
      </form>
    </section>
  `;
}

function renderUserProfile() {
  return `<div class="card-wrapper user-profile">
      <h2>User Name</h2>
      <ul class="user-data">
        <li class="user-data">Age: 10</li>
        <li class="user-data">Height: 6' 10</li>
        <li class="user-data">Weight: 210</li>
        <li class="user-data">Blah blah</li>
      </ul>
    </div
  `
}

function renderLogin() {
  return `<form class="login hidden">
      <input placeholder="username" type="text" name="username" id="username" required>
      <input placeholder="password" type="password" name="password" id="password" required>
      <button class="login-button">Login</button>
    </form>
  `;
}

export {
  displayChanges,
  displayUsername,
  displayTrips,
}
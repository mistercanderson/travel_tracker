import {
  travelers,
  trips,
  destinations,
} from './apiCalls'

import Traveler from './Traveler';
import Destination from './Destination';
import TripRepo from './TripRepo';
import DestinationRepo from './DestinationRepo';
import Trip from './Trip';

let destinationRepo;
let tripRepo;
let users;

function instantiateClasses() {
  generateDestinations();
  generateDestinationRepo();
  generateTrips();
  generateTripRepo();
  generateTravelers();
}

function generateDestinations() {
  if (destinations) {
    return destinations.map(dest => dest = new Destination(dest))
  } else {
    console.log('oh crap destinations is shitty');
  }
}

function generateDestinationRepo() {
  destinationRepo = new DestinationRepo(generateDestinations());
}

function generateTrips() {
  if (trips) {
    return trips.map(trip => trip = new Trip(trip, destinationRepo.list))
  } else {
    console.log('trips is bad');
  }
}

function generateTripRepo() {
  tripRepo = new TripRepo(generateTrips());
}

function generateTravelers() {
  if (travelers) {
    users = travelers.map(traveler => traveler = new Traveler(traveler, tripRepo.list))
  } else {
    console.log('travelers is bad');
  }
}

export {
  instantiateClasses,
  tripRepo,
  destinationRepo,
  users,
};
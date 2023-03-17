// Get references to the DOM elements
const form = document.getElementById('Events_form');
const searchForm = document.getElementById('Search_form');
const eventList = document.getElementById('event-list');


// Define the events array to hold the event objects
let events = [];

// Add an event listener to the form submit button
form.addEventListener('submit', addEvent);



// Load the events from localStorage on page load
window.addEventListener('load', loadEvents);

// Add an event to the events array and localStorage
function addEvent(e) {
  e.preventDefault();
  const name = document.getElementById('event-name').value;
  const date = document.getElementById('event-date').value;
  const time = document.getElementById('event-time').value;
  const location = document.getElementById('event-location').value;
  const notes = document.getElementById('event-notes').value;

  const event = { name, date, time, location, notes };
  events.push(event);

  // Save the events to localStorage
  saveEventsToLocalStorage();

  // Reset the form
  form.reset();

  // Reload the events list
  loadEvents();
}

// Load the events from localStorage
function loadEvents() {
  const eventsString = localStorage.getItem('events');
  if (eventsString) {
    events = JSON.parse(eventsString);
  }
}

// Save the events to localStorage
function saveEventsToLocalStorage() {
  localStorage.setItem('events', JSON.stringify(events));
}



// Load the events from localStorage on page load
window.addEventListener('load', loadEvents);

function loadEvents() {
  const eventsString = localStorage.getItem('events');
  if (eventsString) {
    const events = JSON.parse(eventsString);
    let tableRows = '';
    for (let i = 0; i < events.length; i++) {
      tableRows += `<tr>
                        <td class="px-4 py-2">${events[i].name}</td>
                        <td class="px-4 py-2">${events[i].date}</td>
                        <td class="px-4 py-2">${events[i].time}</td>
                        <td class="px-4 py-2">${events[i].location}</td>
                        <td class="px-4 py-2">${events[i].notes}</td>
                        <td class="px-4 py-2">
                          <button class="edit-btn-${i}">Edit</button>
                          <button class="delete-btn-${i}">Delete</button>
                        </td>
                      </tr>`;
    }
    eventList.querySelector('tbody').innerHTML = tableRows;

    // Add event listeners to the edit and delete buttons
    for (let i = 0; i < events.length; i++) {
      const editButton = document.querySelector(`.edit-btn-${i}`);
      const deleteButton = document.querySelector(`.delete-btn-${i}`);
      editButton.addEventListener('click', () => editEvent(i));
      deleteButton.addEventListener('click', () => deleteEvent(i));
    }
  }
}

// Edit an event in the events array and localStorage
function editEvent(index) {
  // Get the event object from the events array
  const event = events[index];

  // Fill the form fields with the event details
  document.getElementById('event-name').value = event.name;
  document.getElementById('event-date').value = event.date;
  document.getElementById('event-time').value = event.time;
  document.getElementById('event-location').value = event.location;
  document.getElementById('event-notes').value = event.notes;

  // Remove the old event from the array
  events.splice(index, 1);

  // Save the events to localStorage
  saveEventsToLocalStorage();

  // Reload the events list
  loadEvents();
}

// Delete an event from the events array and localStorage
function deleteEvent(index) {
  // Remove the event from the array
  events.splice(index, 1);

  // Save the events to localStorage
  saveEventsToLocalStorage();

  // Reload the events list
  loadEvents();
}


//search for events.
// Add an event listener to the search form submit button
searchForm.addEventListener('submit', searchEvents);
function searchEvents(event) {
  event.preventDefault();

  const searchName = document.getElementById('search-name').value.toLowerCase();
  const searchDate = document.getElementById('search-date').value;
  const searchLocation = document.getElementById('search-location').value.toLowerCase();

  const eventsString = localStorage.getItem('events');
  if (eventsString) {
    const events = JSON.parse(eventsString);
    let foundEvent = null;

    for (let i = 0; i < events.length; i++) {
      if ((searchName && events[i].name.toLowerCase().includes(searchName)) ||
        (searchDate && events[i].date === searchDate) ||
        (searchLocation && events[i].location.toLowerCase().includes(searchLocation))) {
        foundEvent = events[i];
        break;
      }
    }

    if (foundEvent) {
      alert("Event found: " + foundEvent.name + "\n" +
        "Location: " + foundEvent.location + "\n" +
        "Date: " + foundEvent.date
      );
      const tableRows = document.querySelectorAll('#eventList tbody tr');
      for (let i = 0; i < tableRows.length; i++) {
        if (tableRows[i].querySelector('td:nth-child(1)').textContent === foundEvent.name &&
          tableRows[i].querySelector('td:nth-child(2)').textContent === foundEvent.date &&
          tableRows[i].querySelector('td:nth-child(4)').textContent === foundEvent.location) {
          tableRows[i].classList.add('bg-yellow-200');
          setTimeout(() => {
            tableRows[i].classList.remove('bg-yellow-200');
          }, 5000);

          return;
        }
      }
    } else {
      alert('Event not found!');
    }
  }
}

//share events function.
function shareEvent(platform) {
  // Get the event details
  const eventName = document.getElementById('event-name').textContent;
  const eventDate = document.getElementById('event-date').textContent;
  const eventLocation = document.getElementById('event-location').textContent;

  // Share the event based on the selected platform
  switch (platform) {
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(eventName + ' on ' + eventDate + ' at ' + eventLocation)}`);
      break;
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(eventName + ' on ' + eventDate + ' at ' + eventLocation)}`);
      break;
    case 'email':
      window.location.href = `mailto:?subject=${encodeURIComponent(eventName)}&body=${encodeURIComponent(eventName + ' on ' + eventDate + ' at ' + eventLocation)}%0D%0A${encodeURIComponent(window.location.href)}`;
      break;
  }
}

// event map



$(function() {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZHJhc2gtam9lIiwiYSI6ImNsZWN3N3FhdzAxMzEzdm1jZHFvcmNzZmUifQ.tnEvXr3X3WFl0b9A5I3ZSA';
var map = new mapboxgl.Map({
  container: 'map_container',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [0, 0],
  zoom: 2
});

// Create a Leaflet map centered on the United States
var map = L.map('map_container').setView([37.0902, -95.7129], 4);

// Add a tile layer from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map);

// Loop through the events array and add a marker for each event
for (var i = 0; i < events.length; i++) {
  var event = events[i];

  // Create a Leaflet marker with the event's coordinates
  var marker = L.marker(event.coordinates).addTo(map);

  // Bind a popup to the marker with the event's name and location
  marker.bindPopup('<b>' + event.name + '</b><br>' + event.location);
}


events.forEach(function (event) {
  // create a DOM element for the marker
  var marker = document.createElement('div');
  marker.className = 'marker';
  marker.style.backgroundImage = 'url(https://placekitten.com/g/40/40)';
  marker.style.width = '40px';
  marker.style.height = '40px';

  // create the popup
  var popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML('<h3>' + event.name + '</h3><p>' + event.location + '</p>');

  // add the marker to the map
  new mapboxgl.Marker(marker)
    .setLngLat(event.coordinates)
    .setPopup(popup)
    .addTo(map);
});
});



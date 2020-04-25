let map;
let markers = [];
let infoWindow;
let locationSelect;






function initMap() {
  let losangeles = {
    lat: 34.063380,
    lng: -118.358080
  };
  map = new google.maps.Map(document.getElementById('map'), {
    center: losangeles,
    zoom: 11,
    mapTypeId: 'roadmap',


  });
  infoWindow = new google.maps.InfoWindow()
  searchStores()

}

function searchStores() {
  let foundStores = [];
  let zipCode = document.getElementById('zip-code-input').value;

  if (zipCode) {
    stores.forEach(function (store, index) {
      let postal = store.address.postalCode.substring(0, 5);

      if (postal == zipCode) {
        foundStores.push(store);
      }

    })

  } else {
    foundStores = stores
  }
  // console.log(foundStores)
  clearLocations()
  displayStores(foundStores)
  showStoreMarkers(foundStores)
  setOnClickListener()
}

function clearLocations() {
  infoWindow.close();
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function setOnClickListener() {
  let storeElements = document.querySelectorAll('.store-container');
  storeElements.forEach(function (elem, index) {
    elem.addEventListener('click', function () {
      new google.maps.event.trigger(markers[index], 'click');
    })
  })
  // console.log(storeElements)
}

function displayStores(stores) {
  let storesHTML = '';
  stores.forEach(function (store, index) {
    let address = store.addressLines;
    let phone = store.phoneNumber;

    storesHTML += `
    <div class="store-container">
    <div class="store-container-background">
      <div class="store-info-container">
        <div class="store-adress">
          <span>${address[0]}</span>
          <span>${address[1]}</span>

        </div>
        <div class="store-phone-number">${phone}</div>
      </div>
      <div class="store-number-container">
        <div class="store-number">${index + 1}</div>
      </div>
    </div>
  </div>`
  });

  document.querySelector('.stores-list').innerHTML = storesHTML
}

function showStoreMarkers(stores) {
  let bounds = new google.maps.LatLngBounds();
  stores.forEach(function (store, index) {
    let latlng = new google.maps.LatLng(
      store.coordinates.latitude,
      store.coordinates.longitude);

    let name = store.name;
    let adress = store.addressLines[0];
    let openStatusText = store.openStatusText;
    let phoneNumber = store.phoneNumber;
    createMarker(latlng, name, adress, index, openStatusText, phoneNumber);
    bounds.extend(latlng);
  })
  map.fitBounds(bounds);

}

function createMarker(latlng, name, address, index, openStatusText, phoneNumber) {
  let html =  `
  <div class="store-info-window">
      <div class="store-info-name">
          ${name}
      </div>
      <div class="store-info-status">
          ${openStatusText}
      </div>
      <div class="store-info-address">
          <div class="circle">
              <i class="fas fa-location-arrow"></i>
          </div>
          ${address}
      </div>
      <div class="store-info-phone">
          <div class="circle">
              <i class="fas fa-phone-alt"></i>
          </div>
          ${phoneNumber}
      </div>
  </div>
`;
  
  let marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: `${index + 1}`
  });
  google.maps.event.addListener(marker, 'click', function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}
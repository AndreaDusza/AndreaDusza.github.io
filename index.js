/**
 * Created by Andrea on 2015.08.29..
 */

google.maps.event.addDomListener(window, 'load', initializeMap);

$(document).ready(function () {
    $("#town-input-1").select2({
        width: "300px",
        placeholder: "Írja be a településnevet",
        allowClear: true,
        multiple: true,
        maximumSelectionSize: 10,
        data: TOWNS_LIST.map(function (city, index) {
            return {id: index, text: city};
        }),

        formatLoadMore: 'Loading more...',
        query: function (q) {
            // pageSize is number of results to show in dropdown
            var pageSize,
                results;
            pageSize = 20;
            results = this.data.filter(function (e) {
                return (q.term === "" || e.text.toUpperCase().indexOf(q.term.toUpperCase()) === 0);
            });
            q.callback({
                results: results.slice((q.page - 1) * pageSize, q.page * pageSize),
                // retrieve more when user hits bottom
                more: results.length >= q.page * pageSize
            });
        }
    });

    var housesList = document.getElementById("houses-list");

    $.getJSON("houses.json", function (json) {
        json.forEach(i => {
            var li = document.createElement("li");
            li.innerHTML = (
                `<div class="frame">
                <a href="${i.detailsPageUrl}">
                <img src="${i.images[0]}" alt="Img" width="418px" height="264px"></a>
                </div>
                <h5>${i.title}</h5>
                <p>${i.description}</p>
                <div class="details">
                <p><b>Alapterület:</b>${i.sizeInSquareMeters} m<sup>2</sup></p>
                <p><b>Szobák:</b> ${i.numberOfRooms}</p>
                </div>
                <span class="price">${i.price}</span>`
            );
            housesList.appendChild(li);
        })
    });
});

function initializeMap() {
    var myCenter = new google.maps.LatLng(47.456589, 18.928657);
    var mapProp = {
        center: myCenter,
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    $.getJSON("houses.json", function (json) {
        json.forEach(i => {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(i.lat, i.lng)
            });
            marker.setMap(map);

            var contentString =
                `<div class="mapInfoWindow">
                <h1 class="mapInfoWindowFirstHeading">${i.title}</h1>
                <div><p><a href="${i.detailsPageUrl}">
                <img src="${i.images[0]}" height="150" width="200" alt="Img"></a></p>
                <p>${i.price}</p>
                <p><a href="${i.detailsPageUrl}">Részletek itt</a></p>
                </div>
                </div>`;

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });

        });
    });
}



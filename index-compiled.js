/**
 * Created by Andrea on 2015.08.29..
 */

"use strict";

google.maps.event.addDomListener(window, 'load', initializeMap);

$(document).ready(function () {
    $("#town-input-1").select2({
        width: "300px",
        placeholder: "�rja be a telep�l�snevet",
        allowClear: true,
        multiple: true,
        maximumSelectionSize: 10,
        data: TOWNS_LIST.map(function (city, index) {
            return { id: index, text: city };
        }),

        formatLoadMore: 'Loading more...',
        query: function query(q) {
            // pageSize is number of results to show in dropdown
            var pageSize, results;
            pageSize = 20;
            results = this.data.filter(function (e) {
                return q.term === "" || e.text.toUpperCase().indexOf(q.term.toUpperCase()) === 0;
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
        json.forEach(function (i) {
            var li = document.createElement("li");
            li.innerHTML = "<div class=\"frame\">\n                <a href=\"" + i.detailsPageUrl + "\">\n                <img src=\"" + i.images[0] + "\" alt=\"Img\" width=\"418px\" height=\"264px\"></a>\n                </div>\n                <h5>" + i.title + "</h5>\n                <p>" + i.description + "</p>\n                <div class=\"details\">\n                <p><b>Alapter�let:</b>" + i.sizeInSquareMeters + " m<sup>2</sup></p>\n                <p><b>Szob�k:</b> " + i.numberOfRooms + "</p>\n                </div>\n                <span class=\"price\">" + i.price + "</span>";
            housesList.appendChild(li);
        });
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
        json.forEach(function (i) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(i.lat, i.lng)
            });
            marker.setMap(map);

            var contentString = "<div class=\"mapInfoWindow\">\n                <h1 class=\"mapInfoWindowFirstHeading\">" + i.title + "</h1>\n                <div><p><a href=\"" + i.detailsPageUrl + "\">\n                <img src=\"" + i.images[0] + "\" height=\"150\" width=\"200\" alt=\"Img\"></a></p>\n                <p>" + i.price + "</p>\n                <p><a href=\"" + i.detailsPageUrl + "\">R�szletek itt</a></p>\n                </div>\n                </div>";

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });
        });
    });
}

//# sourceMappingURL=index-compiled.js.map
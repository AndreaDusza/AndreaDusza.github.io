/**
 * Created by Andrea on 2015.08.29..
 */
"use strict";

var markers = new Array();

function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = new Array();
};

google.maps.event.addDomListener(window, 'load', initializeMap);
$(document).ready(function () {
    var housesList = document.getElementById("houses-list");

    var townListFromJson = [];
    var typeListFromJson = [];
    $.getJSON("houses.json", function (json) {
        var townSetFromJson = new Set();
        var typeSetFromJson = new Set();
        json.forEach(function (i) {
            var li = document.createElement("li");
            var roomsHtmlPart = "";
            if (i.numberOfRooms !== undefined) {
                roomsHtmlPart = "<p><b>Szobák: </b>" + i.numberOfRooms + "</p>";
            }
            li.innerHTML = "<div class=\"frame\">\n                <a href=\"" + i.detailsPageUrl + "\">\n                <img class=\"houseThumbnailInFrontpageList\" src=\"" + i.images[0] + "\" alt=\"Img\" width=\"418px\" height=\"264px\"></a>\n                </div>\n                <h5>" + i.title + "</h5>\n                <div class=\"details\">\n                <p><b>Alapterület: </b>" + i.sizeInSquareMeters + " m<sup>2</sup></p>" + roomsHtmlPart + ("</div>\n                <span class=\"price\">" + i.price + "</span>");
            housesList.appendChild(li);
            i.locationTags.forEach(function (j) {
                townSetFromJson.add(j);
            });
            typeSetFromJson.add(i.type);
        });

        townSetFromJson.forEach(function (k) {
            townListFromJson.push(k);
        });
        typeSetFromJson.forEach(function (k) {
            typeListFromJson.push(k);
        });

        var typeSelect = document.getElementById("selectEstateType");
        var option = document.createElement("option");
        option.innerHTML = "<option>bármilyen ingatlan</option>";
        typeSelect.appendChild(option);
        typeSetFromJson.forEach(function (i) {
            var option = document.createElement("option");
            option.innerHTML = "<option>" + i + "</option>";
            typeSelect.appendChild(option);
        });

        $("#town-input-1").select2({
            width: "300px",
            placeholder: "Írja be, hol keres ingatlant",
            allowClear: true,
            multiple: true,
            maximumSelectionSize: 10,
            data: townListFromJson.map(function (city, index) {
                return { id: index, text: city };
            }),
            formatLoadMore: 'Loading more...'
        });
    });
});

function initializeMap() {
    var myCenter = new google.maps.LatLng(47.456589, 18.928657);
    var mapProp = {
        center: myCenter,
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    $.getJSON("houses.json", function (json) {
        json.forEach(function (i) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(i.lat, i.lng)
            });
            markers.push(marker);
            marker.setMap(map);

            var contentString = "<div class=\"mapInfoWindow\">\n                <a href=\"" + i.detailsPageUrl + "\"><h1>" + i.mostSpecificLocation + "</h1></a>\n                <div><p><a href=\"" + i.detailsPageUrl + "\">\n                <img class=\"houseThumbnailInMapInfoWindow\" src=\"" + i.images[0] + "\" alt=\"Img\"></a></p>\n                <p>" + i.price + "</p>\n                </div>\n                </div>";

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });
        });
    });
}

function refreshListAndMap() {
    clearMarkers();
    var typeSelector = document.getElementById("selectEstateType");
    var selectedType = typeSelector.value;
    console.log(typeSelector);
    console.log(selectedType);
    var selections = $("#town-input-1").select2('data');
    var selectedTowns = [];
    var saleCheckbox = document.getElementById('checkbox_sale');
    var rentCheckbox = document.getElementById('checkbox_rent');
    selections.forEach(function (i) {
        selectedTowns.push(i.text);
    });
    console.log(selectedTowns);
    var myCenter = new google.maps.LatLng(47.456589, 18.928657);
    var mapProp = {
        center: myCenter,
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    var housesList = document.getElementById("houses-list");
    housesList.innerHTML = "";
    $.getJSON("houses.json", function (json) {
        json.forEach(function (i) {
            if ((selectedTowns.length === 0 || selectedTowns.filter(function (n) {
                return i.locationTags.indexOf(n) >= 0;
            }).length > 0) && (i.type === selectedType || selectedType === "bármilyen ingatlan") && (saleCheckbox.checked && i.forSaleOrRent === "sale" || rentCheckbox.checked && i.forSaleOrRent === "rent")) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(i.lat, i.lng)
                });
                markers.push(marker);
                marker.setMap(map);

                var contentString = "<div class=\"mapInfoWindow\">\n                <a href=\"" + i.detailsPageUrl + "\"><h1>" + i.mostSpecificLocation + "</h1></a>\n                <div><p><a href=\"" + i.detailsPageUrl + "\">\n                <img class=\"houseThumbnailInMapInfoWindow\" src=\"" + i.images[0] + "\" alt=\"Img\"></a></p>\n                <p>" + i.price + "</p>\n                </div>\n                </div>";

                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.open(map, marker);
                });

                var li = document.createElement("li");
                var roomsHtmlPart = "";
                if (i.numberOfRooms !== undefined) {
                    roomsHtmlPart = "<p><b>Szobák: </b>" + i.numberOfRooms + "</p>";
                }
                li.innerHTML = "<div class=\"frame\">\n                <a href=\"" + i.detailsPageUrl + "\">\n                <img class=\"houseThumbnailInFrontpageList\" src=\"" + i.images[0] + "\" alt=\"Img\" width=\"418px\" height=\"264px\"></a>\n                </div>\n                <h5>" + i.title + "</h5>\n                <div class=\"details\">\n                <p><b>Alapterület: </b>" + i.sizeInSquareMeters + " m<sup>2</sup></p>" + roomsHtmlPart + ("</div>\n                <span class=\"price\">" + i.price + "</span>");
                housesList.appendChild(li);
            }
        });
    });
}

//# sourceMappingURL=index-compiled.js.map
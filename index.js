/**
 * Created by Andrea on 2015.08.29..
 */
var markers = new Array();

function clearMarkers() {
    for (var i=0; i<markers.length; i++){
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
        json.forEach(i => {
            var li = document.createElement("li");
            var roomsHtmlPart="";
            if (i.numberOfRooms !== undefined){
                roomsHtmlPart =  "<p><b>Szobák: </b>" + i.numberOfRooms + "</p>";
            }
            li.innerHTML = (
                `<div class="frame">
                <a href="${i.detailsPageUrl}">
                <img class="houseThumbnailInFrontpageList" src="${i.images[0]}" alt="Img" width="418px" height="264px"></a>
                </div>
                <h5>${i.title}</h5>
                <div class="details">
                <p><b>Alapterület: </b>${i.sizeInSquareMeters} m<sup>2</sup></p>`
                + roomsHtmlPart +
                `</div>
                <span class="price">${i.price}</span>`
            );
            housesList.appendChild(li);
            (i.locationTags).forEach(j => {
                townSetFromJson.add(j);
            });
            typeSetFromJson.add(i.type);
        });

        townSetFromJson.forEach( k => {
            townListFromJson.push(k);
        });
        typeSetFromJson.forEach( k => {
            typeListFromJson.push(k);
        });

        var typeSelect = document.getElementById("selectEstateType");
        var option = document.createElement("option");
        option.innerHTML = `<option>bármilyen ingatlan</option>`;
        typeSelect.appendChild(option);
        typeSetFromJson.forEach(i =>{
            var option = document.createElement("option");
            option.innerHTML = `<option>${i}</option>`;
            typeSelect.appendChild(option);
        });

        $("#town-input-1").select2({
            width: "300px",
            placeholder: "Írja be, hol keres ingatlant",
            allowClear: true,
            multiple: true,
            maximumSelectionSize: 10,
            data: townListFromJson.map(function (city, index) {
                return {id: index, text: city};
            }),
            formatLoadMore: 'Loading more...',
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
        json.forEach(i => {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(i.lat, i.lng)
            });
            markers.push(marker);
            marker.setMap(map);

            var contentString =
                `<div class="mapInfoWindow">
                <a href="${i.detailsPageUrl}"><h1>${i.mostSpecificLocation}</h1></a>
                <div><p><a href="${i.detailsPageUrl}">
                <img class="houseThumbnailInMapInfoWindow" src="${i.images[0]}" alt="Img"></a></p>
                <p>${i.price}</p>
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

function refreshListAndMap(){
    clearMarkers();
    var typeSelector = document.getElementById("selectEstateType");
    var selectedType = typeSelector.value;
    console.log(typeSelector);
    console.log(selectedType);
    var selections = $("#town-input-1").select2('data');
    var selectedTowns = [];
    var saleCheckbox = document.getElementById('checkbox_sale');
    var rentCheckbox = document.getElementById('checkbox_rent');
    selections.forEach(i => {
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
        json.forEach(i => {
            if ( ((selectedTowns.length === 0) || ((selectedTowns.filter(function(n) {
                    return (i.locationTags).indexOf(n) >= 0
                }).length > 0)))
            &&
                ((i.type === selectedType) || (selectedType === "bármilyen ingatlan"))
            && ((saleCheckbox.checked && i.forSaleOrRent === "sale") || (rentCheckbox.checked && i.forSaleOrRent === "rent"))
            ) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(i.lat, i.lng)
                });
                markers.push(marker);
                marker.setMap(map);

                var contentString =
                    `<div class="mapInfoWindow">
                <a href="${i.detailsPageUrl}"><h1>${i.mostSpecificLocation}</h1></a>
                <div><p><a href="${i.detailsPageUrl}">
                <img class="houseThumbnailInMapInfoWindow" src="${i.images[0]}" alt="Img"></a></p>
                <p>${i.price}</p>
                </div>
                </div>`;

                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.open(map, marker);
                });


                var li = document.createElement("li");
                var roomsHtmlPart="";
                if (i.numberOfRooms !== undefined){
                    roomsHtmlPart =  "<p><b>Szobák: </b>" + i.numberOfRooms + "</p>";
                }
                li.innerHTML = (
                    `<div class="frame">
                <a href="${i.detailsPageUrl}">
                <img class="houseThumbnailInFrontpageList" src="${i.images[0]}" alt="Img" width="418px" height="264px"></a>
                </div>
                <h5>${i.title}</h5>
                <div class="details">
                <p><b>Alapterület: </b>${i.sizeInSquareMeters} m<sup>2</sup></p>`
                    + roomsHtmlPart +
                    `</div>
                <span class="price">${i.price}</span>`
                );
                housesList.appendChild(li);
            }

        });
    });
}



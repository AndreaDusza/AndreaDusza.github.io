/**
 * Created by Andrea on 2015.08.29..
 */

var imageList = [];

function fillTemplateWithHouseData(house) {
    var advTitle =  document.getElementById("advertisement-title");
    advTitle.innerHTML = house.title;
    var detailsTable = document.getElementById("house-details-table");
    var estateAttributes = [
        "type", "mostSpecificLocation", "condition",
        "heating", "comfortLevel", "bathroomToilet", "elevator", "garden"];
    var estateAttributePrettyStrings = {
        type: "Ingatlan típusa",
        mostSpecificLocation: "Elhelyezkedés",
        condition: "Ingatlan állapota",
        heating: "Fûtés",
        comfortLevel: "Komfort",
        bathroomToilet: "Fürdõszoba és WC",
        elevator: "Lift",
        garden: "Kert"
    };

    estateAttributes.forEach(i => {
            var prop = house[i];
            if (prop) {
                var tr = document.createElement("tr");
                tr.innerHTML = `<td>${estateAttributePrettyStrings[i]}:</td>
                    <td>${house[i]}</td>`;
                detailsTable.appendChild(tr);
            }
        }
    )

    var imagesContainer = document.getElementById("house-images-container");
    house.images.forEach((item,idx) =>{
            imageList.push({src: item, w:600,h:400});
            var img = document.createElement("img");
            img.setAttribute("src",item);
            if (idx === 0) {
                img.setAttribute("width", 418);
                img.setAttribute("height", 262);
                imagesContainer.appendChild(img);
                imagesContainer.appendChild(document.createElement("br"));
            }
            else{
                img.setAttribute("width", 209);
                img.setAttribute("height", 131);
                imagesContainer.appendChild(img);
                if (idx % 2 === 0){
                    imagesContainer.appendChild(document.createElement("br"));
            }
            }
        }
    )
    document.getElementById("house-description-p").innerHTML = house.description;
}

function clickedOnImage() {
    var pswpElement = document.querySelectorAll('.pswp')[0];
    var options = {
        index: 0
    };
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, imageList, options);
    gallery.init();
}
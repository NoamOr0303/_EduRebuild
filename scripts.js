document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('map-container').setView([32.0853, 34.7818], 8); // מרכז על תל אביב

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    window.map = map;

    let selectedMarker = null;

    // הוספת אירוע ללחיצה על המפה להוספת סימן
    map.on('click', function(e) {
        if (selectedMarker) {
            map.removeLayer(selectedMarker);
        }
        selectedMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map)
            .bindPopup('מיקום הנכס')
            .openPopup();

        const latInput = document.getElementById('latitude');
        const lngInput = document.getElementById('longitude');
        
        if (latInput && lngInput) {
            latInput.value = e.latlng.lat;
            lngInput.value = e.latlng.lng;
        } else {
            console.error('Latitude or Longitude input not found');
        }
    });
});

document.getElementById('assessment-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const buildingType = document.getElementById('building-type').value;
    const damageLevel = document.getElementById('damage-level').value;
    const areaSize = document.getElementById('area-size').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    const assessmentResult = document.getElementById('assessment-result');

    if (!latitude || !longitude) {
        assessmentResult.innerText = 'אנא סמן מיקום על המפה.';
        return;
    }

    assessmentResult.innerText = 'מעריך נזק, אנא המתן...';

    const estimatedCost = calculateRepairCost(damageLevel, areaSize);
    const resultText = `סוג המבנה: ${buildingType}\nרמת הנזק: ${damageLevel}\nגודל האזור: ${areaSize} מ"ר\nעלות משוערת לשיקום: ${estimatedCost} ש"ח\nמיקום: קווי רוחב: ${latitude}, קווי אורך: ${longitude}`;

    assessmentResult.innerText = resultText;
});

function calculateRepairCost(damageLevel, areaSize) {
    const costPerSquareMeter = {
        'low': 100,
        'medium': 500,
        'high': 1000
    };

    return costPerSquareMeter[damageLevel] * areaSize;
}

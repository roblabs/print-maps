/*
 * Print Maps - High-resolution maps in the browser, for printing
 * Copyright (c) 2015-2017 Matthew Petroff
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

mapboxgl.accessToken = 'pk.eyJ1Ijoicm9ibGFicyIsImEiOiJwVlg0cnZnIn0.yhekddtKwZohGoORaWjqIw';

var form = document.getElementById('config');

var mapValues = {
  center: [0, 0],
  zoom: 0.5,
  style: "mapbox://styles/mapbox/streets-v10"
}


var Styles = Object.freeze({
  "Positron": 1,
  "DarkMatter": 2,
  "OSMBright": 3,
  "KlokantechBasic": 4,
  "KlokantechTerrain": 5,
  "KlokantechFiordColor": 6,
  "KlokantechToner": 7,
  "KlokantechRomanEmpire": 8,
  "OSMLiberty": 9,
  "MapboxLight": 10,
  "MapboxDark": 11,
  "MapboxStreets": 12,
  "MapboxOutdoors": 13,
  "MapboxEmerald": 14
})


$(document).ready(function () {

    $('#styleSelect').change(styleSelected)
    styleSelected();
});


function styleSelected(){
  var selectedValue = parseInt( $('#styleSelect option:selected').val() )
  console.log(selectedValue)
  console.log($('#styleSelect option:selected').text());

  switch (selectedValue) {
    case Styles.Positron:
      mapValues.style = "https://openmaptiles.github.io/positron-gl-style/style-cdn.json";
    break;

    case Styles.DarkMatter:
      mapValues.style = "https://openmaptiles.github.io/dark-matter-gl-style/style-cdn.json";
    break;

    case Styles.OSMBright:
      mapValues.style = "https://openmaptiles.github.io/osm-bright-gl-style/style-cdn.json";
    break;

    case Styles.KlokantechBasic:
      mapValues.style = "https://openmaptiles.github.io/klokantech-basic-gl-style/style-cdn.json";
    break;

    case Styles.KlokantechTerrain:
      mapValues.style = "https://openmaptiles.github.io/klokantech-terrain-gl-style/style-cdn.json";
    break;

    case Styles.KlokantechFiordColor:
      mapValues.style = "https://openmaptiles.github.io/fiord-color-gl-style/style-cdn.json";
    break;

    case Styles.KlokantechToner:
      mapValues.style = "https://openmaptiles.github.io/toner-gl-style/style-cdn.json";
    break;

    case Styles.KlokantechRomanEmpire:
      mapValues.style = "https://klokantech.github.io/roman-empire/style.json";
      mapValues.zoom = 4;
      mapValues.center = [11.9301, 41.9580];
    break;

    case Styles.OSMLiberty:
      mapValues.style = "http://osm-liberty.lukasmartinelli.ch/style.json";
    break;

    case Styles.MapboxLight:
      mapValues.style = "mapbox://styles/mapbox/light-v9";
    break;

    case Styles.MapboxDark:
      mapValues.style = "mapbox://styles/mapbox/dark-v9";
    break;

    case Styles.MapboxStreets:
      mapValues.style = "mapbox://styles/mapbox/streets-v10";
    break;

    case Styles.MapboxOutdoors:
      mapValues.style = "mapbox://styles/mapbox/outdoors-v10";
    break;

  }

  map.setStyle(mapValues.style);
  map.setCenter(mapValues.center);
  map.setZoom(mapValues.zoom);
}

//
// Interactive map
//
function follow() {
  var zoom = map.getZoom();
  var center = map.getCenter().toArray();

  var z    = parseFloat(zoom).toFixed(2);
  var lat  = parseFloat(center[1]).toFixed(4);
  var long = parseFloat(center[0]).toFixed(4);


  form.zoomInput.value = z;
  form.latitudeInput.value = lat;
  form.longitudeInput.value = long;
}

var map;
try {
    map = new mapboxgl.Map({
        container: 'map',
        center: [0, 0],
        zoom: 0.5,
        pitch: 0,
        style: form.styleSelect.value
    });
    map.addControl(new mapboxgl.NavigationControl({
        position: 'top-left'
    }));

    map.addControl(new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: 'imperial'
    }));


    // setup initial values for UI
    follow();
} catch (e) {
    var mapContainer = document.getElementById('map');
    mapContainer.parentNode.removeChild(mapContainer);
    document.getElementById('config-fields').setAttribute('disabled', 'yes');
    openErrorModal("print-maps error - " + e.message);
}



//
// Geolocation
//

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
        'use strict';
        map.flyTo({center: [position.coords.longitude,
            position.coords.latitude], zoom: 10});
    });
}



//
// Errors
//

var maxSize;
if (map) {
    var canvas = map.getCanvas();
    var gl = canvas.getContext('experimental-webgl');
    maxSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
}

var errors = {
    width: {
        state: false,
        msg: 'Width must be a positive number!',
        grp: 'widthGroup'
    },
    height: {
        state: false,
        grp: 'heightGroup'
    },
    dpi: {
        state: false,
        msg: 'DPI must be a positive number!',
        grp: 'dpiGroup'
    }
};

function handleErrors() {
    'use strict';
    var errorMsgElem = document.getElementById('error-message');
    var anError = false;
    var errorMsg;
    for (var e in errors) {
        e = errors[e];
        if (e.state) {
            if (anError) {
                errorMsg += ' ' + e.msg;
            } else {
                errorMsg = e.msg;
                anError = true;
            }
            document.getElementById(e.grp).classList.add('has-error');
        } else {
            // TODO - document.getElementById(e.grp).classList.remove('has-error');
        }
    }
    if (anError) {
        errorMsgElem.innerHTML = errorMsg;
        errorMsgElem.style.display = 'block';
    } else {
        errorMsgElem.style.display = 'none';
    }
}

function isError() {
    'use strict';
    for (var e in errors) {
        if (errors[e].state) {
            return true;
        }
    }
    return false;
}



//
// Configuration changes / validation
//

form.widthInput.addEventListener('change', function(e) {
    'use strict';
    var unit = form.unitOptions[0].checked ? 'in' : 'mm';
    var val = (unit == 'mm') ? Number(e.target.value / 25.4) : Number(e.target.value);
    var dpi = Number(form.dpiInput.value);
    if (val > 0) {
        if (val * dpi > maxSize) {
            errors.width.state = true;
            errors.width.msg = 'The maximum image dimension is ' + maxSize +
                'px, but the width entered is ' + (val * dpi) + 'px.';
        } else if (val * window.devicePixelRatio * 96 > maxSize) {
            errors.width.state = true;
            errors.width.msg = 'The width is unreasonably big!';
        } else {
            errors.width.state = false;
            if (unit == 'mm') val *= 25.4;
            document.getElementById('map').style.width = toPixels(val);
            map.resize();
        }
    } else {
        errors.width.state = true;
        errors.height.msg = 'Width must be a positive number!';
    }
    handleErrors();
});

form.heightInput.addEventListener('change', function(e) {
    'use strict';
    var unit = form.unitOptions[0].checked ? 'in' : 'mm';
    var val = (unit == 'mm') ? Number(e.target.value / 25.4) : Number(e.target.value);
    var dpi = Number(form.dpiInput.value);
    if (val > 0) {
        if (val * dpi > maxSize) {
            errors.height.state = true;
            errors.height.msg = 'The maximum image dimension is ' + maxSize +
                'px, but the height entered is ' + (val * dpi) + 'px.';
        } else if (val * window.devicePixelRatio * 96 > maxSize) {
            errors.height.state = true;
            errors.height.msg = 'The height is unreasonably big!';
        } else {
            errors.height.state = false;
            if (unit == 'mm') val *= 25.4;
            document.getElementById('map').style.height = toPixels(val);
            map.resize();
        }
    } else {
        errors.height.state = true;
        errors.height.msg = 'Height must be a positive number!';
    }
    handleErrors();
});

form.dpiInput.addEventListener('change', function(e) {
    'use strict';
    var val = Number(e.target.value);
    if (val > 0) {
        errors.dpi.state = false;
        var event = document.createEvent('HTMLEvents');
        event.initEvent('change', true, true);
        form.widthInput.dispatchEvent(event);
        form.heightInput.dispatchEvent(event);
    } else {
        errors.dpi.state = true;
    }
    handleErrors();
});

map.on('moveend', follow).on('zoomend', follow);

form.latitudeInput.addEventListener('change', function(e) {
    'use strict';
    var val = Number(e.target.value);
    map.setCenter([form.longitudeInput.value, val]);
});

form.longitudeInput.addEventListener('change', function(e) {
    'use strict';
    var val = Number(e.target.value);
    map.setCenter([val, form.latitudeInput.value]);
});

form.zoomInput.addEventListener('change', function(e) {
    'use strict';
    var val = Number(e.target.value);
    map.setZoom(val);
});

form.styleSelect.addEventListener('change', function() {
    'use strict';
    try {
      map.setStyle(mapValues.style);

      // // TODO you can only make this call after the map is done being set.  find an event handler
      //
      // console.log(map.getStyle().name);
    } catch (e) {
        openErrorModal("print-maps error - " + e.message);
    }
});

form.mmUnit.addEventListener('change', function() {
    'use strict';
    form.widthInput.value *= 25.4;
    form.heightInput.value *= 25.4;
});

form.inUnit.addEventListener('change', function() {
    'use strict';
    form.widthInput.value /= 25.4;
    form.heightInput.value /= 25.4;
});

if (form.unitOptions[1].checked) {
    // Millimeters
    form.widthInput.value *= 25.4;
    form.heightInput.value *= 25.4;
}


//
// Error modal
//

var origBodyPaddingRight;

function openErrorModal(msg) {
    'use strict';
    var modal = document.getElementById('errorModal');
    document.getElementById('modal-error-text').innerHTML = msg;
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
    document.getElementById('modal-backdrop').style.height =
        modal.scrollHeight + 'px';

    if (document.body.scrollHeight > document.documentElement.clientHeight) {
        origBodyPaddingRight = document.body.style.paddingRight;
        var padding = parseInt((document.body.style.paddingRight || 0), 10);
        document.body.style.paddingRight = padding + measureScrollbar() + 'px';
    }
}

function closeErrorModal() {
    'use strict';
    document.getElementById('errorModal').style.display = 'none';
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = origBodyPaddingRight;
}

function measureScrollbar() {
    'use strict';
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'modal-scrollbar-measure';
    document.body.appendChild(scrollDiv);
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
}



//
// Helper functions
//

function toPixels(length) {
    'use strict';
    var unit = form.unitOptions[0].checked ? 'in' : 'mm';
    var conversionFactor = 96;
    if (unit == 'mm') {
        conversionFactor /= 25.4;
    }

    return conversionFactor * length + 'px';
}



//
// High-res map rendering
//

// document.getElementById('generate-btn').addEventListener('click', generateMap);

function generateMap() {
    'use strict';

    if (isError()) {
        openErrorModal('The current configuration is invalid! Please ' +
            'correct the errors and try again.');
        return;
    }

    document.getElementById('spinner').style.display = 'inline-block';
    document.getElementById('generate-btn').classList.add('disabled');

    var width = Number(form.widthInput.value);
    var height = Number(form.heightInput.value);

    var dpi = Number(form.dpiInput.value);

    var format = form.outputOptions[0].checked ? 'png' : 'pdf';

    var unit = form.unitOptions[0].checked ? 'in' : 'mm';

    var style = mapValues.style;

    var zoom = map.getZoom();
    var center = map.getCenter();
    var bearing = map.getBearing();
    var pitch = map.getPitch();

    createPrintMap(width, height, dpi, format, unit, zoom, center,
        bearing, style, pitch);
}

function createPrintMap(width, height, dpi, format, unit, zoom, center,
    bearing, style, pitch) {
    'use strict';

    // Calculate pixel ratio
    var actualPixelRatio = window.devicePixelRatio;
    Object.defineProperty(window, 'devicePixelRatio', {
        get: function() {return dpi / 96}
    });

    // Create map container
    var hidden = document.createElement('div');
    hidden.className = 'hidden-map';
    document.body.appendChild(hidden);
    var container = document.createElement('div');
    container.style.width = toPixels(width);
    container.style.height = toPixels(height);
    hidden.appendChild(container);

    // Render map
    var renderMap = new mapboxgl.Map({
        container: container,
        center: center,
        zoom: zoom,
        style: style,
        bearing: bearing,
        pitch: pitch,
        interactive: false,
        attributionControl: false
    });

    renderMap.addControl(new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: 'imperial'
    }));

    renderMap.once('load', function() {
        if (format == 'png') {
            renderMap.getCanvas().toBlob(function(blob) {
                saveAs(blob, 'map.png');
            });
        } else {
            var long = 279.4;  // mm
            var short = 215.9; // mm
            var attribPositionFromCorner = 5; // mm
            var orientation = width > height ? 'l' : 'p';
            var pagePhysicalWidth  = width > height ? long : short;
            var pagePhysicalHeight = width > height ? short: long;

            var pdf = new jsPDF({
                orientation: orientation,
                format: 'letter'
            });

            var dataurl = renderMap.getCanvas().toDataURL('image/png');
            pdf.addImage(dataurl, 'png', 0, 0, pagePhysicalWidth, pagePhysicalHeight);

            pdf.setFontSize(6);
            var attrib = window.document.getElementsByClassName("mapboxgl-ctrl-attrib")[0];

            pdf.text(attribPositionFromCorner, pagePhysicalHeight - attribPositionFromCorner, attrib.innerText);

            var title = map.getStyle().name;
            var author = "";
            var creator = "RobLabs.com/print";
            var subject = "center: [" + form.longitudeInput.value  + ", " + form.latitudeInput.value + ", " + form.zoomInput.value + "]";

            pdf.setProperties({
              title: title,
              author: author,
              subject: subject,
              creator: creator,
              keywords: 'jsPDF, javascript, parallax, mapbox'
            })
            pdf.save('map.pdf');
        }

        renderMap.remove();
        hidden.parentNode.removeChild(hidden);
        Object.defineProperty(window, 'devicePixelRatio', {
            get: function() {return actualPixelRatio}
        });
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('generate-btn').classList.remove('disabled');
    });
}

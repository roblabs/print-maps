# Print Maps

Web maps normally don't print well, as their resolution is much lower than
normal print resolution, not to mention the various other unwanted text and
elements that print along with the map. Print Maps changes that by leveraging
[Mapbox GL JS](https://github.com/mapbox/mapbox-gl-js) to render print
resolution maps in the browser.

## Options

* Inches or millimeters
* PNG or PDF output (PDF is Letter size for inches, A4 for millimeters)
* Choice of map styles
* Height and width settings
* DPI setting

## Building

1. There was parameter was not part of the original `print-maps` project which would have made your project unusable with `print-maps`.  An open source change was made so that `pitch` would be part of the print rendering.  See  https://github.com/mpetroff/print-maps/pull/6
1. Add your Mapbox access token to `js/script.js`
  1.  E.g., `mapboxgl.accessToken = 'pk.eyJ1...;`
1. Update your `center`, `zoom`, and `pitch` parameters `js/script.js`
  1.  ``` javascript
  map = new mapboxgl.Map({
      container: 'map',
      center: [-122.705872, 38.410349],
      zoom: 11,
      pitch: 60,
      style: form.styleSelect.value
  });```
  1.  **It is important to set the zoom to integers, such as `11` or `12`.  If you use a zoom such as `11.25`, or use zoom from within the browser you will get clipping of the Prosper icons**
1. Add your Mapbox style to `index.html`.  The first entry is the default.
  1. ``` html
  <div class="col-sm-4">
    <div class="form-group">
      <label for="styleSelect">Map style</label>
      <select id="styleSelect" class="form-control">
        <option value="mapbox://styles/thinkcreatelive/ciyt9p9pd000l2so6g8vkvbfr">Prosper</option>
        <option value="mapbox://styles/mapbox/bright-v9">Bright</option>
        <option value="mapbox://styles/mapbox/outdoors-v9">Outdoors</option>
        <option value="mapbox://styles/mapbox/emerald-v8">Emerald</option>
        <option value="mapbox://styles/mapbox/light-v9">Light</option>
        <option value="mapbox://styles/mapbox/streets-v9">Streets</option>
      </select>
    </div>
  </div>
  ```
1. run a local webserver such as
`python3 -m http.server`, and open `index.html`.
1.  An Alternate web server is Jekyll
  1. `<cmd>-<space bar>` to bring up Spotlight in macOS, then type `terminal`
  1. The macOS app Terminal is a command line prompt that you can use to install apps like Jekyll, and launch the web browser
  1.  Install and launch Jekyll according to the docs at http://jekyllrb.com
  1. Now browse to http://localhost:4000 to see the print maps application running
1. Set the User Interface to these parameters
  1. Map Style = Prosper
  1. Unit = Inch
  1. Output format = PNG
  1. Width = Height = 13.5"
  1. DPI = 300
  1. This will produce a PNG at 4050px by 4050px, which you can crop for final printing
1. The limitation for the number of pixels has to do with the browser and how it implemented WebGL.  Recommend using Safari.




## License

Print Maps is distributed under the MIT License. For more information, read the
file `COPYING` or peruse the license
[online](https://github.com/mpetroff/print-maps/blob/master/COPYING).

## Credits

* [Matthew Petroff](http://mpetroff.net/), Original Author
* [Mapbox GL JS](https://github.com/mapbox/mapbox-gl-js)
* [FileSaver.js](https://github.com/eligrey/FileSaver.js/)
* [canvas-toBlob.js](https://github.com/eligrey/canvas-toBlob.js)
* [jsPDF](https://github.com/MrRio/jsPDF)
* [Bootstrap](http://getbootstrap.com/)

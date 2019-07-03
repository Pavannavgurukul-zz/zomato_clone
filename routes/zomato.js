// using the body-parser for parse the data from html form as a middleware.
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});
// here  I am exporting the main customer data file to app.js(main server file).
module.exports = function(zomato, client) {
  zomato.get('/:city', (request, response) => {
    // here I am getting the location by city name so that I can found the latitude and longitude.
    client.getLocations({query: request.params.city}, function(err, result) {
      if (!err) {
        let data = JSON.parse(result);
        let location = {
          latitude: data.location_suggestions[0].latitude,
          longitude: data.location_suggestions[0].longitude
        }
        // here I am using the other api for calling the  Geocode api for the restaurant details.
        client.getGeocode({
          lat: location.latitude, //latitude taken from the location api
          lon: location.longitude //longitude taken from the location api
        }, function(err, result) {
          if (!err) {
            let data = JSON.parse(result);
            let restraurants = [];
            // this is the loop for getting the filterd details from the all restaurant details.******
            data.nearby_restaurants.forEach((item) => {
              let need = {
                id: item.restaurant.id,
                name: item.restaurant.name,
                location: item.restaurant.location.address,
                price_range: item.restaurant.price_range,
                image: item.restaurant.featured_image,
                has_online_delivery: item.restaurant.has_online_delivery,
              }
              restraurants.push(need)
            });
            //******loop block******//
            return response.render('datafile', {restraurants:restraurants});

          } else {
            console.log(err);
          }
        });
      } else {
        console.log(err);
      }
    });
  });
}

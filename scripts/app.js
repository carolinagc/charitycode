var app = angular.module('eHealth-ebola', []);

app.controller("eHealthCtrl", function($scope, $http) {    

    getData = $http.get("json/data.json").success (function(data){
        $scope.data = data;
        console.log("Json DATA", data);
    });

    getData.then(function(response) {
        $scope.rows = response.data.rows;
        console.log("ROWS", $scope.data.total_rows);
        var today = moment().format("YYYY-MM-DD");
        var last21Days = moment().subtract(21, 'days').calendar();
        last21Days = moment(last21Days).format("YYYY-MM-DD");
        var j = 0;
        var k = 0;
        for(i=0; i<$scope.data.total_rows; i++) {
//            console.log("LGA",$scope.rows[i].value.lga);
            
            if ($scope.rows[i].value.lga == "Port-Harcourt" && $scope.rows[i].value.DateLastContact == last21Days ) {
                var followedUp = true;
                j++;
                console.log("follolwedUp", followedUp);
            } else {
                k++;

            };

        };
                console.log("FollolwedUp", j);
                console.log("NOT follolwedUp", k);

        percent = (j/$scope.data.total_rows)*100;
        percent = 30 ;
        switch (true) {
        case percent>60 && percent<=80:
            $scope.map.setColor("white");
            break;
        case percent>40 && percent<=60:
            $scope.map.setColor("yellow");
            break;
        case 40 :
            $scope.map.setColor("#FF9F60");
            break;
        case percent>20 && percent<=40:
            $scope.map.setColor("red");
            break;

        }
        
    });
});




app.directive("leaflet", function() {
    return {
        restrict : 'E',
        template : "<div id='map'></div>",
        link: function(scope) {
            var map = L.map('map').setView([4.7774, 7.0134], 9);
            
            // add an OpenStreetMap tile layer
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // add a marker in the given location, attach some popup content to it and open the popup
            L.marker([4.77749,7.0134]).addTo(map)
                .bindPopup('eHealthAfrica. <br> Tracking ebola cases.')
                .openPopup(); 
            console.log("scope.color", scope.color);

            scope.map = {
                setColor: function(color) {
                    circle = L.circle([4.77749,7.0134], 30000, {
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.5
                    }).addTo(map); 
                }
            }
        } 
    }
});
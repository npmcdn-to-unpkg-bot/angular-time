'use strict';

timeApp.directive('cell', function(){
	return {
		restrict: 'E',
		templateUrl: '../directives/cell.html',
		replace: true,

		link: function($scope, element, attrs){
			$scope.$watch('formatTime', function(newValue, oldValue, scope) {
				var text = attrs['value'];
				// console.log(newValue);
				if(newValue == 2)
				{
					var pmam = text.substr(-2);
					var numberHours = text.substr(0, text.length-2);
					element.find('span').text(numberHours);
					if(element.find("p").length == 0){
						element.append("<p class='pmam'></span>");	
					}
					element.find("p").text(pmam);
				}
				else if(newValue != 2){
					if(element.find("p").length > 0){
						element.find("p").detach("p");	
					}
					element.find('span').text(text);
				}
				else
					console.log('Unknown time format');
			});
		}
	}
});

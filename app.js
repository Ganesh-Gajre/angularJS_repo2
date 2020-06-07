(function () {
  'use strict';

  var app = angular.module('NarrowItDownApp', [])
  app.controller('NarrowItDownController', NarrowItDownController)
  app.service('MenuSearchService', MenuSearchService)
  app.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
  app.directive('foundItems', FoundItemsDirective);

  function FoundItemsDirective() {
    return {
      templateUrl: 'foundItems.html',
      controller: FoundItemsController,
      controllerAs: 'foundItem',
      scope: {
        items: '<',
        onRemove: '&'
      },
      bindToController: true
    }
  }

  function FoundItemsController() {
    var foundItem = this;
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var menu = this;

    menu.getMenuItems = function (shortName) {

      MenuSearchService.getMatchedMenuItems().then(function (response) {

        menu.found = [];
        response.data.menu_items.forEach(menuItems => {
          if (menuItems.description.split(' ').includes(shortName)) {
            menu.found.push(menuItems);
          }
          console.log(menu.found);
        });
      })
        .catch(function (error) {
          console.log(error);
        })
    };

    menu.removeItem = function (itemIndex) {
      menu.found.splice(itemIndex, 1);
    };
  }


  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function () {
      var foundItems = $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      });

      return foundItems;
    };
  }

})();

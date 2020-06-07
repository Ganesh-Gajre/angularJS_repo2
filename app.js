(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
    .directive('foundItems', FoundItemsDirective);

  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        items: '<',
        onRemove: '&'
      },
      controller: FoundItemsController,
      controllerAs: 'menu',
      bindToController: true
    };

    return ddo;
  }


  function FoundItemsController() {
    var menu = this;
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var menu = this;
    menu.found = [];
    menu.notFound = false;

    menu.getMenuItems = function (shortName) {

      MenuSearchService.getMatchedMenuItems().then(function (response) {

        menu.found = [];
        response.data.menu_items.forEach(menuItems => {
          if (menuItems.description.split(' ').includes(shortName)) {
            menu.found.push(menuItems);
          }
        });
        
        if (menu.found.length === 0) {
          menu.notFound = true;
        }
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

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

    menu.getMenuItems = function (shortName) {

      MenuSearchService.getMatchedMenuItems().then(function (response) {

        menu.found = [];
        response.data.menu_items.forEach(menuItems => {
          if (menuItems.description.split(' ').includes(shortName)) {
            menu.found.push(menuItems);
          }
        });

        menu.notFound = (shortName && menu.found.length) ? false : true;
      })
        .catch(function (error) {
          console.log(error);
        })
    };

    menu.removeItem = function (itemIndex) {
      MenuSearchService.removeItem(menu.found, itemIndex);
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

    service.removeItem = function (itemIndex) {
      menu.found.splice(itemIndex, 1);
    };
  }

})();

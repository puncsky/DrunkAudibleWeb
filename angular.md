module

    var app = angular.module('store', []);
                                      --- dependency

directive

    <html ng-app="store">

expression

    {{ 1 + 2 }}

controller 

    (function() {
        var gem = { name: 'Azurite', price: 2.95 }; 
        var app = angular.module('gemStore', []); 

        app.controller('StoreController', function() {
        });
    };)();

directive, controller name, alias

    <div ng-controller="StoreController as store">

property

    app.controller('StoreController', function() {
        this.product = gem;
    });

display property

    <h3>
        {{ store.product.name }}
        <em class="pull-right">{{ store.product.price }}</em>
    </h3>

`ng-show` directive

    <div ng-show="!store.product.soldOut" >

`ng-repeat` directive with array

    <div class="product row" ng-repeat="product in store.products">
      <h3>
        {{product.name}}
        <em class="pull-right">${{product.price}}</em>
      </h3>
    </div>

- directives: HTML annotations that trigger js behaviors
- moduels: where our app components live
- controllers: where we add application behavior
- expressions: how values get displayed within the page


currency filter and pipe

    {{ product.price | currency }}

- date
- uppercase & lowercase
- limitTo
- orderBy


`ng-src` directive

    <img ng-src="{{product.images[0]}}"/>

show gallary only there are images

    <div class="gallery" ng-show="product.images.length">

`ng-init` variable but usually we do init in a controller

tabs

    app.controller('TabController', function(){
        this.tab = 1;
        
        this.setTab = function(selectedTab){
          this.tab = selectedTab;
        };
        
        this.isSet = function(tab){
          return this.tab == tab;
        };
    });

`ng-click`

    <ul class="nav nav-pills">
      <li>
        <a href ng-click="tab.setTab(1)">Description</a></li>
      <li>
        <a href ng-click="tab.setTab(2)">Specs</a></li>
      <li>
        <a href ng-click="tab.setTab(3)">Reviews</a></li>
    </ul>

`.tab`: class tab

`class="active"` on 1 is set

    <li ng-class="{active: panel.isSet(1)}">

controller 可以相互嵌套

form, models, validation

`ng-model` two way binding
似乎是 form 内部的scope，对应输入的地方和其他标记的地方绑定

    <form name="reviewForm">
      <!--  Live Preview -->
      <blockquote>
        <strong>{{review.stars}} Stars</strong>
        {{review.body}}
        <cite class="clearfix">—{{review.author }}</cite>
      </blockquote>
    <h4>Submit a Review</h4>
      <fieldset class="form-group">
        <select ng-model="review.stars" class="form-control" ng-options="stars for stars in [5,4,3,2,1]"  title="Stars">
          <option value="">Rate the Product</option>
        </select>
      </fieldset>
      <fieldset class="form-group">
        <textarea ng-model="review.body" class="form-control" placeholder="Write a short review of the product..." title="Review"></textarea>
      </fieldset>
      <fieldset class="form-group">
        <input ng-model="review.author" type="email" class="form-control" placeholder="jimmyDean@example.org" title="Email" />
      </fieldset>
      <fieldset class="form-group">
        <input type="submit" class="btn btn-primary pull-right" value="Submit Review" />
      </fieldset>
    </form>

BlahCtrl = BlahController

    app.controller('ReviewController', function(){
        this.review = {};
        this.addReview = function(product){  // the product to be reviewed
          product.reviews.push(this.review);
          this.review={};
        };
    });

    <form name="reviewForm" ng-controller="ReviewController as reviewCtrl" ng-submit="reviewCtrl.addReview(product)">

定义controller后model要与controller里的变量对应，这里只列举其中一个变化

    <select ng-model="reviewCtrl.review.stars" class="form-control" ng-options="stars for stars in [5,4,3,2,1]" title="Stars">

validation

`novalidate` in the form to 取消html缺省设置

`required`

$ refers to property of the form

    ng-submit="reviewForm.$valid && reviewCtrl.addReview(product)"

    <form name="reviewForm" ng-submit="reviewForm.$valid && reviewCtrl.addReview(product) " ng-controller="ReviewController as reviewCtrl" ng-submit="reviewCtrl.addReview(product)" novalidate>
    
    ng-include="'product-title.html'" // noticce the quote

custom directive

    <product-title></product-title>

    app.directive('productTitle', function(){
        return {
            restrict: 'E', // element directive
            templateUrl: 'product-title.html'
        };
    });

- element directive
- attribute directive: restrict: 'A'

use custom directive to write expressive HTML


    app.directive("productTabs", function() {
        return {
          restrict: "E",
          templateUrl: "product-tabs.html",
          controller: function() {
                 this.tab = 1;

                 this.isSet = function(checkTab) {
                    return this.tab === checkTab;
                   };

              this.setTab = function(setTab) {
                this.tab = setTab;
                 };
          },
          controllerAs: "tab"
        };
    });

isolate to module

app.js

    (function(){
        var app = angular.module('store', ['store-products']);
        app.controller('StoreController', function() {...});
    })();

products.js

    (function(){
        var app = angular.module('store-products', [ ]);
        app.directive(...);
        app.directive(...);
        app.directive(...);
    })();

**remember to add script in the html file**

services are start with `$`

`$http` service

    $http({method: 'GET', url: '/products.json' });

    $http.get('/products.json', { apiKey: 'myApiKey' });

dependency injection services

    .                        // notice the quotes
    app.controller('bnlah', [ '$http', '$log', function($http, $log) {
        var store = this;

        store.products = []

        $http.get('/products.json').sucess(function(data){
            store.products = data;
        });
    } ]);


- offical doc
- egghead.io
- thinkster.io
- dash directive
- meetup.com
- codeschool a lot of resources

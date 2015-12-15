// Ionic profiler App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'profiler' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'profiler.services' is found in services.js
// 'profiler.controllers' is found in controllers.js
var db = null;

var obj_dump = function obj_dump(obj) 
{
  var out = '';
  for (var i in obj) 
    {out += i + ": " + obj[i] + "\n";};
    
   console.log(out);
    
};
angular.module('profiler', ['ionic', 'profiler.controllers', 'profiler.services', 'ngCordova'])
  
.run(function($ionicPlatform,$cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    };
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    };


    if (window.cordova) {
      // $cordovaSQLite.deleteDB("profiler.db");
      db = $cordovaSQLite.openDB({ name: "profiler.db" }); //device
      // alert("Tablet mode");
      
    }else{
      db = window.openDatabase("profiler.db", '1', 'profiler', 1024 * 1024 * 100); // browser
      // alert("Browser Mode");
    };
    
    
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS table_household  (hh_id integer primary key, a1_entrypass text, a1_certificate text, blocknum text, lotnum text, housenum text, buildingnum text, placeoforigin text, reason text, house_alteration text, type_of_alterations text, water_source text, electricity text, amenities text, vehicles text, f1 text, details text, i1date text, remarks text, status text, familycount text, addres text, date_interview text, remarks2 text, otherhouse text, otherhouseplace text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS table_head (head_id integer primary key,house_id integer, fname text, mname text, lname text, bdate date, education text, income integer, gender text, bplace text, maritalstatus text, placeofwork text, relation text, disabled text, pregnant text, lactating text, seniorcitizen text, other_healthstatus text, occupation text, status_occupation text, inactive text, membership text, skills text, beneficiary text, inactivereason text)");    
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS iga (iga_id integer primary key,house_id integer,c1 text,c2 text,c3 text,c4 text,remarks text)");    
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS table_service (s_id integer primary key,house_id integer, water text, electricity text, healthcenter text, privateclinic text, healers text, daycare text, elemschool text, highschool text, market text, barangayhall text, policeoutpost text, garbagecollection text, facilities text, transport text, remarks text, toilet text)");    
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS migration_pattern (mp_id integer primary key,house_id integer,hhpattern text, sppattern text)");    
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS user (u_id integer primary key, area_coord text, area_survey text, date_interview text, HHH text)");    
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS resettlement_area (r_id integer primary key, resname text, household text)");    
    
    

    

  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'tabs/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.addProfile', {
    url: '/addProfile',
    views: {
      'tab-addProfile': {
        templateUrl: 'tabs/tab-addProfile.html',
        controller: 'addProfileCtrl'
      }
    }
  })

  .state('tab.viewProfile', {
      url: '/viewProfile',
      views: {
        'tab-viewProfile': {
          templateUrl: 'tabs/tab-viewProfile.html',
          controller: 'viewProfileCtrl'
        }
      }
    })
    .state('tab.viewProfile-detail', {
      url: '/viewProfile/:viewProfileId',
      views: {
        'tab-viewProfile': {
          templateUrl: 'tabs/viewProfile-detail.html',
          controller: 'viewProfileDetailCtrl'
        }
      }
    })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'tabs/tab-settings.html',
        controller: 'settingsCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/addProfile');

});

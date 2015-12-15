angular.module('profiler.controllers', ['ngCordova'])

.controller('addProfileCtrl', function($scope, $rootScope,$ionicScrollDelegate, $cordovaSQLite, $ionicPopup, $state) {
  $rootScope.addProfileVisible = false;
  
  $scope.date = new Date();
  $scope.dateInput = $scope.date.getFullYear().toString() + "-" + ($scope.date.getMonth()+1) + "-" + $scope.date.getDate().toString();
  console.log($scope.dateInput);
  $scope.addMemberFormVisible = false;
  $scope.addPatternForm = true;
  $scope.goToSettings = function goToSettings(){
    $state.transitionTo("tab.settings", null, {reload: true, notify:true});
  };

  $scope.refreshPage = function refreshPage(){
     $state.go($state.current, {}, {reload: true});
  };

  $scope.confirmSave = function confirmSave() {
     var confirmPopup = $ionicPopup.confirm({
        title: 'Confirmation',
        template: "<center>Tap OK to SAVE DATA <br> Tap Cancel to go back and <br>REVIEW DATA </center>",
     });
     confirmPopup.then(function(decision) {
        if (decision) {
           console.log("USER SELECTION: OK");
           $scope.insertProfile();
        } else {
           console.log("USER SELECTION: CANCELLED");
        };
     });
  };


  $scope.insertProfile = function insertProfile() {
      console.log("INSERTION: STARTED");
      $scope.eval_save();
      var household_array = 
      [
        $scope.surveyInput.A1_entryPass,
        $scope.surveyInput.A1_certificate,
        $scope.surveyInput.A2_blockNumber,
        $scope.surveyInput.A2_lotNumber,
        $scope.surveyInput.A2_houseNumber,
        $scope.surveyInput.A2_buildingNumber,
        $scope.surveyInput.A5_placeOfOrigin,
        $scope.surveyInput.A4_reasonForReloc,
        $scope.surveyInput.A8_houseAlterations,
        $scope.surveyInput.A9_typeOfAlterations,
        $scope.surveyInput.A6_waterSource,
        $scope.surveyInput.A7_electricity,
        $scope.surveyInput.A10_householdAmenities,
        $scope.surveyInput.A11_vehicles,
        $scope.surveyInput.E1_f1,
        $scope.surveyInput.E1_details,
        $scope.surveyInput.E2_balayDate,
        $scope.surveyInput.A12_remarks,
        $scope.surveyInput.A3_occupant,
        $scope.surveyInput.A3_hh,
        $scope.surveyInput.A2_address,
        $scope.dateInput,
        $scope.surveyInput.D16_remarks,
        $scope.surveyInput.E3_otherHouse,
        $scope.surveyInput.E3_otherHousePlace
      ]; 
      console.log("INSERTION: household_array compiled");
      var query = "INSERT INTO table_household (a1_entrypass,a1_certificate,blocknum,lotnum,housenum,buildingnum,placeoforigin,reason,house_alteration,type_of_alterations,water_source,electricity,amenities,vehicles,f1,details,i1date,remarks,status,familycount,addres,date_interview,remarks2,otherhouse,otherhouseplace) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      $cordovaSQLite.execute(db, query,household_array).then(function(result) {
          console.log("INSERTION: HOUSEHOLD INSERTED, ID -> "+ result.insertId);
          $scope.insertMember(result.insertId);
          $scope.insertIga(result.insertId);
          $scope.insertService(result.insertId);
          $scope.insertMPattern(result.insertId);
          console.log("INSERTION: COMPLETED!");
          $scope.refreshPage();
          
      }, function (err) {
          console.log("INSERTION: FAILED!");
          console.error(err);
          obj_dump(err);
      });

  };

  $scope.insertMPattern = function insertMPattern(insertId){
    var mPatternInsertArr = 
    [
      insertId,
      $scope.mPattern_HH,
      $scope.mPattern_SP
    ];
    console.log("INSERTION: Migration Pattern Array Created");
    var query = "INSERT INTO migration_pattern (house_id,hhpattern,sppattern) VALUES (?,?,?)";
    $cordovaSQLite.execute(db, query,mPatternInsertArr).then(function(pattern) {
        console.log("INSERTION: MIGRATION PATTERN INSERTED, ID -> "+ pattern.insertId);
        var mPatternInsertArr = "";
        console.log("INSERTION: MIGRATION PATTERN purged!");
    }, function (err) {
        console.log("INSERTION: MIGRATION PATTERN INSERTION FAILED!");
        console.error(err);
    });

  };

  $scope.insertService = function insertService(insertId){
    var serviceInsertArr =
    [
      insertId,
      $scope.surveyInput.D1_water,
      $scope.surveyInput.D2_electricity,
      $scope.surveyInput.D5_healthCenter,
      $scope.surveyInput.D6_privateHealthClinics,
      $scope.surveyInput.D7_traditionalHealersAlternative,
      $scope.surveyInput.D8_dayCareCenterPreSChool,
      $scope.surveyInput.D9_elementarySchool,
      $scope.surveyInput.D10_highSchool,
      $scope.surveyInput.D11_marketTalipapa,
      $scope.surveyInput.D12_baraggayHall,
      $scope.surveyInput.D13_policeOutpost,
      $scope.surveyInput.D3_garabageCollection,
      $scope.surveyInput.D14_recreationalFacilities,
      $scope.surveyInput.D15_publicTransport,
      $scope.surveyInput.D16_remarks,
      $scope.surveyInput.D4_toiletFacilities
    ];
    console.log("INSERTION: SERVICE array created!");

    var query = "INSERT INTO table_service (house_id,water,electricity,healthcenter,privateclinic,healers,daycare,elemschool,highschool,market,barangayhall,policeoutpost,garbagecollection,facilities,transport,remarks,toilet) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    $cordovaSQLite.execute(db, query,serviceInsertArr).then(function(service) {
        console.log("INSERTION: SERVICE INSERTED, ID -> "+ service.insertId);
        var serviceInsertArr = "";
        console.log("INSERTION: SERVICE purged!");
    }, function (err) {
        console.log("INSERTION: SERVICE INSERTION FAILED!");
        console.error(err);
    });

  };

  $scope.insertIga = function insertIga(insertId){
    var igaInsertArr = 
    [
      insertId,
      $scope.surveyInput.C1,
      $scope.surveyInput.C2,
      $scope.surveyInput.C3,
      $scope.surveyInput.C4,
    ];

    console.log("INSERTION: IGA array created!");

    var query = "INSERT INTO iga (house_id,c1,c2,c3,c4) VALUES (?,?,?,?,?)";
    $cordovaSQLite.execute(db, query,igaInsertArr).then(function(iga) {
        console.log("INSERTION: IGA INSERTED, ID -> "+ iga.insertId);
        var igaInsertArr = "";
        console.log("INSERTION: IGA_array purged!");
    }, function (err) {
        console.log("INSERTION: IGA INSERTION FAILED!");
        console.error(err);
    });
  };

  $scope.insertMember = function insertMember(insertId){
    
    for (var i = 0; i < $scope.bGroup.length; i++) {
      var memberInsertArr = 
      [
        insertId,
        $scope.bGroup[i].firstName,
        $scope.bGroup[i].lastName,
        $scope.bGroup[i].middleName,
        $scope.bGroup[i].B3_dob,
        $scope.bGroup[i].B6_education,
        $scope.bGroup[i].B10_monthlyIncome,
        $scope.bGroup[i].B2_sex,
        $scope.bGroup[i].B4_birthplace,
        $scope.bGroup[i].B5_maritalStatus,
        $scope.bGroup[i].B9_placeOfWork,
        $scope.bGroup[i].B1_relationToHhH,
        $scope.bGroup[i].B14_healthStatus_disabled,
        $scope.bGroup[i].B14_healthStatus_pregnant,
        $scope.bGroup[i].B14_healthStatus_lactating,
        $scope.bGroup[i].B14_healthStatus_seniorcitizen,
        $scope.bGroup[i].B14_healthStatus_others,
        $scope.bGroup[i].B7_occupation,
        $scope.bGroup[i].B8_stateOfOccupation,
        $scope.bGroup[i].B15_status,
        $scope.bGroup[i].B11_membersInInstitutions,
        $scope.bGroup[i].B13_skills,
        $scope.bGroup[i].B12_beneficiary,
        $scope.bGroup[i].B16_remarks,
      ];
      console.log("INSERTION: member_" + i);

      var query = "INSERT INTO table_head (house_id,fname,mname,lname,bdate,education,income,gender,bplace,maritalstatus,placeofwork,relation,disabled,pregnant,lactating,seniorcitizen,other_healthstatus,occupation,status_occupation,inactive,membership,skills,beneficiary,inactivereason) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      $cordovaSQLite.execute(db, query,memberInsertArr).then(function(member) {
          console.log("INSERTION: MEMBER INSERTED, ID -> "+ member.insertId);
          var memberInsertArr = "";
          console.log("INSERTION: member_array purged!");
      }, function (err) {
          console.log("INSERTION: MEMBER INSERTION FAILED!");
          console.error(err);
      });
    };
  
    
  };


  $scope.eval_save = function eval_save()
  {
    $scope.implode_A10();
    $scope.implode_A11();
    $scope.implode_mpattern();
    $scope.eval_cGroup();
    $scope.eval_dGroup();
    if ($scope.surveyInput.A6_waterSource == "Others") {
      $scope.surveyInput.A6_waterSource = $scope.surveyRaw.A6_waterSource;
    };    
    if ($scope.surveyInput.A9_typeOfAlterations == "Others") {
      $scope.surveyInput.A9_typeOfAlterations = $scope.surveyRaw.A9_typeOfAlterations;
    };
    obj_dump($scope.surveyInput);


  };






  // Evaluators and Imploders! <START>

  $scope.eval_A1_1 = function eval_A1_1(){
    if($scope.surveyRaw.A1_entryPass){$scope.surveyInput.A1_entryPass="Entry Pass"}
    else{$scope.surveyInput.A1_entryPass=""};
  };

  $scope.eval_A1_2 = function eval_A1_2(){
    if($scope.surveyRaw.A1_certificate){$scope.surveyInput.A1_certificate="Certificate"}
    else{$scope.surveyInput.A1_certificate=""};
  };

  $scope.eval_A4 = function eval_A4(){
    if ($scope.surveyInput.A4_reasonForReloc=="Others") {$scope.surveyRaw.A4_others=true;}
    else{$scope.surveyRaw.A4_others=false;};
  };

  $scope.eval_A6 = function eval_A6(){
    if ($scope.surveyInput.A6_waterSource=="Others") {$scope.surveyRaw.A6_others=true;}
    else{$scope.surveyRaw.A6_others=false;};
  };

  $scope.eval_A9 = function eval_A9(){
    if ($scope.surveyInput.A9_typeOfAlterations=="Others") {$scope.surveyRaw.A9_others=true;}
    else{$scope.surveyRaw.A9_others=false;};
  };



  $scope.eval_B1 = function eval_B1(){
    if ($scope.bGroupInput.B1_relationToHhH=="Others") {$scope.bGroupRaw.B1_others=true;}
    else{$scope.bGroupRaw.B1_others=false;};
  };

  $scope.eval_B7 = function eval_B7(){
    if ($scope.bGroupInput.B7_occupation=="Others") {$scope.bGroupRaw.B7_others=true;}
    else{$scope.bGroupRaw.B7_others=false;};
  };

  $scope.eval_B8 = function eval_B8(){
    if ($scope.bGroupInput.B8_stateOfOccupation=="Others") {$scope.bGroupRaw.B8_others=true;}
    else{$scope.bGroupRaw.B8_others=false;};
  };

  $scope.eval_B9 = function eval_B9(){
    if ($scope.bGroupInput.B9_placeOfWork=="Others") {$scope.bGroupRaw.B9_others=true;}
    else{$scope.bGroupRaw.B9_others=false;};
  };

  $scope.eval_B13 = function eval_B13(){
    if ($scope.bGroupInput.B13_skills=="Others") {$scope.bGroupRaw.B13_others=true;}
    else{$scope.bGroupRaw.B13_others=false;};
  };

  $scope.eval_B14 = function eval_B14(){
    if ($scope.bGroupInput.B14_healthStatus=="Others") {$scope.bGroupRaw.B14_others=true;}
    else{$scope.bGroupRaw.B14_others=false;};
  };

  $scope.eval_cGroup = function eval_cGroup(){
    if ($scope.surveyInput.C1=="Yes") {$scope.surveyInput.C1=$scope.surveyRaw.C1;}
    else{$scope.surveyInput.C1="No" };
    if ($scope.surveyInput.C2=="Yes") {$scope.surveyInput.C2=$scope.surveyRaw.C2;}
    else{$scope.surveyInput.C2="No" };
    if ($scope.surveyInput.C3=="Yes") {$scope.surveyInput.C3=$scope.surveyRaw.C3;}
    else{$scope.surveyInput.C3="No" };
    if ($scope.surveyInput.C4=="Yes") {$scope.surveyInput.C4=$scope.surveyRaw.C4;}
    else{$scope.surveyInput.C4="No" };

  };

  $scope.eval_C1 = function eval_C1(){
    if ($scope.surveyInput.C1=="Yes") {$scope.surveyRaw.C1_show=true;}
    else{$scope.surveyRaw.C1_show=false;};
  };

  $scope.eval_C2 = function eval_C2(){
    if ($scope.surveyInput.C2=="Yes") {$scope.surveyRaw.C2_show=true;}
    else{$scope.surveyRaw.C2_show=false;};
  };

  $scope.eval_C3 = function eval_C3(){
    if ($scope.surveyInput.C3=="Yes") {$scope.surveyRaw.C3_show=true;}
    else{$scope.surveyRaw.C3_show=false;};
  };

  $scope.eval_C4 = function eval_C4(){
    if ($scope.surveyInput.C4=="Yes") {$scope.surveyRaw.C4_show=true;}
    else{$scope.surveyRaw.C4_show=false;};
  };

  $scope.eval_E1 = function eval_E1(){
    $scope.surveyRaw.E1_details = new Array();
    if ($scope.surveyInput.E1_f1=="Buyer") {$scope.surveyRaw.E1_buyerVisible=true;}
    else{$scope.surveyRaw.E1_buyerVisible=false;};
    if ($scope.surveyInput.E1_f1=="Giprinda") {$scope.surveyRaw.E1_giprindaVisible=true;}
    else{$scope.surveyRaw.E1_giprindaVisible=false;};
    if ($scope.surveyInput.E1_f1=="Renter") {$scope.surveyRaw.E1_renterVisible=true;}
    else{$scope.surveyRaw.E1_renterVisible=false;};
    if ($scope.surveyInput.E1_f1=="Renter-free") {$scope.surveyRaw.E1_rentFreeVisible=true;}
    else{$scope.surveyRaw.E1_rentFreeVisible=false;};
  };

  $scope.eval_E3 = function eval_E3(){
    if ($scope.surveyInput.E3_otherHouse=="Yes")
    {
      $scope.surveyInput.E3_otherHousePlace = "";
      $scope.surveyRaw.E3_visible=true;
    }
    else{$scope.surveyRaw.E3_visible=false;};    
  };

  $scope.eval_dGroup = function eval_dGroup(){

    if ($scope.surveyRaw.D1_water) {$scope.surveyInput.D1_water = "Water";}
    else{$scope.surveyInput.D1_water = "None";};

    if ($scope.surveyRaw.D2_electricity) {$scope.surveyInput.D2_electricity = "Electricity";}
    else{$scope.surveyInput.D2_electricity = "None";};

    if ($scope.surveyRaw.D3_garabageCollection) {$scope.surveyInput.D3_garabageCollection = "Garbage Collection";}
    else{$scope.surveyInput.D3_garabageCollection = "None";};

    if ($scope.surveyRaw.D4_toiletFacilities) {$scope.surveyInput.D4_toiletFacilities = "Toilet Facilities";}
    else{$scope.surveyInput.D4_toiletFacilities = "None";};

    if ($scope.surveyRaw.D5_healthCenter) {$scope.surveyInput.D5_healthCenter = "Health Center";}
    else{$scope.surveyInput.D5_healthCenter = "None";};

    if ($scope.surveyRaw.D6_privateHealthClinics) {$scope.surveyInput.D6_privateHealthClinics = "Private Health Clinics";}
    else{$scope.surveyInput.D6_privateHealthClinics = "None";};

    if ($scope.surveyRaw.D7_traditionalHealersAlternative) {$scope.surveyInput.D7_traditionalHealersAlternative = " Traditional Healers/Alternative";}
    else{$scope.surveyInput.D7_traditionalHealersAlternative = "None";};
    
    if ($scope.surveyRaw.D8_dayCareCenterPreSChool) {$scope.surveyInput.D8_dayCareCenterPreSChool = "Day Care Center/Pre School";}
    else{$scope.surveyInput.D8_dayCareCenterPreSChool = "None";};
    
    if ($scope.surveyRaw.D9_elementarySchool) {$scope.surveyInput.D9_elementarySchool = "Elementary School";}
    else{$scope.surveyInput.D9_elementarySchool = "None";};
    
    if ($scope.surveyRaw.D10_highSchool) {$scope.surveyInput.D10_highSchool = "High School";}
    else{$scope.surveyInput.D10_highSchool = "None";};
    
    if ($scope.surveyRaw.D11_marketTalipapa) {$scope.surveyInput.D11_marketTalipapa = "Market/Talipapa";}
    else{$scope.surveyInput.D11_marketTalipapa = "None";};
    
    if ($scope.surveyRaw.D12_baraggayHall) {$scope.surveyInput.D12_baraggayHall = "Baranggay Hall";}
    else{$scope.surveyInput.D12_baraggayHall = "None";};
    
    if ($scope.surveyRaw.D13_policeOutpost) {$scope.surveyInput.D13_policeOutpost = "Police Outpost";}
    else{$scope.surveyInput.D13_policeOutpost = "None";};
    
    if ($scope.surveyRaw.D14_recreationalFacilities) {$scope.surveyInput.D14_recreationalFacilities = "Recreational Facilites";}
    else{$scope.surveyInput.D14_recreationalFacilities = "None";};
    
    if ($scope.surveyRaw.D15_publicTransport) {$scope.surveyInput.D15_publicTransport = "Public Transport";}
    else{$scope.surveyInput.D15_publicTransport = "None";};

    // console.log($scope.surveyInput);

  };


  $scope.implode_E1 = function implode_E1()
  {
    $scope.surveyInput.E1_details = "";
    if ($scope.surveyInput.E1_f1=="Buyer") 
    {
      $scope.surveyInput.E1_details = 
      $scope.surveyRaw.E1_details[0]+"|" +
      $scope.surveyRaw.E1_details[1]+"|" +
      $scope.surveyRaw.E1_details[2];
    }
    else if ($scope.surveyInput.E1_f1=="Giprinda")
    {
      $scope.surveyInput.E1_details = 
      $scope.surveyRaw.E1_details[3]+"|" +
      $scope.surveyRaw.E1_details[4]+"|" +
      $scope.surveyRaw.E1_details[5];
    }      
    else if ($scope.surveyInput.E1_f1=="Renter")
    {
      $scope.surveyInput.E1_details = 
      $scope.surveyRaw.E1_details[6]+"|" +
      $scope.surveyRaw.E1_details[7]+"|" +
      $scope.surveyRaw.E1_details[8]+"|" +
      $scope.surveyRaw.E1_details[9];
    }      
    else if ($scope.surveyInput.E1_f1=="Renter-free")
    {
      $scope.surveyInput.E1_details = 
      $scope.surveyRaw.E1_details[10]+"|" +
      $scope.surveyRaw.E1_details[11]+"|" +
      $scope.surveyRaw.E1_details[12];
    };      

    if ($scope.surveyInput.E2_balayDate != null) {
    $scope.surveyInput.E2_balayDate = $scope.surveyInput.E2_balayDate;
    console.log($scope.surveyInput.E1_details);
  };
    console.log("INSERTION: E1_IMPLODED");
    
    };



  $scope.implode_A10 = function implode_A10(){
  $scope.surveyRaw.A10 = "";
  $scope.surveyInput.A10_householdAmenities = "";
  if ($scope.surveyRaw.A10_arr[0]) {$scope.surveyRaw.A10 = $scope.surveyRaw.A10 + "TV, "};
  if ($scope.surveyRaw.A10_arr[1]) {$scope.surveyRaw.A10 = $scope.surveyRaw.A10 + "Radio/Component, "};
  if ($scope.surveyRaw.A10_arr[2]) {$scope.surveyRaw.A10 = $scope.surveyRaw.A10 + "DVD Player, "};
  if ($scope.surveyRaw.A10_arr[3]) {$scope.surveyRaw.A10 = $scope.surveyRaw.A10 + "PC/Laptop, "};
  if ($scope.surveyRaw.A10_arr[4]) {$scope.surveyRaw.A10 = $scope.surveyRaw.A10 + "Rice Cooker, "};
  if ($scope.surveyRaw.A10_arr[5]) {$scope.surveyRaw.A10 = $scope.surveyRaw.A10 + "Refrigerator, "};
  if ($scope.surveyRaw.A10_arr[6]) {$scope.surveyRaw.A10 = $scope.surveyRaw.A10 + "Electric Fan, "};
  if ($scope.surveyRaw.A10_arr[7]) {$scope.surveyRaw.A10 = $scope.surveyRaw.A10 + "Electric Iron, "};
  if ($scope.surveyRaw.A10_arr[8]) {$scope.surveyRaw.A10 = $scope.surveyRaw.A10 + "Stove/Oven, "};
  if ($scope.surveyRaw.A10_arr[9]) {$scope.surveyRaw.A10 = $scope.surveyRaw.A10 + "Washing Machine, "};
  $scope.surveyInput.A10_householdAmenities = $scope.surveyRaw.A10;
  console.log("INSERTION: A10_IMPLODED");  
  };

  $scope.implode_A11 = function implode_A11(){
  $scope.surveyRaw.A11 = "";
  $scope.surveyInput.A11_vehicles = "";
  if ($scope.surveyRaw.A11_arr[0]) {$scope.surveyRaw.A11 = $scope.surveyRaw.A11 + "Car/Pick-up Truck, "};
  if ($scope.surveyRaw.A11_arr[1]) {$scope.surveyRaw.A11 = $scope.surveyRaw.A11 + "Cargo Truck, "};
  if ($scope.surveyRaw.A11_arr[2]) {$scope.surveyRaw.A11 = $scope.surveyRaw.A11 + "Jeepney/Multicab, "};
  if ($scope.surveyRaw.A11_arr[3]) {$scope.surveyRaw.A11 = $scope.surveyRaw.A11 + "Motorcycle, "};
  if ($scope.surveyRaw.A11_arr[4]) {$scope.surveyRaw.A11 = $scope.surveyRaw.A11 + "Motorela, "};
  if ($scope.surveyRaw.A11_arr[5]) {$scope.surveyRaw.A11 = $scope.surveyRaw.A11 + "Bicycle, "};
  if ($scope.surveyRaw.A11_arr[6]) {$scope.surveyRaw.A11 = $scope.surveyRaw.A11 + "Tri-sikad, "};
  $scope.surveyInput.A11_vehicles = $scope.surveyRaw.A11;
  console.log("INSERTION: A11_IMPLODED");
  };

  $scope.implode_B11 = function implode_B11(){
  $scope.bGroupInput.B11_membersInInstitutions = "";
  if ($scope.bGroupRaw.B11_arr[0]) {$scope.bGroupInput.B11_membersInInstitutions = $scope.bGroupInput.B11_membersInInstitutions + "GSIS, "};
  if ($scope.bGroupRaw.B11_arr[1]) {$scope.bGroupInput.B11_membersInInstitutions = $scope.bGroupInput.B11_membersInInstitutions + "SSS, "};
  if ($scope.bGroupRaw.B11_arr[2]) {$scope.bGroupInput.B11_membersInInstitutions = $scope.bGroupInput.B11_membersInInstitutions + "PAGIBIG, "};
  if ($scope.bGroupRaw.B11_others) {$scope.bGroupInput.B11_membersInInstitutions = $scope.bGroupInput.B11_membersInInstitutions + $scope.bGroupRaw.B11_arr[3]};
  console.log("INSERTION: B11_IMPLODED");
  
  };

  $scope.implode_B12 = function implode_B12(){
  $scope.bGroupInput.B12_beneficiary = "";
  if ($scope.bGroupRaw.B12_arr[0]) {$scope.bGroupInput.B12_beneficiary = $scope.bGroupInput.B12_beneficiary + "4Ps, "};
  if ($scope.bGroupRaw.B12_arr[1]) {$scope.bGroupInput.B12_beneficiary = $scope.bGroupInput.B12_beneficiary + "PhilHealth, "};
  if ($scope.bGroupRaw.B12_arr[2]) {$scope.bGroupInput.B12_beneficiary = $scope.bGroupInput.B12_beneficiary + "Livelihood, "};
  if ($scope.bGroupRaw.B12_arr[3]) {$scope.bGroupInput.B12_beneficiary = $scope.bGroupInput.B12_beneficiary + "Training, "};
  if ($scope.bGroupRaw.B12_others) {$scope.bGroupInput.B12_beneficiary = $scope.bGroupInput.B12_beneficiary + $scope.bGroupRaw.B12_arr[4]};
  console.log("INSERTION: B12_IMPLODED");
  
  };

  $scope.implode_mpattern = function implode_mpattern(){
    $scope.mPattern_HH = "";
    $scope.mPattern_SP = "";

    for (var i = 0; i < $scope.mPattern.length; i++) {
      $scope.mPattern_HH = $scope.mPattern_HH + $scope.mPattern[i].HHH_place + "|" + $scope.mPattern[i].HHH_iDate + "|";
      $scope.mPattern_SP = $scope.mPattern_SP + $scope.mPattern[i].sp_place + "|" + $scope.mPattern[i].sp_iDate + "|";
    };
    $scope.mPattern_HH = $scope.mPattern_HH.slice(0, -1);
    $scope.mPattern_SP = $scope.mPattern_SP.slice(0, -1);

    console.log("INSERTION: MIGRATIONPATTERN_IMPLODED");

    // console.log("mPattern_HH: " + $scope.mPattern_HH);
    // console.log("mPattern_SP: " + $scope.mPattern_SP);
  };

  $scope.eval_bGroup = function eval_bGroup(){
    console.log("Number of members: " + Object.keys($scope.bGroup).length);
    // console.log($scope.bGroup);
  };

  // Evaluators and Imploders! <END>
  $scope.surveyInput=
  {
    A1_entryPass                    :null,
    A1_certificate                  :null,
    A2_blockNumber                  :null,
    A2_lotNumber                    :null,
    A2_houseNumber                  :null,
    A2_address                      :null,
    A3_occupant                     :null,
    A3_hh                           :null,
    A4_reasonForReloc               :null,
    A5_placeOfOrigin                :null,
    A6_waterSource                  :null,
    A7_electricity                  :null,
    A8_houseAlterations             :null,
    A9_typeOfAlterations            :null,
    A10_householdAmenities          :"",
    A11_vehicles                    :"",
    A12_remarks                     :null,
    C1                              :"No",
    C2                              :"No",
    C3                              :"No",
    C4                              :"No",
    D1_water                        :null,
    D2_electricity                  :null,
    D3_garabageCollection           :null,
    D4_toiletFacilities             :null,
    D5_healthCenter                 :null,
    D6_privateHealthClinics         :null,
    D7_traditionalHealersAlternative:null,
    D8_dayCareCenterPreSChool       :null,
    D9_elementarySchool             :null,
    D10_highSchool                  :null,
    D11_marketTalipapa              :null,
    D12_baraggayHall                :null,
    D13_policeOutpost               :null,
    D14_recreationalFacilities      :null,
    D15_publicTransport             :null,
    D16_remarks                     :null,
    E1_f1                           :null,
    E1_details                      :null,
    E2_balayDate                    :null,
    E3_otherHouse                   :null,
    E3_otherHousePlace              :null,
    E4_remarks2                     :null,
  };

  $scope.surveyRaw=
  {
    A1_entryPass                    :null,
    A1_certificate                  :null,
    A4_others                       :false,
    A6_waterSource                  :null,
    A6_others                       :false,
    A7_electricity                  :null,
    A8_houseAlterations             :null,
    A9_typeOfAlterations            :null,
    A10_arr                         :new Array(),
    A10                             :"",
    A11_arr                         :new Array(),
    A11                             :"",
    A12_remarks                     :null,
    B1_arr                          :new Array,
    C1                              :null,
    C2                              :null,
    C3                              :null,
    C4                              :null,
    C1_show                         :false,
    C2_show                         :false,
    C3_show                         :false,
    C4_show                         :false,
    D1_water                        :false,
    D2_electricity                  :false,
    D3_garabageCollection           :false,
    D4_toiletFacilities             :false,
    D5_healthCenter                 :false,
    D6_privateHealthClinics         :false,
    D7_traditionalHealersAlternative:false,
    D8_dayCareCenterPreSChool       :false,
    D9_elementarySchool             :false,
    D10_highSchool                  :false,
    D11_marketTalipapa              :false,
    D12_baraggayHall                :false,
    D13_policeOutpost               :false,
    D14_recreationalFacilities      :false,
    D15_publicTransport             :false,
    D16_remarks                     :false,
    E1_buyerVisible                 :false,
    E1_giprindaVisible              :false,
    E1_renterVisible                :false,
    E1_rentFreeVisible              :false,
    E1_f1                           :null,
    E1_details                      :new Array(),
    E3_visible                      :false,
    E4_remarks                      :null,
  };
  $scope.surveyRaw.B1_arr = ["House Hold Head"];
  console.log($scope.surveyRaw.B1_arr);

  $scope.bGroup = new Array();
  $scope.mPattern = new Array();

  // $scope.mPattern.push( {
  //   HHH_place: "CDO",
  //   HHH_iDate: "1997-2010",
  //   sp_place : "Carmen",
  //   sp_iDate : "1234",
  // }); 
  // $scope.mPattern.push( {
  //   HHH_place: "Canada",
  //   HHH_iDate: "1995-2011",
  //   sp_place : "bulua",
  //   sp_iDate : "1895-4875",
  // });
  // $scope.bGroupInput = {};

  $scope.mPatternInput = 
  {
    HHH_place: null,
    HHH_iDate: null,
    sp_place: null,
    sp_iDate: null,
  };


  $scope.bGroupInput = 
  {

    firstName                     : null,
    lastName                      : null,
    middleName                    : null,
    B1_relationToHhH              : null,
    B2_sex                        : "Male",
    B3_dob                        : null,
    B4_birthplace                 : null,
    B5_maritalStatus              : "Single",
    B6_education                  : "None",
    B7_occupation                 : "None",
    B8_stateOfOccupation          : "None",
    B9_placeOfWork                : "None",
    B10_monthlyIncome             : null,
    B11_membersInInstitutions     : "None",
    B12_beneficiary               : "None",
    B13_skills                    : "None",
    B14_healthStatus              : null,
    B14_healthStatus_disabled     : null,
    B14_healthStatus_pregnant     : null,
    B14_healthStatus_lactating    : null,
    B14_healthStatus_seniorcitizen: null,
    B14_healthStatus_others       : null,
    B15_status                    : null,
    B16_remarks                   : null,
  };  
  $scope.bGroupRaw = {
    B1_relationToHhH         :null,
    B1_others                :false,
    B7_occupation            :null,
    B7_others                :false,
    B8_stateOfOccupation     :null,
    B8_others                :false,
    B9_placeOfWork           :null,
    B9_others                :false,
    B11                      :null,
    B11_others               :false,
    B11_arr                  :new Array(),
    B12                      :null,
    B12_others               :false,
    B12_arr                  :new Array(),
    B13_skills               :null,
    B13_others               :null,
    B14_healthStatus         :null,
    B14_others               :false,
    B15_status               :null,
    B16_remarks              :null,
  };

  $scope.savePatternTo_mPattern = function savePatternTo_mPattern()
  {
    $scope.mPattern.push($scope.mPatternInput);
    $scope.mPatternInput = 
    {
      HHH_place: null,
      HHH_iDate: null,
      sp_place: null,
      sp_iDate: null,
    };    

  };

  $scope.saveMemberTo_bGroup = function saveMemberTo_bGroup()
  {
    if ($scope.bGroupInput.B3_dob != null){$scope.bGroupInput.B3_dob = $scope.bGroupInput.B3_dob.getFullYear().toString() + "-" + ($scope.bGroupInput.B3_dob.getMonth()+1) + "-" + $scope.bGroupInput.B3_dob.getDate().toString();
      };

    if (Object.keys($scope.bGroup).length == 0) 
    {
      $scope.bGroupInput.B1_relationToHhH = "House Hold Head";
      console.log($scope.bGroupInput.B1_relationToHhH + "auto selected");
    };

    if ($scope.bGroupInput.B1_relationToHhH=="Others")
    {$scope.bGroupInput.B1_relationToHhH = $scope.bGroupRaw.B1_relationToHhH;};
    
    if ($scope.bGroupInput.B7_occupation=="Others")
    {$scope.bGroupInput.B7_occupation = $scope.bGroupRaw.B7_occupation;};
    
    if ($scope.bGroupInput.B8_stateOfOccupation=="Others")
    {$scope.bGroupInput.B8_stateOfOccupation = $scope.bGroupRaw.B8_stateOfOccupation;};
    
    if ($scope.bGroupInput.B9_placeOfWork=="Others")
    {$scope.bGroupInput.B9_placeOfWork = $scope.bGroupRaw.B9_placeOfWork;};
    
    if ($scope.bGroupInput.B13_skills=="Others")
    {$scope.bGroupInput.B13_skills = $scope.bGroupRaw.B13_skills;};
    
    if ($scope.bGroupInput.B14_healthStatus=="Others")
    {$scope.bGroupInput.B14_healthStatus_others = $scope.bGroupRaw.B14_healthStatus;}
    else if ($scope.bGroupInput.B14_healthStatus=="Disabled")  
    {$scope.bGroupInput.B14_healthStatus_disabled = $scope.bGroupInput.B14_healthStatus;}
    else if ($scope.bGroupInput.B14_healthStatus=="Pregnant")  
    {$scope.bGroupInput.B14_healthStatus_pregnant = $scope.bGroupInput.B14_healthStatus;}
    else if ($scope.bGroupInput.B14_healthStatus=="Lactating")  
    {$scope.bGroupInput.B14_healthStatus_lactating = $scope.bGroupInput.B14_healthStatus;}
    else if ($scope.bGroupInput.B14_healthStatus=="Senior Citizen")  
    {$scope.bGroupInput.B14_healthStatus_seniorcitizen = $scope.bGroupInput.B14_healthStatus;};

    $scope.implode_B11();
    $scope.implode_B12();

    obj_dump($scope.bGroupInput);

    $scope.bGroup.push($scope.bGroupInput);
    console.log($scope.bGroup);

    $scope.bGroupInput = 
      {

        firstName                     : null,
        lastName                      : null,
        middleName                    : null,
        B1_relationToHhH              : null,
        B2_sex                        : "Male",
        B3_dob                        : null,
        B4_birthplace                 : null,
        B5_maritalStatus              : "Single",
        B6_education                  : "None",
        B7_occupation                 : "None",
        B8_stateOfOccupation          : "None",
        B9_placeOfWork                : "None",
        B10_monthlyIncome             : null,
        B11_membersInInstitutions     : "None",
        B12_beneficiary               : "None",
        B13_skills                    : "None",
        B14_healthStatus              : null,
        B14_healthStatus_disabled     : null,
        B14_healthStatus_pregnant     : null,
        B14_healthStatus_lactating    : null,
        B14_healthStatus_seniorcitizen: null,
        B14_healthStatus_others       : null,
        B15_status                    : null,
        B16_remarks                   : null,
      };  
      $scope.bGroupRaw = {
        B1_relationToHhH         :null,
        B1_others                :false,
        B7_occupation            :null,
        B7_others                :false,
        B8_stateOfOccupation     :null,
        B8_others                :false,
        B9_placeOfWork           :null,
        B9_others                :false,
        B11                      :null,
        B11_others               :false,
        B11_arr                  :new Array(),
        B12                      :null,
        B12_others               :false,
        B12_arr                  :new Array(),
        B13_skills               :null,
        B13_others               :null,
        B14_healthStatus         :null,
        B14_others               :false,
        B15_status               :null,
        B16_remarks              :null,
      };
      $scope.surveyRaw.B1_arr = [
         "Spouse",
         "Daughter",
         "Son",
         "Niece",
         "Nephew",
         "In-law",
         "Sibling",
         "Father",
         "Mother",
         "Grandchild",
         "Cousin",
         "Grandparent",
         "Others"
      ];  

  };

})

.controller('viewProfileCtrl', function($scope,$cordovaSQLite) {


 $scope.testArr = new Array();

 $scope.selectProfile = function selectProfile(){
  
 $scope.testArr = new Array();


     var query = "SELECT table_household.a1_entrypass,table_household.a1_certificate,table_household.blocknum,table_household.lotnum,table_household.housenum,table_household.placeoforigin,table_household.reason,table_household.house_alteration,table_household.type_of_alterations,table_household.water_source,table_household.electricity,table_household.amenities,table_household.vehicles,table_household.f1,table_household.details,table_household.i1date ,table_household.remarks,table_household.status,table_household.addres,table_household.date_interview ,table_household.remarks2,table_household.otherhouse,table_household.otherhouseplace,table_head.fname,table_head.mname,table_head.lname FROM table_household INNER JOIN table_head ON table_household.hh_id = table_head.house_id WHERE table_head.relation = 'House Hold Head'";
        $cordovaSQLite.execute(db, query).then(function(res) {
            if(res.rows.length > 0) {
              for (var i = 0; i < res.rows.length; i++) {
              $scope.testArr[i] = res.rows.item(i);
              };
                
              
            } else {
                console.log("No results found");
            }
        }, function (err) {
            obj_dump(err);
            alert("error!");
        });
        console.log($scope.testArr[0]);
        $scope.$broadcast('scroll.refreshComplete');
      };


})

.controller('viewProfileDetailCtrl', function($scope, $stateParams,$cordovaSQLite) {



})

.controller('settingsCtrl', function($scope, $rootScope,$state, $cordovaSQLite, $http) { // SETTINGS CONTROLLER!!!!!!!!!!!!!!!!!!!!!!
  
  $rootScope.surveySettings={
    AOS:null,
    AC:null,
  };
  
  $scope.surveySettingsSave = function surveySettingsSave(){
    obj_dump($rootScope.surveySettings);
    if ($rootScope.surveySettings.AOS !== null && $rootScope.surveySettings.AC !== null &&  $rootScope.surveySettings.AOS !== "" && $rootScope.surveySettings.AC !== "") 
      {
        $rootScope.addProfileVisible = true;
        $state.transitionTo("tab.addProfile", null, {reload: true, notify:true});
      }
    else
      {
        $rootScope.addProfileVisible = false;        
      }

  };

  
  
  $scope.surveySettingsForm = false;  
  $scope.uploadSettingsForm = true;  


 $scope.purge = function purge(){
      $cordovaSQLite.deleteDB("profiler.db");
      alert("Database Deleted!");
      db = $cordovaSQLite.openDB({ name: "profiler.db" });
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS table_household  (hh_id integer primary key, a1_entrypass text, a1_certificate text, blocknum text, lotnum text, housenum text, buildingnum text, placeoforigin text, reason text, house_alteration text, type_of_alterations text, water_source text, electricity text, amenities text, vehicles text, f1 text, details text, i1date text, remarks text, status text, familycount text, addres text, date_interview text, remarks2 text, otherhouse text, otherhouseplace text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS table_head (head_id integer primary key,house_id integer, fname text, mname text, lname text, bdate date, education text, income integer, gender text, bplace text, maritalstatus text, placeofwork text, relation text, disabled text, pregnant text, lactating text, seniorcitizen text, other_healthstatus text, occupation text, status_occupation text, inactive text, membership text, skills text, beneficiary text, inactivereason text)");    
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS iga (iga_id integer primary key,house_id integer,c1 text,c2 text,c3 text,c4 text,remarks text)");    
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS table_service (s_id integer primary key,house_id integer, water text, electricity text, healthcenter text, privateclinic text, healers text, daycare text, elemschool text, highschool text, market text, barangayhall text, policeoutpost text, garbagecollection text, facilities text, transport text, remarks text, toilet text)");    
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS migration_pattern (mp_id integer primary key,house_id integer,hhpattern text, sppattern text)");    
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS user (u_id integer primary key, area_coord text, area_survey text, date_interview text, HHH text)");    
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS resettlement_area (r_id integer primary key, resname text, household text)"); 
      alert("Database Created!");
      $scope.testArr = new Array();
      $scope.purgeSwitch = 0;
 };
 $scope.purgeSwitch = 0;
 $scope.devPurge = function devPurge(){
  $scope.purgeSwitch = $scope.purgeSwitch + 1 ;
  console.log("Purge Switch Count: " + $scope.purgeSwitch)
  if ($scope.purgeSwitch >20){$scope.purge();};
 };

  // test changing domain
  $scope.newDomain = "192.168.0.100";
  $scope.ipIsSet = false;
  $scope.surveyAreaList = new Array();
  var testResArea = "1"; // To be repalced used @ function saveHouse()

  $scope.serverStatus = "DISCONNECTED";


  $scope.loadArea = function loadArea(){
     var query = "SELECT rid, resname FROM resettlement_area";
        $cordovaSQLite.execute(db, query).then(function(res) {
            if(res.rows.length > 0) {
              for (var i = 0; i < res.rows.length; i++) {
              $scope.surveyAreaList[i] = res.rows.item(i);
              };
                
              
            } else {
                $scope.surveyAreaList = new Array();
                console.log("No results found");
                alert("No Resettlement Area Found, please SYNC WITH SERVER")
            }
        }, function (err) {
            obj_dump(err);
            alert("error!");
        });    

  };

  $scope.testCon = function testCon(ip)
  {
    $scope.ipIsSet = true;
    var serverDomain = ip;
    $scope.testPoint = "http://" + serverDomain + "/Api/ProfilerApi/testCon";
    if ($scope.ipIsSet) {
      alert("Connection Test: Press OK to continue");
      console.log("Connection test using " + $scope.testPoint);
      $http.get($scope.testPoint)
      .success( function ( Res ) {
          alert(Res.Response);
          $scope.serverStatus = "CONNECTED"

      } )
      .error(function ( error ) {
          alert('error Res:' + error.message);
          console.log('error Res:' + error.message);
          $scope.serverStatus = "DISCONNECTED";
      });
    } else {
      alert("Please Set the IP address");
    };
  };

  $scope.changeDomain = function changeDomain(ip) {
    var serverDomain = ip;
    // var serverDomain = "192.168.15.8";
    $scope.ipIsSet = true;
    $scope.endPoint0 = "http://" + serverDomain + "/Api/ProfilerApi/allRes";
    $scope.endPoint1 = "http://" + serverDomain + "/Api/ProfilerApi/newHouse";
    $scope.endPoint2 = "http://" + serverDomain + "/Api/ProfilerApi/newService";
    $scope.endPoint3 = "http://" + serverDomain + "/Api/ProfilerApi/newIga";
    $scope.endPoint4 = "http://" + serverDomain + "/Api/ProfilerApi/newMigration";
    $scope.endPoint5 = "http://" + serverDomain + "/Api/ProfilerApi/newHouseMember";
    alert("Server Syncing Address: " + serverDomain);
    $scope.serverStatus = "DISCONNECTED";
  };
  

  $scope.syncRes = function syncRes( ) {
    $cordovaSQLite.execute(db, "DROP TABLE resettlement_area"); 
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS resettlement_area (r_id integer primary key, rid integer, resname text, household text)");   
    var saveResToLocal = function saveResToLocal( ) {
      if ($scope.resettle.length > 0) {

        for (var i = 0; i < $scope.resettle.length ;i++) {
          var query = "INSERT INTO resettlement_area (rid, resname) VALUES (?,?)";
          $cordovaSQLite.execute(db, query, [ $scope.resettle[i].rid, $scope.resettle[i].resname ])
            .then(function(res) {
              console.log("success resettlement area ID -> " + res.insertId);
              // alert("success resettlement area ID -> " + res.insertId);

            }, function (err) {
              // alert("Error on inserting resettlement info: " + err);
              console.log("Error on inserting resettlement info: " + err);
            });
        };
        alert("Resettlement Areas Synced!");
      } else {
        alert("No resettlement data found");
      };
    };//saveResToLocal end

    if ($scope.ipIsSet) {
      alert("Syncing Resettlement Area");
      console.log("Syncing Resettlement Area");
      $http.get($scope.endPoint0)
      .success( function ( Res ) {
          console.log( "Server Response: "+ Res.length + " Usable Data/s " ); 
          $scope.resettle = Res;
          saveResToLocal( );
          $scope.loadArea();    
      } )
      .error(function ( error ) {
          alert('error Res:' + error.message);
          console.log('error Res:' + error.message);
      });
    } else {
      alert("Please Set the IP address");
    };
  };


  $scope.syncDB = function syncDB() {
    console.log("Syncing process active");
    alert("Syncing process active");
    var housedata = new Array();
    var getAllHouseRec = function getAllHouseRec(){ 
      var query = "SELECT hh_id, a1_entrypass , a1_certificate , blocknum , lotnum , housenum , placeoforigin , reason , house_alteration , type_of_alterations , water_source , electricity , amenities , vehicles , f1 , details , i1date , remarks , status , addres , date_interview , remarks2 , otherhouse , otherhouseplace FROM table_household";
      $cordovaSQLite.execute(db, query).then(function(res) {
        if(res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            housedata.push(res.rows.item(i)); 
          };
          saveLoop(); // next funtion
        } else { 
          alert("No results found"); 
          console.log("No results found"); 
        }
      }, function (err) { console.error("error on getting house:" + err); });
    };


    var saveLoop = function saveLoop(){
      if (housedata.length > 0) {
        var count = 0;
        do {
          saveHouse( housedata[count] );
          count++;
        }
        while (count < housedata.length);
      } else { 
        alert("No data to save"); 
        console.log("No data to save"); 
      }
    };


    var saveHouse = function saveHouse( houseData ) {
      console.log("mobile hid " + houseData.hh_id);
      $http.post( $scope.endPoint1 , houseData )
        .success( function ( houseRes ) {          
          console.log("Sync Success HouseID: "+ houseRes);
          var memberCode = testResArea + houseRes + houseData.blocknum + houseData.lotnum + houseData.housenum;
          $scope.saveServiceToDB(houseRes, memberCode, houseData.hh_id); // params(serverhouseID, memberUniqeHouse,mobilehouseID )     
        } )
        .error(function ( error ) {          
          alert("Sync error House: " + error );
          console.log("Sync error House: " + error );
        });
    };
    if ( $scope.ipIsSet ) {
      getAllHouseRec( ); // the sync process starts here
    } else {
      alert("Please Set the IP addres");
    }
  }; 


  $scope.saveServiceToDB = function saveServiceToDB( hid, memberCode, local_hid ){
    var serviceData = new Array();
    var query = "SELECT water, electricity, healthcenter, privateclinic, healers, daycare, elemschool, highschool, market, barangayhall, policeoutpost, garbagecollection, facilities, transport, remarks, toilet FROM table_service WHERE house_id = " + local_hid ;
    $cordovaSQLite.execute(db, query).then(function(res) {
      serviceData.push(res.rows.item(0)); 
      saveService();
    }, function (err) { 
      alert("service error get data " + err); 
      console.log(err); 
    });


    var saveService = function saveService( ){
      serviceData[0].househ_id = hid;   
      $http.post( $scope.endPoint2 , serviceData[0] )
        .success( function ( servRes ) {
          console.log("Sync Success serviceID: "+ servRes);
          $scope.saveIgaToDB( hid, memberCode, local_hid );            
        } )
        .error(function ( error ) {
          alert('error service: ' + error.message);
          console.log('error service: ' + error.message);
        });
    }
  };


  $scope.saveIgaToDB = function saveIgaToDB( hid, memberCode, local_hid ){
    var igaData = new Array();
    var query = "SELECT c1 ,c2 ,c3 ,c4, remarks FROM iga WHERE house_id = " + local_hid ;
    $cordovaSQLite.execute(db, query).then(function(res) {
      igaData.push(res.rows.item(0)); 
      saveIga();
    }, function (err) { 
      alert("iga error get data" + err); 
      console.log(err); 
    });


    var saveIga = function saveIga( ){
      igaData[0].house_id = hid;
      $http.post( $scope.endPoint3 , igaData[0] )
        .success( function ( igaRes ) {
          console.log("Sync Success igaID: "+ igaRes);
          $scope.saveMigToDB( hid, memberCode, local_hid );  
        } )
        .error(function ( error ) {
          alert('error iga api call: ' + error.message);
          console.log('error iga api call: ' + error.message);
        });
    }
  };


  $scope.saveMigToDB = function saveMigToDB( hid, memberCode, local_hid ){
    var migData = new Array();
    var query = "SELECT hhpattern, sppattern FROM migration_pattern WHERE house_id = " + local_hid ;
    $cordovaSQLite.execute(db, query).then(function(res) {
      migData.push(res.rows.item(0)); 
      saveMig();
    }, function (err) { 
      alert("iga error get data" + err); 
      console.log("iga error get data" + err); 
    });


    var saveMig = function saveMig(){
      migData[0].house_id = hid;
      $http.post( $scope.endPoint4 , migData[0] )
        .success( function ( migRes ) {
          console.log("Sync Success migID: "+ migRes);
          $scope.saveMemberToDB( hid, memberCode, local_hid );
        } )
        .error(function ( error ) {
          alert('error mig api call: ' + error.message);
          console.log('error mig api call: ' + error.message);
        });
    }
  };


  $scope.saveMemberToDB = function saveMemberToDB( hid, memberCode, local_hid ){ 
    var memberData = new Array();
    var query = "SELECT fname, mname, lname, bdate, education, income integer, gender, bplace, maritalstatus, placeofwork, relation, disabled, pregnant, lactating, seniorcitizen, other_healthstatus, occupation, status_occupation, inactive, membership, skills, beneficiary, inactivereason FROM table_head WHERE house_Id = " + local_hid ;
    $cordovaSQLite.execute(db, query).then(function(res) {
      if(res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          memberData.push(res.rows.item(i)); 
        };
          saveMember( );
      } else {
        console.log("Error save member table: no data found");
        alert("Error save member table: no data found");
      }
    }, function (err) {
      console.error("member error get data ");
      alert("member error get data ");
    });


    var saveMember = function saveMember( ){
      for (var count = 0; count < memberData.length; count++) {
        memberData[count].house_id = hid;
        memberData[count].memCode = memberCode;
        $http.post( $scope.endPoint5 , memberData[count] )
          .success( function ( memberRes ) { 
            alert("Sync Success MemberID: "+ memberRes);
            console.log("Sync Success MemberID: "+ memberRes);
          } )
          .error(function ( error ) {
             alert('error api Member call: ' + error.message);
             console.log('error api Member call: ' + error.message);
          });
      };
      memberData = new Array();// clean the variable 
    }
  };


});

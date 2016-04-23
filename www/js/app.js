/*
 * Please see the included README.md file for license terms and conditions.
 */
angular.module('myApp', ['ionic', 'ngCordova', 'firebase'])

/*.factory('Entries', function($firebaseArray) {
    var itemsRef = new Firebase("https://myresitgst.firebaseio.com/entries");
    return $firebaseArray(itemsRef);
})

.factory('Participants', function($firebaseArray) {
    
    var fbRef = new Firebase("https://myresitgst.firebaseio.com/");
        fbRef.authAnonymously(function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
          }
        }, {
            remember: "sessionOnly"
        });
    
    var itemsRef = new Firebase("https://myresitgst.firebaseio.com/participants");
    return $firebaseArray(itemsRef);
})*/

.controller('myAppCtrl', function($scope, $cordovaCamera){
    
    $scope.FireBaseURL = "https://myresitgst.firebaseio.com/";
    
    var ref = new Firebase($scope.FireBaseURL);

    $scope.language = "bi";
    
    if($scope.language == "bm"){
        //$scope.txtMenuUtama = "Menu Utama";
        changeLanguageBM()
        
    } else{
        //$scope.txtMenuUtama = "Main Menu";
        changeLanguageBI()
    }
    
    $scope.headerTitle = $scope.txtAppTitle; //"Peraduan Jom Minta Resit";
    $scope.showMenu = true;
    $scope.showSimpanButton = false;
    $scope.buttonSeterusnyaButirDiri = true;
    $scope.buttonKembaliButirDiri = true;
    $scope.checkboxAgree = false;
    var lang = "bi";
    $scope.showPenyertaanLepas = false;
    
    $scope.participant = {};
    
    $scope.entry = {};
    $scope.entriesLocal = [];
    $scope.participantsLocal = [];
    $scope.participant.email = "";
    var similarParticipant = null;
   // $scope.participants = Participants;
   // var currentdata = {};
    var users = null;
    
    //$scope.entries = Entries;
    
    var $currentID = 0; //for check current IC
    
    var myName = null;
    var myIcNo = null;
    var myJantina = null;
    var myAlamat = null;
    var myPhoneNo = null;
    var myCreateDate = null;
    var myCreateDateSeconds = null;
    //var myRef = new Firebase($scope.FireBaseURL);
    
    
    //Setup local data
    users = localStorage.getItem('participantsLocal');
    
    if (users != null){
        $scope.participantsLocal = JSON.parse(users);
        $currentID = $scope.participantsLocal.length - 1;
        
        myName = $scope.participantsLocal[$currentID].name;
        myIcNo = $scope.participantsLocal[$currentID].icNo;
        myJantina = $scope.participantsLocal[$currentID].jantina;
        myAlamat = $scope.participantsLocal[$currentID].alamat;
        myPhoneNo = $scope.participantsLocal[$currentID].phoneNo;
        myCreateDate = $scope.participantsLocal[$currentID].createDate;
        myCreateDateSeconds = $scope.participantsLocal[$currentID].createDateSeconds; 
        myEmail = $scope.participantsLocal[$currentID].email; 
        
        $scope.daftarUbah = $scope.txtUbahProfil; //"Ubah Profil";
        $scope.participant.name = myName;
        $scope.participant.icNo = myIcNo;
        $scope.participant.jantina = myJantina;
        $scope.participant.alamat = myAlamat;
        $scope.participant.phoneNo = myPhoneNo;
        $scope.participant.createDate = myCreateDate;
        $scope.participant.createDateSeconds = myCreateDateSeconds;
        $scope.participant.email = myEmail;
        
        
    } else{
        $scope.daftarUbah = $scope.txtDaftar; //"Daftar";
        //console.log("takde data");
    }
    
    var entriesData = localStorage.getItem('entriesLocal');
    if (entriesData != undefined){
        $scope.entriesLocal = JSON.parse(entriesData);
        $scope.showPenyertaanLepas = false;
    } else{
        $scope.showPenyertaanLepas = true;
    }
    
    $scope.$index = 0;
    
    var $index = localStorage.getItem('$index');
    if($index != undefined){
        $scope.$index = JSON.parse($index);
    }
    
    
    firebaseSession = function(){
        
        ref.authAnonymously(function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
            }
        }, {
            remember: "sessionOnly"
        });
        
    }
    
    $scope.submitInvoicePage1 = function(){
        
        if($scope.checkboxAgree == true){
            $scope.showMenu = false;
            $scope.showSimpanButton = false;
            $scope.buttonSeterusnyaButirDiri = true;
            $scope.buttonKembaliButirDiri = true;
            $scope.headerTitle = $scope.txtHeaderButirDiri; //"Butir Diri";
            
            getParticipantsData()
            
            Firebase.goOnline();
            
            navigator.notification.alert($scope.txtSilaPastikanVersi);
            
            firebaseSession()
            activate_subpage('#page_butir_diri');
        } else{
            //alert("Anda perlu setuju dengan Terma & Syarat");
            navigator.notification.alert($scope.txtAlertSayaSetuju, function(){}, "Info", "OK");
        }
        
    }
    
    
    
    getParticipantsData = function(){
        var users2 = localStorage.getItem('participantsLocal');
    
        if (users2 != null){
            $scope.participantsLocal = JSON.parse(users2);
        }
    
    }
    
    
    $scope.clickSaveParticipant = function(){
        
        //console.log("the current id is: " + $currentID);

        if((($scope.participant.email == undefined) || ($scope.participant.email == ""))){
            $scope.participant.email = " ";
        }
        if ((($scope.participant.name != undefined) && ($scope.participant.name != "")) && (($scope.participant.icNo != undefined) && ($scope.participant.icNo != "")) && (($scope.participant.phoneNo != undefined) && ($scope.participant.phoneNo != "")) && (($scope.participant.alamat != undefined) && ($scope.participant.alamat != "")) && (($scope.participant.jantina != undefined) && ($scope.participant.jantina != "")) && 
        (($scope.participant.email != undefined) && ($scope.participant.email != ""))){
            //save to localStorage
            saveParticipant()
            navigator.notification.alert($scope.txtAlertMaklumatDisimpan, function(){}, "Info", "OK");
        } else{
            navigator.notification.alert($scope.txtErrorFillAll, function(){}, "Info", "OK");
        }
        
    }
    
    $scope.ubahProfile = function(){
        
        //console.log("current length: " + $scope.participantsLocal.length);
        
       // $scope.participant = $scope.participantsLocal[$currentID];
        getParticipantsData()
        
        //checking list of users:
        /*
        if ($scope.participantsLocal.length > 0){
            for (var n=0; n<$scope.participantsLocal.length; n++){
                console.log("IC No: " + $scope.participantsLocal[n].icNo + " Name: " + $scope.participantsLocal[n].name + " Unique id: " + $scope.participantsLocal[n].uniqueID);
            }
        }*/
        
        $scope.showMenu = true;
        $scope.headerTitle = $scope.txtButirDiri; //"Ubah Butir Diri";
        $scope.buttonSeterusnyaButirDiri = false;
        $scope.buttonKembaliButirDiri = false;
        $scope.showSimpanButton = true;
        uib_sb.close_all_sidebars();
        activate_subpage('#page_butir_diri');
        
    }
    
    $scope.pageSenaraiPemenang = function(){
        closeSideBar();
        $scope.headerTitle = $scope.txtSenaraiPemenang; //"Senarai Pemenang";
        activate_subpage('#page_senarai_pemenang');
    }
    
    $scope.pageTukarBahasa = function(){
        closeSideBar();
        $scope.headerTitle = "Change Language";
        activate_subpage('#page_tukar_bahasa');
    }
    
    checkIcExist = function(){
        getParticipantsData()
        var icExist = false;
        for (var i=0; i<$scope.participantsLocal.length; i++){
            /*console.log(i);
            console.log("Participant local name: " + $scope.participantsLocal[i].name);
            console.log("Participant local icNo: " + $scope.participantsLocal[i].icNo + ", participant icno: " + $scope.participant.icNo);*/
            if ($scope.participantsLocal[i].icNo == $scope.participant.icNo){
                //console.log("ic is exist");
                //console.log(i);
                //console.log($scope.participantsLocal[i].icNo);
                $currentID = i;
                icExist = true
                break;
                //return true;
            }else{
                console.log("ic not yet found");
                //console.log($scope.participantsLocal[i].icNo);
                icExist = false;
            }
        }
        return icExist;
        
    }
    
    saveParticipant = function(){
        
        $scope.participant.createDate = Date();
        
        $scope.participant.createDateSeconds = new Date().getTime() / 1000;
        
        $scope.participant.icNo = $scope.participant.icNo.replace(/-/g, '');
            
        //make it uppercase
        $scope.participant.name = $scope.participant.name.toUpperCase();
            
        getParticipantsData()
        var isExist = false;
        if($scope.participantsLocal.length != 0){
            for(var i=0;i<$scope.participantsLocal.length;i++){
                //console.log("IC No: " + $scope.participantsLocal[i].icNo + " Name: " + $scope.participantsLocal[i].name);
                if ($scope.participantsLocal[i].icNo == $scope.participant.icNo){
                    console.log("IC Exist");
                    var participantID = $scope.participantsLocal[i].uniqueID;
                    $scope.participant.uniqueID = participantID;
    
                    $scope.participant.modifiedDate = new Date().getTime() / 1000;
                    
                    $scope.participantsLocal.splice(i,1);
                    //console.log("unique id after ic exist: " + $scope.participant.uniqueID)
                    $scope.participantsLocal.push($scope.participant);
                    
                    isExist = true;
                    break;
                }
            }
        
            if (isExist == false){
                console.log("Create new local storage..");
                $scope.participant.modifiedDate = undefined;
                $scope.participant.uniqueID = undefined;
                $scope.participantsLocal.push($scope.participant);
            }
        }else{
            console.log("Local storage not exist yet");
            $scope.participant.modifiedDate = undefined;
            $scope.participant.uniqueID = undefined;
            $scope.participantsLocal.push($scope.participant);
        }
        
        $currentID = ($scope.participantsLocal.length) - 1;
        
        localStorage.setItem('participantsLocal', JSON.stringify($scope.participantsLocal));
        
        console.log("set in local storage..");
        
    }
    
    /* MODIFY PARTICIPANT IN FIREBASE */
    
    modifyParticipantFirebase = function(){
        console.log("Modify Participant in Firebase");
        //If user already exist, update current user to firebase with UniqueID..
                    
        //This is real code..
        //var usersRef = new Firebase($scope.FireBaseURL + "participants");
        
        var usersRef = ref.child("participants");
        var participantsRef = usersRef.child($scope.participant.uniqueID);
        
        participantsRef.update({
                "name": $scope.participant.name,
                "icNo": $scope.participant.icNo,
                "phoneNo": $scope.participant.phoneNo,
                "jantina": $scope.participant.jantina,
                "alamat": $scope.participant.alamat,
                "email": $scope.participant.email,
                "createDateSeconds": $scope.participant.createDateSeconds-1200,
                "modifiedDate": $scope.participant.modifiedDate,
                "createDate": $scope.participant.createDate
        }, function(error) {
            if (error) {
                alert("Your session has expired. Please exit the app and try again. " + error);
                $scope.menuUtama()
            } else {
                //alert("Data saved successfully.");
                console.log("Firebase participants updated succesfully for id " + $scope.participant.uniqueID);
            }
        }); 
                 
    }
    
    $scope.industri = function(){
        //console.log($scope.participant.name);
        if((($scope.participant.email == undefined) || ($scope.participant.email == ""))){
            $scope.participant.email = " ";
        }
        
        if ((($scope.participant.name != undefined) && ($scope.participant.name != "")) && (($scope.participant.icNo != undefined) && ($scope.participant.icNo != "")) && (($scope.participant.phoneNo != undefined) && ($scope.participant.phoneNo != "")) && (($scope.participant.alamat != undefined) && ($scope.participant.alamat != "")) && (($scope.participant.jantina != undefined) && ($scope.participant.jantina != "")) && 
        (($scope.participant.email != undefined) && ($scope.participant.email != ""))){
            
        saveParticipant()
            
        //if(checkIcExist()){
        
        getParticipantsData()   
        
        //console.log("The unique id is " + $scope.participantsLocal[$currentID].uniqueID);   
            
        if($scope.participantsLocal[$currentID].uniqueID == undefined){
            //if id at firebase not defined, add participants to firebase.. get uniqueID
            submitParticipantToFireBase()
        } else{
            modifyParticipantFirebase()
        }
                
            //}
            $scope.headerTitle = $scope.txtIndustri; //"Industri";
             activate_subpage('#page_industri');
        }
        else{
            // alert($scope.txtErrorFillAll);
            navigator.notification.alert($scope.txtErrorFillAll, function(){}, "Info", "OK");
        }
       
    }
    
    notSimilarParticipantData = function(){
        console.log("Nama participant: " + $scope.participant.name);
        console.log("Nama Local: " + $scope.participantsLocal[$currentID].name);
        if (($scope.participant.name == $scope.participantsLocal[$currentID].name) && 
            ($scope.participant.icNo == $scope.participantsLocal[$currentID].icNo) && ($scope.participant.phoneNo == $scope.participantsLocal[$currentID].phoneNo) && ($scope.participant.alamat == $scope.participantsLocal[$currentID].alamat) && ($scope.participant.jantina == $scope.participantsLocal[$currentID].jantina) && 
        ($scope.participant.email == $scope.participantsLocal[$currentID].email)){
            return false;
            
        } else{
            return true;
        }
        
    }
    
    
    /* ADD NEW PARTICIPANT IN FIREBASE 
    var id = undefined;
    submitParticipantToFireBase = function(){
        console.log("Create participant in Firebase");
        $cordovaProgress.showSimpleWithLabel(true, "Please wait..");
        $scope.participants.$add({
            "name": $scope.participant.name,
            "icNo": $scope.participant.icNo,
            "phoneNo": $scope.participant.phoneNo,
            "jantina": $scope.participant.jantina,
            "alamat": $scope.participant.alamat,
            "email": $scope.participant.email,
            "createDateSeconds": $scope.participant.createDateSeconds,
            "createDate": $scope.participant.createDate
          }).then(function(ref) {
                id = ref.key();
                console.log("added record with id " + id);
                $cordovaProgress.hide();
                getParticipantsData()
                $scope.participantsLocal[$scope.participantsLocal.length-1].uniqueID = id;
                console.log("latest unique id: " + $scope.participantsLocal[$scope.participantsLocal.length-1].uniqueID);
                
                localStorage.setItem('participantsLocal', JSON.stringify($scope.participantsLocal));
                console.log("local storage saved..");
                $scope.participant.index = $scope.participants.$indexFor(id);
                console.log("Array location to firebase: " + $scope.participants.$indexFor(id)); 
                // returns location in the array 
            }, function(error) {
            if (error) {
                alert("Your session has expired. Please exit the app and try again. Error message: " + error);
                $scope.menuUtama()
            } else {
                    //alert("Data saved successfully.");
            }
        }); 
         
    } */
    
    var id = undefined;
    $scope.postID = undefined;
    
    /* ADD NEW PARTICIPANT IN FIREBASE*/
    
    submitParticipantToFireBase = function(){
        
        console.log("Create participant in Firebase");
        var postsRef = ref.child("participants"); 

        var newPostRef = postsRef.push({
                "name": $scope.participant.name,
                "icNo": $scope.participant.icNo,
                "phoneNo": $scope.participant.phoneNo,
                "jantina": $scope.participant.jantina,
                "alamat": $scope.participant.alamat,
                "email": $scope.participant.email,
                "createDateSeconds": $scope.participant.createDateSeconds,
                "createDate": $scope.participant.createDate
        }, function(error){
            if (error){
                alert("Your session has expired. Please exit the app and try again. " + error); 
            } else{
                 console.log("The participants saved successfully in Firebase..");
            }
        }); 

        $scope.postID = newPostRef.key();
        console.log("The new unique id participant is: " + $scope.postID);
        
        getParticipantsData()
        
        $scope.participantsLocal[$scope.participantsLocal.length-1].uniqueID = $scope.postID;
        localStorage.setItem('participantsLocal', JSON.stringify($scope.participantsLocal));
        //console.log("local storage saved.."); 
    }
    
    submitEntryToFireBase = function(){
        
        $scope.entry.image = $scope.imageData;
        $scope.entry.createDate = new Date().getTime() / 1000;
        
        if($scope.participant.uniqueID == undefined){
            var participantUniqueID = $scope.participantsLocal[$scope.participantsLocal.length-1].uniqueID;
            $scope.participant.uniqueID = participantUniqueID;
        }
        
        var entriesRef = ref.child("entries"); 

        var newEntries = entriesRef.push({
            "uniqueUserId": $scope.participant.uniqueID,
            "localId": $scope.entry.localId,
            "resitNo": $scope.entry.resitNo,
            "gstId": $scope.entry.gstId,
            "resitDate": $scope.entry.resitDate.toString(),
            "resitAmount": $scope.entry.resitAmount,
            "gstAmount": $scope.entry.gstAmount,
            "kategori": $scope.entry.kategori,
            "negeri": $scope.entry.negeri,
            "createDate": $scope.entry.createDate,
            "image": $scope.entry.image
            
        }, function(error){
            if (error){
                alert("Your session has expired. Please exit the app and try again. " + error); 
                $scope.menuUtama()
            } else{
                console.log("The entries saved successfully in Firebase..");
                Firebase.goOffline();
            }
        }); 
        
        var entryId = newEntries.key();
         
        console.log("The new unique id for entry is: " + entryId);
        
    }
        
        /*
         $scope.entries.$add({
                    "uniqueUserId": $scope.participant.uniqueID,
                    "localId": $scope.entry.localId,
                    "resitNo": $scope.entry.resitNo,
                    "gstId": $scope.entry.gstId,
                    "resitDate": $scope.entry.resitDate.toString(),
                    "resitAmount": $scope.entry.resitAmount,
                    "gstAmount": $scope.entry.gstAmount,
                    "kategori": $scope.entry.kategori,
                    "negeri": $scope.entry.negeri,
                    "createDate": $scope.entry.createDate,
                    "image": $scope.entry.image
        }).then(function(ref) {
                id = ref.key();
                console.log("added new entry record with entry id " + id);
                Firebase.goOffline();
            
            }, function(error) {
            if (error) {
                alert("Your session has expired. Please exit the app and try again. " + error);
                $scope.menuUtama()
            } else {
                    //alert("Data saved successfully.");
            }
        });*/
    
    
    function onConfirm(button){
         if (button == 1) { // if user select Yes
            $scope.entry.image = $scope.imageData; 
            //add participants and entry into local data
            if ($scope.entry.localId == undefined){
                $scope.$index = $scope.$index+1;
                $scope.entry.localId = $scope.$index;
                localStorage.setItem('$index', JSON.stringify($scope.$index));
            }
             
            //push to firebase
            submitEntryToFireBase()
            
            $scope.entriesLocal.push($scope.entry);
            localStorage.setItem('entriesLocal', JSON.stringify($scope.entriesLocal));    
            
            $scope.entry = {};
            
            //redirect to page_selesai

            $scope.showMenu = true;
            $scope.headerTitle = $scope.txtAppTitle //"Tax Invoice Please";
            //alert($scope.txtBerjaya);
             navigator.notification.alert($scope.txtBerjaya, function(){}, "Info", "OK");
             $scope.showPenyertaanLepas = false;
            activate_subpage('#page_selesai');
         }
          else{ //if user select No
              return;
          }
     }
    
    $scope.submitEntry = function(){
        navigator.notification.confirm($scope.txtSilaSahkanConfirmation, onConfirm, $scope.txtPengesahan, [$scope.txtYa, $scope.txtTidak]);
      
    }
    
    function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");
    //return dataURL;
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
    
    //button pergi ke butir resit
    $scope.submitInvoicePage2 = function(){
        
        if($scope.entry.kategori != undefined){
            $scope.headerTitle = $scope.txtHeaderButirInvoice; //"Butir Invoice";
            activate_subpage('#page_butir_invois');
        } else{
            //alert($scope.txtSilaPilihIndustri);
            navigator.notification.alert($scope.txtSilaPilihIndustri, function(){}, "Info", "OK");
        }
    }
    
    $scope.goToTestPage = function(Participants){
       // activate_subpage('#testPage');
        
        var ref = new Firebase($scope.FireBaseURL + "participants");
        //var ref = $scope.participants;
        ref.orderByChild("icNo").equalTo("909009090").on("child_added", function(snapshot) {
          console.log(snapshot.key());
        });
        
    }
    
    $scope.menuUtama = function(){
        uib_sb.close_all_sidebars();
        $scope.showMenu = true;
        $scope.headerTitle = $scope.txtAppTitle; //"Tax Invoice Please";
        activate_subpage('#page_84_95');
    }
    
    //button ambil gambar
    $scope.submitInvoicePage3 = function(){ 
        $scope.showMenu = true;
        $scope.headerTitle = $scope.txtButiranResit//"Butiran Resit";
        
        takePicture2()
    }
    
    //kembali ke ambil gambar
    $scope.submitInvoicePage3b = function(){ 
        $scope.showMenu = true;
        $scope.headerTitle = $scope.txtButiranResit //"Butiran Resit";
        activate_subpage('#page_butir_gambar');
    }
    
    
    takePicture2 = function(){
        
        document.addEventListener("deviceready", function() {

        var options = {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 800,
          targetHeight: 600,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
          correctOrientation:true
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
          var image = document.getElementById('myImage');
          image.src = "data:image/jpeg;base64," + imageData;
            
          var image2 = document.getElementById('myImage5');
          image2.src = "data:image/jpeg;base64," + imageData;
            $scope.imageData = imageData;
            
        }, function(err) {
          // error
        });

        }, false);
        activate_subpage('#page_butir_gambar');
    }   
    
    $scope.takePicture = function(){
        
        document.addEventListener("deviceready", function() {

            var options = {
              quality: 50,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.CAMERA,
              allowEdit: false,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: 800,
              targetHeight: 600,
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: false,
              correctOrientation:true
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
            var image = document.getElementById('myImage');
            image.src = "data:image/jpeg;base64," + imageData;
              
            var image2 = document.getElementById('myImage5');
            image2.src = "data:image/jpeg;base64," + imageData;
            $scope.imageData = imageData;
            }, function(err) {
              // error
            });

        }, false);
    }
    
    function closeSideBar(){
        uib_sb.close_all_sidebars();
    }
    
    $scope.closeSideBar2 = function(){
        closeSideBar()
    }
    
    $scope.penyertaanLepas = function(){
        
        uib_sb.close_all_sidebars();
        $scope.headerTitle = $scope.txtPenyertaanLepas; //"Penyertaan Lepas";
        activate_subpage('#page_penyertaan_lepas');  
    }
    
    
    $scope.selesai = function(){
        $scope.headerTitle = $scope.txtSelesai; //"Selesai";
        var image3 = document.getElementById('myImage5');
        image3.src = "";
        activate_subpage('#page_selesai');
        
    }
    
    $scope.pagePenggunaan1 = function(){
        closeSideBar()
        $scope.headerTitle = $scope.txtCaraPenyertaan;
        activate_subpage('#page_penggunaan1');
        
    }
    
    $scope.PageMenuHowTo = function(){
        closeSideBar()
        $scope.headerTitle = $scope.txtCaraPenggunaan;
        activate_subpage('#page_MenuHowTo');
    }
    
    $scope.pagePenggunaan2 = function(){
        activate_subpage('#page_penggunaan2');
        
    }
    
    $scope.pagePenggunaan3 = function(){
        activate_subpage('#page_penggunaan3');
        
    }
    
    $scope.pagePenggunaan4 = function(){
        activate_subpage('#page_penggunaan4');
        
    }
    
    $scope.pageSampleInvoice1 = function(){
        $scope.headerTitle = $scope.txtContohResit;
        activate_subpage('#page_sampleInvoice1');
        
    }
    
    $scope.pageSampleInvoice2 = function(){
        activate_subpage('#page_sampleInvoice2');
        
    }
    
    $scope.pageSampleInvoice3 = function(){
        activate_subpage('#page_sampleInvoice3');
        
    }

    function resitExist(){
        var isExist = false;
        for (var i=0; i < $scope.entriesLocal.length;i++){
            if ($scope.entriesLocal[i].gstId == $scope.entry.gstId){
                if ($scope.entriesLocal[i].resitNo == $scope.entry.resitNo){
                 isExist = true;
                 break;  
                }
                continue;
            }       
        } 
        return isExist;
    }
   
    $scope.pengesahan = function(){
        var mydate = new Date();
        var firstDay = new Date(mydate.getFullYear(), mydate.getMonth(), 1);
        
       /* if ($scope.entry.resitAmount != undefined && $scope.entry.gstAmount != undefined){
            $scope.entry.resitAmount = $scope.entry.resitAmount.toFixed(2);
            $scope.entry.gstAmount = $scope.entry.gstAmount.toFixed(2);
            console.log("resit amount ok");
        } */
        
        /*if ($scope.entry.gstId != undefined){
            var validGstId = $scope.entry.gstId.replace(/\s+/g, '');
            console.log("gstId ok");
        }*/
            
        if(checkValidInvoice() == true){
            //console.log("checkValidInvoice");
               if ($scope.entry.resitDate < firstDay){
                //alert($scope.txtAlertTarikhResit);
                   navigator.notification.alert($scope.txtAlertTarikhResit, function(){}, "Info", "OK");
                
                
                /*else if(validGstId.length != 12){
                    //alert($scope.txtErrorGST);
                    navigator.notification.alert($scope.txtErrorGST, function(){}, "Info", "OK");
                }*/
                
                /*else if(resitExist()){
                    //alert($scope.txtResitDahAda);
                    navigator.notification.alert($scope.txtResitDahAda, function(){}, "Info", "OK");    
                }*/
                
                } else{
                    
                    if (isNotNumber()){
                        
                        navigator.notification.alert($scope.txtMustNumber, function(){}, "Info", "OK");
                        
                    } else{
                        $scope.headerTitle = $scope.txtPengesahan; //"Pengesahan";
                    
                        //alert("go to pengesahan");
                        $scope.entry.resitAmount = parseFloat($scope.entry.resitAmount).toFixed(2);
                        $scope.entry.gstAmount = parseFloat($scope.entry.gstAmount).toFixed(2);
                        activate_subpage('#page_pengesahan');
                    }
                }
            } 
        else{
            //alert($scope.txtErrorFillAll);
            navigator.notification.alert($scope.txtErrorFillAll, function(){}, "Info", "OK");
            return;
        }
          
    } //end of function scope.pengesahan
    
    function isNotNumber(){
        
        if ((!isNaN($scope.entry.resitAmount) && angular.isNumber(+$scope.entry.resitAmount)) && (!isNaN($scope.entry.gstAmount) && angular.isNumber(+$scope.entry.gstAmount))) {
            return false
        }
        else{
            return true
        }
        
    }
    
    function checkValidInvoice(){
        var resitValid = false;
        if((($scope.entry.resitNo != undefined) && ($scope.entry.resitNo != "")) && (($scope.entry.resitDate != undefined) && ($scope.entry.resitDate != "")) && (($scope.entry.resitAmount != undefined) && ($scope.entry.resitAmount != "")) && (($scope.entry.gstAmount != undefined) && ($scope.entry.gstAmount != "")) && (($scope.entry.negeri != undefined) && ($scope.entry.negeri != "")) && (($scope.entry.kategori != undefined) && ($scope.entry.kategori != ""))){
            resitValid = true;
        } else{
            resitValid = false;
        }
        //alert("show resit valid");
        console.log("the resit is valid: " + resitValid);
        return resitValid;
    }
    
    $scope.clickChangeLanguage = function(){
        if($scope.language == "bm"){
            changeLanguageBM()
        } else{
            changeLanguageBI()
        }
        
        //alert($scope.txtBahasaDitukar);
        
        navigator.notification.alert($scope.txtBahasaDitukar, function(){}, "Info", "OK");
        $scope.menuUtama()
    }
    
    $scope.pageTermaSyarat = function(){
        window.open('http://myresitgst.com.my/en/terma.html', '_system');
    }
    
    //List of Text for Change Language
    
    function changeLanguageBM(){
        $scope.txtAppTitle = "MyResitGST";
        $scope.txtHeaderButirDiri = "Langkah 2: Maklumat Diri";
        $scope.txtButirDiri = "Maklumat Diri";
        $scope.txtAmbilGambar = "Ambil Gambar Resit";
        $scope.txtMenuUtama = "Menu Utama";
        $scope.txtDaftar = "Daftar";
        $scope.txtPenyertaanLepas = "Penyertaan Lepas"; 
        $scope.txtUbahProfil = "Ubah Profil";
        $scope.txtBahasaDitukar = "Bahasa telah ditukar";
        $scope.daftarUbah =  $scope.txtUbahProfil;
        
        $scope.txtSenaraiPemenang = "Senarai Pemenang";
        $scope.txtTnC = "Terma & Syarat";
        $scope.txtSayaSetuju = "Saya setuju dengan Terma & Syarat";
        $scope.txtAlertSayaSetuju = "Anda perlu setuju dengan Terma dan Syarat";
        $scope.txtSeterusnya = "Seterusnya";
        $scope.txtKembali = "Kembali";
        $scope.txtButiranResit = "Langkah 1: Gambar Resit";
        $scope.txtAmbilGambarSemula = "Ambil Gambar Semula";
        
        $scope.txtNamaPenuh = "Nama Penuh";
        $scope.txtNoIC = "No. IC/Passport";
        $scope.txtTelefon = "No. Telefon";
        $scope.txtIndustri = "Langkah 3: Pilih Kategori";
        $scope.txtSilaPilihIndustri = "Sila pilih salah satu industri";
        $scope.txtAlertMaklumatDisimpan = "Maklumat anda telah disimpan";
        $scope.txtKategori = "Kategori";
        $scope.txtHeaderButirInvoice = "Langkah 4: Maklumat Resit";
        
        $scope.txtButirInvoice = "Maklumat Resit";
        $scope.txtNoResit = "No. Resit";
        $scope.txtNoGST = "No. GST Syarikat";
        $scope.txtTarikhResit = "Tarikh Resit";
        $scope.txtResitDate = "Tarikh Resit";
        $scope.txtAmaunResit = "Amaun Resit";
        $scope.txtAlertTarikhResit = "Tarikh resit mesti tidak kurang dari bulan terkini.";
        
        $scope.txtAmaunGST = "Amaun GST";
        $scope.txtNegeri = "Negeri Pembelian";
        $scope.txtErrorGST = "No. GST mesti tidak kurang atau tidak lebih dari 12 aksara";
        $scope.txtErrorFillAll = "Sila masukkan semua butiran";
        $scope.txtSilaSahkan = "Sila sahkan semua maklumat adalah betul sebelum hantar";
        $scope.txtResitDahAda = "Harap maaf, no. GST dan no. resit ini sudah wujud dalam pengkalan data kami";
        $scope.txtHantar = "Hantar";
        $scope.txtSimpan = "Simpan";
        
        $scope.txtSilaSahkanConfirmation = "Pastikan anda mempunyai talian internet sebelum menghantar penyertaan ini dan pastikan semua maklumat adalah benar dan tepat";
        $scope.txtYa = "Hantar";
        $scope.txtTidak = "Batal";
        $scope.txtPengesahan = "Langkah 5: Pengesahan";
        $scope.txtSelesai = "Selesai";
        $scope.txtBerjaya = "Penyertaan anda telah berjaya dihantar. Kami akan menghubungi anda sekiranya  terpilih sebagai pemenang";
        $scope.txtAlamat = "Alamat Penuh";
        $scope.txtJantina = "Jantina";
        $scope.txtLelaki = "Lelaki";
        $scope.txtPerempuan = "Perempuan";
        
        $scope.txtRestoran = "Restoran";
        $scope.txtHardware = "Perkakasan";
        $scope.txtFarmasi = "Farmasi";
        $scope.txtKedaiBuku = "Kedai Buku";
        $scope.txtMiniMarket = "Pasar Mini";
        $scope.txtHiburan = "Hiburan";
        $scope.txtLainlain = "Lain-lain";
        $scope.txtPasaraya = "Pasaraya";
        $scope.txtStesyenMinyak = "Stesen Minyak";
        
        $scope.txtTukarBahasa = "Tukar Bahasa";
        $scope.txtBahasa = "Bahasa";
        $scope.txtMainMenu = "Menu Utama";
        $scope.txtCaraPenggunaan = "Cara Penggunaan";
        $scope.txtNoEntry = "Tiada penyertaan sebelum ini";
        $scope.txtTiadaRekodPemenang = "Tiada rekod pemenang setakat ini";
        $scope.txtMustNumber = "Amaun resit atau amaun GST mesti dalam format nombor";
        $scope.txtContohResit = "Contoh Maklumat Resit";
        
        $scope.txtCaraPenyertaan = "Cara Menghantar Penyertaan";
        $scope.txtSilaPastikanVersi = "Sila pastikan aplikasi MyResitGST anda adalah versi yang terkini sebelum anda menghantar penyertaan.";
        

    }
    
    function changeLanguageBI(){
        $scope.txtAppTitle = "MyResitGST";
        $scope.txtHeaderButirDiri = "Step 2: Personal Details";
        $scope.txtButirDiri = "Personal Details";
        $scope.txtAmbilGambar = "Capture Receipt Image";
        $scope.txtMenuUtama = "Main Menu";
        $scope.txtDaftar = "Register";
        $scope.txtPenyertaanLepas = "Previous Submission";
        $scope.txtUbahProfil = "Change Profile";
        $scope.txtBahasaDitukar = "Your language has been changed";
        $scope.daftarUbah =  $scope.txtUbahProfil;
        
        $scope.txtSenaraiPemenang = "Winners";
        $scope.txtTnC = "Terms & Conditions";
        $scope.txtSayaSetuju = "I agree with the Terms and Conditions";
        $scope.txtAlertSayaSetuju = "You must agree with the Terms & Conditions";
        $scope.txtSeterusnya = "Next";
        $scope.txtKembali = "Back";
        $scope.txtButiranResit = "Step 1: Invoice Image";
        $scope.txtAmbilGambarSemula = "Retake Picture";
        
        $scope.txtNamaPenuh = "Full Name";
        $scope.txtNoIC = "IC/Passport No.";
        $scope.txtTelefon = "Telephone No.";
        $scope.txtIndustri = "Step 3: Select Kategori";
        $scope.txtSilaPilihIndustri = "Please select 1 of the industries";
        $scope.txtAlertMaklumatDisimpan = "Your detail has been saved";
        $scope.txtKategori = "Category";
        $scope.txtHeaderButirInvoice = "Step 4: Invoice Details";
        
        $scope.txtButirInvoice = "Invoice Details";
        $scope.txtNoResit = "Invoice No.";
        $scope.txtNoGST = "Company GST No.";
        $scope.txtTarikhResit = "Invoice Date";
        $scope.txtAmaunResit = "Invoice Amount";
        $scope.txtAlertTarikhResit = "Invoice date must not less than current month.";
        
        $scope.txtAmaunGST = "GST Amount";
        $scope.txtNegeri = "Purchase State";
        $scope.txtErrorGST = "GST id must be equal to 12 characters";
        $scope.txtErrorFillAll = "All fields are required";
        $scope.txtSilaSahkan = "Please ensure all information is correct before you submit";
        $scope.txtResitDahAda = "Sorry, the GST id and invoice number already exist in our database";
        $scope.txtHantar = "Submit";
        $scope.txtSimpan = "Save";
        
        $scope.txtSilaSahkanConfirmation = "Please ensure you have an internet connection before you submit and all given information true and correct.";
        $scope.txtYa = "Submit";
        $scope.txtTidak = "Cancel";
        $scope.txtPengesahan = "Step 5: Confirmation";
        $scope.txtSelesai = "Finish";
        $scope.txtBerjaya = "Your entry has been submitted. We will contact you if you are selected as the winner";
        $scope.txtAlamat = "Full Address";
        $scope.txtJantina = "Gender";
        $scope.txtLelaki = "Male";
        $scope.txtPerempuan = "Female";
        
        $scope.txtRestoran = "Restaurant";
        $scope.txtHardware = "Hardware";
        $scope.txtFarmasi = "Pharmacy";
        $scope.txtKedaiBuku = "Book Store";
        $scope.txtMiniMarket = "Mini Market";
        $scope.txtHiburan = "Entertainment";
        $scope.txtLainlain = "Others";
        
        $scope.txtPasaraya = "Supermarket";
        $scope.txtStesyenMinyak = "Petrol Station";
        
        $scope.txtTukarBahasa = "Set Language";
        $scope.txtBahasa = "Language";
        $scope.txtMainMenu = "Main Menu";
        $scope.txtCaraPenggunaan = "How to Use";
        $scope.txtNoEntry = "No entry so far";
        $scope.txtTiadaRekodPemenang = "No record";
        $scope.txtMustNumber = "Receipt amount and GST amount must be in number format";
        $scope.txtContohResit = "Sample Invoice Details";
        
        $scope.txtCaraPenyertaan = "How to Submit Your Entry";
        $scope.txtSilaPastikanVersi = "Please make sure you have updated the latest version of MyResitGST before you submit the entry.";

    }

    
}) // end of angular Controller

/*$scope.clickChangeLanguage(){
    changeLanguage($scope.language)
}*/

    


var onDeviceReady = function() {
   // $.feat.nativeTouchScroll = true;
}
    
document.addEventListener("intel.xdk.device.ready", onDeviceReady, false);




















App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originFarmerID: "0x0000000000000000000000000000000000000000",
    originFarmName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        // App.sku = $("#sku").val();
        App.searchUPC = $("#upc").val();
        App.farmerUPC = $("#farmerupc").val();
        App.productUPC = $("#productupc").val();
        // App.ownerID = $("#ownerID").val();
        App.originFarmerID = $("#originFarmerID").val();
        App.originFarmName = $("#originFarmName").val();
        App.originFarmInformation = $("#originFarmInformation").val();
        App.originFarmLatitude = $("#originFarmLatitude").val();
        App.originFarmLongitude = $("#originFarmLongitude").val();
        App.productNotes = $("#productNotes").val();

        App.farmerPrice = $("#farmerPrice").val();
        App.productPrice = $("#productPrice").val();
        App.distributorID = $("#distributorID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();

        console.log(
            // App.sku,
            App.searchUPC,
            App.farmerUPC,
            App.productUPC,
            // App.ownerID,
            App.originFarmerID,
            App.originFarmName,
            App.originFarmInformation,
            App.originFarmLatitude,
            App.originFarmLongitude,
            App.productNotes,
            App.farmerPrice,
            App.productPrice,
            App.distributorID,
            App.retailerID,
            App.consumerID
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';

        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);

            // App.fetchItemBufferOne();
            // App.fetchItemBufferTwo();
            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.harvestItem(event);
                break;
            case 2:
                return await App.processItem(event);
                break;
            case 3:
                return await App.packItem(event);
                break;
            case 4:
                return await App.sellItem(event);
                break;
            case 5:
                return await App.buyItem(event);
                break;
            case 6:
                return await App.shipItem(event);
                break;
            case 7:
                return await App.receiveItem(event);
                break;
            case 8:
                return await App.purchaseItem(event);
                break;
            case 9:
                return await App.fetchItemBufferOne(event);
                break;
            case 10:
                return await App.fetchItemBufferTwo(event);
                break;
            case 11:
                return await App.addFarmerRole(event);
                break;
            }
    },

    harvestItem: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.readForm();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.harvestItem(
                App.farmerUPC,
                App.metamaskAccountID,
                App.originFarmName,
                App.originFarmInformation,
                App.originFarmLatitude,
                App.originFarmLongitude,
                App.productNotes
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('harvestItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    addFarmerRole: function(event){
      event.preventDefault();
      console.log('add farmer');
      App.readForm();
    //   App.contracts.SupplyChain.deployed().then(function(instance){
    //       return instance.addFarmer(App.originFarmerID);
    //   }).then(function(result){
    //       console.log('farmer added: ' + App.originFarmerID);
    //       alert('farmer with address: ', App.originFarmerID, ' has been added');
    //   }).catch(function(err){
    //       console.log(err.message);
    //   });

    console.log('farmer id: ', App.originFarmerID);
    App.contracts.SupplyChain.deployed().then(function(instance) {
        return instance.addFarmer(App.originFarmerID);
    }).then(function(result) {
          console.log('farmer added: ' + App.originFarmerID);
          alert('farmer with address: ', App.originFarmerID, ' has been added');
    }).catch(function(err) {
        console.log(err.message);
    });


    },

    processItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.readForm();


        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.processItem(App.farmerUPC, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('processItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    packItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.readForm();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.packItem(App.farmerUPC, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('packItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    sellItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.readForm();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const askingPrice = web3.toWei(App.farmerPrice, "ether");
            console.log('farmer asking price',askingPrice);
            return instance.sellItem(App.farmerUPC, askingPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('sellItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    buyItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.readForm();
        console.log('productUPC: ', App.productUPC);

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const walletValue = web3.toWei(App.productPrice, "ether");
            return instance.buyItem(App.productUPC, {from: App.metamaskAccountID, value: walletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('buyItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    shipItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.readForm();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipItem(App.productUPC, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('shipItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    receiveItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.readForm();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveItem(App.productUPC, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('receiveItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    purchaseItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.readForm();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.purchaseItem(App.productUPC, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('purchaseItem',result);
        }).catch(function(err) {
            console.log(err.message);
            $("#fetch").text("Error retrieving product");

        });
    },

    fetchItemBufferOne: function () {
    ///   event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
        // App.upc = $('#upc').val();
        // console.log('upc',App.upc);
        App.readForm();


        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferOne(App.searchUPC);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferOne', result);
          console.log('item sku: ', result[0]);
          console.log('item upc: ', result[1]);

          console.log('ownerID', result[2]);
          console.log('originFarmerID', result[3]);
          console.log('originFarmName', result[4]);
          console.log('originFarmInformation', result[5]);
          console.log('originFarmLatitude', result[6]);
          console.log('originFarmLongitude', result[7]);
          $("#fetch").empty();


          $("#fetch").append('<li>' + 'item sku' + ' : ' + result[0] + '</li>');
          $("#fetch").append('<li>' + 'item upc' + ' : ' + result[1] + '</li>');
          $("#fetch").append('<li>' + 'owner id' + ' : ' + result[2] + '</li>');

          $("#fetch").append('<li>' + 'originFarmerID' + ' :' + result[3] + '</li>');
          $("#fetch").append('<li>' + 'originFarmName' + ' : ' + result[4] + '</li>');
          $("#fetch").append('<li>' + 'originFarmInformation' + ' : ' + result[5] + '</li>');
          $("#fetch").append('<li>' + 'originFarmLatitude' + ' : ' + result[6] + '</li>');
          $("#fetch").append('<li>' + 'originFarmLongitude' + ' : ' + result[7] + '</li>');


        }).catch(function(err) {
          console.log(err.message);
          $("#fetch").text("Error retrieving product");

        });
    },

    fetchItemBufferTwo: function () {
    ///    event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
    App.readForm();

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferTwo.call(App.searchUPC);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferTwo', result);

          const askingPriceInEther = web3.fromWei(result[4], "ether");

          $("#fetch").empty();

          $("#fetch").append('<li>' + 'itemSKU' + ' : ' + result[0] + '</li>');
          $("#fetch").append('<li>' + 'itemUPC' + ' : ' + result[1] + '</li>');
          $("#fetch").append('<li>' + 'productID' + ' : ' + result[2] + '</li>');
          $("#fetch").append('<li>' + 'productNotes' + ' : ' + result[3] + '</li>');
          $("#fetch").append('<li>' + 'askingPrice' + ' : ' + askingPriceInEther + ' ether' + '</li>');
          $("#fetch").append('<li>' + 'itemState' + ' : ' + result[5] + '</li>');
          $("#fetch").append('<li>' + 'distributorID' + ' : ' + result[6] + '</li>');
          $("#fetch").append('<li>' + 'retailerID' + ' : ' + result[7] + '</li>');
          $("#fetch").append('<li>' + 'consumerID' + ' : ' + result[8] + '</li>');




        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            console.log(JSON.stringify(log));
            console.log('args' + log.args);
            console.log('upc event' + log.args["upc"]);
            const upc = log.args["upc"];
            $("#ftc-events").append('<li>'+  'UPC ' + upc + ': ' +  log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });

    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});


function openPage(pageName, elmnt, color) {
    // Hide all elements with class="tabcontent" by default */
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    // Remove the background color of all tablinks/buttons
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].style.backgroundColor = "";
    }

    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";

    // Add the specific color to the button used to open the tab content
    elmnt.style.backgroundColor = color;
  }

  // Get the element with id="defaultOpen" and click on it
  document.getElementById("defaultOpen").click();

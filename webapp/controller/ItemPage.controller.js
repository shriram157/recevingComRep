sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("zRecCompReport.controller.ItemPage", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf zRecCompReport.view.ItemPage
		 */
		onInit: function () {
			this.getView().setModel(this.getOwnerComponent().getModel("ZEWM_RECIVIENG_COMPLETION_SRV"));
			this.getOwnerComponent().getRouter().attachRoutePatternMatched(this._onRoutMatched, this);
			var oMultiHeaderConfig = {
				multiheader1: [3, 1],
				multiheader2: [2, 1],
				multiheader3: [6, 1]
			};

			this.getView().setModel(new sap.ui.model.json.JSONModel(oMultiHeaderConfig), "multiHeaderConfig");

		},
		_onRoutMatched: function (oEvent) {
			var owhno = oEvent.getParameters().arguments.whno;
			var odocno = oEvent.getParameters().arguments.asn;

			this.getView().byId("idObjHeader").setTitle("#" + odocno);
			// 			this.getView().byId("SimpleFormDisplay354").bindItems(
			// 				"/sap/opu/odata/sap/ZEWM_RECIVIENG_COMPLETION_SRV/ItHdrSet?$filter= Whno eq '7110' and Docno eq '115'&$expand=HdrToLift");
			var oModel = this.getOwnerComponent().getModel();
			oModel.read(
				"/ItLiftSet", {
					urlParameters: {
						"$filter": "Whno eq '" + owhno + "'and Asn eq '" + odocno + "'"
					},
					success: $.proxy(function (odata) {
						this.getView().getModel("LocalDataModel").setProperty("/ItemModel", odata.results);

					}, this),
					error: function (err) {
						console.log(err);
					}
				});

		},
		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("Home", {}, true);
			}
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf zReceivingCompletionReport.view.ItemPage
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf zReceivingCompletionReport.view.ItemPage
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf zReceivingCompletionReport.view.ItemPage
		 */
		//	onExit: function() {
		//
		//	}

	});

});
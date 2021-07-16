sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"zRecCompReport/model/models",
	"sap/ui/model/odata/v2/ODataModel"
], function (UIComponent, Device, models, ODataModel) {
	"use strict";

	return UIComponent.extend("zRecCompReport.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(models.createLocalModel(), "LocalDataModel");
			var mConfig = this.getMetadata().getManifestEntry("/sap.app/dataSources/ZEWM_RECIVIENG_COMPLETION_SRV");
			var oDataModel = new ODataModel(mConfig.uri, {
				useBatch: true,
				disableHeadRequestForToken: true,
				defaultUpdateMethod: 'PATCH',
				json: true
			});
			this.setModel(oDataModel, "CompletionModel");
			
			var mConfig01 = this.getMetadata().getManifestEntry("/sap.app/dataSources/ZEWM_VARIANT_SRV");
			var oDataModel01 = new ODataModel(mConfig01.uri, {
				useBatch: false,
				disableHeadRequestForToken: true,
				json: true
			});
			this.setModel(oDataModel01, "VarientModel");
		}
	});
});
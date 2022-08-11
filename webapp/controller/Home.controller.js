sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"zRecCompReport/utils/searchResult",
	"sap/m/MessageBox"
], function (Controller, Sorter, Filter, Export, ExportTypeCSV, searchResult, MessageBox) {
	"use strict";
	var cUser;

	return Controller.extend("zRecCompReport.controller.Home", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf zRecCompReport.view.Home
		 */
		searchResult: searchResult,
		onInit: function () {
			var VarientModel = this.getOwnerComponent().getModel("VarientModel");

			try {
				var y = "/sap/bc/ui2/start_up";
				var xmlHttp = null;
				xmlHttp = new XMLHttpRequest();

				xmlHttp.onreadystatechange = function () {
					if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
						var oUserData = JSON.parse(xmlHttp.responseText);
						console.log(oUserData);
					}
				};

				xmlHttp.open("GET", y, false);

				xmlHttp.send(null);
				console.log(xmlHttp.responseText.slice(xmlHttp.responseText.search("id"), xmlHttp.responseText.search("language")).substr(5, (
					xmlHttp.responseText.slice(113, 128).length - 8)));
				// cUser = xmlHttp.responseText.slice(xmlHttp.responseText.search("id"), xmlHttp.responseText.search("language")).substr(5, (xmlHttp.responseText
				//  .slice(113, 128).length - 8));
				var pArray = xmlHttp.responseText.split(",");
				cUser = pArray[7].substr(6, pArray[7].length - 7);
			} catch (e) {
				// cUser = "SINGHMI";
				console.log("Caught");
			}

			// if (cUser === "") {
			//  cUser = "SINGHMI";
			// }

			VarientModel.read("/VariantSet", {
				urlParameters: {
					"$filter": "UserId eq '" + cUser + "'"
				},
				success: $.proxy(function (sdata) {
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/VariantSet", sdata.results);

					//Service Call to Set the default Variant
					VarientModel.read("/VariantSet", {
						urlParameters: {
							"$filter": "UserId eq '" + cUser + "' and DefaultVariantKey eq 'X'"
						},
						success: $.proxy(function (sdata) {
							this.getView().setModel(this.getOwnerComponent().getModel("CompletionModel"));
							this._ModelServiceCall();

							if (sdata.results.length > 0) {
								var vText = this.getView().byId("vm");
								// vText.oSelectedItem = sdata.results[0].VariantName;
								this.getOwnerComponent().getModel("LocalDataModel").setProperty("/DefVar", sdata.results[0].VariantName);
								// vText.setShowSetAsDefault(sdata.results[0].VariantName);
								this.getView().byId("idWhno").setSelectedKey(sdata.results[0].Whno);
								this.getView().byId("idDocno").setSelectedKey(sdata.results[0].Asn);
								this.getView().byId("idCompletionTime").setValue(sdata.results[0].ActualComletionTime);
								this.getView().byId("idCreatedOn").setDateValue(sdata.results[0].CreatedOnFrom);
								this.getView().byId("idCreatedOn").setSecondDateValue(sdata.results[0].CreatedOnTo);
								if (sdata.results[0].HideChkbox === "X") {
									this.getView().byId("idCheckBoxMarked").setSelected(true);
								} else {
									this.getView().byId("idCheckBoxMarked").setSelected(false);
								}
							}

							//Service Call 3 to Filter the data on go Button
							// this.getView().setModel(this.getOwnerComponent().getModel("CompletionModel"));
							// this._ModelServiceCall(); Called in the beginning
							this._timeStampCall();

							var oMultiHeaderConfig = {
								multiheader1: [3, 1],
								multiheader2: [2, 1],
								multiheader3: [6, 1],
								rowCount: 0,
								oBusy: false
							};

							this.getView().setModel(new sap.ui.model.json.JSONModel(oMultiHeaderConfig), "multiHeaderConfig");

							this.aKeys = ["Whno", "Docno"];
							this.oSelectDate01 = this.getSelect("idCreatedOn");
							this.oSelectDate02 = this.getSelect("idCompletionTime");
							this.oSelectWhno = this.getSelect("idWhno");
							this.oSelectDocno = this.getSelect("idDocno");

							//      var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
							//        pattern: "yyyy-MM-dd HH:mm:ss"
							//      });

							var oDateModel = new sap.ui.model.json.JSONModel();
							var PriorDate = new Date();
							oDateModel.setData({
								// dateFormatDRS1: "yyyy-MM-dd HH:mm:ss",
								// dateValueDRS2: new Date(new Date().setDate(PriorDate.getDate() - 30)),
								// secondDateValueDRS2: PriorDate,
								// dateMinDRS2: new Date().toDateString() + " " + new Date().toLocaleTimeString(),
								// dateMaxDRS2: new Date()

								dateFormatDRS1: "yyyy-MM-dd HH:mm:ss",
								dateValueDRS2: null,
								secondDateValueDRS2: null,
								dateMinDRS2: null,
								dateMaxDRS2: null
							});
							this.getView().setModel(oDateModel, "DateModel");
							var oDateModel01 = new sap.ui.model.json.JSONModel();
							oDateModel01.setData({
								dateFormatDRS1: "yyyy-MM-dd HH:mm:ss",
								dateValueDRS2: null,
								secondDateValueDRS2: null,
								dateMinDRS2: null,
								dateMaxDRS2: null,
								prCoplitionDate: null,
								prDlvDate: new Date(),
								prDlvDate01: new Date()
							});
							this.getView().setModel(oDateModel01, "DateModel01");

							this.mGroupFunctions = {
								Docno: function (oContext) {
									var name = oContext.getProperty("Docno");
									return {
										key: name,
										text: name
									};
								}
							};

						}, this)
					});
				}, this)
			});

		},
		onNextRecords: function () {

			if (this.clickRecords < 0) {
				this.clickRecords = 0;
				this.clickRecords += 1;
			} else {
				this.clickRecords += 1;
			}
			this.numRecords = this.clickRecords * 100;

			//this.countAllRecords = this.getCountOfAllRecords();

			if (this.countAllRecords == 0) {
				this.getView().byId("idNextRecordsBtn").setEnabled(false);
			}
			if (this.numRecords >= 100) {
				this.getView().byId("idPrevRecordsBtn").setEnabled(true);

			}
			// this.onSearch();
			searchResult._fnSearchResult(this);
		},
		onPreviousRecords: function () {

			this.clickRecords -= 1;
			if (this.clickRecords <= 0) {
				this.numRecords = 0;
			} else {
				this.numRecords = this.clickRecords * 100;
			}
			if (this.numRecords !== 0) {

				this.getView().byId("idNextRecordsBtn").setEnabled(true);

			}
			if (this.numRecords === 0) {

				this.getView().byId("idPrevRecordsBtn").setEnabled(false);

			}

			//this.onSearch();
			searchResult._fnSearchResult(this);
		},

		onSave: function () {
			//call service Create
			var lvWhno = this.getView().byId("idWhno").getSelectedKey();
			var lvASN = this.getView().byId("idDocno").getSelectedKey();

			//Date formatter for Created on&nbsp;
			var CreatedOn = this.getView().getModel("DateModel").getProperty("/dateValueDRS2");
			if (CreatedOn == "") {
				var lvCreateonfrm = null;
			} else {
				var Dateformt1 = new Date(CreatedOn).getTime();
				var lv_dt1 = "/Date(";
				var lv_dt2 = ")/";
				var lvCreateonfrm = lv_dt1.concat(Dateformt1.toString(), lv_dt2);
			}
			//Date formatter for Created from
			var Createdfr = this.getView().getModel("DateModel").getProperty("/secondDateValueDRS2");
			if (Createdfr == "") {
				var lvCreateonTo = null;
			} else {
				var Dateformt2 = new Date(Createdfr).getTime();
				var lv_dt3 = "/Date(";
				var lv_dt4 = ")/";
				var lvCreateonTo = lv_dt3.concat(Dateformt2.toString(), lv_dt4);
			}
			//Date Formatter For actual time Completion

			var lvActComplTime = this.getView().getModel("DateModel01").getProperty("/prCoplitionDate");
			if (lvActComplTime == "") {
				var lvActcomp = null;
			} else {
				var lvActnew = new Date(lvActComplTime).getTime();
				var lv_dtacc = "/Date(";
				var lv_dt2acc = ")/";
				var lvActcomp = lv_dtacc.concat(lvActnew.toString(), lv_dt2acc);
			}
			var lvCheckbox;

			if (this.getView().byId("idCheckBoxMarked").getSelected()) {
				lvCheckbox = "X";
			} else {
				lvCheckbox = "";
			}
			var lvkey;
			var vText = this.getView().byId("vm");
			if (vText.oSelectedItem) {
				var vm_sel = vText.oSelectedItem.mProperties.text;
				console.log(vm_sel);
				if (vText.oDefault.mProperties.selected) {
					lvkey = "X";
				} else {
					lvkey = "";

				}
			}

			var VarientModel = this.getOwnerComponent().getModel("VarientModel");
			var oObj = {
				"Whno": lvWhno,
				"Asn": lvASN, //"0001501182",
				"HideChkbox": lvCheckbox,
				"UserId": cUser,
				"VariantName": vm_sel,
				"CreatedOnFrom": lvCreateonfrm, // Createdfrom
				"CreatedOnTo": lvCreateonTo, //created to
				"DefaultVariantKey": lvkey,
				"ActualComletionTime": lvActcomp
			};

			VarientModel.create("/VariantSet", oObj, {
				success: $.proxy(function (response, data) {
					console.log(response, data);
				}, this)
			});
			// vText.setInitialSelectionKey(vm_sel);
			// Call Read Service again and set the the Model again
			VarientModel.read("/VariantSet", {
				urlParameters: {
					"$filter": "UserId eq '" + cUser + "'"
				},
				success: $.proxy(function (sdata) {
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/VariantSet", sdata.results);
				}, this)
			});
		},

		onSelect: function () {
			//call service B
			this.getView().byId("idWhno").setSelectedKey("");
			this.getView().byId("idDocno").setSelectedKey("");
			// this.getView().byId("idDlvDate").setValue("");
			this.getView().byId("idCompletionTime").setValue("");
			// this.getView().byId("idCreatedOn").setValue("");
			// this.getView().byId("idCreatedOn").setDateValue("");
			// this.getView().byId("idCreatedOn").setSecondDateValue("");
			this.getView().byId("idCheckBoxMarked").setSelected(false);

			var VarientSelecModel = this.getOwnerComponent().getModel("VarientModel");
			var vText = this.getView().byId("vm");
			if (vText.lastSelectedVariantKey === "*standard*") {
				this.getView().byId("idWhno").setSelectedKey("");
				this.getView().byId("idDocno").setSelectedKey("");
				this.getView().byId("idCompletionTime").setValue("");
				// this.getView().byId("idCreatedOn").setValue("");
				// this.getView().byId("idCreatedOn").setDateValue("");
				// this.getView().byId("idCreatedOn").setSecondDateValue("");
				this.getView().byId("idCheckBoxMarked").setSelected(false);
			} else {
				if (vText.oSelectedItem) {
					var vm_sel = vText.oSelectedItem.mProperties.text;
					console.log(vm_sel);
					VarientSelecModel.read("/VariantSet", {
						urlParameters: {
							"$filter": "UserId eq '" + cUser + "' and VariantName eq '" + vm_sel + "'"
						},
						success: $.proxy(function (sdata) {
							console.log(sdata);
							//this.getOwnerComponent().getModel("LocalDataModel").setProperty("/VariantPickingSet", sdata.results);
							this.getView().byId("idWhno").setSelectedKey(sdata.results[0].Whno);
							this.getView().byId("idDocno").setSelectedKey(sdata.results[0].Asn);
							this.getView().byId("idCompletionTime").setValue(sdata.results[0].ActualComletionTime);
							this.getView().byId("idCreatedOn").setValue(sdata.results[0].CreatedOn);
							if (sdata.results[0].HideChkbox === "X") {
								this.getView().byId("idCheckBoxMarked").setSelected(true);
							} else {
								this.getView().byId("idCheckBoxMarked").setSelected(false);
							}
						}, this)
					});
				}
			}

		},

		onSelectTableCheckBox: function (oEvent) {
			var oSelected = oEvent.getSource().getSelected();
			var oModel = this.getOwnerComponent().getModel("CompletionModel");
			var oTable = this.getView().byId("idRCPTable");
			//      var oBindItems = oTable.getBinding("rows");
			//      var andFilter = [];
			var whno = oEvent.getSource().getParent().getCells()[0].getText();
			var asn = oEvent.getSource().getParent().getCells()[1].getText();
			var cellLength = oEvent.getSource().getParent().getCells().length - 1;
			var inboundDel = oEvent.getSource().getParent().getCells()[cellLength].getText();
			if (oSelected) {
				//   oModel.update("")

				var obj = {
					"WarehouseNumber": whno,
					"Asn": asn,
					"Docno": inboundDel
				};

				oEvent.getSource().setSelected(false);
				oModel.refreshSecurityToken();
				oModel.create("/MarkCompletedSet", obj, {
					success: $.proxy(function (response) {

						this.onSearch();

						//    andFilter = new sap.ui.model.Filter({
						//      filters: [
						//        new sap.ui.model.Filter("Whno", sap.ui.model.FilterOperator.NE, whno),
						//        new sap.ui.model.Filter("Asn", sap.ui.model.FilterOperator.NE, asn),
						//        //new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.NE, inboundDel),
						//      ],
						//      and: true
						//    });
						//    oBindItems.filter(andFilter);
					}, this),
					error: function (err) {
						console.log(err);
					}
				});

			} else {
				oModel.remove("/MarkCompletedSet(WarehouseNumber='" + whno + "',Asn='" + asn + "',Docno='" + inboundDel + "')", {
					method: "DELETE",
					success: $.proxy(function (response) {
						this.onSearch();
					}, this)
				});
			}

		},

		_fnTotalCount: function (totalLines) {
			var totalLineSum = "";
			if (totalLines.length > 0) {
				totalLineSum = totalLines.reduce(function (a, b) {
					return a + b;
				});

				return totalLineSum;
			} else {
				return totalLineSum;
			}

		},

		validateDeliveryDate: function (oEvt) {
			var dateRangePicker = oEvt.getSource();
			var fromDate = dateRangePicker.getDateValue();
			var toDate = dateRangePicker.getSecondDateValue();
			var oneDay = 24 * 60 * 60 * 1000;
			var diffInDays = Math.abs((toDate.getTime() - fromDate.getTime()) / oneDay);
			if (diffInDays > 180 || diffInDays === 180) {
				dateRangePicker.setValue(null);
				MessageBox.alert("Please select date range within 6 months only");

			}

		},
		onSearch: function () {
			var oKey = this.getView().byId("idWhno").getSelectedKey();
			if (this.getOwnerComponent().getModel("LocalDataModel")) {
				this.getOwnerComponent().getModel("LocalDataModel").setProperty("/oWarehouseNum", oKey);
			}
			//var oTable = this.getView().byId("idRCPTable");
			//      var oBindItems = oTable.getBinding("rows");
			this.clickRecords = 0;
			this.numRecords = 0;
			searchResult._fnSearchResult(this);

		},

		getSelect: function (sId) {
			return this.getView().byId(sId);
		},
		onClear: function (oEvent) {
			this.oSelectWhno.setSelectedKey("");
			this.oSelectDocno.setSelectedKey("");
			var oTable = this.getView().byId("idRCPTable");
			var oBindItems = oTable.getBinding("rows");
			oBindItems.filter([]);
		},

		/**
		 *    START
		 *    Defect ID : 7692
		 *    Developer : Abhijeet Parihar
		 *    Functionality: Export to Excel
		 *  &nbsp;\&nbsp;
		 **/

		onDataExport: function (oEvent) {
			//  var m =   sap.ui.getCore().getModel("oRowData");
			this.getOwnerComponent().getModel("LocalDataModel").setSizeLimit(2000);
			var oBinding = this.getView().byId("idRCPTable").getBinding();
			var that = this;
			var aFliters = oBinding.aFilters;
			var oExport = new sap.ui.core.util.Export({

				exportType: new sap.ui.core.util.ExportTypeCSV({

					separatorChar: "\t",

					mimeType: "application/vnd.ms-excel",

					charset: "utf-8",

					fileExtension: "xls"

				}),

				models: this.getOwnerComponent().getModel("LocalDataModel"),

				rows: {

					path: "/tHdrSet"

				},

				columns: [

					{

						name: "Warehouse Number",

						template: {

							content: "{Whno}"

						}

					}, {

						name: "ASN #",

						template: {

							content: "{Asn}"

						}

					}, {

						name: "Unloading Start Time",

						template: {

							content: {
								parts: ["UnloadingStart"],
								formatter: function (value) {
									jQuery.sap.require("sap.ui.core.format.DateFormat");
									var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
										pattern: "yyyy-MM-dd HH:mm:ss"
									});
									if (value) {

										var formatDt = new Date(value).toUTCString().split(" GMT")[0];

										return formatDt;

									} else {
										return value;
									}
								}
							}

						}

					}, {

						name: "Target Duration (HR)",
						template: {

							content: "{PutawayTarget}"

						}

					}, {

						name: "Target Completion Time",

						template: {

							content: {
								parts: ["TargetComTime"],
								formatter: function (value) {
									jQuery.sap.require("sap.ui.core.format.DateFormat");
									var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
										pattern: "yyyy-MM-dd HH:mm:ss"
									});
									if (value) {

										var formatDt = new Date(value).toUTCString().split(" GMT")[0];;

										return formatDt;

									} else {
										return value;
									}
								}
							}

						}

					}, {

						name: "Actual Completion Time",

						template: {

							content: {
								parts: ["ActualComletionTime"],
								formatter: function (value) {
									jQuery.sap.require("sap.ui.core.format.DateFormat");
									var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
										pattern: "yyyy-MM-dd HH:mm:ss"
									});
									if (value) {

										var formatDt = new Date(value).toUTCString().split(" GMT")[0];

										return formatDt;

									} else {
										return value;
									}
								}
							}

						}

					}, {

						name: "Total Lines - (" + that.getView().getModel("multiHeaderConfig").getProperty("/totalLinSum") + ")",

						template: {

							content: "{TotalLines}"

						}

					}, {

						name: "Left Line - (" + that.getView().getModel("multiHeaderConfig").getProperty("/leftLineArr") + ")",

						template: {

							content: "{LiftLines}"

						}

					}, {

						name: "Percent Completion in 24H",

						template: {

							content: "{Completion24}"

						}

					}, {

						name: "Percent Left",

						template: {

							content: {
								parts: ["LiftPercent"],
								formatter: function (value) {
									if (value) {
										var oval = parseFloat(value).toFixed(2);
										return oval * 100;
									} else {
										return value;
									}

								}
							}

						}

					}, {

						name: "Cage Bulk CB10 (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/Cb10Total") + ")",

						template: {

							content: "{Cb10Total}"

						}

					}, {

						name: "Cage Bulk CB10 (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/Cb10Lift") + ")",

						template: {
							//content: "{Cb10Lift}"
							content: {
								parts: ["Cb10Lift"],
								formatter: function (value) {
									if (value) {
										var oval = parseFloat(value).toFixed(2);
										return oval * 100;
									} else {
										return value;
									}

								}
							}

						}

					}, {

						name: "Cage Bulk CB10 (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/Cb10Min") + ")",

						template: {
							content: "{Cb10Min}"

						}

					}, {

						name: "Dangerous Goods DG10 (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/Dg10Total") + ")",

						template: {

							content: "{Dg10Total}"

						}

					}, {

						name: "Dangerous Goods DG10 (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/Dg10Lift") + ")",

						template: {

							//content: "{Dg10Lift}"
							content: {
								parts: ["Dg10Lift"],
								formatter: function (value) {
									if (value) {
										var oval = parseFloat(value).toFixed(2);
										return oval * 100;
									} else {
										return value;
									}

								}
							}

						}

					}, {

						name: "Dangerous Goods DG10 (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/Dg10Min") + ")",

						template: {
							content: "{Dg10Min}"

						}

					},

					/////// added for incident start
					{

						name: "Dangerous Goods DGHI (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/DghiTotal") + ")",

						template: {

							content: "{DghiTotal}"

						}

					}, {

						name: "Dangerous Goods DGHI (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/DghiLift") + ")",

						template: {

							//content: "{Dg10Lift}"
							content: {
								parts: ["DghiLift"],
								formatter: function (value) {
									if (value) {
										var oval = parseFloat(value).toFixed(2);
										return oval * 100;
									} else {
										return value;
									}

								}
							}

						}

					}, {

						name: "Dangerous Goods DGHI (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/DghiMin") + ")",

						template: {
							content: "{DghiMin}"

						}

					},
					/////////// added for incident end

					{

						name: "Loose Bulk LB10 (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/Lb10Total") + ")",

						template: {

							content: "{Lb10Total}"

						}

					}, {

						name: "Loose Bulk LB10 (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/Lb10Lift") + ")",

						template: {

							//content: "{Lb10Lift}"
							content: {
								parts: ["Lb10Lift"],
								formatter: function (value) {
									if (value) {
										var oval = parseFloat(value).toFixed(2);
										return oval * 100;
									} else {
										return value;
									}

								}
							}

						}

					}, {

						name: "Loose Bulk LB10 (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/LB10Min") + ")",

						template: {
							content: "{LB10Min}"

						}

					},

					// {

					// 	name: "Lower Mezzanine LM10 (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/Lm10Total") + ")",

					// 	template: {

					// 		content: "{Lm10Total}"

					// 	}

					// }, {

					// 	name: "Lower Mezzanine LM10 (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/Lm10Lift") + ")",

					// 	template: {

					// 		//content: "{Lm10Lift}"
					// 		content: {
					// 			parts: ["Lm10Lift"],
					// 			formatter: function (value) {
					// 				if (value) {
					// 					var oval = parseFloat(value).toFixed(2);
					// 					return oval * 100;
					// 				} else {
					// 					return value;
					// 				}

					// 			}
					// 		}

					// 	}

					// }, {

					// 	name: "Lower Mezzanine LM10 (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/LM10Min") + ")",

					// 	template: {
					// 		content: "{LM10Min}"

					// 	}

					// },

					{

						name: "Reserve Storage RE10 (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/Re10Total") + ")",

						template: {

							content: "{Re10Total}"

						}

					}, {

						name: "Reserve Storage RE10 (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/Re10Lift") + ")",

						template: {

							//content: "{Re10Lift}"
							content: {
								parts: ["Re10Lift"],
								formatter: function (value) {
									if (value) {
										var oval = parseFloat(value).toFixed(2);
										return oval * 100;
									} else {
										return value;
									}

								}
							}

						}

					}, {

						name: "Reserve Storage RE10 (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/Re10Min") + ")",

						template: {
							content: "{Re10Min}"

						}

					},

					// {

					// 	name: "LM Reserve RELM (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/RelmTotal") + ")",

					// 	template: {

					// 		content: "{RelmTotal}"

					// 	}

					// }, {

					// 	name: "LM Reserve RELM (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/RelmLift") + ")",

					// 	template: {

					// 		//content: "{RelmLift}"
					// 		content: {
					// 			parts: ["RelmLift"],
					// 			formatter: function (value) {
					// 				if (value) {
					// 					var oval = parseFloat(value).toFixed(2);
					// 					return oval * 100;
					// 				} else {
					// 					return value;
					// 				}

					// 			}
					// 		}

					// 	}

					// }, {

					// 	name: "LM Reserve RELM (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/RelmMin") + ")",

					// 	template: {
					// 		content: "{RelmMin}"

					// 	}

					// }, 

					// {

					// 	name: "UM Reserve REUM (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/ReumTotal") + ")",

					// 	template: {

					// 		content: "{ReumTotal}"

					// 	}

					// }, {

					// 	name: "UM Reserve REUM (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/ReumLift") + ")",

					// 	template: {

					// 		//content: "{ReumLift}"
					// 		content: {
					// 			parts: ["ReumLift"],
					// 			formatter: function (value) {
					// 				if (value) {
					// 					var oval = parseFloat(value).toFixed(2);
					// 					return oval * 100;
					// 				} else {
					// 					return value;
					// 				}

					// 			}
					// 		}

					// 	}

					// }, {

					// 	name: "UM Reserve REUM (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/ReumMin") + ")",

					// 	template: {
					// 		content: "{ReumMin}"

					// 	}

					// }, 

					{

						name: "Upper Mezzanine Umhi (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/UmhiTotal") + ")",

						template: {

							content: "{UmhiTotal}"

						}

					}, {

						name: "Upper Mezzanine Umhi (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/UmhiLift") + ")",

						template: {

							//content: "{Um10Lift}"
							content: {
								parts: ["UmhiLift"],
								formatter: function (value) {
									if (value) {
										var oval = parseFloat(value).toFixed(2);
										return oval * 100;
									} else {
										return value;
									}

								}
							}

						}

					}, {

						name: "Upper Mezzanine Umhi (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/UmhiMin") + ")",

						template: {
							content: "{UmhiMin}"

						}

					},

					{

						name: "Fast Rack PDC1 FR10 (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/Rf10Total") + ")",

						template: {

							content: "{Rf10Total}"

						}

					}, {

						name: "Fast Rack PDC1 FR10 (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/Rf10Lift") + ")",

						template: {

							//content: "{Rf10Lift}"

							content: {
								parts: ["Rf10Lift"],
								formatter: function (value) {
									if (value) {
										var oval = parseFloat(value).toFixed(2);
										return oval * 100;
									} else {
										return value;
									}

								}
							}
						}

					}, {

						name: "Fast Rack PDC1 FR10 (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/Fr10Min") + ")",

						template: {
							content: "{Fr10Min}"

						}

					}, {

						name: "Loose Bulk PDC2 LB20 (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/Lb20Total") + ")",

						template: {

							content: "{Lb20Total}"

						}

					}, {

						name: "Loose Bulk PDC2 LB20 (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/Lb20Lift") + ")",

						template: {

							//content: "{Lb20Lift}"
							content: {
								parts: ["Lb20Lift"],
								formatter: function (value) {
									if (value) {
										var oval = parseFloat(value).toFixed(2);
										return oval * 100;
									} else {
										return value;
									}

								}
							}

						}

					}, {

						name: "Loose Bulk PDC2 LB20 (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/Lb20Min") + ")",

						template: {
							content: "{Lb20Min}"

						}

					},

					// {

					// 	name: "Lower Mezzanine LMHI (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/LmhiTotal") + ")",

					// 	template: {

					// 		content: "{LmhiTotal}"

					// 	}

					// }, {

					// 	name: "Lower Mezzanine LMHI (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/LmhiLift") + ")",

					// 	template: {

					// 		//content: "{Um10Lift}"
					// 		content: {
					// 			parts: ["LmhiLift"],
					// 			formatter: function (value) {
					// 				if (value) {
					// 					var oval = parseFloat(value).toFixed(2);
					// 					return oval * 100;
					// 				} else {
					// 					return value;
					// 				}

					// 			}
					// 		}

					// 	}

					// }, {

					// 	name: "Lower Mezzanine LMHI (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/LmhiMin") + ")",

					// 	template: {
					// 		content: "{LmhiMin}"

					// 	}

					// },

					// {

					// 	name: "Upper Mezzanine UMHI (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/UmhiTotal") + ")",

					// 	template: {

					// 		content: "{UmhiTotal}"

					// 	}

					// }, {

					// 	name: "Upper Mezzanine UMHI (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/UmhiLift") + ")",

					// 	template: {

					// 		//content: "{Um10Lift}"
					// 		content: {
					// 			parts: ["UmhiLift"],
					// 			formatter: function (value) {
					// 				if (value) {
					// 					var oval = parseFloat(value).toFixed(2);
					// 					return oval * 100;
					// 				} else {
					// 					return value;
					// 				}

					// 			}
					// 		}

					// 	}

					// }, {

					// 	name: "Upper Mezzanine UMHI (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/UmhiMin") + ")",

					// 	template: {
					// 		content: "{UmhiMin}"

					// 	}

					// },

					// {

					// 	name: "Dangerous Goods DGHI (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/DghiTotal") + ")",

					// 	template: {

					// 		content: "{DghiTotal}"

					// 	}

					// }, {

					// 	name: "Dangerous Goods DGHI (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/DghiLift") + ")",

					// 	template: {

					// 		//content: "{Um10Lift}"
					// 		content: {
					// 			parts: ["DghiLift"],
					// 			formatter: function (value) {
					// 				if (value) {
					// 					var oval = parseFloat(value).toFixed(2);
					// 					return oval * 100;
					// 				} else {
					// 					return value;
					// 				}

					// 			}
					// 		}

					// 	}

					// }, {

					// 	name: "Dangerous Goods DGHI (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/DghiMin") + ")",

					// 	template: {
					// 		content: "{DghiMin}"

					// 	}

					// },
					{

						name: "Y810-Deconsolidation (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/Y810Total") + ")",

						template: {

							content: "{Y810Total}"

						}

					}, {

						name: "Y810-Deconsolidation (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/Y810Lift") + ")",

						template: {

							//content: "{Um10Lift}"
							content: {
								parts: ["Y810Lift"],
								formatter: function (value) {
									if (value) {
										var oval = parseFloat(value).toFixed(2);
										return oval * 100;
									} else {
										return value;
									}

								}
							}

						}

					}, {

						name: "Y810-Deconsolidation (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/Y810Min") + ")",

						template: {
							content: "{Y810Min}"

						}

					},

					{

						name: "Y860 – Relabeling (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/Y860Total") + ")",

						template: {

							content: "{Y860Total}"

						}

					}, {

						name: "Y860 – Relabeling (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/Y860Lift") + ")",

						template: {

							//content: "{Um10Lift}"
							content: {
								parts: ["Y860Lift"],
								formatter: function (value) {
									if (value) {
										var oval = parseFloat(value).toFixed(2);
										return oval * 100;
									} else {
										return value;
									}

								}
							}

						}

					}, {

						name: "Y860 – Relabeling (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/Y860Min") + ")",

						template: {
							content: "{Y860Min}"

						}

					},

					{

						name: "NOLO (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/NoloTotal") + ")",

						template: {

							content: "{NoloTotal}"

						}

					}, {

						name: "NOLO (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/NoloLift") + ")",

						template: {

							//content: "{Um10Lift}"
							content: {
								parts: ["NoloLift"],
								formatter: function (value) {
									if (value) {
										var oval = parseFloat(value).toFixed(2);
										return oval * 100;
									} else {
										return value;
									}

								}
							}

						}

					}, {

						name: "NOLO (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/NoloMin") + ")",

						template: {
							content: "{NoloMin}"

						}

					},

					{

						name: "WP10 - Walkable Bulk Parts (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/Wp10Total") + ")",

						template: {

							content: "{Wp10Total}"

						}

					}, {

						name: "WP10 - Walkable Bulk Parts (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/Wp10Lift") + ")",

						template: {

							//content: "{Um10Lift}"
							content: {
								parts: ["Wp10Lift"],
								formatter: function (value) {
									if (value) {
										var oval = parseFloat(value).toFixed(2);
										return oval * 100;
									} else {
										return value;
									}

								}
							}

						}

					}, {

						name: "WP10 - Walkable Bulk Parts (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/Wp10Min") + ")",

						template: {
							content: "{Wp10Min}"

						}

					},

					{

						name: "TP10 - Two Persons Pick (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/Tp10Total") + ")",

						template: {

							content: "{Tp10Total}"

						}

					}, {

						name: "TP10 - Two Persons Pick (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/Tp10Lift") + ")",

						template: {

							//content: "{Um10Lift}"
							content: {
								parts: ["Tp10Lift"],
								formatter: function (value) {
									if (value) {
										var oval = parseFloat(value).toFixed(2);
										return oval * 100;
									} else {
										return value;
									}

								}
							}

						}

					}, {

						name: "TP10 - Two Persons Pick (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/Tp10Min") + ")",

						template: {
							content: "{Tp10Min}"

						}

					},

					{

						name: "FP10 - Floor Pick Parts (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/Fp10Total") + ")",

						template: {

							content: "{Fp10Total}"

						}

					}, {

						name: "FP10 - Floor Pick Parts (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/Fp10Lift") + ")",

						template: {

							//content: "{Um10Lift}"
							content: {
								parts: ["Fp10Lift"],
								formatter: function (value) {
									if (value) {
										var oval = parseFloat(value).toFixed(2);
										return oval * 100;
									} else {
										return value;
									}

								}
							}

						}

					}, {

						name: "FP10 - Floor Pick Parts (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/Fp10Min") + ")",

						template: {
							content: "{Fp10Min}"

						}

					},

					{

						name: "MP10-Medium Parts (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/Mp10Total") + ")",

						template: {

							content: "{Mp10Total}"

						}

					}, {

						name: "MP10-Medium Parts (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/Mp10Lift") + ")",

						template: {

							//content: "{Um10Lift}"
							content: {
								parts: ["Mp10Lift"],
								formatter: function (value) {
									if (value) {
										var oval = parseFloat(value).toFixed(2);
										return oval * 100;
									} else {
										return value;
									}

								}
							}

						}

					}, {

						name: "MP10-Medium Parts (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/Mp10Min") + ")",

						template: {
							content: "{Mp10Min}"

						}

					},

					{

						name: "RS10 - Rack Storage Area (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/Rs10Total") + ")",

						template: {

							content: "{Rs10Total}"

						}

					}, {

						name: "RS10 - Rack Storage Area (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/Rs10Lift") + ")",

						template: {

							//content: "{Um10Lift}"
							content: {
								parts: ["Rs10Lift"],
								formatter: function (value) {
									if (value) {
										var oval = parseFloat(value).toFixed(2);
										return oval * 100;
									} else {
										return value;
									}

								}
							}

						}

					}, {

						name: "RS10 - Rack Storage Area (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/Rs10Min") + ")",

						template: {
							content: "{Rs10Min}"

						}

					},

					{

						name: "SB10 - Slow Bulk (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/Sb10Total") + ")",

						template: {

							content: "{Sb10Total}"

						}

					}, {

						name: "SB10 - Slow Bulk (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/Sb10Lift") + ")",

						template: {

							//content: "{Um10Lift}"
							content: {
								parts: ["Sb10Lift"],
								formatter: function (value) {
									if (value) {
										var oval = parseFloat(value).toFixed(2);
										return oval * 100;
									} else {
										return value;
									}

								}
							}

						}

					}, {

						name: "SB10 - Slow Bulk (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/Sb10Min") + ")",

						template: {
							content: "{Sb10Min}"

						}

					},

					{

						name: "SPHI - Service Parts SPHI (Total - " + that.getView().getModel("multiHeaderConfig").getProperty("/SphiTotal") + ")",

						template: {

							content: "{SphiTotal}"

						}

					}, {

						name: "SPHI - Service Parts SPHI (Left - " + that.getView().getModel("multiHeaderConfig").getProperty("/SphiLift") + ")",

						template: {

							//content: "{Um10Lift}"
							content: {
								parts: ["SphiLift"],
								formatter: function (value) {
									if (value) {
										var oval = parseFloat(value).toFixed(2);
										return oval * 100;
									} else {
										return value;
									}

								}
							}

						}

					}, {

						name: "SPHI - Service Parts SPHI (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/SphiMin") + ")",

						template: {
							content: "{SphiMin}"

						}

					},

					{

						name: "SVHI - Small and Very Small Parts SVHI (Total - " + that.getView().getModel("multiHeaderConfig").getProperty(
							"/SvhiTotal") + ")",

						template: {

							content: "{SvhiTotal}"

						}

					}, {

						name: "SVHI - Small and Very Small Parts SVHI (Left - " + that.getView().getModel("multiHeaderConfig").getProperty(
								"/SvhiLift") +
							")",

						template: {

							//content: "{Um10Lift}"
							content: {
								parts: ["SvhiLift"],
								formatter: function (value) {
									if (value) {
										var oval = parseFloat(value).toFixed(2);
										return oval * 100;
									} else {
										return value;
									}

								}
							}

						}

					}, {

						name: "SVHI - Small and Very Small Parts SVHI (Min - " + that.getView().getModel("multiHeaderConfig").getProperty("/SvhiMin") +
							")",

						template: {
							content: "{SvhiMin}"

						}

					}, {

						name: "Doc Num",

						template: {

							content: "{Docno}"

						}

					}

				]

			});

			//* download exported file

			oExport.saveFile().always(function () {

				this.destroy();

			});
		},

		/**
		 *    END
		 *    Defect ID : 7692
		 *    Developer : Abhijeet Parihar
		 *    Functionality: Export to Excel
		 *  &nbsp;\&nbsp;
		 **/
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf zReceivingCompletionReport.view.Home
		 */
		//  onBeforeRendering: function() {
		//
		//  },

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf zReceivingCompletionReport.view.Home
		 */

		// Commenting the OnNAvigate functionto hide the item level screen as per the CR1096

		// onNavigate: function (oEvent) {

		//  var obj = oEvent.getSource().getModel("LocalDataModel").getProperty(oEvent.getParameters().rowContext.sPath);

		//  this.getOwnerComponent().getRouter().navTo("ItemPage", {
		//    whno: obj.Whno,
		//    asn: obj.Asn
		//  });
		// },

		_ModelServiceCall: function () {
			var that = this;
			this.IntervalHandle = setInterval(function () {

				that.getOwnerComponent().getModel().refresh(true);

				//sap.ui.getCore().getModel("ZEWM_RECIVIENG_COMPLETION_SRV").refresh(true);
			}, 60000);
		},

		_timeStampCall: function () {
			var that = this;
			this.InterValHandlCall = setInterval(function () {
				try {
					that.getView().byId("idGetDate").setText(new Date().toDateString() + " " + new Date().toLocaleTimeString());
				} catch (err) {
					that.getView().byId("idGetDate").setText("");
				}

			}, 1000);
		},

		formatDate: function (value) {
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			//      var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
			//        pattern: "yyyy-MM-dd HH:mm:ss"
			//      });

			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyyMMddHHMMSS"
			});
			if (value) {

				var formatDt = new Date(value).toUTCString().split(" GMT")[0];;

				return formatDt;

			} else {
				return value;
			}
		},

		formatNumber: function (value) {
			if (value) {
				var oval = Math.round(parseFloat(value) * 100) / 100;
				return Math.round(oval * 100);
			} else {
				return value;
			}

		},

		//    formatBlankValue: function (value) {
		//      var val = parseFloat(value);
		//      if (val == 0) {
		//        var oval = "";
		//        return oval;
		//      } else {
		//        return value;
		//    },

		handleViewSettingsDialogButtonPressed: function (oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("zReceivingCompletionReport.view.fragments.sortDialog", this);
			}
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},

		handleConfirm: function (oEvent) {

			var oView = this.getView();
			var oTable = oView.byId("idRCPTable");

			var mParams = oEvent.getParameters();

			var oBinding = oTable.getBinding("rows");

			// apply sorter to binding
			// (grouping comes before sorting)
			var sPath;
			var bDescending;
			var vGroup;
			var aSorters = [];
			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();

				bDescending = mParams.groupDescending;
				vGroup = this.mGroupFunctions[sPath];
				aSorters.push(new Sorter(sPath, bDescending, vGroup));
			}
			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));
			oBinding.sort(aSorters);

		},

		formatChecked: function (e) {
			console.log(e);
		},

		fnTotalLine: function (e) {
			console.log(e);
		},

		onAfterRendering: function () {

			//      var oModel = this.getOwnerComponent().getModel();
			//      oModel.read("/ItHdrSet", {
			//        success: $.proxy(function (odata) {
			//          this.getView().byId("idTableTitle").setText("Total Rows (" + odata.results.length + ")");
			//        }, this)
			//      });
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf zReceivingCompletionReport.view.Home
		 */
		onExit: function () {
			if (this.IntervalHandle) {
				clearInterval(this.IntervalHandle);
			}
		}

	});

});
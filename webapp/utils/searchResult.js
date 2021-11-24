sap.ui.define([
	"sap/m/MessageBox"
	], function (MessageBox) {
	"use strict";

	return {
		_fnSearchResult: function (elm) {
			//this.getView().getModel("multiHeaderConfig").setProperty("/oBusy", true);

			elm.getOwnerComponent().getModel("LocalDataModel").setProperty("/busyIndicate", true);
			var oModel = elm.getOwnerComponent().getModel("CompletionModel");
			var oChecked = elm.getView().byId("idCheckBoxMarked").getSelected();
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-ddTHH:mm:ss"
			});
			var andFilter = [];
			var skip = elm.numRecords;

			// var sQuery = elm.getView().byId("idCreatedOn").getValue();

			var odateFrom = oDateFormat.format(elm.getView().getModel("DateModel").getProperty("/dateValueDRS2"));
			var oDateToFinal = oDateFormat.format(elm.getView().getModel("DateModel").getProperty("/secondDateValueDRS2"));

			var oTargetComplDate = oDateFormat.format(elm.getView().getModel("DateModel01").getProperty("/prCoplitionDate"));
			var oTargetComplDateS = oTargetComplDate.split("T")[0];

			var odateCompletionFrom = oTargetComplDateS + "T" + "00:00:00";
			var oDateToFinalCo = oTargetComplDateS + "T" + "23:59:00";

			var oDelvDate = oDateFormat.format(elm.getView().getModel("DateModel01").getProperty("/prDlvDate"));
			var oDelvDate01 = oDateFormat.format(elm.getView().getModel("DateModel01").getProperty("/prDlvDate01"));

			var oDelvDateS = oDelvDate.split("T")[0];
			//      var oDelvDateFrom = oDelvDateS + "T" + "00:00:00";
			//      var oDelvDateTo = oDelvDateS + "T" + "23:59:00";

			var sQueryDoc = elm.getView().byId("idDocno").getValue();
			var sQueryWhID = elm.getView().byId("idWhno");
			var sQueryWh = sQueryWhID.getSelectedKey();
			var oTable = elm.getView().byId("idRCPTable");
			var oBindItems = oTable.getBinding("rows");
			var oFilterParam;
			var oDlvComplete;
			if (oChecked) {
				oDlvComplete = "X";
			} else {
				oDlvComplete = "";
			}

			if (sQueryWh == "") {
				elm.getView().byId("idPickingStrip").setProperty("visible", true);
				elm.getView().byId("idPickingStrip").setText("Please Select Warehouse Number");
				elm.getView().byId("idPickingStrip").setType("Error");
				sQueryWhID.setValueState(sap.ui.core.ValueState.Error);
				andFilter = [];
				elm.getView().getModel("multiHeaderConfig").setProperty("/rowCount", 0);
			} else if (sQueryWh != "" && oDelvDate == "" && sQueryDoc == "" && oTargetComplDate == "" && oDateToFinal == "") {

				elm.getView().byId("idPickingStrip").setProperty("visible", false);
				sQueryWhID.setValueState(sap.ui.core.ValueState.None);

				oFilterParam = "Whno eq '" + sQueryWh + "'and HideChkbox eq '" + oDlvComplete + "'";

			} else if (sQueryWh != "" && oDelvDate != "" && sQueryDoc == "" && oTargetComplDate == "" && oDateToFinal == "") {

				elm.getView().byId("idPickingStrip").setProperty("visible", false);
				sQueryWhID.setValueState(sap.ui.core.ValueState.None);
				oFilterParam = "Whno eq '" + sQueryWh + "'and HideChkbox eq '" + oDlvComplete + "'and (DlvryDate ge datetime'" + oDelvDate +
					"'and DlvryDate le datetime'" + oDelvDate01 + "')";

			} else if (sQueryDoc != "" && oDelvDate == "" && sQueryWh != "" && oTargetComplDate == "" && oDateToFinal == "") {

				elm.getView().byId("idPickingStrip").setProperty("visible", false);
				sQueryWhID.setValueState(sap.ui.core.ValueState.None);
				//elm.getView().getModel("multiHeaderConfig").setProperty("/rowCount", 20);

				oFilterParam = "Whno eq '" + sQueryWh + "'and HideChkbox eq '" + oDlvComplete + "'and Asn eq '" + sQueryDoc + "'";

			} else if (sQueryDoc != "" && oDelvDate != "" && sQueryWh != "" && oTargetComplDate == "" && oDateToFinal == "") {

				elm.getView().byId("idPickingStrip").setProperty("visible", false);
				sQueryWhID.setValueState(sap.ui.core.ValueState.None);
				//elm.getView().getModel("multiHeaderConfig").setProperty("/rowCount", 20);
				oFilterParam = "Whno eq '" + sQueryWh + "'and HideChkbox eq '" + oDlvComplete + "'and Asn eq '" + sQueryDoc +
					"'and (DlvryDate ge datetime'" + oDelvDate + "'and DlvryDate le datetime'" + oDelvDate01 + "')";
			} else if (sQueryDoc != "" && sQueryWh != "" && oDelvDate != "" && oTargetComplDate != "" && oDateToFinal == "") {

				elm.getView().byId("idPickingStrip").setProperty("visible", false);
				sQueryWhID.setValueState(sap.ui.core.ValueState.None);
				//elm.getView().getModel("multiHeaderConfig").setProperty("/rowCount", 20);

				oFilterParam = "Whno eq '" + sQueryWh + "'and HideChkbox eq '" + oDlvComplete + "'and Asn eq '" + sQueryDoc +
					"'and (DlvryDate ge datetime'" + oDelvDate + "'and DlvryDate le datetime'" + oDelvDate01 +
					"') and (ActualComletionTime ge datetime'" + odateCompletionFrom +
					"'and ActualComletionTime le datetime'" +
					oDateToFinalCo + "')";

			} else if (oTargetComplDate != "" && oDelvDate != "" && sQueryWh != "" && sQueryDoc == "" && oDateToFinal == "") {

				elm.getView().byId("idPickingStrip").setProperty("visible", false);
				sQueryWhID.setValueState(sap.ui.core.ValueState.None);
				//elm.getView().getModel("multiHeaderConfig").setProperty("/rowCount", 20);

				oFilterParam = "Whno eq '" + sQueryWh + "'and HideChkbox eq '" + oDlvComplete + "'and (DlvryDate ge datetime'" + oDelvDate +
					"'and DlvryDate le datetime'" + oDelvDate01 + "') and (ActualComletionTime ge datetime'" + odateCompletionFrom +
					"'and ActualComletionTime le datetime'" +
					oDateToFinalCo + "')";

			} else if (oTargetComplDate != "" && oDelvDate == "" && sQueryWh != "" && sQueryDoc == "" && oDateToFinal == "") {

				elm.getView().byId("idPickingStrip").setProperty("visible", false);
				sQueryWhID.setValueState(sap.ui.core.ValueState.None);
				//elm.getView().getModel("multiHeaderConfig").setProperty("/rowCount", 20);

				oFilterParam = "Whno eq '" + sQueryWh + "'and HideChkbox eq '" + oDlvComplete + "'and (ActualComletionTime ge datetime'" +
					odateCompletionFrom +
					"'and ActualComletionTime le datetime'" +
					oDateToFinalCo + "')";

			} else if (sQueryDoc == "" && oDelvDate == "" && sQueryWh != "" && oDateToFinal != "" && oTargetComplDate == "") {

				elm.getView().byId("idPickingStrip").setProperty("visible", false);
				sQueryWhID.setValueState(sap.ui.core.ValueState.None);
				//elm.getView().getModel("multiHeaderConfig").setProperty("/rowCount", 20);
				oFilterParam = "Whno eq '" + sQueryWh + "'and HideChkbox eq '" + oDlvComplete + "'and (CreatedOn ge datetime'" + odateFrom +
					"'and CreatedOn le datetime'" + oDateToFinal + "')";

			} else if (sQueryDoc != "" && oDelvDate == "" && sQueryWh != "" && oDateToFinal != "" && oTargetComplDate == "") {

				elm.getView().byId("idPickingStrip").setProperty("visible", false);
				sQueryWhID.setValueState(sap.ui.core.ValueState.None);
				//elm.getView().getModel("multiHeaderConfig").setProperty("/rowCount", 20);

				oFilterParam = "Whno eq '" + sQueryWh + "'and HideChkbox eq '" + oDlvComplete + "'and Asn eq '" +
					sQueryDoc + "'and (CreatedOn ge datetime'" + odateFrom + "'and CreatedOn le datetime'" + oDateToFinal + "')";

			} else if (sQueryDoc == "" && oDelvDate != "" && sQueryWh != "" && oDateToFinal != "" && oTargetComplDate == "") {

				elm.getView().byId("idPickingStrip").setProperty("visible", false);
				sQueryWhID.setValueState(sap.ui.core.ValueState.None);
				//elm.getView().getModel("multiHeaderConfig").setProperty("/rowCount", 20);

				oFilterParam = "Whno eq '" + sQueryWh + "'and HideChkbox eq '" + oDlvComplete + "'and (DlvryDate ge datetime'" + oDelvDate +
					"'and DlvryDate le datetime'" + oDelvDate01 + "') and (CreatedOn ge datetime'" + odateFrom + "'and CreatedOn le datetime'" +
					oDateToFinal + "')";

			} else if (sQueryDoc != "" && oDelvDate != "" && sQueryWh != "" && oDateToFinal == "" && oTargetComplDate != "") {

				elm.getView().byId("idPickingStrip").setProperty("visible", false);
				sQueryWhID.setValueState(sap.ui.core.ValueState.None);
				//elm.getView().getModel("multiHeaderConfig").setProperty("/rowCount", 20);

				oFilterParam = "Whno eq '" + sQueryWh + "'and HideChkbox eq '" + oDlvComplete + "'and Asn eq '" + sQueryDoc +
					"'and (DlvryDate ge datetime'" + oDelvDate + "'and DlvryDate le datetime'" + oDelvDate01 +
					"') and (ActualComletionTime ge datetime'" + odateCompletionFrom +
					"'and ActualComletionTime le datetime'" +
					oDateToFinalCo + "')";

			} else if (sQueryDoc != "" && oDelvDate != "" && sQueryWh != "" && oDateToFinal != "" && oTargetComplDate == "") {

				elm.getView().byId("idPickingStrip").setProperty("visible", false);
				sQueryWhID.setValueState(sap.ui.core.ValueState.None);
				//elm.getView().getModel("multiHeaderConfig").setProperty("/rowCount", 20);
				oFilterParam = "Whno eq '" + sQueryWh + "'and HideChkbox eq '" + oDlvComplete + "'and Asn eq '" + sQueryDoc +
					"'and (DlvryDate ge datetime'" + oDelvDate + "'and DlvryDate le datetime'" + oDelvDate01 + "') and (CreatedOn ge datetime'" +
					odateFrom + "'and CreatedOn le datetime'" + oDateToFinal + "')";

			} else if (sQueryDoc == "" && oDelvDate != "" && sQueryWh != "" && oDateToFinal != "" && oTargetComplDate != "") {

				elm.getView().byId("idPickingStrip").setProperty("visible", false);
				sQueryWhID.setValueState(sap.ui.core.ValueState.None);
				//elm.getView().getModel("multiHeaderConfig").setProperty("/rowCount", 20);

				oFilterParam = "Whno eq '" + sQueryWh + "'and HideChkbox eq '" + oDlvComplete + "'and (DlvryDate ge datetime'" + oDelvDate +
					"'and DlvryDate le datetime'" + oDelvDate01 + "') and (CreatedOn ge datetime'" + odateFrom + "'and CreatedOn le datetime'" +
					oDateToFinal +
					"') and (ActualComletionTime ge datetime'" + odateCompletionFrom + "'and ActualComletionTime le datetime'" + oDateToFinalCo + "')";

			} else if (sQueryDoc != "" && oDelvDate != "" && sQueryWh != "" && oTargetComplDate != "" && oDateToFinal != "") {

				oFilterParam = "Whno eq '" + sQueryWh + "'and Asn eq '" + sQueryDoc + "'and HideChkbox eq '" + oDlvComplete +
					"'and (DlvryDate ge datetime'" + oDelvDate + "'and DlvryDate le datetime'" + oDelvDate01 + "') and (CreatedOn ge datetime'" +
					odateFrom + "'and CreatedOn le datetime'" + oDateToFinal +
					"') and (ActualComletionTime ge datetime'" + odateCompletionFrom + "'and ActualComletionTime le datetime'" + oDateToFinalCo + "')";

				elm.getView().byId("idPickingStrip").setProperty("visible", false);
				sQueryWhID.setValueState(sap.ui.core.ValueState.None);
				//  elm.getView().getModel("multiHeaderConfig").setProperty("/rowCount", 20);

			} else {
				//elm.getView().getModel("multiHeaderConfig").setProperty("/rowCount", 0);
			}

			oModel.read("/Header_NewSet", {

				urlParameters: {
					"$skip": skip,
					"$top": 100,
					"$inlinecount": "allpages",
					"$filter": oFilterParam
				},
				success: $.proxy(function (data) {
					var dataResult;
					if (oTargetComplDate != "") {
						dataResult = data.results.filter(function (item) {
							if (item.ActualComletionTime !== null) {
								return item.ActualComletionTime.getTime() >= new Date(odateCompletionFrom).getTime() &&
									item.ActualComletionTime.getTime() <= new Date(oDateToFinalCo).getTime();
							}

						});

						console.log(dataResult);
					} else {
						dataResult = data.results
					}

					elm.countAllRecords = data.results.length;
					if (elm.countAllRecords >= 100) {
						elm.getView().byId("idNextRecordsBtn").setEnabled(true);
					} else {
						elm.getView().byId("idNextRecordsBtn").setEnabled(false);
					}
					
					elm.getOwnerComponent().getModel("LocalDataModel").setProperty("/tHdrSet", dataResult);
					elm.getOwnerComponent().getModel("LocalDataModel").setProperty("/busyIndicate", false);

					elm.getView().byId("idTableTitle").setText("Total Rows (" + dataResult.length + ")");
					if (dataResult.length > 0) {

						var oArr = {
							totalLines: [],
							leftLineArr: [],
							Cb10Total: [],
							Cb10Lift: [],
							Cb10Min: [],
							Dg10Total: [],
							Dg10Lift: [],
							Dg10Min: [],
							Lb10Total: [],
							Lb10Lift: [],
							Lb10Min: [],
							Lm10Total: [],
							Lm10Lift: [],
							Lm10Min: [],
							Re10Total: [],
							Re10Lift: [],
							Re10Min: [],
							RelmTotal: [],
							RelmLift: [],
							RelmMin: [],
							ReumTotal: [],
							ReumLift: [],
							ReumMin: [],
							Um10Total: [],
							Um10Lift: [],
							Um10Min: [],
							Rf10Total: [],
							Rf10Lift: [],
							Fr10Min: [],
							Lb20Total: [],
							Lb20Lift: [],
							Lb20Min: [],
							NoloLift: [],
							NoloTotal: [],
							LmhiLift: [],
							LmhiTotal: [],
							UmhiLift: [],
							UmhiTotal: [],
							DghiLift: [],
							DghiTotal: [],
							LmhiMin: [],
							UmhiMin: [],
							DghiMin: [],
							NoloMin: [],
							Wp10Total: [],
							Wp10Lift: [],
							Wp10Min: [],
							Tp10Min: [],
							Tp10Lift: [],
							Tp10Total: [],
							LbhiMin: [],
							LbhiLift: [],
							LbhiTotal: [],
							SvhiMin: [],
							SvhiLift: [],
							SvhiTotal: [],
							SphiMin: [],
							SphiLift: [],
							SphiTotal: [],
							Fp10Total: [],
							Fp10Lift: [],
							Fp10Min: [],
							Mp10Min: [],
							Mp10Lift: [],
							Mp10Total: [],
							Rs10Min: [],
							Rs10Lift: [],
							Rs10Total: [],
							Bc10Min: [],
							Bc10Lift: [],
							Bc10Total: [],
							Y810Min: [],
							Y810Lift: [],
							Y810Total: [],
							Y860Min: [],
							Y860Lift: [],
							Y860Total: [],
							Sb10Min: [],
							Sb10Lift: [],
							Sb10Total: [],
							Sf10Min: [],
							Sf10Lift: [],
							Sf10Total: [],
							Sp10Min: [],
							Sp10Lift: [],
							Sp10Total: [],
							Sm10Min: [],
							Sm10Total: [],
							Sm10Lift: [],
							Vs10Min: [],
							Vs10Lift: [],
							Vs10Total: []
						};

						//console.log(data);
						for (var i in dataResult) {
							if (dataResult[i].LmhiMin != "") {
								oArr.LmhiMin.push(Math.round(dataResult[i].LmhiMin));
							}
							if (dataResult[i].UmhiMin != "") {
								oArr.UmhiMin.push(Math.round(dataResult[i].UmhiMin));
							}
							if (dataResult[i].DghiMin != "") {
								oArr.DghiMin.push(Math.round(dataResult[i].DghiMin));
							}
							if (dataResult[i].NoloMin != "") {
								oArr.NoloMin.push(Math.round(dataResult[i].NoloMin));
							}
							if (dataResult[i].LmhiLift != "") {
								oArr.LmhiLift.push(parseInt(dataResult[i].LmhiLift));
							}
							if (dataResult[i].LmhiTotal != "") {
								oArr.LmhiTotal.push(parseInt(dataResult[i].LmhiTotal));
							}
							if (dataResult[i].UmhiLift != "") {
								oArr.UmhiLift.push(parseInt(dataResult[i].UmhiLift));
							}
							if (dataResult[i].UmhiTotal != "") {
								oArr.UmhiTotal.push(parseInt(dataResult[i].UmhiTotal));
							}
							if (dataResult[i].DghiLift != "") {
								oArr.DghiLift.push(parseInt(dataResult[i].DghiLift));
							}
							if (dataResult[i].DghiTotal != "") {
								oArr.DghiTotal.push(parseInt(dataResult[i].DghiTotal));
							}
							if (dataResult[i].TotalLines != "") {
								oArr.totalLines.push(parseInt(dataResult[i].TotalLines));
							}
							if (dataResult[i].LiftLines != "") {
								oArr.leftLineArr.push(parseInt(dataResult[i].LiftLines));
							}
							if (dataResult[i].Cb10Total != "") {
								oArr.Cb10Total.push(parseInt(dataResult[i].Cb10Total));
							}
							if (dataResult[i].Cb10Lift != "") {
								oArr.Cb10Lift.push(parseInt(dataResult[i].Cb10Lift));
							}
							if (dataResult[i].Cb10Min != "") {
								oArr.Cb10Min.push(Math.round(dataResult[i].Cb10Min));
							}
							if (dataResult[i].Dg10Total != "") {
								oArr.Dg10Total.push(parseInt(dataResult[i].Dg10Total));
							}
							if (dataResult[i].Dg10Lift != "") {
								oArr.Dg10Lift.push(parseInt(dataResult[i].Dg10Lift));
							}
							if (dataResult[i].Dg10Min != "") {
								oArr.Dg10Min.push(Math.round(dataResult[i].Dg10Min));
							}
							if (dataResult[i].Lb10Total != "") {
								oArr.Lb10Total.push(parseInt(dataResult[i].Lb10Total));
							}
							if (dataResult[i].Lb10Lift != "") {
								oArr.Lb10Lift.push(parseInt(dataResult[i].Lb10Lift));
							}
							if (dataResult[i].Lb10Min != "") {
								oArr.Lb10Min.push(Math.round(dataResult[i].Lb10Min));
							}
							if (dataResult[i].Lm10Total != "") {
								oArr.Lm10Total.push(parseInt(dataResult[i].Lm10Total));
							}
							if (dataResult[i].Lm10Lift != "") {
								oArr.Lm10Lift.push(parseInt(dataResult[i].Lm10Lift));
							}
							if (dataResult[i].Lm10Min != "") {
								oArr.Lm10Min.push(Math.round(dataResult[i].Lm10Min));
							}
							if (dataResult[i].Re10Total != "") {
								oArr.Re10Total.push(parseInt(dataResult[i].Re10Total));
							}
							if (dataResult[i].Re10Lift != "") {
								oArr.Re10Lift.push(parseInt(dataResult[i].Re10Lift));
							}
							if (dataResult[i].Re10Min != "") {
								oArr.Re10Min.push(Math.round(dataResult[i].Re10Min));
							}
							if (dataResult[i].RelmTotal != "") {
								oArr.RelmTotal.push(parseInt(dataResult[i].RelmTotal));
							}
							if (dataResult[i].RelmLift != "") {
								oArr.RelmLift.push(parseInt(dataResult[i].RelmLift));
							}
							if (dataResult[i].RelmMin != "") {
								oArr.RelmMin.push(Math.round(dataResult[i].RelmMin));
							}
							if (dataResult[i].ReumTotal != "") {
								oArr.ReumTotal.push(parseInt(dataResult[i].ReumTotal));
							}
							if (dataResult[i].ReumLift != "") {
								oArr.ReumLift.push(parseInt(dataResult[i].ReumLift));
							}
							if (dataResult[i].ReumMin != "") {
								oArr.ReumMin.push(Math.round(dataResult[i].ReumMin));
							}
							if (dataResult[i].Um10Total != "") {
								oArr.Um10Total.push(parseInt(dataResult[i].Um10Total));
							}
							if (dataResult[i].Um10Lift != "") {
								oArr.Um10Lift.push(parseInt(dataResult[i].Um10Lift));
							}
							if (dataResult[i].Um10Min != "") {
								oArr.Um10Min.push(Math.round(dataResult[i].Um10Min));
							}
							if (dataResult[i].Rf10Total != "") {
								oArr.Rf10Total.push(parseInt(dataResult[i].Rf10Total));
							}
							if (dataResult[i].Rf10Lift != "") {
								oArr.Rf10Lift.push(parseInt(dataResult[i].Rf10Lift));
							}
							if (dataResult[i].Fr10Min != "") {
								oArr.Fr10Min.push(Math.round(dataResult[i].Fr10Min));
							}
							if (dataResult[i].Lb20Total != "") {
								oArr.Lb20Total.push(parseInt(dataResult[i].Lb20Total));
							}
							if (dataResult[i].Lb20Lift != "") {
								oArr.Lb20Lift.push(parseInt(dataResult[i].Lb20Lift));
							}
							if (dataResult[i].Lb20Min != "") {
								oArr.Lb20Min.push(Math.round(dataResult[i].Lb20Min));
							}
							if (dataResult[i].NoloLift != "") {
								oArr.NoloLift.push(parseInt(dataResult[i].NoloLift));
							}
							if (dataResult[i].NoloTotal != "") {
								oArr.NoloTotal.push(parseInt(dataResult[i].NoloTotal));
							}
							if (dataResult[i].Wp10Total != "") {
								oArr.Wp10Total.push(parseInt(dataResult[i].Wp10Total));
							}
							if (dataResult[i].Wp10Min != "") {
								oArr.Wp10Min.push(Math.round(dataResult[i].Wp10Min));
							}
							if (dataResult[i].Wp10Lift != "") {
								oArr.Wp10Lift.push(parseInt(dataResult[i].Wp10Lift));
							}
							if (dataResult[i].SvhiTotal != "") {
								oArr.SvhiTotal.push(parseInt(dataResult[i].SvhiTotal));
							}
							if (dataResult[i].SvhiLift != "") {
								oArr.SvhiLift.push(parseInt(dataResult[i].SvhiLift));
							}
							if (dataResult[i].SvhiMin != "") {
								oArr.SvhiMin.push(Math.round(dataResult[i].SvhiMin));
							}
							if (dataResult[i].SphiTotal != "") {
								oArr.SphiTotal.push(parseInt(dataResult[i].SphiTotal));
							}
							if (dataResult[i].SphiLift != "") {
								oArr.SphiLift.push(parseInt(dataResult[i].SphiLift));
							}
							if (dataResult[i].SphiMin != "") {
								oArr.SphiMin.push(Math.round(dataResult[i].SphiMin));
							}
							if (dataResult[i].LbhiTotal != "") {
								oArr.LbhiTotal.push(parseInt(dataResult[i].LbhiTotal));
							}
							if (dataResult[i].LbhiLift != "") {
								oArr.LbhiLift.push(parseInt(dataResult[i].LbhiLift));
							}
							if (dataResult[i].LbhiMin != "") {
								oArr.LbhiMin.push(Math.round(dataResult[i].LbhiMin));
							}
							if (dataResult[i].Fp10Total != "") {
								oArr.Fp10Total.push(parseInt(dataResult[i].Fp10Total));
							}
							if (dataResult[i].Fp10Lift != "") {
								oArr.Fp10Lift.push(parseInt(dataResult[i].Fp10Lift));
							}
							if (dataResult[i].Fp10Min != "") {
								oArr.Fp10Min.push(Math.round(dataResult[i].Fp10Min));
							}
							if (dataResult[i].Mp10Total != "") {
								oArr.Mp10Total.push(parseInt(dataResult[i].Mp10Total));
							}
							if (dataResult[i].Rs10Total != "") {
								oArr.Rs10Total.push(parseInt(dataResult[i].Rs10Total));
							}
							if (dataResult[i].Rs10Lift != "") {
								oArr.Rs10Lift.push(parseInt(dataResult[i].Rs10Lift));
							}
							if (dataResult[i].Rs10Min != "") {
								oArr.Rs10Min.push(Math.round(dataResult[i].Rs10Min));
							}
							if (dataResult[i].Mp10Lift != "") {
								oArr.Mp10Lift.push(parseInt(dataResult[i].Mp10Lift));
							}
							if (dataResult[i].Mp10Min != "") {
								oArr.Mp10Min.push(Math.round(dataResult[i].Mp10Min));
							}
							if (dataResult[i].Bc10Min != "") {
								oArr.Bc10Min.push(Math.round(dataResult[i].Bc10Min));
							}
							if (dataResult[i].Bc10Lift != "") {
								oArr.Bc10Lift.push(parseInt(dataResult[i].Bc10Lift));
							}
							if (dataResult[i].Bc10Total != "") {
								oArr.Bc10Total.push(parseInt(dataResult[i].Bc10Total));
							}
							if (dataResult[i].Y810Min != "") {
								oArr.Y810Min.push(Math.round(dataResult[i].Y810Min));
							}
							if (dataResult[i].Y810Lift != "") {
								oArr.Y810Lift.push(parseInt(dataResult[i].Y810Lift));
							}
							if (dataResult[i].Y810Total != "") {
								oArr.Y810Total.push(parseInt(dataResult[i].Y810Total));
							}
							if (dataResult[i].Y860Min != "") {
								oArr.Y860Min.push(Math.round(dataResult[i].Y860Min));
							}
							if (dataResult[i].Y860Lift != "") {
								oArr.Y860Lift.push(parseInt(dataResult[i].Y860Lift));
							}
							if (dataResult[i].Y860Total != "") {
								oArr.Y860Total.push(parseInt(dataResult[i].Y860Total));
							}
							if (dataResult[i].Sb10Min != "") {
								oArr.Sb10Min.push(Math.round(dataResult[i].Sb10Min));
							}
							if (dataResult[i].Sb10Lift != "") {
								oArr.Sb10Lift.push(parseInt(dataResult[i].Sb10Lift));
							}
							if (dataResult[i].Sb10Total != "") {
								oArr.Sb10Total.push(parseInt(dataResult[i].Sb10Total));
							}
							if (dataResult[i].Sf10Min != "") {
								oArr.Sf10Min.push(Math.round(dataResult[i].Sf10Min));
							}
							if (dataResult[i].Sf10Lift != "") {
								oArr.Sf10Lift.push(parseInt(dataResult[i].Sf10Lift));
							}
							if (dataResult[i].Sf10Total != "") {
								oArr.Sf10Total.push(parseInt(dataResult[i].Sf10Total));
							}
							if (dataResult[i].Sp10Min != "") {
								oArr.Sp10Min.push(Math.round(dataResult[i].Sp10Min));
							}
							if (dataResult[i].Sp10Lift != "") {
								oArr.Sp10Lift.push(parseInt(dataResult[i].Sp10Lift));
							}
							if (dataResult[i].Sp10Total != "") {
								oArr.Sp10Total.push(parseInt(dataResult[i].Sp10Total));
							}
							if (dataResult[i].Sm10Min != "") {
								oArr.Sm10Min.push(Math.round(dataResult[i].Sm10Min));
							}
							if (dataResult[i].Sm10Total != "") {
								oArr.Sm10Total.push(parseInt(dataResult[i].Sm10Total));
							}
							if (dataResult[i].Sm10Lift != "") {
								oArr.Sm10Lift.push(parseInt(dataResult[i].Sm10Lift));
							}
							if (dataResult[i].Vs10Min != "") {
								oArr.Vs10Min.push(Math.round(dataResult[i].Vs10Min));
							}
							if (dataResult[i].Vs10Lift != "") {
								oArr.Vs10Lift.push(parseInt(dataResult[i].Vs10Lift));
							}
							if (dataResult[i].Vs10Total != "") {
								oArr.Vs10Total.push(parseInt(dataResult[i].Vs10Total));
							}

						}

						//    var oReturnValTotal = elm._fnTotalCount(oArr.totalLines);
						//    var oReturnValLeftLTotal = elm._fnTotalCount(oArr.leftLineArr);

						elm.getView().getModel("multiHeaderConfig").setProperty("/LmhiMin", elm._fnTotalCount(oArr.LmhiMin));
						elm.getView().getModel("multiHeaderConfig").setProperty("/UmhiMin", elm._fnTotalCount(oArr.UmhiMin));
						elm.getView().getModel("multiHeaderConfig").setProperty("/DghiMin", elm._fnTotalCount(oArr.DghiMin));
						elm.getView().getModel("multiHeaderConfig").setProperty("/NoloMin", elm._fnTotalCount(oArr.NoloMin));

						elm.getView().getModel("multiHeaderConfig").setProperty("/LmhiLift", elm._fnTotalCount(oArr.LmhiLift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/LmhiTotal", elm._fnTotalCount(oArr.LmhiTotal));
						elm.getView().getModel("multiHeaderConfig").setProperty("/UmhiLift", elm._fnTotalCount(oArr.UmhiLift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/UmhiTotal", elm._fnTotalCount(oArr.UmhiTotal));

						elm.getView().getModel("multiHeaderConfig").setProperty("/DghiLift", elm._fnTotalCount(oArr.DghiLift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/DghiTotal", elm._fnTotalCount(oArr.DghiTotal));

						elm.getView().getModel("multiHeaderConfig").setProperty("/NoloLift", elm._fnTotalCount(oArr.NoloLift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/NoloTotal", elm._fnTotalCount(oArr.NoloTotal));
						elm.getView().getModel("multiHeaderConfig").setProperty("/totalLinSum", elm._fnTotalCount(oArr.totalLines));
						elm.getView().getModel("multiHeaderConfig").setProperty("/leftLineArr", elm._fnTotalCount(oArr.leftLineArr));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Cb10Total", elm._fnTotalCount(oArr.Cb10Total));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Cb10Lift", elm._fnTotalCount(oArr.Cb10Lift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Cb10Min", elm._fnTotalCount(oArr.Cb10Min));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Dg10Total", elm._fnTotalCount(oArr.Dg10Total));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Dg10Lift", elm._fnTotalCount(oArr.Dg10Lift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Dg10Min", elm._fnTotalCount(oArr.Dg10Min));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lb10Total", elm._fnTotalCount(oArr.Lb10Total));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lb10Lift", elm._fnTotalCount(oArr.Lb10Lift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lb10Min", elm._fnTotalCount(oArr.Lb10Min));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lm10Total", elm._fnTotalCount(oArr.Lm10Total));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lm10Lift", elm._fnTotalCount(oArr.Lm10Lift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lm10Min", elm._fnTotalCount(oArr.Lm10Min));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Re10Total", elm._fnTotalCount(oArr.Re10Total));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Re10Lift", elm._fnTotalCount(oArr.Re10Lift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Re10Min", elm._fnTotalCount(oArr.Re10Min));
						elm.getView().getModel("multiHeaderConfig").setProperty("/RelmTotal", elm._fnTotalCount(oArr.RelmTotal));
						elm.getView().getModel("multiHeaderConfig").setProperty("/RelmLift", elm._fnTotalCount(oArr.RelmLift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/RelmMin", elm._fnTotalCount(oArr.RelmMin));
						elm.getView().getModel("multiHeaderConfig").setProperty("/ReumTotal", elm._fnTotalCount(oArr.ReumTotal));
						elm.getView().getModel("multiHeaderConfig").setProperty("/ReumLift", elm._fnTotalCount(oArr.ReumLift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/ReumMin", elm._fnTotalCount(oArr.ReumMin));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Um10Total", elm._fnTotalCount(oArr.Um10Total));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Um10Lift", elm._fnTotalCount(oArr.Um10Lift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Um10Min", elm._fnTotalCount(oArr.Um10Min));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Rf10Total", elm._fnTotalCount(oArr.Rf10Total));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Rf10Lift", elm._fnTotalCount(oArr.Rf10Lift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Fr10Min", elm._fnTotalCount(oArr.Fr10Min));

						elm.getView().getModel("multiHeaderConfig").setProperty("/Lb20Total", elm._fnTotalCount(oArr.Lb20Total));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lb20Lift", elm._fnTotalCount(oArr.Lb20Lift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lb20Min", elm._fnTotalCount(oArr.Lb20Min));

						elm.getView().getModel("multiHeaderConfig").setProperty("/Wp10Total", elm._fnTotalCount(oArr.Wp10Total));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Wp10Lift", elm._fnTotalCount(oArr.Wp10Lift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Wp10Min", elm._fnTotalCount(oArr.Wp10Min));

						elm.getView().getModel("multiHeaderConfig").setProperty("/SvhiTotal", elm._fnTotalCount(oArr.SvhiTotal));
						elm.getView().getModel("multiHeaderConfig").setProperty("/SvhiLift", elm._fnTotalCount(oArr.SvhiLift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/SvhiMin", elm._fnTotalCount(oArr.SvhiMin));

						elm.getView().getModel("multiHeaderConfig").setProperty("/SphiTotal", elm._fnTotalCount(oArr.SphiTotal));
						elm.getView().getModel("multiHeaderConfig").setProperty("/SphiLift", elm._fnTotalCount(oArr.SphiLift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/SphiMin", elm._fnTotalCount(oArr.SphiMin));

						elm.getView().getModel("multiHeaderConfig").setProperty("/LbhiTotal", elm._fnTotalCount(oArr.LbhiTotal));
						elm.getView().getModel("multiHeaderConfig").setProperty("/LbhiLift", elm._fnTotalCount(oArr.LbhiLift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/LbhiMin", elm._fnTotalCount(oArr.LbhiMin));

						elm.getView().getModel("multiHeaderConfig").setProperty("/Fp10Total", elm._fnTotalCount(oArr.Fp10Total));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Fp10Lift", elm._fnTotalCount(oArr.Fp10Lift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Fp10Min", elm._fnTotalCount(oArr.Fp10Min));

						elm.getView().getModel("multiHeaderConfig").setProperty("/Mp10Min", elm._fnTotalCount(oArr.Mp10Min));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Mp10Lift", elm._fnTotalCount(oArr.Mp10Lift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Mp10Total", elm._fnTotalCount(oArr.Mp10Total));

						elm.getView().getModel("multiHeaderConfig").setProperty("/Rs10Min", elm._fnTotalCount(oArr.Rs10Min));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Rs10Lift", elm._fnTotalCount(oArr.Rs10Lift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Rs10Total", elm._fnTotalCount(oArr.Rs10Total));

						elm.getView().getModel("multiHeaderConfig").setProperty("/Sb10Min", elm._fnTotalCount(oArr.Sb10Min));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sb10Lift", elm._fnTotalCount(oArr.Sb10Lift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sb10Total", elm._fnTotalCount(oArr.Sb10Total));

						elm.getView().getModel("multiHeaderConfig").setProperty("/Bc10Min", elm._fnTotalCount(oArr.Bc10Min));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Bc10Lift", elm._fnTotalCount(oArr.Bc10Lift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Bc10Total", elm._fnTotalCount(oArr.Bc10Total));
						
						elm.getView().getModel("multiHeaderConfig").setProperty("/Y810Min", elm._fnTotalCount(oArr.Y810Min));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Y810Lift", elm._fnTotalCount(oArr.Y810Lift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Y810Total", elm._fnTotalCount(oArr.Y810Total));

						elm.getView().getModel("multiHeaderConfig").setProperty("/Y860Min", elm._fnTotalCount(oArr.Y860Min));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Y860Lift", elm._fnTotalCount(oArr.Y860Lift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Y860Total", elm._fnTotalCount(oArr.Y860Total));
						
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sf10Min", elm._fnTotalCount(oArr.Sf10Min));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sf10Lift", elm._fnTotalCount(oArr.Sf10Lift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sf10Total", elm._fnTotalCount(oArr.Sf10Total));

						elm.getView().getModel("multiHeaderConfig").setProperty("/Sp10Min", elm._fnTotalCount(oArr.Sp10Min));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sp10Lift", elm._fnTotalCount(oArr.Sp10Lift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sp10Total", elm._fnTotalCount(oArr.Sp10Total));

						elm.getView().getModel("multiHeaderConfig").setProperty("/Sm10Min", elm._fnTotalCount(oArr.Sm10Min));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sm10Total", elm._fnTotalCount(oArr.Sm10Total));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sm10Lift", elm._fnTotalCount(oArr.Sm10Lift));

						elm.getView().getModel("multiHeaderConfig").setProperty("/Vs10Min", elm._fnTotalCount(oArr.Vs10Min));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Vs10Lift", elm._fnTotalCount(oArr.Vs10Lift));
						elm.getView().getModel("multiHeaderConfig").setProperty("/Vs10Total", elm._fnTotalCount(oArr.Vs10Total));

					} else {
						elm.getView().getModel("multiHeaderConfig").setProperty("/totalLinSum", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/leftLineArr", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Cb10Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Cb10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Cb10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Dg10Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Dg10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Dg10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lb10Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lb10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lb10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lm10Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lm10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lm10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Re10Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Re10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Re10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/RelmTotal", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/RelmLift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/RelmMin", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/ReumTotal", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/ReumLift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/ReumMin", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Um10Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Um10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Um10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Rf10Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Rf10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Fr10Min", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Lb20Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lb20Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lb20Min", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Wp10Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Wp10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Wp10Min", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/SvhiTotal", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/SvhiLift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/SvhiMin", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/SphiTotal", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/SphiLift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/SphiMin", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/LbhiTotal", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/LbhiLift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/LbhiMin", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Fp10Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Fp10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Fp10Min", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Mp10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Mp10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Mp10Total", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Rs10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Rs10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Rs10Total", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Sb10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sb10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sb10Total", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Bc10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Bc10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Bc10Total", "");
						
						elm.getView().getModel("multiHeaderConfig").setProperty("/Y810Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Y810Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Y810Total", "");
						
						elm.getView().getModel("multiHeaderConfig").setProperty("/Y860Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Y860Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Y860Total", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Sf10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sf10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sf10Total", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Sp10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sp10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sp10Total", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Sm10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sm10Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sm10Lift", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Vs10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Vs10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Vs10Total", "");

					}

				}, elm),
				error: $.proxy(function (data) {
					elm.countAllRecords = 0;
				
					elm.getView().byId("idNextRecordsBtn").setEnabled(false);
					
					elm.getOwnerComponent().getModel("LocalDataModel").setProperty("/tHdrSet", []);
					elm.getView().getModel("multiHeaderConfig").setProperty("/totalLinSum", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/leftLineArr", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Cb10Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Cb10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Cb10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Dg10Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Dg10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Dg10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lb10Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lb10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lb10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lm10Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lm10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lm10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Re10Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Re10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Re10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/RelmTotal", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/RelmLift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/RelmMin", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/ReumTotal", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/ReumLift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/ReumMin", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Um10Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Um10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Um10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Rf10Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Rf10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Fr10Min", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Lb20Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lb20Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Lb20Min", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Wp10Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Wp10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Wp10Min", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/SvhiTotal", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/SvhiLift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/SvhiMin", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/SphiTotal", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/SphiLift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/SphiMin", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/LbhiTotal", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/LbhiLift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/LbhiMin", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Fp10Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Fp10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Fp10Min", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Mp10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Mp10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Mp10Total", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Rs10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Rs10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Rs10Total", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Sb10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sb10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sb10Total", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Bc10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Bc10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Bc10Total", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Y810Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Y810Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Y810Total", "");
						
						elm.getView().getModel("multiHeaderConfig").setProperty("/Y860Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Y860Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Y860Total", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Sf10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sf10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sf10Total", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Sp10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sp10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sp10Total", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Sm10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sm10Total", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Sm10Lift", "");

						elm.getView().getModel("multiHeaderConfig").setProperty("/Vs10Min", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Vs10Lift", "");
						elm.getView().getModel("multiHeaderConfig").setProperty("/Vs10Total", "");
						elm.getView().byId("idTableTitle").setText("Total Rows ()");
				
					elm.getOwnerComponent().getModel("LocalDataModel").setProperty("/busyIndicate", false);
					MessageBox.show("Internal Error Occurred");
				}, elm)

			});

		}
	};

});
sap.ui.define([
	"portoseguro/zpstaparametros/controller/BaseController",
	"sap/m/MessageToast"
], function (
	BaseController, MessageToast
) {
	"use strict";

	return BaseController.extend("portoseguro.zpstaparametros.controller.ZPSTA_ATCFG_ENT", {

		onInit: function () {
			this.getView().addStyleClass("sapUiSizeCompact");

		},

		onSave: function () {
			var oModel = this.getOwnerComponent().getModel();

			var mParameters = {
				sucess: function (oData, response) {
					MessageToast.show("Salvo com sucesso!");
				},
				error: function (oError) {
					if (oError) {
						if (oError.responseText) {
							var oErrorMessage = JSON.parse(oError.responseText);
							sap.m.MessageBox.alert(oErrorMessage.error.message.value);
						}
					}
				}
			};

			oModel.submitChanges(mParameters);
		},

		onDelete: function () {
			var that = this;
			this.approveDialog(function () {
				var tblDados = that.byId("tblDadosEmpEnt").getTable(),
					selectedIndices = tblDados.getSelectedIndices();

				if (selectedIndices.length > 0) {

					selectedIndices.forEach(function (selectedIndex) {

						var context = tblDados.getContextByIndex(selectedIndex);
						var oModel = that.getOwnerComponent().getModel();
                        oModel.setUseBatch(false);
						oModel.remove(context.getPath());
					});

				} else {
					var oBundle = this.getResourceBundle();
					var sMsg = oBundle.getText("msgNenhumSelecionado");
					MessageToast.show(sMsg);
				}

			});

		},

		
		onNew: function () {
			var currDate = new Date();
			var currDay, currMonth, currYear, currUTCTime, fullDateStr;
            currDay = ''+currDate.toLocaleString('pt-BR', {day: 'numeric' });
            currMonth = ''+currDate.toLocaleString('pt-BR', {month: 'numeric'});
            currMonth.length < 2? currMonth = '0' + currMonth : 'Hello World'; 
            currYear = ''+currDate.toLocaleString('pt-BR', {year: 'numeric'});
            currUTCTime = currDate.toLocaleString('pt-BR', {hour: 'numeric', minute: 'numeric', second: 'numeric'});
            fullDateStr = `${currYear}-${currMonth}-${currDay} ${currUTCTime}.000000000`;
			
			var newItem = {
				"CodEmpresa": 0,
				"NomeEmpresa": "",
				"CodLegalEntity": "",
				"DtInclusaoReg":  fullDateStr,
				"Status": ""
			};

			var oModel = this.getOwnerComponent().getModel();
            oModel.setUseBatch(true);
			var oContext = oModel.createEntry("/OZPSTA_ATCFG_ENT", {
				properties: newItem
			});
			
			this._oContext = oContext;

			var dialog = this._getDialog("portoseguro.zpstaparametros.view.dialogs.ZPSTA_ATCFG_ENTDialog");
			sap.ui.core.Fragment.byId("frmDialog", "formEmpEnt").bindElement(oContext.getPath());
			dialog.open();

		},

		onAdd: function () {

			var path = sap.ui.core.Fragment.byId("frmDialog", "formEmpEnt").getElementBinding().getPath();
			var model = sap.ui.core.Fragment.byId("frmDialog", "formEmpEnt").getModel();
			var boundItem = model.getProperty(path);
			var that = this;
			var mParameters = {
				success: function (oData, response) {
					MessageToast.show("Salvo com sucesso!");
					that.closeDialog();
                    that.getView().byId('tblDadosEmpEnt').rebindTable();
				},
				error: function (oError) {
					// if (oError) {
					// 	if (oError.responseText) {
					// 		var oErrorMessage = JSON.parse(oError.responseText);
					// 		sap.m.MessageBox.alert(oErrorMessage.error.message.value);
					// 		that.closeDialog();
					// 	}
					// }
                    that.getView().byId('tblDadosEmpEnt').rebindTable();
				}
			};

			model.submitChanges(mParameters);
			model.refresh();
            that.closeDialog();
		},
		
		onDataReceived: function () {

			var oTable = this.byId("tblDadosEmpEnt");
			oTable.getTable().getColumns().forEach(function (oLine) {
				oLine.setProperty("width", "200px");
			});

		}

	});
});
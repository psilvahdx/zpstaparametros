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

			this.byId('smartFilterBarEmpEnt-btnGo').setText(this.geti18NText("FILTER_BAR_GO")); 
			sap.ui.getCore().byId('__text4').setText(this.geti18NText("FILTER_BAR_NO_FILTER"));
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
			var fullDateStr = this.onGetNewDate();
			
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

			var dialog = this._getDialog("frmDialogEmpEnt", "portoseguro.zpstaparametros.view.dialogs.ZPSTA_ATCFG_ENTDialog");
			sap.ui.core.Fragment.byId("frmDialogEmpEnt", "formEmpEnt").bindElement(oContext.getPath());
			dialog.open();

		},

		onAdd: function () {

			var path = sap.ui.core.Fragment.byId("frmDialogEmpEnt", "formEmpEnt").getElementBinding().getPath();
			var model = sap.ui.core.Fragment.byId("frmDialogEmpEnt", "formEmpEnt").getModel();
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

			// var oTable = this.byId("tblDadosEmpEnt");
			// oTable.getTable().getColumns().forEach(function (oLine) {
			// 	oLine.setProperty("width", "200px");
			// });

		}

	});
});
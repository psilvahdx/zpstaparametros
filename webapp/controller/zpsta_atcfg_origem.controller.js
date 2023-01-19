sap.ui.define([
	"portoseguro/zpstaparametros/controller/BaseController",
	"sap/m/MessageToast"
], function (
	BaseController, MessageToast
) {
	"use strict";

	return BaseController.extend("portoseguro.zpstaparametros.controller.ZPSTA_ATCFG_ORIGEM", {

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
					// if (oError) {
					// 	if (oError.responseText) {
					// 		var oErrorMessage = JSON.parse(oError.responseText);
					// 		sap.m.MessageBox.alert(oErrorMessage.error.message.value);
					// 	}
					// }
                    console.log(oError);
				}
			};

			oModel.submitChanges(mParameters);
		},

		onDelete: function () {
			var that = this;
			this.approveDialog(function () {
				var tblDados = that.byId("tblDadosCfgOri").getTable(),
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
				"CodSistOrigem": null,
				"NomeSistOrigem": "",
				"DtInclusaoReg": fullDateStr,
				"SourceSystem": ""
			};

			var oModel = this.getOwnerComponent().getModel();
            oModel.setUseBatch(true);
			var oContext = oModel.createEntry("/OZPSTA_ATCFG_ORIGEM", {
				properties: newItem
			});

			var dialog = this._getDialog("frmDialogCfgOri", "portoseguro.zpstaparametros.view.dialogs.ZPSTA_ATCFG_ORIGEMDialog");
			sap.ui.core.Fragment.byId("frmDialogCfgOri", "formCfgOri").bindElement(oContext.getPath());
			dialog.open();

		},

		onAdd: function () {

			var that = this;
			var path = sap.ui.core.Fragment.byId("frmDialogCfgOri", "formCfgOri").getElementBinding().getPath();
			var model = sap.ui.core.Fragment.byId("frmDialogCfgOri", "formCfgOri").getModel();
			var boundItem = model.getProperty(path);

			if (boundItem.CodSistOrigem) {
				var bDuplicateKeys = false;
				var aKeys = Object.keys(model.oData);
				var odata = model.oData;
				model.mChangedEntities = {};

				for (var record in odata) {
					if (boundItem.CodSistOrigem == odata[record].CodSistOrigem) {
						bDuplicateKeys = true;
					}
				}
				if (!bDuplicateKeys) {
					var mParameters = {
						success: function (oData, response) {
							MessageToast.show("Salvo com sucesso!");
							that.closeDialog();
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
				} else {
					that.closeDialog();
					MessageToast.show("Item já existente!", {
						duration: 3000
					});
				}
			}
		
		},
		onDataReceived: function () {

			// var oTable = this.byId("tblDadosCfgOri");
			// oTable.getTable().getColumns().forEach(function (oLine) {
			// 	oLine.setProperty("width", "200px");
			// });

		}

	});
});
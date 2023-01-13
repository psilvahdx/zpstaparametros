sap.ui.define([
	"portoseguro/zpstaparametros/controller/BaseController",
	"sap/m/MessageToast"
], function (
	BaseController, MessageToast
) {
	"use strict";

	return BaseController.extend("portoseguro.zpstaparametros.controller.ZPSTA_CFG_GP_RAMO_PASS", {

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
				var tblDados = that.byId("tblDadosRamPass").getTable(),
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
			var newItem = {
				"CodigoRamo": null,
				"GrupoRamoPassivo": ""
			};

			var oModel = this.getOwnerComponent().getModel();
            oModel.setUseBatch(true);
			var oContext = oModel.createEntry("/OZPSTA_CFG_RAMO_PASS", {
				properties: newItem
			});

			var dialog = this._getDialog("portoseguro.zpstaparametros.view.dialogs.ZPSTA_CFG_GP_RAMO_PASSDialog");
			sap.ui.core.Fragment.byId("frmDialog", "formRamPass").bindElement(oContext.getPath());
			dialog.open();

		},

		onAdd: function () {

			var path = sap.ui.core.Fragment.byId("frmDialog", "formRamPass").getElementBinding().getPath();
			var model = sap.ui.core.Fragment.byId("frmDialog", "formRamPass").getModel();
			var boundItem = model.getProperty(path);
			var that = this;
			var mParameters = {
				success: function (oData, response) {
					MessageToast.show("Salvo com sucesso!");
					that.closeDialog();
				},
				error: function (oError) {
					if (oError) {
						if (oError.responseText) {
							var oErrorMessage = JSON.parse(oError.responseText);
							sap.m.MessageBox.alert(oErrorMessage.error.message.value);
							that.closeDialog();
						}
					}
				}
			};

			model.submitChanges(mParameters);
			model.refresh();
		}

	});
});
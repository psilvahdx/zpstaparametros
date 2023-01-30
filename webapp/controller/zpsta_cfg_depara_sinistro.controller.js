sap.ui.define([
	"portoseguro/zpstaparametros/controller/BaseController",
	"sap/m/MessageToast"
], function (
	BaseController,
	MessageToast
) {
	"use strict";

	return BaseController.extend("portoseguro.zpstaparametros.controller.ZPSTA_CFG_DEPARA_SINISTRO", {

		onInit: function () {
			this.getView().addStyleClass("sapUiSizeCompact");
		},
		onSave: function () {
			var oModel = this.getOwnerComponent().getModel();
			oModel.setUseBatch(true);

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
				var tblDados = that.byId("tblDadosDepSin").getTable(),
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
				"CodEveNegocio": "",
				"CodMovSinistro": "",
				"JuridicoFlag": "",
				"Ro": "",
				"Tpmoid": "",
				"TipoMovimento": "",
				"Cmpid": "",
				"TpSin": "",
				"CodEmpresa": ""
			};

			var oModel = this.getOwnerComponent().getModel();
			var oContext = oModel.createEntry("/OZPSTA_CFG_DEPARA_SIN", {
				properties: newItem
			});

			var dialog = this._getDialog("frmDialogDepSin", "portoseguro.zpstaparametros.view.dialogs.ZPSTA_CFG_DEPARA_SINISTRODialog");
			sap.ui.core.Fragment.byId("frmDialogDepSin", "formDepSin").bindElement(oContext.getPath());
			dialog.open();

		},

		onAdd: function () {
			var that = this;
			var path = sap.ui.core.Fragment.byId("frmDialogDepSin", "formDepSin").getElementBinding().getPath();
			var model = sap.ui.core.Fragment.byId("frmDialogDepSin", "formDepSin").getModel();
			var boundItem = model.getProperty(path);
			if (boundItem) {
				var bDuplicateKeys = false;
				var aKeys = Object.keys(model.oData);
				var odata = model.oData;
				model.mChangedEntities = {};
				for (var record in odata) {
					if (boundItem.CodEveNegocio == odata[record].CodEveNegocio
						&& boundItem.CodMovSinistro == odata[record].CodMovSinistro
						&& boundItem.JuridicoFlag == odata[record].JuridicoFlag
						&& boundItem.Ro == odata[record].Ro
						&& boundItem.Tpmoid == odata[record].Tpmoid
						&& boundItem.TipoMovimento == odata[record].TipoMovimento
						&& boundItem.Cmpid == odata[record].Cmpid
						&& boundItem.TpSin == odata[record].TpSin
						&& boundItem.CodEmpresa == odata[record].CodEmpresa) {
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
							that.getView().byId('tblDadosDepSin').rebindTable();
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
		}
	});
});
sap.ui.define([
	"portoseguro/zpstaparametros/controller/BaseController",
	"sap/m/MessageToast"
], function (
	BaseController, MessageToast
) {
	"use strict";

	return BaseController.extend("portoseguro.psta_parametros.controller.ZPSTA_CFG_DEPARA_PREMIO", {

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
				var tblDados = that.byId("tblDados").getTable(),
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
				"NumeroEndosso": "",
				"Ro": "",
				"Tpmoid": "",
				"Cmpid": "",
				"CodigoEmpresa": ""
			};

			var oModel = this.getOwnerComponent().getModel();
			oModel.setUseBatch(true);
			var oContext = oModel.createEntry("/OZPSTA_CFG_DEPARA_PREM", {
				properties: newItem
			});

			var dialog = this._getDialog("portoseguro.zpstaparametros.view.dialogs.ZPSTA_CFG_DEPARA_PREMIODialog");
			sap.ui.core.Fragment.byId("frmDialog", "form").bindElement(oContext.getPath());
			dialog.open();

		},

		onAdd: function () {

			var path = sap.ui.core.Fragment.byId("frmDialog", "form").getElementBinding().getPath();
			var model = sap.ui.core.Fragment.byId("frmDialog", "form").getModel();
			var boundItem = model.getProperty(path);
			
			var uEntities = model.mChangedEntities;
			var keys = Object.keys(uEntities);
			var valores = uEntities[keys];

			if(valores.codigo_evento_negocio == ""){valores.codigo_evento_negocio = "0";}
			if(valores.codigo_empresa == ""){valores.codigo_empresa = 0;}
			
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
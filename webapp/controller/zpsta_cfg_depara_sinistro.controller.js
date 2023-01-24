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

			var path = sap.ui.core.Fragment.byId("frmDialogDepSin", "form").getElementBinding().getPath();
			var model = sap.ui.core.Fragment.byId("frmDialogDepSin", "form").getModel();
			var boundItem = model.getProperty(path);
			
			var uEntities = model.mChangedEntities;
			var keys = Object.keys(uEntities);
			var valores = uEntities[keys];

			if(valores.codigo_evento_negocio == ""){valores.codigo_evento_negocio = "0";}
            if(valores.codigo_mov_sinistro == ""){valores.codigo_mov_sinistro = "0";}
            if(valores.codigo_empresa == ""){valores.codigo_empresa = "0";}
            if(valores.tp_sin == ""){valores.tp_sin = "0";}
			
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
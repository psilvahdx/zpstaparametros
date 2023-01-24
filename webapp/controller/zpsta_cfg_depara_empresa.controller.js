sap.ui.define([
	"portoseguro/zpstaparametros/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/analytics/BatchResponseCollector"
], function (
	BaseController,
	MessageToast,
	BatchResponseCollector
) {
	"use strict";

	return BaseController.extend("portoseguro.zpstaparametros.controller.zpsta_cfg_depara_empresa", {

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
				"CodEmpresa": "",
				"Descricao": "",
				"CodCia": ""
			};

			var oModel = this.getOwnerComponent().getModel();
			var oContext = oModel.createEntry("/OZPSTA_CFG_DEPARA_EMP", {
				properties: newItem
			});

			var dialog = this._getDialog("portoseguro.zpstaparametros.view.dialogs.ZPSTA_CFG_DEPARA_EMPRESADialog");
			sap.ui.core.Fragment.byId("frmDialog", "form").bindElement(oContext.getPath());
			dialog.open();

		},
		onAdd: function () {
		var path = sap.ui.core.Fragment.byId("frmDialog", "form").getElementBinding().getPath();
		var model = sap.ui.core.Fragment.byId("frmDialog", "form").getModel();
		model.setUseBatch(true);
		var boundItem = model.getProperty(path);
		var uEntities = model.mChangedEntities;
		var keys = Object.keys(uEntities);
		var valores = uEntities[keys];
		var that = this;
		var mParameters = {
			success: function (oData, response) {
				MessageToast.show("Salvo com sucesso!");
				that.closeDialog();
			},
			error: function (oError) {
				if (oError) {
					if (oError.responseText) {
/* 						var oErrorMessage = JSON.parse(oError.responseText);
						sap.m.MessageBox.alert(oErrorMessage.error.message.value); */
						MessageToast.show("Erro ao inserir registro!");
						that.closeDialog();
						model.refresh();
					}
				}
			}
		};

		model.submitChanges(mParameters);
		model.refresh();
	},
		
		onDataReceived: function () {
			var oTable = this.byId("tblDados");
			oTable.getTable().getColumns().forEach(function (oLine) {
				oLine.setProperty("width", "200px");
			}); 

		}
	});
});